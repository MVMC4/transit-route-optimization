"""Greater Gaborone contribution envelope shared by preview and submission guards."""

from collections.abc import Iterable
from typing import Protocol


class LocatedPoint(Protocol):
    lat: float
    long: float


CONTRIBUTION_BOUNDS = {
    "west": 25.55,
    "south": -24.90,
    "east": 26.20,
    "north": -24.35,
}


def is_inside_contribution_area(point: LocatedPoint) -> bool:
    """Return whether a coordinate is inside the configured metro envelope."""

    return (
        CONTRIBUTION_BOUNDS["west"] <= point.long <= CONTRIBUTION_BOUNDS["east"]
        and CONTRIBUTION_BOUNDS["south"] <= point.lat <= CONTRIBUTION_BOUNDS["north"]
    )


def all_inside_contribution_area(points: Iterable[LocatedPoint]) -> bool:
    """Return false as soon as a contribution point leaves the metro envelope."""

    return all(is_inside_contribution_area(point) for point in points)
