package edu.cit.lgng.backend.service;

import edu.cit.lgng.backend.model.Schedule;
import edu.cit.lgng.backend.model.Seat;
import edu.cit.lgng.backend.repository.ScheduleRepository;
import edu.cit.lgng.backend.repository.SeatRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SeatService {

    private final SeatRepository seatRepo;
    private final ScheduleRepository scheduleRepo;

    @Transactional
    public List<Seat> generateSeats(Long scheduleId, int rows, int cols) {
        Schedule schedule = scheduleRepo.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found: " + scheduleId));

        // Prevent duplicates
        if (!seatRepo.findByScheduleId(scheduleId).isEmpty()) {
            throw new RuntimeException("Seats already exist for schedule ID " + scheduleId);
        }

        List<Seat> seats = new ArrayList<>();
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                String seatNumber = (char)('A' + r) + String.valueOf(c + 1);
                Seat seat = Seat.builder()
                        .schedule(schedule)
                        .seatNumber(seatNumber)
                        .rowIndex(r)
                        .colIndex(c)
                        .status(Seat.Status.AVAILABLE)
                        .build();
                seats.add(seat);
            }
        }

        return seatRepo.saveAll(seats);
    }

    public List<Seat> getSeatsBySchedule(Long scheduleId) {
        return seatRepo.findByScheduleId(scheduleId);
    }
}