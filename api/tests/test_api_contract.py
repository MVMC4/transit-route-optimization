from app.main import app


def test_openapi_contains_complete_route_surface() -> None:
    paths = app.openapi()["paths"]

    assert set(paths["/api/routes"]) >= {"get", "post"}
    assert "post" in paths["/api/routes/map"]
    assert "get" in paths["/api/routes/nearby"]
    assert "get" in paths["/api/routes/network"]
    assert set(paths["/api/routes/{route_id}"]) >= {"get", "patch", "delete"}
    assert "get" in paths["/api/routes/{route_id}/geometry"]
    assert set(paths["/api/routes/{route_id}/nodes"]) >= {"get", "post"}
    assert set(paths["/api/routes/{route_id}/nodes/{node_id}"]) >= {
        "get",
        "patch",
        "delete",
    }
    assert "post" in paths["/api/routes/{route_id}/optimize"]
    optimization_schema = app.openapi()["components"]["schemas"]["RouteOptimizationRequest"]
    assert "timeLimitSeconds" in optimization_schema["properties"]
    assert "post" in paths["/api/pathfind"]
    assert "get" in paths["/api/dashboard"]
    assert "get" in paths["/api/health"]
    assert "post" in paths["/api/community/routes/preview"]
    assert "post" in paths["/api/community/routes"]
    assert "get" in paths["/api/community/posts"]
    assert "post" in paths["/api/community/posts"]
    assert "post" in paths["/api/developer/register"]
    assert "post" in paths["/api/developer/login"]
    assert "post" in paths["/api/developer/logout"]
    assert "post" in paths["/api/developer/keys"]
    assert "get" in paths["/api/developer/usage"]
    assert "post" in paths["/api/developer/password-recovery"]
    assert "post" in paths["/api/developer/password-reset"]
    assert "get" in paths["/v1/routes"]
    assert "get" in paths["/v1/routes/{route_id}/geometry"]


def test_public_api_explorer_is_disabled_by_default() -> None:
    mounted_paths = {route.path for route in app.routes if hasattr(route, "path")}

    assert "/api/docs" not in mounted_paths
    assert "/api/redoc" not in mounted_paths
    assert "/api/openapi" not in mounted_paths
