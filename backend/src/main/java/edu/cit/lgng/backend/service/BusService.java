package edu.cit.lgng.backend.service;

import edu.cit.lgng.backend.dto.BusCreateDto;
import edu.cit.lgng.backend.model.Bus;
import edu.cit.lgng.backend.model.BusType;
import edu.cit.lgng.backend.repository.BusRepository;
import edu.cit.lgng.backend.repository.BusTypeRepository;
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
public class BusService {

    private final BusRepository busRepository;
    private final BusTypeRepository busTypeRepository;
    private final ScheduleRepository scheduleRepository;
    private final SeatRepository seatRepository;
    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;

    public List<Bus> all() {
        return busRepository.findAll();
    }

    public Bus create(BusCreateDto dto) {

        BusType busType = busTypeRepository.findById(dto.getBusTypeId())
                .orElseThrow(() -> new RuntimeException("Invalid busTypeId"));

        Bus bus = Bus.builder()
                .busNumber(dto.getBusNumber())
                .plateNo(dto.getPlateNo())
                .status(dto.getStatus())
                .busType(busType)
                .build();

        return busRepository.save(bus);
    }

    public Bus update(Long id, BusCreateDto dto) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus not found"));

        BusType busType = busTypeRepository.findById(dto.getBusTypeId())
                .orElseThrow(() -> new RuntimeException("Invalid busTypeId"));

        bus.setBusNumber(dto.getBusNumber());
        bus.setPlateNo(dto.getPlateNo());
        bus.setStatus(dto.getStatus());
        bus.setBusType(busType);

        return busRepository.save(bus);
    }

    @Transactional
    public void delete(Long id) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus not found"));
        
        // Find all schedules for this bus
        List<Long> scheduleIds = scheduleRepository.findByBusId(id)
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
        scheduleRepository.deleteByBusId(id);
        
        // Now delete the bus
        busRepository.delete(bus);
    }
}