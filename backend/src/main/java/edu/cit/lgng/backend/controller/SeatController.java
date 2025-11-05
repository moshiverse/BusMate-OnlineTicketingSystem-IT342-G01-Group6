package edu.cit.lgng.backend.controller;

import edu.cit.lgng.backend.model.Seat;
import edu.cit.lgng.backend.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/seats")
@RequiredArgsConstructor
public class SeatController {
    private final SeatService seatService;

    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPER_ADMIN')")
    @PostMapping("/generate/{scheduleId}")
    public ResponseEntity<?> generateSeats(
            @PathVariable Long scheduleId,
            @RequestParam(defaultValue = "10") int rows,
            @RequestParam(defaultValue = "4") int cols) {
        var seats = seatService.generateSeats(scheduleId, rows, cols);
        return ResponseEntity.ok(Map.of(
                "message", "Seats generated successfully",
                "totalSeats", seats.size(),
                "scheduleId", scheduleId
        ));
    }

    @GetMapping("/schedule/{scheduleId}")
    public ResponseEntity<?> getSeats(@PathVariable Long scheduleId) {
        return ResponseEntity.ok(seatService.getSeatsBySchedule(scheduleId));
    }
}

