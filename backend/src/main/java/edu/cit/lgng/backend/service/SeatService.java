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

        // Get bus capacity to determine layout
        Integer capacity = schedule.getBus().getBusType().getCapacity();
        List<Seat> seats;

        // Use custom layouts for specific capacities (41 or 53)
        if (capacity != null && (capacity == 41 || capacity == 53)) {
            seats = generateCustomBusLayout(schedule, capacity);
        } else {
            // Default grid layout for other capacities
            seats = generateGridLayout(schedule, rows, cols);
        }

        return seatRepo.saveAll(seats);
    }

    /**
     * Generate custom bus layout for Standard (41 seats) and Premium (53 seats) buses
     * Layout: 2 seats - aisle (gap) - 2 seats per regular row, last row has 5 seats
     */
    private List<Seat> generateCustomBusLayout(Schedule schedule, int capacity) {
        List<Seat> seats = new ArrayList<>();
        int seatCount = 0;
        int row = 0;

        // Calculate number of regular rows (4 seats each) and last row (5 seats)
        int regularRows = (capacity - 5) / 4; // All rows except the last
        int lastRowSeats = 5;

        // Generate regular rows: [seat1, seat2, gap, seat3, seat4]
        for (int r = 0; r < regularRows; r++) {
            String rowLabel = String.valueOf((char) ('A' + r));
            
            // Left side: 2 seats (A1, A2)
            for (int c = 0; c < 2; c++) {
                seats.add(Seat.builder()
                        .schedule(schedule)
                        .seatNumber(rowLabel + (c + 1))
                        .rowIndex(r)
                        .colIndex(c)
                        .status(Seat.Status.AVAILABLE)
                        .build());
                seatCount++;
            }

            // Right side: 2 seats (A3, A4) - columns 3 and 4, leaving column 2 as aisle gap
            for (int c = 3; c < 5; c++) {
                seats.add(Seat.builder()
                        .schedule(schedule)
                        .seatNumber(rowLabel + (c))
                        .rowIndex(r)
                        .colIndex(c)
                        .status(Seat.Status.AVAILABLE)
                        .build());
                seatCount++;
            }
            row++;
        }

        // Generate last row: 5 seats across
        String lastRowLabel = String.valueOf((char) ('A' + row));
        for (int c = 0; c < lastRowSeats; c++) {
            seats.add(Seat.builder()
                    .schedule(schedule)
                    .seatNumber(lastRowLabel + (c + 1))
                    .rowIndex(row)
                    .colIndex(c)
                    .status(Seat.Status.AVAILABLE)
                    .build());
        }

        return seats;
    }

    /**
     * Generate default grid layout for buses with other capacities
     */
    private List<Seat> generateGridLayout(Schedule schedule, int rows, int cols) {
        List<Seat> seats = new ArrayList<>();
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                String seatNumber = (char) ('A' + r) + String.valueOf(c + 1);
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
        return seats;
    }

    public List<Seat> getSeatsBySchedule(Long scheduleId) {
        return seatRepo.findByScheduleId(scheduleId);
    }
}