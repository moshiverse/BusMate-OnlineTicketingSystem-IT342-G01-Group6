package edu.cit.lgng.backend.service;

import edu.cit.lgng.backend.config.PayMongoConfig;
import edu.cit.lgng.backend.dto.PayMongoDto.*;
import edu.cit.lgng.backend.model.Booking;
import edu.cit.lgng.backend.model.BookingSeat;
import edu.cit.lgng.backend.model.Payment;
import edu.cit.lgng.backend.model.Route;
import edu.cit.lgng.backend.model.Schedule;
import edu.cit.lgng.backend.model.Seat;
import edu.cit.lgng.backend.repository.BookingRepository;
import edu.cit.lgng.backend.repository.BookingSeatRepository;
import edu.cit.lgng.backend.repository.PaymentRepository;
import edu.cit.lgng.backend.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayMongoService {

    private final PayMongoConfig payMongoConfig;
    private final RestTemplate restTemplate;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final SeatRepository seatRepository;
    private final ObjectMapper objectMapper;

    /**
     * Create a PayMongo Payment Intent from the backend
     * This should be called when user proceeds to payment
     */
    @Transactional
    public PaymentIntentResponse createPaymentIntent(Long bookingId, String description) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));

        // Convert amount to centavos (PayMongo uses smallest currency unit)
        // Minimum amount is 2000 centavos (₱20.00)
        int amountInCentavos = booking.getAmount().multiply(BigDecimal.valueOf(100)).intValue();
        
        if (amountInCentavos < 2000) {
            throw new RuntimeException("Minimum payment amount is ₱20.00");
        }

        // Build the request body for PayMongo
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("amount", amountInCentavos);
        attributes.put("currency", "PHP");
        attributes.put("description", description != null ? description : "BusMate Booking #" + bookingId);
        attributes.put("payment_method_allowed", Arrays.asList("card", "gcash", "grab_pay", "paymaya"));
        attributes.put("statement_descriptor", "BusMate");
        
        // Add metadata for tracking
        Map<String, String> metadata = new HashMap<>();
        metadata.put("booking_id", bookingId.toString());
        metadata.put("user_id", booking.getUser().getId().toString());
        attributes.put("metadata", metadata);

        Map<String, Object> data = new HashMap<>();
        data.put("attributes", attributes);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("data", data);

        // Make API call to PayMongo
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Basic " + payMongoConfig.getEncodedSecretKey());

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    payMongoConfig.getBaseUrl() + "/payment_intents",
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            Map<String, Object> responseData = (Map<String, Object>) response.getBody().get("data");
            Map<String, Object> responseAttributes = (Map<String, Object>) responseData.get("attributes");

            String paymentIntentId = (String) responseData.get("id");
            String clientKey = (String) responseAttributes.get("client_key");
            String status = (String) responseAttributes.get("status");

            // Store the payment intent ID in the booking for later verification
            booking.setPaymentRef(paymentIntentId);
            bookingRepository.save(booking);

            log.info("Created PayMongo Payment Intent: {} for Booking: {}", paymentIntentId, bookingId);

            return PaymentIntentResponse.builder()
                    .id(paymentIntentId)
                    .clientKey(clientKey)
                    .status(status)
                    .amount(amountInCentavos)
                    .currency("PHP")
                    .description((String) responseAttributes.get("description"))
                    .paymentMethodAllowed((List<String>) responseAttributes.get("payment_method_allowed"))
                    .publicKey(payMongoConfig.getPublicKey())
                    .build();

        } catch (Exception e) {
            log.error("Failed to create PayMongo Payment Intent for Booking: {}", bookingId, e);
            throw new RuntimeException("Failed to create payment: " + e.getMessage());
        }
    }

    /**
     * Retrieve a Payment Intent status
     */
    public PaymentStatusResponse getPaymentIntentStatus(String paymentIntentId) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Basic " + payMongoConfig.getEncodedSecretKey());

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    payMongoConfig.getBaseUrl() + "/payment_intents/" + paymentIntentId,
                    HttpMethod.GET,
                    entity,
                    Map.class
            );

            Map<String, Object> responseData = (Map<String, Object>) response.getBody().get("data");
            Map<String, Object> responseAttributes = (Map<String, Object>) responseData.get("attributes");
            Map<String, String> metadata = (Map<String, String>) responseAttributes.get("metadata");

            String paymentId = null;
            List<Map<String, Object>> payments = (List<Map<String, Object>>) responseAttributes.get("payments");
            if (payments != null && !payments.isEmpty()) {
                paymentId = (String) payments.get(0).get("id");
            }

            Long bookingId = metadata != null && metadata.get("booking_id") != null 
                    ? Long.parseLong(metadata.get("booking_id")) 
                    : null;

            return PaymentStatusResponse.builder()
                    .paymentIntentId(paymentIntentId)
                    .status((String) responseAttributes.get("status"))
                    .amount((Integer) responseAttributes.get("amount"))
                    .paymentId(paymentId)
                    .bookingId(bookingId)
                    .build();

        } catch (Exception e) {
            log.error("Failed to retrieve Payment Intent status: {}", paymentIntentId, e);
            throw new RuntimeException("Failed to retrieve payment status: " + e.getMessage());
        }
    }

    /**
     * Handle successful payment - update booking and create payment record
     */
    @Transactional
    public Booking handlePaymentSuccess(String paymentIntentId) {
        PaymentStatusResponse status = getPaymentIntentStatus(paymentIntentId);
        
        if (!"succeeded".equals(status.getStatus())) {
            throw new RuntimeException("Payment not successful. Status: " + status.getStatus());
        }

        Booking booking = bookingRepository.findById(status.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Get seat numbers for this booking
        List<BookingSeat> bookingSeats = bookingSeatRepository.findAll().stream()
                .filter(bs -> bs.getBooking().getId().equals(booking.getId()))
                .toList();
        List<String> seatNumbers = bookingSeats.stream()
                .map(BookingSeat::getSeatNumber)
                .toList();

        // Update seat status to OCCUPIED
        for (String seatNumber : seatNumbers) {
            Seat seat = seatRepository.findByScheduleId(booking.getSchedule().getId()).stream()
                    .filter(s -> s.getSeatNumber().equals(seatNumber))
                    .findFirst()
                    .orElse(null);
            if (seat != null) {
                seat.setStatus(Seat.Status.OCCUPIED);
                seatRepository.save(seat);
            }
        }

        // Update booking status
        booking.setStatus(Booking.Status.CONFIRMED);
        booking.setPaymentRef(status.getPaymentId() != null ? status.getPaymentId() : paymentIntentId);
        
        // Generate QR code with actual booking information
        booking.setQrCodeText(generateQrCodeContent(booking, seatNumbers));
        
        bookingRepository.save(booking);

        // Create payment record
        Payment payment = Payment.builder()
                .booking(booking)
                .provider("PAYMONGO")
                .providerRef(paymentIntentId)
                .amount(booking.getAmount())
                .status(Payment.Status.SUCCESS)
                .receivedAt(Instant.now())
                .build();
        
        paymentRepository.save(payment);

        log.info("Payment successful for Booking: {}, PaymentIntent: {}", booking.getId(), paymentIntentId);

        return booking;
    }

    /**
     * Generate QR code content with actual booking information
     */
    private String generateQrCodeContent(Booking booking, List<String> seatNumbers) {
        try {
            ObjectNode qrData = objectMapper.createObjectNode();
            
            // Booking info
            qrData.put("bookingId", "BM-" + String.format("%06d", booking.getId()));
            qrData.put("status", booking.getStatus().name());
            
            // Passenger info
            qrData.put("passenger", booking.getUser().getName());
            qrData.put("email", booking.getUser().getEmail());
            
            // Route info
            Schedule schedule = booking.getSchedule();
            Route route = schedule.getRoute();
            qrData.put("origin", route.getOrigin());
            qrData.put("destination", route.getDestination());
            qrData.put("route", route.getOrigin() + " - " + route.getDestination());
            
            // Schedule info
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");
            
            qrData.put("travelDate", schedule.getTravelDate().format(dateFormatter));
            qrData.put("departureTime", schedule.getDepartureTime().format(timeFormatter));
            qrData.put("arrivalTime", schedule.getArrivalTime().format(timeFormatter));
            
            // Bus info
            if (schedule.getBus() != null) {
                qrData.put("busNumber", schedule.getBus().getBusNumber());
                qrData.put("plateNumber", schedule.getBus().getPlateNo());
                if (schedule.getBus().getBusType() != null) {
                    qrData.put("busType", schedule.getBus().getBusType().getName());
                }
            }
            
            // Seat info
            qrData.put("seats", String.join(", ", seatNumbers));
            qrData.put("seatCount", seatNumbers.size());
            
            // Payment info
            qrData.put("amount", "PHP " + booking.getAmount().toString());
            
            // Verification code (for manual verification)
            String verificationCode = generateVerificationCode(booking.getId());
            qrData.put("verificationCode", verificationCode);
            
            return objectMapper.writeValueAsString(qrData);
            
        } catch (Exception e) {
            log.error("Failed to generate QR code content", e);
            // Fallback to simple format if JSON fails
            return String.format("BM-%06d|%s|%s-%s|%s|%s|PHP%s",
                    booking.getId(),
                    booking.getUser().getName(),
                    booking.getSchedule().getRoute().getOrigin(),
                    booking.getSchedule().getRoute().getDestination(),
                    booking.getSchedule().getTravelDate(),
                    String.join(",", seatNumbers),
                    booking.getAmount()
            );
        }
    }

    /**
     * Generate a short verification code for manual checking
     */
    private String generateVerificationCode(Long bookingId) {
        String base = "BM" + bookingId + System.currentTimeMillis();
        int hash = Math.abs(base.hashCode());
        return String.format("%06d", hash % 1000000);
    }

    /**
     * Handle payment webhook events from PayMongo
     */
    @Transactional
    public void handleWebhookEvent(Map<String, Object> payload) {
        Map<String, Object> data = (Map<String, Object>) payload.get("data");
        Map<String, Object> attributes = (Map<String, Object>) data.get("attributes");
        String eventType = (String) attributes.get("type");

        log.info("Received PayMongo webhook event: {}", eventType);

        if ("payment.paid".equals(eventType)) {
            Map<String, Object> eventData = (Map<String, Object>) attributes.get("data");
            Map<String, Object> paymentAttributes = (Map<String, Object>) eventData.get("attributes");
            
            String paymentIntentId = (String) paymentAttributes.get("payment_intent_id");
            if (paymentIntentId != null) {
                try {
                    handlePaymentSuccess(paymentIntentId);
                } catch (Exception e) {
                    log.error("Failed to process payment.paid webhook for: {}", paymentIntentId, e);
                }
            }
        } else if ("payment.failed".equals(eventType)) {
            Map<String, Object> eventData = (Map<String, Object>) attributes.get("data");
            Map<String, Object> paymentAttributes = (Map<String, Object>) eventData.get("attributes");
            
            String paymentIntentId = (String) paymentAttributes.get("payment_intent_id");
            log.warn("Payment failed for PaymentIntent: {}", paymentIntentId);
        }
    }
}