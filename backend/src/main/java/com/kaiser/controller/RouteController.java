package com.kaiser.controller;

import com.kaiser.model.Route;
import com.kaiser.repository.RouteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class RouteController {

    private final RouteRepository routeRepository;

    public RouteController(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    // GET all routes
    @GetMapping("/routes")
    public List<Route> getRoutes() {
        return routeRepository.findAll();
    }

    // GET a single route by ID
    @GetMapping("/routes/{routeId}")
    public ResponseEntity<Route> getRouteById(@PathVariable String routeId) {
        return routeRepository.findById(routeId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    // POST create a new route
    @PostMapping("/routes")
    public ResponseEntity<Route> createRoute(@RequestBody Route route) {
        Route savedRoute = routeRepository.save(route);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRoute);
    }

    // DELETE a whole route
    @DeleteMapping("/routes/{routeId}")
    public ResponseEntity<Map<String, Object>> deleteRoute(@PathVariable String routeId) {
        if (routeRepository.existsById(routeId)) {
            routeRepository.deleteById(routeId);
            return ResponseEntity.ok(Map.of(
                    "status", (Object) "deleted",
                    "routeId", (Object) routeId
            ));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "status", (Object) "error",
                    "message", (Object) "Route not found"
            ));
        }
    }
}
