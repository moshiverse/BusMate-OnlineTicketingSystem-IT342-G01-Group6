package edu.cit.lgng.backend.repository;

import edu.cit.lgng.backend.model.Booking;
import edu.cit.lgng.backend.model.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {
}
