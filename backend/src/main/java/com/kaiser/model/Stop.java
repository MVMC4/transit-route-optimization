package com.kaiser.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document
public class Stop {

    @JsonProperty
    private String name;

    @JsonProperty
    private double lat;

    @JsonProperty
    private double lng;

    @JsonProperty
    private boolean hub;

    @JsonProperty
    private List<String> flags;

    public Stop() {} // default constructor

    public Stop(String name, double lat, double lng, boolean hub, List<String> flags) {
        this.name = name;
        this.lat = lat;
        this.lng = lng;
        this.hub = hub;
        this.flags = flags;
    }

    // Getters
    public String getName() { return name; }
    public double getLat() { return lat; }
    public double getLng() { return lng; }
    public boolean isHub() { return hub; }
    public List<String> getFlags() { return flags; }

    // Setters
    public void setName(String name) { this.name = name; }
    public void setLat(double lat) { this.lat = lat; }
    public void setLng(double lng) { this.lng = lng; }
    public void setHub(boolean hub) { this.hub = hub; }
    public void setFlags(List<String> flags) { this.flags = flags; }
}
