package edu.cit.lgng.backend.controller;

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

    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPER_ADMIN')")
    @PostMapping
    public Bus create(@RequestBody Bus b) {
        return service.create(b);
    }
}
