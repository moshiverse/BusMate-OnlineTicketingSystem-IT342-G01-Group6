package edu.cit.lgng.backend.service;

import edu.cit.lgng.backend.model.Schedule;
import edu.cit.lgng.backend.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// service/ScheduleService.java
@Service
@RequiredArgsConstructor
public class ScheduleService {
    private final ScheduleRepository repo;
    public List<Schedule> all(){return repo.findAll();}
    public Schedule create(Schedule s){return repo.save(s);}
}

