package edu.cit.lgng.backend.service;

import edu.cit.lgng.backend.model.*;
import edu.cit.lgng.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepo;
    private final UserRepository userRepo;
    private final ScheduleRepository scheduleRepo;
    private final SeatRepository seatRepo;
    private final BookingSeatRepository bookingSeatRepo;

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
        booking.setStatus(Booking.Status.CONFIRMED);
        booking.setPaymentRef(providerRef);
        // qr_code generation logic placeholder
        booking.setQrCodeText("QR-" + booking.getId() + "-" + System.currentTimeMillis());
        return bookingRepo.save(booking);
    }

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepo.findByUserId(userId);
    }
}
