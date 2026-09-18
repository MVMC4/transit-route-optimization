"""Cached OSRM client for road-following display geometry."""

from __future__ import annotations

import json
from functools import lru_cache
from urllib.parse import urlencode
from urllib.request import Request, urlopen


class RoadGeometryError(RuntimeError):
    pass


def build_route_url(base_url: str, coordinates: tuple[tuple[float, float], ...]) -> str:
    coordinate_path = ";".join(f"{long:.6f},{lat:.6f}" for long, lat in coordinates)
    query = urlencode(
        {
            "overview": "full",
            "geometries": "geojson",
            "steps": "false",
            "alternatives": "false",
        }
    )
    return f"{base_url.rstrip('/')}/route/v1/driving/{coordinate_path}?{query}"


@lru_cache(maxsize=512)
def fetch_road_geometry(
    base_url: str,
    coordinates: tuple[tuple[float, float], ...],
    timeout_seconds: float,
) -> tuple[tuple[tuple[float, float], ...], int, int]:
    if len(coordinates) < 2:
        raise RoadGeometryError("At least two stops are required")

    request = Request(
        build_route_url(base_url, coordinates),
        headers={"User-Agent": "TransitOS/0.1 route-preview"},
    )
    try:
        with urlopen(request, timeout=timeout_seconds) as response:  # noqa: S310
            payload = json.load(response)
    except (OSError, TimeoutError, ValueError) as error:
        raise RoadGeometryError("Road routing service is unavailable") from error

    if payload.get("code") != "Ok" or not payload.get("routes"):
        raise RoadGeometryError("No road-aligned geometry was found")

    route = payload["routes"][0]
    raw_coordinates = route.get("geometry", {}).get("coordinates", [])
    if len(raw_coordinates) < 2:
        raise RoadGeometryError("Road routing service returned empty geometry")

    geometry = tuple((float(point[0]), float(point[1])) for point in raw_coordinates)
    distance_meters = round(float(route.get("distance", 0)))
    duration_minutes = round(float(route.get("duration", 0)) / 60)
    return geometry, distance_meters, duration_minutes
