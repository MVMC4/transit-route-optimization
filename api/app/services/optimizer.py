"""Bounded OR-Tools stop-order optimizer and geodesic distance helpers."""

from __future__ import annotations

from ortools.constraint_solver import pywrapcp, routing_enums_pb2

from app.models import Node
from app.services.routing import haversine_meters


def _distance_matrix(nodes: list[Node]) -> list[list[int]]:
    return [[round(haversine_meters(a.lat, a.long, b.lat, b.long)) for b in nodes] for a in nodes]


def path_distance(order: list[int], matrix: list[list[int]]) -> int:
    return sum(matrix[left][right] for left, right in zip(order, order[1:], strict=False))


def optimize_node_order(nodes: list[Node], time_limit_seconds: int) -> tuple[list[Node], int, int]:
    ordered = sorted(nodes, key=lambda node: node.order_num)
    if len(ordered) < 3:
        matrix = _distance_matrix(ordered)
        distance = path_distance(list(range(len(ordered))), matrix)
        return ordered, distance, distance

    matrix = _distance_matrix(ordered)
    manager = pywrapcp.RoutingIndexManager(len(ordered), 1, [0], [len(ordered) - 1])
    routing = pywrapcp.RoutingModel(manager)

    def distance_callback(from_index: int, to_index: int) -> int:
        return matrix[manager.IndexToNode(from_index)][manager.IndexToNode(to_index)]

    callback_index = routing.RegisterTransitCallback(distance_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(callback_index)

    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    )
    search_parameters.local_search_metaheuristic = (
        routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
    )
    search_parameters.time_limit.FromSeconds(time_limit_seconds)

    solution = routing.SolveWithParameters(search_parameters)
    if solution is None:
        original_indexes = list(range(len(ordered)))
        original_distance = path_distance(original_indexes, matrix)
        return ordered, original_distance, original_distance

    optimized_indexes: list[int] = []
    index = routing.Start(0)
    while not routing.IsEnd(index):
        optimized_indexes.append(manager.IndexToNode(index))
        index = solution.Value(routing.NextVar(index))
    optimized_indexes.append(manager.IndexToNode(index))

    original_distance = path_distance(list(range(len(ordered))), matrix)
    optimized_distance = path_distance(optimized_indexes, matrix)
    return [ordered[index] for index in optimized_indexes], original_distance, optimized_distance
