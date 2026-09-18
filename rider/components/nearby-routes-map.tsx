"use client";

/** Interactive place picker and nearby-route result map. */

import { useEffect, useRef } from "react";
import maplibregl, { GeoJSONSource } from "maplibre-gl";
import { NearbyRoute, Node, RouteGeometry } from "@/lib/api-client";
import { createMapStyle, GABORONE_CENTER, routeColor } from "@/lib/map-config";

type MapPoint = { lat: number; long: number };

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

function pointFeature(kind: string, point: MapPoint): GeoJSON.Feature {
  return {
    type: "Feature",
    properties: { kind },
    geometry: { type: "Point", coordinates: [point.long, point.lat] },
  };
}

function discoveryData(
  selection: MapPoint | null,
  origin: MapPoint | null,
  destination: MapPoint | null,
  nearbyRoutes: NearbyRoute[],
  routeNodes: Record<number, Node[]>,
  routeGeometries: Record<number, RouteGeometry>,
  radiusMeters: number
): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = [];
  if (selection) {
    features.push({
      type: "Feature",
      properties: { kind: "radius" },
      geometry: {
        type: "Polygon",
        coordinates: [radiusRing(selection.lat, selection.long, radiusMeters)],
      },
    });
    features.push(pointFeature("selection", selection));
  }
  if (destination) features.push(pointFeature("destination", destination));
  if (origin) features.push(pointFeature("origin", origin));

  for (const match of nearbyRoutes) {
    const color = routeColor(match.route.id);
    const nodes = [...(routeNodes[match.route.id] ?? [])].sort(
      (left, right) => left.orderNum - right.orderNum
    );
    const coordinates = routeGeometries[match.route.id]?.coordinates
      ?? nodes.map((node) => [node.long, node.lat] as [number, number]);
    if (coordinates.length > 1) {
      features.push({
        type: "Feature",
        properties: {
          kind: "route",
          routeName: match.route.name,
          color,
          roadAligned: routeGeometries[match.route.id]?.isRoadAligned ?? false,
        },
        geometry: { type: "LineString", coordinates },
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
  selection,
  origin,
  destination,
  nearbyRoutes,
  routeNodes,
  routeGeometries,
  radiusMeters,
  prompt,
  onPin,
}: {
  selection: MapPoint | null;
  origin: MapPoint | null;
  destination: MapPoint | null;
  nearbyRoutes: NearbyRoute[];
  routeNodes: Record<number, Node[]>;
  routeGeometries: Record<number, RouteGeometry>;
  radiusMeters: number;
  prompt: string;
  onPin: (coordinate: MapPoint) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const stateRef = useRef({
    selection, origin, destination, nearbyRoutes, routeNodes, routeGeometries, radiusMeters,
  });
  const onPinRef = useRef(onPin);

  useEffect(() => {
    stateRef.current = {
      selection, origin, destination, nearbyRoutes, routeNodes, routeGeometries, radiusMeters,
    };
  }, [selection, origin, destination, nearbyRoutes, routeNodes, routeGeometries, radiusMeters]);

  useEffect(() => { onPinRef.current = onPin; }, [onPin]);

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
          current.selection,
          current.origin,
          current.destination,
          current.nearbyRoutes,
          current.routeNodes,
          current.routeGeometries,
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
        id: "nearby-route-casing",
        type: "line",
        source: "discovery",
        filter: ["==", ["get", "kind"], "route"],
        paint: { "line-color": "#ffffff", "line-width": 7, "line-opacity": 0.9 },
      });
      map.addLayer({
        id: "nearby-route-lines",
        type: "line",
        source: "discovery",
        filter: ["==", ["get", "kind"], "route"],
        paint: { "line-color": ["get", "color"], "line-width": 3.5, "line-opacity": 0.95 },
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
      for (const [id, kind, color] of [
        ["confirmed-destination", "destination", "#ef4444"],
        ["confirmed-origin", "origin", "#22c55e"],
        ["selected-location", "selection", "#c9ff4a"],
      ] as const) {
        map.addLayer({
          id,
          type: "circle",
          source: "discovery",
          filter: ["==", ["get", "kind"], kind],
          paint: {
            "circle-radius": kind === "selection" ? 8 : 6,
            "circle-color": color,
            "circle-stroke-color": "#111111",
            "circle-stroke-width": 2,
          },
        });
      }
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
      source?.setData(discoveryData(
        selection, origin, destination, nearbyRoutes, routeNodes, routeGeometries, radiusMeters
      ));
      if (selection) map.easeTo({ center: [selection.long, selection.lat], duration: 400 });
    };
    if (map.isStyleLoaded()) update();
    else map.once("load", update);
  }, [selection, origin, destination, nearbyRoutes, routeNodes, routeGeometries, radiusMeters]);

  return (
    <div className="map-frame map-frame-discovery">
      <div className="map-hint"><span className="map-hint-dot" />{prompt}</div>
      <div ref={containerRef} className="map-canvas" aria-label="Choose a place on the Gaborone map" />
    </div>
  );
}
