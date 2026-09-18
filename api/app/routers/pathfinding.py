"""Journey-planning HTTP boundary for origin and destination places."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config import Settings, get_settings
from app.database import get_db
from app.schemas import NoRouteResponse, PathfindRequest, PathfindResponse
from app.services.routing import find_path

router = APIRouter(prefix="/api/pathfind", tags=["Pathfinding"])


@router.post("", response_model=PathfindResponse | NoRouteResponse)
def pathfind(
    payload: PathfindRequest,
    session: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
) -> PathfindResponse | NoRouteResponse:
    result = find_path(session, payload.origin, payload.destination, settings)
    if result is None:
        return NoRouteResponse(message="No transit path found within walking range.")
    return result
