package edu.cit.lgng.backend.controller;

import edu.cit.lgng.backend.dto.BookingRequestDto;
import edu.cit.lgng.backend.dto.PaymentRequestDto;
import edu.cit.lgng.backend.model.Booking;
import edu.cit.lgng.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserBookings(@PathVariable Long userId) {
        try {
            List<Booking> bookings = bookingService.getUserBookings(userId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Returns all bookings in the system.
     * This is primarily used by the admin dashboard for reporting.
     */
    @GetMapping
    public ResponseEntity<?> getAllBookings() {
        try {
            List<Booking> bookings = bookingService.getAllBookings();
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
