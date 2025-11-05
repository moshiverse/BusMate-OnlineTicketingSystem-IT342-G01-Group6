package edu.cit.lgng.backend.repository;

import edu.cit.lgng.backend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
