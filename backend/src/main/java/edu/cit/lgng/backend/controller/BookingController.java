package edu.cit.lgng.backend.controller;

import edu.cit.lgng.backend.dto.BookingRequestDto;
import edu.cit.lgng.backend.dto.PaymentRequestDto;
import edu.cit.lgng.backend.model.Booking;
import edu.cit.lgng.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequestDto req) {
        try {
            Booking b = bookingService.createBooking(req.getUserId(), req.getScheduleId(), req.getAmount(), req.getSeatNumbers());
            return ResponseEntity.ok(b);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<?> confirmBooking(@PathVariable Long id, @RequestBody PaymentRequestDto req) {
        try {
            Booking b = bookingService.confirmBooking(id, req.getProviderRef(), req.getAmount());
            return ResponseEntity.ok(b);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
