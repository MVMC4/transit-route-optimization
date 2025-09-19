package com.kaiser.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document
public class Route {

    @Id
    @JsonProperty
    private String routeId;

    @JsonProperty
    private String name;

    @JsonProperty
    private List<Stop> stops;

    @JsonProperty
    private boolean active;

    @JsonProperty
    private List<String> flags;

    public Route() {} // default constructor

    public Route(String routeId, String name, List<Stop> stops, boolean active, List<String> flags) {
        this.routeId = routeId;
        this.name = name;
        this.stops = stops;
        this.active = active;
        this.flags = flags;
    }

    // Getters
    public String getRouteId() { return routeId; }
    public String getName() { return name; }
    public List<Stop> getStops() { return stops; }
    public boolean isActive() { return active; }
    public List<String> getFlags() { return flags; }

    // Setters
    public void setRouteId(String routeId) { this.routeId = routeId; }
    public void setName(String name) { this.name = name; }
    public void setStops(List<Stop> stops) { this.stops = stops; }
    public void setActive(boolean active) { this.active = active; }
    public void setFlags(List<String> flags) { this.flags = flags; }
}
