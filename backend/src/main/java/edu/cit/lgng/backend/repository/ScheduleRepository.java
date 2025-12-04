package edu.cit.lgng.backend.repository;

import edu.cit.lgng.backend.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByBusId(Long busId);
    List<Schedule> findByRouteId(Long routeId);
    void deleteByBusId(Long busId);
    void deleteByRouteId(Long routeId);
}
