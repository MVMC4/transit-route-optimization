"use client";

/** Quiet, locked MapLibre hero that progressively draws one road-aligned Gaborone route. */

import { useEffect, useRef, useState } from "react";
import maplibregl, { GeoJSONSource, Marker, StyleSpecification } from "maplibre-gl";
const roadCoordinates: [number, number][] = [
  [25.943883,-24.628739],[25.944194,-24.628986],[25.943307,-24.62993],[25.942509,-24.630731],
  [25.941382,-24.629825],[25.942771,-24.628357],[25.9432,-24.62772],[25.943387,-24.626955],
  [25.943338,-24.626675],[25.9431,-24.626446],[25.942898,-24.626357],[25.938942,-24.626389],
  [25.937429,-24.626372],[25.936637,-24.625997],[25.936084,-24.625719],[25.935899,-24.625783],
  [25.935093,-24.62664],[25.935245,-24.626852],[25.934665,-24.627477],[25.934315,-24.627453],
  [25.933229,-24.628561],[25.931384,-24.630507],[25.929462,-24.632511],[25.928995,-24.633273],
  [25.928989,-24.63409],[25.929027,-24.640413],[25.929126,-24.644662],[25.929143,-24.648222],
  [25.92918,-24.653249],[25.929198,-24.656183],[25.929216,-24.657737],[25.929417,-24.658123],
  [25.929267,-24.658305],[25.928678,-24.658164],[25.92414,-24.658187],[25.923305,-24.65824],
  [25.922878,-24.6582],[25.920961,-24.658244],[25.920581,-24.658611],[25.92005,-24.658802],
  [25.919394,-24.658841],[25.919133,-24.659083],[25.919098,-24.661507],[25.919023,-24.663562],
  [25.918576,-24.66454],[25.918186,-24.665004],[25.9169,-24.663909],[25.916376,-24.663462],
  [25.915571,-24.664278],[25.914997,-24.664862],[25.91391,-24.663926],[25.911283,-24.661853],
  [25.912116,-24.66076],[25.912713,-24.659117],[25.912789,-24.658251],[25.912752,-24.657588],
  [25.914359,-24.657582],[25.916878,-24.657564],[25.91711,-24.657659],[25.917088,-24.657837],
  [25.916355,-24.657815],
];
const origin = roadCoordinates[0];
const destination = roadCoordinates[roadCoordinates.length - 1];

function createMapStyle(): StyleSpecification {
  return { version:8, sources:{ osm:{ type:"raster", tiles:["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], tileSize:256, attribution:"© OpenStreetMap contributors" } }, layers:[{ id:"osm", type:"raster", source:"osm", paint:{ "raster-saturation":-1, "raster-contrast":-.14, "raster-brightness-min":.3, "raster-brightness-max":1, "raster-opacity":.76 } }] };
}

function routeData(coordinates: [number, number][]): GeoJSON.FeatureCollection {
  return { type:"FeatureCollection", features:[{ type:"Feature", properties:{ kind:"route" }, geometry:{ type:"LineString", coordinates } }] };
}

function endpointMarker(label: string, place: string, tone: "start" | "end"): HTMLDivElement {
  const element = document.createElement("div");
  element.className = `hero-endpoint ${tone}`;
  const dot = document.createElement("i");
  const copy = document.createElement("span");
  const eyebrow = document.createElement("small");
  const value = document.createElement("strong");
  eyebrow.textContent = label;
  value.textContent = place;
  copy.append(eyebrow, value);
  element.append(dot, copy);
  return element;
}

export function HeroRouteDemo() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("Loading road-aligned route");

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;
    let cancelled = false;
    let animationFrame = 0;
    const markers: Marker[] = [];
    const map = new maplibregl.Map({ container, style:createMapStyle(), bounds:[[25.908,-24.669],[25.951,-24.620]], fitBoundsOptions:{ padding:70 }, interactive:false, attributionControl:{} });
    const observer = new ResizeObserver(() => map.resize());
    observer.observe(container);

    map.on("load", async () => {
      map.addSource("hero-route", { type:"geojson", data:routeData([origin, origin]) });
      map.addLayer({ id:"hero-route-casing", type:"line", source:"hero-route", layout:{ "line-cap":"round", "line-join":"round" }, paint:{ "line-color":"#ffffff", "line-width":9, "line-opacity":.95 } });
      map.addLayer({ id:"hero-route-line", type:"line", source:"hero-route", layout:{ "line-cap":"round", "line-join":"round" }, paint:{ "line-color":"#3157ff", "line-width":4, "line-opacity":1 } });
      markers.push(new maplibregl.Marker({ element:endpointMarker("Start", "Broadhurst", "start"), anchor:"left" }).setLngLat(origin).addTo(map));
      markers.push(new maplibregl.Marker({ element:endpointMarker("Destination", "Main Mall", "end"), anchor:"right" }).setLngLat(destination).addTo(map));
      const coordinates = roadCoordinates;
      const source = map.getSource("hero-route") as GeoJSONSource;
      const bounds = coordinates.reduce((result, coordinate) => result.extend(coordinate), new maplibregl.LngLatBounds(coordinates[0], coordinates[0]));
      map.fitBounds(bounds, { padding:{ top:100, right:100, bottom:95, left:100 }, duration:0 });
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { source.setData(routeData(coordinates)); setStatus("Road-aligned route ready"); return; }
        const started = performance.now();
        const duration = 5200;
        const animate = (time: number) => {
          if (cancelled) return;
          const progress = Math.min(1, (time - started) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          const position = eased * (coordinates.length - 1);
          const index = Math.min(coordinates.length - 2, Math.floor(position));
          const fraction = position - index;
          const a = coordinates[index]; const b = coordinates[index + 1];
          const head: [number, number] = [a[0] + (b[0] - a[0]) * fraction, a[1] + (b[1] - a[1]) * fraction];
          source.setData(routeData([...coordinates.slice(0, index + 1), head]));
          if (progress < 1) animationFrame = requestAnimationFrame(animate); else { source.setData(routeData(coordinates)); setStatus("Road-aligned route ready"); }
        };
      animationFrame = requestAnimationFrame(animate);
    });
    return () => { cancelled = true; cancelAnimationFrame(animationFrame); observer.disconnect(); markers.forEach((marker) => marker.remove()); map.remove(); };
  }, []);

  return <div id="hero-map" className="hero-route-demo" aria-label="Broadhurst to Main Mall product preview"><div ref={mapContainerRef} className="demo-map-canvas" aria-label="Locked Gaborone map showing a road-following route"/><span className="sr-only" role="status">{status}</span><div className="map-blend top"/><div className="map-blend bottom"/></div>;
}
