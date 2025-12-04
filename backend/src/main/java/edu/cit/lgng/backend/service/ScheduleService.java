package edu.cit.lgng.backend.service;

import edu.cit.lgng.backend.model.Schedule;
import edu.cit.lgng.backend.repository.ScheduleRepository;
import edu.cit.lgng.backend.repository.SeatRepository;
import edu.cit.lgng.backend.repository.BookingRepository;
import edu.cit.lgng.backend.repository.BookingSeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// service/ScheduleService.java
@Service
@RequiredArgsConstructor
public class ScheduleService {
    private final ScheduleRepository repo;
    private final SeatRepository seatRepository;
    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    public List<Schedule> all(){return repo.findAll();}
    public Schedule create(Schedule s){return repo.save(s);}

    public Schedule update(Long id, Schedule scheduleData) {
        Schedule schedule = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        schedule.setRoute(scheduleData.getRoute());
        schedule.setBus(scheduleData.getBus());
        schedule.setDepartureTime(scheduleData.getDepartureTime());
        schedule.setArrivalTime(scheduleData.getArrivalTime());
        schedule.setPrice(scheduleData.getPrice());
        schedule.setAvailableSeats(scheduleData.getAvailableSeats());
        return repo.save(schedule);
    }

    @Transactional
    public void delete(Long id) {
        Schedule schedule = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        
        // Delete in order: booking_seats -> bookings -> seats -> schedule
        bookingSeatRepository.deleteByScheduleId(id);
        bookingRepository.deleteByScheduleId(id);
        seatRepository.deleteByScheduleId(id);
        
        // Now delete the schedule
        repo.delete(schedule);
    }
}

