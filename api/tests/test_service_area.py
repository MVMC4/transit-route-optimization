"""Unit checks for the community contribution envelope and its boundary semantics."""

from dataclasses import dataclass

import pytest
from fastapi import HTTPException

from app.routers.community import require_contribution_area
from app.services.service_area import all_inside_contribution_area, is_inside_contribution_area


@dataclass
class Point:
    lat: float
    long: float


def test_greater_gaborone_points_are_inside() -> None:
    assert all_inside_contribution_area([Point(-24.6533, 25.9231), Point(-24.57, 26.02)])


def test_maun_is_outside() -> None:
    assert not is_inside_contribution_area(Point(-19.9833, 23.4167))


def test_boundary_is_inclusive() -> None:
    assert is_inside_contribution_area(Point(-24.90, 25.55))


def test_router_guard_rejects_before_routing() -> None:
    with pytest.raises(HTTPException, match="Greater Gaborone") as error:
        require_contribution_area([Point(-19.9833, 23.4167), Point(-19.97, 23.45)])
    assert error.value.status_code == 422
