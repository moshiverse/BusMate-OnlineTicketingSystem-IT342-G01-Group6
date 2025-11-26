package edu.cit.lgng.backend.service;

import edu.cit.lgng.backend.model.Route;
import edu.cit.lgng.backend.repository.RouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// service/RouteService.java
@Service
@RequiredArgsConstructor
public class RouteService {
    private final RouteRepository repo;
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

    public void delete(Long id) {
        Route route = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found"));
        repo.delete(route);
    }
}

