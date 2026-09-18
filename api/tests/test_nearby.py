from sqlalchemy.dialects import postgresql

from app.routers.routes import nearby_routes


class EmptySession:
    def execute(self, statement: object) -> list[object]:
        compiled = str(
            statement.compile(  # type: ignore[attr-defined]
                dialect=postgresql.dialect(), compile_kwargs={"literal_binds": True}
            )
        )
        assert "ST_DWithin" in compiled
        assert "ST_Distance" in compiled
        return []


def test_nearby_routes_builds_a_postgis_distance_query() -> None:
    response = nearby_routes(
        lat=-24.6767,
        long=25.9355,
        radius_meters=750,
        session=EmptySession(),  # type: ignore[arg-type]
    )

    assert response.radius_meters == 750
    assert response.routes == []
