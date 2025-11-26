package edu.cit.lgng.backend.controller;

import edu.cit.lgng.backend.dto.BusCreateDto;
import edu.cit.lgng.backend.model.Bus;
import edu.cit.lgng.backend.service.BusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/buses")
@RequiredArgsConstructor
public class BusController {
    private final BusService service;

    @GetMapping
    public List<Bus> all() {
        return service.all();
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPER_ADMIN')")
    public Bus create(@RequestBody BusCreateDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPER_ADMIN')")
    public Bus update(@PathVariable Long id, @RequestBody BusCreateDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPER_ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
