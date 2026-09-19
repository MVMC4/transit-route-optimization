"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import { GeoJSONSource } from "maplibre-gl";
import { NearbyRoute, Node } from "@/lib/api-client";
import { createMapStyle, GABORONE_CENTER, routeColor } from "@/lib/map-config";

function radiusRing(lat: number, long: number, radiusMeters: number): [number, number][] {
  const points: [number, number][] = [];
  const latScale = 111_320;
  const longScale = 111_320 * Math.cos((lat * Math.PI) / 180);
  for (let index = 0; index <= 64; index += 1) {
    const angle = (index / 64) * Math.PI * 2;
    points.push([
      long + (Math.cos(angle) * radiusMeters) / longScale,
      lat + (Math.sin(angle) * radiusMeters) / latScale,
    ]);
  }
  return points;
}

function discoveryData(
  pin: { lat: number; long: number } | null,
  nearbyRoutes: NearbyRoute[],
  routeNodes: Record<number, Node[]>,
  radiusMeters: number
): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = [];
  if (pin) {
    features.push({
      type: "Feature",
      properties: { kind: "radius" },
      geometry: { type: "Polygon", coordinates: [radiusRing(pin.lat, pin.long, radiusMeters)] },
    });
    features.push({
      type: "Feature",
      properties: { kind: "pin" },
      geometry: { type: "Point", coordinates: [pin.long, pin.lat] },
    });
  }

  for (const match of nearbyRoutes) {
    const color = routeColor(match.route.id);
    const nodes = [...(routeNodes[match.route.id] ?? [])].sort(
      (left, right) => left.orderNum - right.orderNum
    );
    if (nodes.length > 1) {
      features.push({
        type: "Feature",
        properties: { kind: "route", routeName: match.route.name, color },
        geometry: {
          type: "LineString",
          coordinates: nodes.map((node) => [node.long, node.lat]),
        },
      });
    }
    for (const node of nodes) {
      features.push({
        type: "Feature",
        properties: { kind: "stop", routeName: match.route.name, color, name: node.name },
        geometry: { type: "Point", coordinates: [node.long, node.lat] },
      });
    }
  }
  return { type: "FeatureCollection", features };
}

export function NearbyRoutesMap({
  pin,
  nearbyRoutes,
  routeNodes,
  radiusMeters,
  onPin,
}: {
  pin: { lat: number; long: number } | null;
  nearbyRoutes: NearbyRoute[];
  routeNodes: Record<number, Node[]>;
  radiusMeters: number;
  onPin: (coordinate: { lat: number; long: number }) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const stateRef = useRef({ pin, nearbyRoutes, routeNodes, radiusMeters });
  const onPinRef = useRef(onPin);

  useEffect(() => {
    stateRef.current = { pin, nearbyRoutes, routeNodes, radiusMeters };
  }, [pin, nearbyRoutes, routeNodes, radiusMeters]);

  useEffect(() => {
    onPinRef.current = onPin;
  }, [onPin]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const map = new maplibregl.Map({
      container,
      style: createMapStyle(),
      center: GABORONE_CENTER,
      zoom: 11.25,
    });
    mapRef.current = map;
    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(container);
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
    map.on("click", (event) => {
      onPinRef.current({
        lat: Number(event.lngLat.lat.toFixed(6)),
        long: Number(event.lngLat.lng.toFixed(6)),
      });
    });
    map.on("load", () => {
      const current = stateRef.current;
      map.addSource("discovery", {
        type: "geojson",
        data: discoveryData(
          current.pin,
          current.nearbyRoutes,
          current.routeNodes,
          current.radiusMeters
        ),
      });
      map.addLayer({
        id: "search-radius",
        type: "fill",
        source: "discovery",
        filter: ["==", ["get", "kind"], "radius"],
        paint: { "fill-color": "#7557ff", "fill-opacity": 0.1 },
      });
      map.addLayer({
        id: "nearby-route-lines",
        type: "line",
        source: "discovery",
        filter: ["==", ["get", "kind"], "route"],
        paint: {
          "line-color": ["get", "color"],
          "line-width": 5,
          "line-opacity": 0.9,
        },
      });
      map.addLayer({
        id: "nearby-route-stops",
        type: "circle",
        source: "discovery",
        filter: ["==", ["get", "kind"], "stop"],
        paint: {
          "circle-radius": 5,
          "circle-color": "#ffffff",
          "circle-stroke-color": ["get", "color"],
          "circle-stroke-width": 2,
        },
      });
      map.addLayer({
        id: "selected-location",
        type: "circle",
        source: "discovery",
        filter: ["==", ["get", "kind"], "pin"],
        paint: {
          "circle-radius": 9,
          "circle-color": "#c9ff4a",
          "circle-stroke-color": "#111111",
          "circle-stroke-width": 4,
        },
      });
    });
    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const update = () => {
      const source = map.getSource("discovery") as GeoJSONSource | undefined;
      source?.setData(discoveryData(pin, nearbyRoutes, routeNodes, radiusMeters));
      if (pin) map.easeTo({ center: [pin.long, pin.lat], duration: 450 });
    };
    if (map.isStyleLoaded()) update();
    else map.once("load", update);
  }, [pin, nearbyRoutes, routeNodes, radiusMeters]);

  return (
    <div className="map-frame map-frame-discovery">
      <div className="map-hint">
        <span className="map-hint-dot" />
        Drop a pin anywhere in Gaborone
      </div>
      <div ref={containerRef} className="map-canvas" aria-label="Find combi routes near a pinned location" />
    </div>
  );
}
