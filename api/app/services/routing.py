"""Transit graph construction, walking edges, and shortest-path calculations."""

from __future__ import annotations

import heapq
import math
from collections import defaultdict
from dataclasses import dataclass

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import Settings
from app.models import Node
from app.schemas import Coordinate, NodeRead, PathfindResponse, TimeBreakdown

EARTH_RADIUS_METERS = 6_371_000
SOURCE_NODE = -1
DESTINATION_NODE = -2


@dataclass(frozen=True)
class GraphEdge:
    target: int
    minutes: float
    mode: str
    distance_meters: float


def haversine_meters(lat_a: float, long_a: float, lat_b: float, long_b: float) -> float:
    lat_a_rad = math.radians(lat_a)
    lat_b_rad = math.radians(lat_b)
    delta_lat = lat_b_rad - lat_a_rad
    delta_long = math.radians(long_b - long_a)
    value = (
        math.sin(delta_lat / 2) ** 2
        + math.cos(lat_a_rad) * math.cos(lat_b_rad) * math.sin(delta_long / 2) ** 2
    )
    return 2 * EARTH_RADIUS_METERS * math.asin(math.sqrt(value))


def travel_minutes(distance_meters: float, speed_kmh: float) -> float:
    return distance_meters / 1000 / speed_kmh * 60


def _candidate_nodes(
    nodes: list[Node], coordinate: Coordinate, maximum: float
) -> list[tuple[Node, float]]:
    ranked = sorted(
        (
            (node, haversine_meters(coordinate.lat, coordinate.long, node.lat, node.long))
            for node in nodes
        ),
        key=lambda item: item[1],
    )
    return [item for item in ranked[:5] if item[1] <= maximum]


def _build_graph(
    nodes: list[Node], origin: Coordinate, destination: Coordinate, settings: Settings
) -> dict[int, list[GraphEdge]]:
    graph: dict[int, list[GraphEdge]] = defaultdict(list)
    routes: dict[int, list[Node]] = defaultdict(list)

    for node in nodes:
        routes[node.route_id].append(node)

    for route_nodes in routes.values():
        route_nodes.sort(key=lambda node: node.order_num)
        for left, right in zip(route_nodes, route_nodes[1:], strict=False):
            distance = haversine_meters(left.lat, left.long, right.lat, right.long)
            minutes = travel_minutes(distance, settings.bus_speed_kmh)
            graph[left.id].append(GraphEdge(right.id, minutes, "bus", distance))
            graph[right.id].append(GraphEdge(left.id, minutes, "bus", distance))

    for index, left in enumerate(nodes):
        for right in nodes[index + 1 :]:
            if left.route_id == right.route_id:
                continue
            distance = haversine_meters(left.lat, left.long, right.lat, right.long)
            if distance > settings.max_transfer_meters:
                continue
            minutes = (
                travel_minutes(distance, settings.walking_speed_kmh)
                + settings.transfer_penalty_minutes
            )
            graph[left.id].append(GraphEdge(right.id, minutes, "transfer", distance))
            graph[right.id].append(GraphEdge(left.id, minutes, "transfer", distance))

    for node, distance in _candidate_nodes(nodes, origin, settings.max_walk_meters):
        graph[SOURCE_NODE].append(
            GraphEdge(
                node.id, travel_minutes(distance, settings.walking_speed_kmh), "walk", distance
            )
        )

    for node, distance in _candidate_nodes(nodes, destination, settings.max_walk_meters):
        graph[node.id].append(
            GraphEdge(
                DESTINATION_NODE,
                travel_minutes(distance, settings.walking_speed_kmh),
                "walk",
                distance,
            )
        )

    return graph


def _dijkstra(graph: dict[int, list[GraphEdge]]) -> list[tuple[int, GraphEdge]] | None:
    source_state = (SOURCE_NODE, False)
    distances: dict[tuple[int, bool], float] = {source_state: 0}
    previous: dict[tuple[int, bool], tuple[tuple[int, bool], GraphEdge]] = {}
    queue: list[tuple[float, int, bool]] = [(0, SOURCE_NODE, False)]
    destination_state: tuple[int, bool] | None = None

    while queue:
        distance_so_far, node_id, bus_used = heapq.heappop(queue)
        state = (node_id, bus_used)
        if distance_so_far != distances.get(state):
            continue
        if node_id == DESTINATION_NODE and bus_used:
            destination_state = state
            break

        for edge in graph.get(node_id, []):
            next_bus_used = bus_used or edge.mode == "bus"
            next_state = (edge.target, next_bus_used)
            candidate = distance_so_far + edge.minutes
            if candidate >= distances.get(next_state, math.inf):
                continue
            distances[next_state] = candidate
            previous[next_state] = (state, edge)
            heapq.heappush(queue, (candidate, edge.target, next_bus_used))

    if destination_state is None:
        return None

    result: list[tuple[int, GraphEdge]] = []
    state = destination_state
    while state != source_state:
        prior_state, edge = previous[state]
        result.append((prior_state[0], edge))
        state = prior_state
    result.reverse()
    return result


def find_path(
    session: Session, origin: Coordinate, destination: Coordinate, settings: Settings
) -> PathfindResponse | None:
    nodes = list(session.scalars(select(Node).order_by(Node.route_id, Node.order_num)))
    if not nodes:
        return None

    edges = _dijkstra(_build_graph(nodes, origin, destination, settings))
    if not edges:
        return None

    nodes_by_id = {node.id: node for node in nodes}
    path_ids: list[int] = []
    walking_minutes = 0.0
    walking_distance = 0.0
    bus_minutes = 0.0
    transfers = 0

    for source, edge in edges:
        if source > 0 and source not in path_ids:
            path_ids.append(source)
        if edge.target > 0 and edge.target not in path_ids:
            path_ids.append(edge.target)
        if edge.mode == "bus":
            bus_minutes += edge.minutes
        elif edge.mode == "transfer":
            transfers += 1
            walking_distance += edge.distance_meters
            walking_minutes += travel_minutes(edge.distance_meters, settings.walking_speed_kmh)
        else:
            walking_distance += edge.distance_meters
            walking_minutes += edge.minutes

    waiting_minutes = settings.initial_wait_minutes + transfers * settings.transfer_penalty_minutes
    total = walking_minutes + bus_minutes + waiting_minutes

    return PathfindResponse(
        path=[NodeRead.model_validate(nodes_by_id[node_id]) for node_id in path_ids],
        total_time_minutes=round(total),
        breakdown=TimeBreakdown(
            walking=round(walking_minutes),
            bus=round(bus_minutes),
            waiting=round(waiting_minutes),
        ),
        transfers=transfers,
        walking_distance_meters=round(walking_distance),
    )
