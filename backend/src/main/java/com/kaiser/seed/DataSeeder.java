package com.kaiser.seed;

import com.kaiser.model.Route;
import com.kaiser.model.Stop;
import com.kaiser.repository.RouteRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final RouteRepository routeRepository;

    public DataSeeder(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Clear existing data
        routeRepository.deleteAll();

        // Sample Routes
        Route r1 = new Route(
                "R1",
                "City Center to University",
                List.of(
                        new Stop("Stop A", -24.65, 25.92, false, List.of()),
                        new Stop("Stop B", -24.70, 25.95, true, List.of("wheelchair"))
                ),
                true,
                List.of("express")
        );

        Route r2 = new Route(
                "R2",
                "Airport to Downtown",
                List.of(
                        new Stop("Airport", -24.62, 25.90, true, List.of("luggage")),
                        new Stop("Downtown", -24.65, 25.92, false, List.of())
                ),
                true,
                List.of()
        );

        // Save routes
        routeRepository.saveAll(List.of(r1, r2));

        System.out.println("✅ Seed data inserted!");
    }
}
