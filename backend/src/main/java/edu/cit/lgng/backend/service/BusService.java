package edu.cit.lgng.backend.service;

import edu.cit.lgng.backend.model.Bus;
import edu.cit.lgng.backend.repository.BusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// service/BusService.java
@Service
@RequiredArgsConstructor
public class BusService {
    private final BusRepository repo;
    public List<Bus> all(){return repo.findAll();}
    public Bus create(Bus b){return repo.save(b);}
}

