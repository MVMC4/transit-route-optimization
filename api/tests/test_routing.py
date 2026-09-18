from app.services.routing import haversine_meters, travel_minutes


def test_haversine_returns_zero_for_same_point() -> None:
    assert haversine_meters(-26.2041, 28.0473, -26.2041, 28.0473) == 0


def test_haversine_distance_is_symmetric() -> None:
    forward = haversine_meters(-26.2041, 28.0473, -26.1076, 28.0567)
    reverse = haversine_meters(-26.1076, 28.0567, -26.2041, 28.0473)
    assert round(forward) == round(reverse)
    assert 10_000 < forward < 12_000


def test_travel_minutes_uses_kilometers_per_hour() -> None:
    assert travel_minutes(5_000, 5) == 60
