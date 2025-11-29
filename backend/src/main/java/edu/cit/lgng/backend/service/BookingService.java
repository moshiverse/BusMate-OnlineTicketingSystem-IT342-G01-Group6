package edu.cit.lgng.backend.service;

import edu.cit.lgng.backend.model.*;
import edu.cit.lgng.backend.repository.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {
    private final BookingRepository bookingRepo;
    private final UserRepository userRepo;
    private final ScheduleRepository scheduleRepo;
    private final SeatRepository seatRepo;
    private final BookingSeatRepository bookingSeatRepo;
    private final ObjectMapper objectMapper;

    @Transactional
    public Booking createBooking(Long userId, Long scheduleId, BigDecimal amount, List<String> seatNumbers) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Schedule schedule = scheduleRepo.findById(scheduleId).orElseThrow(() -> new RuntimeException("Schedule not found"));

        Booking booking = Booking.builder()
                .user(user)
                .schedule(schedule)
                .amount(amount)
                .status(Booking.Status.PENDING)
                .build();
        Booking saved = bookingRepo.save(booking);

        for(String sn : seatNumbers) {
            Seat seat = seatRepo.findByScheduleId(scheduleId).stream()
                    .filter(s -> s.getSeatNumber().equals(sn))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Seat not found: " + sn));

            if(seat.getStatus() != Seat.Status.AVAILABLE) {
                throw new RuntimeException("Seat not available: " + sn);
            }
            seat.setStatus(Seat.Status.RESERVED);
            seatRepo.save(seat);

            BookingSeat bs = BookingSeat.builder()
                    .booking(saved)
                    .schedule(schedule)
                    .seatNumber(sn)
                    .build();
            bookingSeatRepo.save(bs);
        }

        Integer avail = schedule.getAvailableSeats();
        if(avail != null) {
            schedule.setAvailableSeats(avail - seatNumbers.size());
            scheduleRepo.save(schedule);
        }

        return saved;
    }

    @Transactional
    public Booking confirmBooking(Long bookingId, String providerRef, BigDecimal amount) {
        Booking booking = bookingRepo.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking not found"));
        
        // Get seat numbers for this booking
        List<BookingSeat> bookingSeats = bookingSeatRepo.findAll().stream()
                .filter(bs -> bs.getBooking().getId().equals(bookingId))
                .toList();
        List<String> seatNumbers = bookingSeats.stream()
                .map(BookingSeat::getSeatNumber)
                .toList();

        // Update seat status to OCCUPIED
        for (String seatNumber : seatNumbers) {
            Seat seat = seatRepo.findByScheduleId(booking.getSchedule().getId()).stream()
                    .filter(s -> s.getSeatNumber().equals(seatNumber))
                    .findFirst()
                    .orElse(null);
            if (seat != null) {
                seat.setStatus(Seat.Status.OCCUPIED);
                seatRepo.save(seat);
            }
        }

        booking.setStatus(Booking.Status.CONFIRMED);
        booking.setPaymentRef(providerRef);
        
        // Generate QR code with booking information
        booking.setQrCodeText(generateQrCodeContent(booking, seatNumbers));
        
        return bookingRepo.save(booking);
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
            qrData.put("route", route.getOrigin() + " → " + route.getDestination());
            
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
            qrData.put("amount", "₱" + booking.getAmount().toString());
            qrData.put("paymentRef", booking.getPaymentRef());
            
            // Verification code (for manual verification)
            String verificationCode = generateVerificationCode(booking.getId());
            qrData.put("verificationCode", verificationCode);
            
            return objectMapper.writeValueAsString(qrData);
            
        } catch (Exception e) {
            // Fallback to simple format if JSON fails
            return String.format("BM-%06d|%s|%s→%s|%s|%s|₱%s",
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
        // Create a simple hash-based verification code
        String base = "BM" + bookingId + System.currentTimeMillis();
        int hash = Math.abs(base.hashCode());
        return String.format("%06d", hash % 1000000);
    }

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepo.findByUserId(userId);
    }

    /**
     * Returns all bookings in the system.
     * Intended for admin / reporting use on the dashboard.
     */
    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }
}