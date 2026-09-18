"use client";

/** MapLibre route view that follows the rider marker during an active trip. */

import { useEffect, useRef } from "react";
import maplibregl, { GeoJSONSource, LngLatBounds } from "maplibre-gl";
import { Node, RouteGeometry } from "@/lib/api-client";
import { createMapStyle } from "@/lib/map-config";

type Position = { lat: number; long: number };

function tripData(stops: Node[], geometry: RouteGeometry | null, position: Position | null, targetId: number): GeoJSON.FeatureCollection {
  const coordinates = geometry?.coordinates ?? stops.map((stop) => [stop.long, stop.lat]);
  const features: GeoJSON.Feature[] = coordinates.length > 1 ? [{ type: "Feature", properties: { kind: "route" }, geometry: { type: "LineString", coordinates } }] : [];
  for (const stop of stops) features.push({ type: "Feature", properties: { kind: "stop", target: stop.id === targetId }, geometry: { type: "Point", coordinates: [stop.long, stop.lat] } });
  if (position) features.push({ type: "Feature", properties: { kind: "rider" }, geometry: { type: "Point", coordinates: [position.long, position.lat] } });
  return { type: "FeatureCollection", features };
}

export function LiveTripMap({ stops, geometry, position, targetId }: { stops: Node[]; geometry: RouteGeometry | null; position: Position | null; targetId: number }) {
  const containerRef = useRef<HTMLDivElement>(null); const mapRef = useRef<maplibregl.Map | null>(null);
  const stateRef = useRef({ stops, geometry, position, targetId });
  useEffect(() => { stateRef.current = { stops, geometry, position, targetId }; }, [stops, geometry, position, targetId]);
  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({ container: containerRef.current, style: createMapStyle(), center: [25.9231, -24.6533], zoom: 11 }); mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
    map.on("load", () => {
      const current = stateRef.current;
      map.addSource("trip", { type: "geojson", data: tripData(current.stops, current.geometry, current.position, current.targetId) });
      map.addLayer({ id: "trip-casing", type: "line", source: "trip", filter: ["==", ["get", "kind"], "route"], paint: { "line-color": "#fff", "line-width": 12 } });
      map.addLayer({ id: "trip-route", type: "line", source: "trip", filter: ["==", ["get", "kind"], "route"], paint: { "line-color": "#445cff", "line-width": 7 } });
      map.addLayer({ id: "trip-stops", type: "circle", source: "trip", filter: ["==", ["get", "kind"], "stop"], paint: { "circle-radius": ["case", ["get", "target"], 10, 5], "circle-color": ["case", ["get", "target"], "#ff70b7", "#fff"], "circle-stroke-color": "#111", "circle-stroke-width": 3 } });
      map.addLayer({ id: "trip-rider", type: "circle", source: "trip", filter: ["==", ["get", "kind"], "rider"], paint: { "circle-radius": 9, "circle-color": "#c9ff4a", "circle-stroke-color": "#111", "circle-stroke-width": 4 } });
      const coords = current.geometry?.coordinates ?? current.stops.map((stop) => [stop.long, stop.lat] as [number, number]);
      if (coords.length > 1) map.fitBounds(coords.reduce((bounds, item) => bounds.extend(item as [number, number]), new LngLatBounds(coords[0] as [number, number], coords[0] as [number, number])), { padding: 65, maxZoom: 14 });
    });
    return () => { map.remove(); mapRef.current = null; };
  }, []);
  useEffect(() => { const map = mapRef.current; if (!map?.isStyleLoaded()) return; (map.getSource("trip") as GeoJSONSource | undefined)?.setData(tripData(stops, geometry, position, targetId)); if (position) map.easeTo({ center: [position.long, position.lat], zoom: Math.max(map.getZoom(), 13), duration: 500 }); }, [stops, geometry, position, targetId]);
  return <div ref={containerRef} className="live-trip-map" aria-label="Live route and rider position" />;
}
