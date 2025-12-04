package edu.cit.lgng.backend.repository;

import edu.cit.lgng.backend.model.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BusRepository extends JpaRepository<Bus, Long> {
    List<Bus> findByBusTypeId(Long busTypeId);
    void deleteByBusTypeId(Long busTypeId);
}
