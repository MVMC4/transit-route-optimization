"""Cached, SSRF-hardened OSRM client for road-following display geometry."""

from __future__ import annotations

import json
from functools import lru_cache
from urllib.parse import urlencode, urljoin

import httpx

from app.services.outbound_http import UnsafeOutboundUrl, validate_outbound_url


class RoadGeometryError(RuntimeError):
    pass


def build_route_url(base_url: str, coordinates: tuple[tuple[float, float], ...]) -> str:
    coordinate_path = ";".join(f"{long:.6f},{lat:.6f}" for long, lat in coordinates)
    query = urlencode(
        {"overview": "full", "geometries": "geojson", "steps": "false", "alternatives": "false"}
    )
    return f"{base_url.rstrip('/')}/route/v1/driving/{coordinate_path}?{query}"


def _get_json(
    url: str, allowed_hosts: tuple[str, ...], timeout_seconds: float, max_bytes: int
) -> dict:
    current = url
    try:
        with httpx.Client(timeout=timeout_seconds, follow_redirects=False) as client:
            for _ in range(4):
                validate_outbound_url(current, allowed_hosts)
                with client.stream(
                    "GET", current, headers={"User-Agent": "Tsela/1.0 route-preview"}
                ) as response:
                    if response.is_redirect:
                        location = response.headers.get("location")
                        if not location:
                            raise RoadGeometryError("Road routing redirect was invalid")
                        current = urljoin(current, location)
                        continue
                    response.raise_for_status()
                    declared = int(response.headers.get("content-length", "0") or 0)
                    if declared > max_bytes:
                        raise RoadGeometryError("Road routing response was too large")
                    body = bytearray()
                    for chunk in response.iter_bytes():
                        body.extend(chunk)
                        if len(body) > max_bytes:
                            raise RoadGeometryError("Road routing response was too large")
                    return json.loads(body)
    except (httpx.HTTPError, json.JSONDecodeError, UnsafeOutboundUrl, ValueError) as error:
        raise RoadGeometryError("Road routing service is unavailable") from error
    raise RoadGeometryError("Road routing service redirected too many times")


@lru_cache(maxsize=512)
def fetch_road_geometry(
    base_url: str,
    coordinates: tuple[tuple[float, float], ...],
    timeout_seconds: float,
    allowed_hosts: tuple[str, ...] = ("router.project-osrm.org",),
    max_response_bytes: int = 2_000_000,
) -> tuple[tuple[tuple[float, float], ...], int, int]:
    if len(coordinates) < 2:
        raise RoadGeometryError("At least two stops are required")
    payload = _get_json(
        build_route_url(base_url, coordinates), allowed_hosts, timeout_seconds, max_response_bytes
    )
    if payload.get("code") != "Ok" or not payload.get("routes"):
        raise RoadGeometryError("No road-aligned geometry was found")
    route = payload["routes"][0]
    raw_coordinates = route.get("geometry", {}).get("coordinates", [])
    if len(raw_coordinates) < 2:
        raise RoadGeometryError("Road routing service returned empty geometry")
    geometry = tuple((float(point[0]), float(point[1])) for point in raw_coordinates)
    return (
        geometry,
        round(float(route.get("distance", 0))),
        round(float(route.get("duration", 0)) / 60),
    )
