package edu.cit.lgng.backend.repository;

import edu.cit.lgng.backend.model.Booking;
import edu.cit.lgng.backend.model.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {
    List<BookingSeat> findByBookingId(Long bookingId);
    List<BookingSeat> findByScheduleId(Long scheduleId);
    void deleteByBookingId(Long bookingId);
    void deleteByScheduleId(Long scheduleId);
}
