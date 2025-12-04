package edu.cit.lgng.backend.service;

import edu.cit.lgng.backend.model.BusType;
import edu.cit.lgng.backend.repository.BusTypeRepository;
import edu.cit.lgng.backend.repository.BusRepository;
import edu.cit.lgng.backend.repository.ScheduleRepository;
import edu.cit.lgng.backend.repository.SeatRepository;
import edu.cit.lgng.backend.repository.BookingRepository;
import edu.cit.lgng.backend.repository.BookingSeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BusTypeService {
    private final BusTypeRepository busTypeRepository;
    private final BusRepository busRepository;
    private final ScheduleRepository scheduleRepository;
    private final SeatRepository seatRepository;
    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;

    public List<BusType> getAll() {
        return busTypeRepository.findAll();
    }

    public BusType create(BusType busType) {
        return busTypeRepository.save(busType);
    }

    public BusType update(Long id, BusType busTypeData) {
        BusType existingType = busTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus type not found"));
        existingType.setName(busTypeData.getName());
        existingType.setCapacity(busTypeData.getCapacity());
        existingType.setDescription(busTypeData.getDescription());
        return busTypeRepository.save(existingType);
    }

    @Transactional
    public void delete(Long id) {
        BusType busType = busTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus type not found"));
        
        // Find all buses of this type
        List<Long> busIds = busRepository.findByBusTypeId(id)
                .stream()
                .map(bus -> bus.getId())
                .toList();
        
        // For each bus, delete its schedules, seats, bookings and booking_seats
        for (Long busId : busIds) {
            List<Long> scheduleIds = scheduleRepository.findByBusId(busId)
                    .stream()
                    .map(schedule -> schedule.getId())
                    .toList();
            
            // Delete in order: booking_seats -> bookings -> seats -> schedules
            for (Long scheduleId : scheduleIds) {
                bookingSeatRepository.deleteByScheduleId(scheduleId);
                bookingRepository.deleteByScheduleId(scheduleId);
                seatRepository.deleteByScheduleId(scheduleId);
            }
            
            // Delete schedules for this bus
            scheduleRepository.deleteByBusId(busId);
        }
        
        // Delete all buses of this type
        busRepository.deleteByBusTypeId(id);
        
        // Finally, delete the bus type
        busTypeRepository.delete(busType);
    }
}
