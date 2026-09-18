from app.seed import SEED_ROUTES


def test_gaborone_seed_routes_are_unique_and_mappable() -> None:
    assert len({route.name for route in SEED_ROUTES}) == len(SEED_ROUTES)
    assert len(SEED_ROUTES) >= 6

    for route in SEED_ROUTES:
        assert len(route.stops) >= 2
        for stop in route.stops:
            assert -25.0 < stop.lat < -24.0
            assert 25.0 < stop.long < 26.5
