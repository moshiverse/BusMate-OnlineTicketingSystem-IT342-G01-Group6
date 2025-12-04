package edu.cit.lgng.backend.repository;

import edu.cit.lgng.backend.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByScheduleId(Long scheduleId);
    void deleteByScheduleId(Long scheduleId);
}
