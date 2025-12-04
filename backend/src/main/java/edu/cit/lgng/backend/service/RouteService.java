package edu.cit.lgng.backend.service;

import edu.cit.lgng.backend.model.Route;
import edu.cit.lgng.backend.repository.RouteRepository;
import edu.cit.lgng.backend.repository.ScheduleRepository;
import edu.cit.lgng.backend.repository.SeatRepository;
import edu.cit.lgng.backend.repository.BookingRepository;
import edu.cit.lgng.backend.repository.BookingSeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// service/RouteService.java
@Service
@RequiredArgsConstructor
public class RouteService {
    private final RouteRepository repo;
    private final ScheduleRepository scheduleRepository;
    private final SeatRepository seatRepository;
    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    public List<Route> listAll(){return repo.findAll();}
    public Route create(Route r){return repo.save(r);}

    public Route update(Long id, Route routeData) {
        Route route = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found"));
        route.setOrigin(routeData.getOrigin());
        route.setDestination(routeData.getDestination());
        route.setDistanceKm(routeData.getDistanceKm());
        route.setDurationMinutes(routeData.getDurationMinutes());
        return repo.save(route);
    }

    @Transactional
    public void delete(Long id) {
        Route route = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found"));
        
        // Find all schedules for this route
        List<Long> scheduleIds = scheduleRepository.findByRouteId(id)
                .stream()
                .map(schedule -> schedule.getId())
                .toList();
        
        // Delete in order: booking_seats -> bookings -> seats -> schedules
        for (Long scheduleId : scheduleIds) {
            bookingSeatRepository.deleteByScheduleId(scheduleId);
            bookingRepository.deleteByScheduleId(scheduleId);
            seatRepository.deleteByScheduleId(scheduleId);
        }
        
        // Delete schedules
        scheduleRepository.deleteByRouteId(id);
        
        // Now delete the route
        repo.delete(route);
    }
}

