package edu.cit.lgng.backend.controller;

import edu.cit.lgng.backend.model.Route;
import edu.cit.lgng.backend.service.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RouteController {
    private final RouteService service;

    @GetMapping
    public List<Route> all() {
        return service.listAll();
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPER_ADMIN')")
    @PostMapping
    public ResponseEntity<Route> create(@RequestBody Route r) {
        return ResponseEntity.ok(service.create(r));
    }
}
