"""Read-only operations dashboard aggregation endpoints."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Node, Route
from app.schemas import DashboardResponse, NodeRead, RouteRead

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("", response_model=DashboardResponse)
@router.get("/db", response_model=DashboardResponse, include_in_schema=False)
def dashboard_data(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    session: Session = Depends(get_db),
) -> DashboardResponse:
    offset = (page - 1) * limit
    routes = list(
        session.scalars(select(Route).order_by(Route.created_at.desc()).offset(offset).limit(limit))
    )
    nodes = list(
        session.scalars(
            select(Node).order_by(Node.route_id, Node.order_num).offset(offset).limit(limit)
        )
    )
    return DashboardResponse(
        routes=[RouteRead.model_validate(route) for route in routes],
        nodes=[NodeRead.model_validate(node) for node in nodes],
        totals={
            "routes": session.scalar(select(func.count()).select_from(Route)) or 0,
            "nodes": session.scalar(select(func.count()).select_from(Node)) or 0,
        },
    )
