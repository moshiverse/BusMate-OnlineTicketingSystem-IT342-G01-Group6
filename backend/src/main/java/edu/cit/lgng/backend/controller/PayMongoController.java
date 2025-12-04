package edu.cit.lgng.backend.controller;

import edu.cit.lgng.backend.dto.PayMongoDto.*;
import edu.cit.lgng.backend.model.Booking;
import edu.cit.lgng.backend.service.PayMongoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/paymongo")
@RequiredArgsConstructor
@Slf4j
public class PayMongoController {

    private final PayMongoService payMongoService;

    /**
     * Create a Payment Intent for a booking
     * Called when user clicks "Proceed to Payment"
     */
    @PostMapping("/create-intent")
    public ResponseEntity<PaymentIntentResponse> createPaymentIntent(
            @RequestBody CreatePaymentIntentRequest request) {
        
        PaymentIntentResponse response = payMongoService.createPaymentIntent(
                request.getBookingId(),
                request.getDescription()
        );
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get the status of a Payment Intent
     */
    @GetMapping("/intent/{paymentIntentId}/status")
    public ResponseEntity<PaymentStatusResponse> getPaymentStatus(
            @PathVariable String paymentIntentId) {
        
        PaymentStatusResponse response = payMongoService.getPaymentIntentStatus(paymentIntentId);
        return ResponseEntity.ok(response);
    }

    /**
     * Verify and complete payment after user returns from payment
     * Called from frontend after redirect
     */
    @PostMapping("/verify-payment/{paymentIntentId}")
    public ResponseEntity<?> verifyPayment(@PathVariable String paymentIntentId) {
        try {
            Booking booking = payMongoService.handlePaymentSuccess(paymentIntentId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("bookingId", booking.getId());
            response.put("status", booking.getStatus().name());
            response.put("qrCodeText", booking.getQrCodeText());
            response.put("booking", booking);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }

    /**
     * Webhook endpoint for PayMongo events
     * Must be registered in PayMongo dashboard
     */
    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody Map<String, Object> payload,
            @RequestHeader(value = "Paymongo-Signature", required = false) String signature) {
        
        // In production, verify the signature
        // See: https://developers.paymongo.com/docs/creating-webhook
        
        try {
            payMongoService.handleWebhookEvent(payload);
            return ResponseEntity.ok("Webhook processed");
        } catch (Exception e) {
            log.error("Webhook processing failed", e);
            return ResponseEntity.ok("Webhook received"); // Always return 2xx
        }
    }
}