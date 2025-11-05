package edu.cit.lgng.backend.controller;

import edu.cit.lgng.backend.model.BusType;
import edu.cit.lgng.backend.repository.BusTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/bus-types")
@RequiredArgsConstructor
public class BusTypeController {
    private final BusTypeRepository repo;

    @GetMapping
    public List<BusType> getAll() {
        return repo.findAll();
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPER_ADMIN')")
    @PostMapping
    public BusType create(@RequestBody BusType type) {
        return repo.save(type);
    }
}

