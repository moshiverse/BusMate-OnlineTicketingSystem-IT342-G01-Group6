package edu.cit.lgng.backend.repository;

import edu.cit.lgng.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
}
