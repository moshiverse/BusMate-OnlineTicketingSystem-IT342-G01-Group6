package edu.cit.lgng.backend.repository;

import edu.cit.lgng.backend.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
}
