package edu.cit.lgng.backend.service;

import edu.cit.lgng.backend.model.Booking;
import edu.cit.lgng.backend.model.Payment;
import edu.cit.lgng.backend.repository.BookingRepository;
import edu.cit.lgng.backend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepo;
    private final BookingRepository bookingRepo;

    public Payment recordPayment(Long bookingId, String provider, String providerRef, BigDecimal amount) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        Payment p = Payment.builder()
                .booking(booking)
                .provider(provider)
                .providerRef(providerRef)
                .amount(amount)
                .status(Payment.Status.SUCCESS)
                .receivedAt(Instant.now())
                .build();
        return paymentRepo.save(p);
    }

    public Payment create(Payment payment) {
        return paymentRepo.save(payment);
    }
}
