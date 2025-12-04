package edu.cit.lgng.backend.controller;

import edu.cit.lgng.backend.model.BusType;
import edu.cit.lgng.backend.service.BusTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/bus-types")
@RequiredArgsConstructor
public class BusTypeController {
    private final BusTypeService busTypeService;

    @GetMapping
    public List<BusType> getAll() {
        return busTypeService.getAll();
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPER_ADMIN')")
    @PostMapping
    public BusType create(@RequestBody BusType type) {
        return busTypeService.create(type);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPER_ADMIN')")
    public BusType update(@PathVariable Long id, @RequestBody BusType type) {
        return busTypeService.update(id, type);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPER_ADMIN')")
    public void delete(@PathVariable Long id) {
        busTypeService.delete(id);
    }
}

