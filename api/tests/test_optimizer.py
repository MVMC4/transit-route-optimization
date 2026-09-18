from types import SimpleNamespace

from app.services.optimizer import optimize_node_order, path_distance


def test_path_distance_does_not_close_the_route() -> None:
    matrix = [[0, 10, 50], [10, 0, 20], [50, 20, 0]]
    assert path_distance([0, 1, 2], matrix) == 30


def test_optimizer_preserves_first_and_last_stop() -> None:
    nodes = [
        SimpleNamespace(id=1, order_num=1, lat=0.0, long=0.0),
        SimpleNamespace(id=2, order_num=2, lat=1.0, long=1.0),
        SimpleNamespace(id=3, order_num=3, lat=0.1, long=0.1),
        SimpleNamespace(id=4, order_num=4, lat=0.0, long=2.0),
    ]
    optimized, original_distance, optimized_distance = optimize_node_order(nodes, 1)

    assert optimized[0].id == 1
    assert optimized[-1].id == 4
    assert optimized_distance <= original_distance
