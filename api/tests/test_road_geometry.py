from app.services.road_geometry import build_route_url


def test_build_route_url_preserves_longitude_latitude_order() -> None:
    url = build_route_url(
        "https://router.example.test/",
        ((25.971981, -24.667377), (25.935498, -24.676658)),
    )

    assert url.startswith(
        "https://router.example.test/route/v1/driving/25.971981,-24.667377;25.935498,-24.676658?"
    )
    assert "geometries=geojson" in url
    assert "overview=full" in url
