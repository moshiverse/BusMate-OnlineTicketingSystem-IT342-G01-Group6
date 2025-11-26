package edu.cit.lgng.backend.controller;

import edu.cit.lgng.backend.model.Schedule;
import edu.cit.lgng.backend.model.Seat;
import edu.cit.lgng.backend.repository.SeatRepository;
import edu.cit.lgng.backend.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {
    private final ScheduleService scheduleService;
    private final SeatRepository seatRepo;

    @GetMapping
    public List<Schedule> all() { return scheduleService.all(); }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPER_ADMIN')")
    @PostMapping
    public Schedule create(@RequestBody Schedule s) {
        return scheduleService.create(s);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPER_ADMIN')")
    public Schedule update(@PathVariable Long id, @RequestBody Schedule schedule) {
        return scheduleService.update(id, schedule);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        scheduleService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/seats")
    public ResponseEntity<List<Seat>> seats(@PathVariable Long id) {
        return ResponseEntity.ok(seatRepo.findByScheduleId(id));
    }
}

