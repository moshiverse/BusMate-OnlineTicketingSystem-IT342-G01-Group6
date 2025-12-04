package edu.cit.lgng.backend.repository;

import edu.cit.lgng.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByScheduleId(Long scheduleId);
    void deleteByScheduleId(Long scheduleId);
}
