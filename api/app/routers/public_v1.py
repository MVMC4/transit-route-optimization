"""Credential-protected public API with indexed lookups and bounded request volume."""

from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, Header, HTTPException, Query, Request
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.config import Settings, get_settings
from app.database import get_db
from app.metrics import AUTH_FAILURES, RATE_LIMIT_REJECTIONS
from app.models import ApiKey, ApiUsage, Route
from app.routers.routes import get_route_geometry
from app.schemas import RouteGeometryResponse, RouteRead
from app.services.rate_limit import invalid_credential_gate
from app.services.security import hash_token, key_prefix

router = APIRouter(prefix="/v1", tags=["Public API v1"])


def require_api_key(
    request: Request,
    x_api_key: str | None = Header(default=None, alias="X-API-Key"),
    session: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
) -> ApiKey:
    if not x_api_key:
        AUTH_FAILURES.labels("public_api", "missing_key").inc()
        raise HTTPException(status_code=401, detail="X-API-Key is required")
    client_host = request.client.host if request.client else "unknown"
    client_identity = f"ip:{client_host}"
    credential_identity = f"key:{hash_token(x_api_key)[:16]}"
    if any(
        invalid_credential_gate.blocked(identity, settings.invalid_key_attempts_per_hour)
        for identity in (client_identity, credential_identity)
    ):
        RATE_LIMIT_REJECTIONS.labels("invalid_credentials").inc()
        raise HTTPException(
            status_code=429,
            detail="Too many invalid credential attempts",
            headers={"Retry-After": "3600"},
        )
    api_key = session.scalar(
        select(ApiKey).where(
            ApiKey.prefix == key_prefix(x_api_key),
            ApiKey.secret_hash == hash_token(x_api_key),
            ApiKey.revoked_at.is_(None),
            ApiKey.expires_at > datetime.now(UTC),
        )
    )
    if api_key is None:
        invalid_credential_gate.record(client_identity)
        invalid_credential_gate.record(credential_identity)
        AUTH_FAILURES.labels("public_api", "invalid_key").inc()
        raise HTTPException(status_code=401, detail="API key is invalid, expired, or revoked")
    now = datetime.now(UTC)
    period_start = datetime(now.year, now.month, 1, tzinfo=UTC)
    monthly_used = (
        session.scalar(
            select(func.count(ApiUsage.id)).where(
                ApiUsage.api_key_id == api_key.id, ApiUsage.occurred_at >= period_start
            )
        )
        or 0
    )
    if monthly_used >= api_key.monthly_quota:
        RATE_LIMIT_REJECTIONS.labels("monthly_quota").inc()
        raise HTTPException(
            status_code=429,
            detail="Monthly API quota exceeded",
            headers={"Retry-After": "3600"},
        )
    hourly_used = (
        session.scalar(
            select(func.count(ApiUsage.id)).where(
                ApiUsage.api_key_id == api_key.id,
                ApiUsage.occurred_at >= now - timedelta(hours=1),
            )
        )
        or 0
    )
    if hourly_used >= api_key.hourly_limit:
        RATE_LIMIT_REJECTIONS.labels("hourly_quota").inc()
        raise HTTPException(
            status_code=429,
            detail=f"Hourly API limit exceeded ({api_key.hourly_limit} requests)",
            headers={"Retry-After": "3600"},
        )
    api_key.last_used_at = now
    session.add(ApiUsage(api_key_id=api_key.id, method=request.method, path=request.url.path))
    session.commit()
    return api_key


@router.get("/routes", response_model=list[RouteRead])
def v1_routes(
    search: str | None = Query(default=None, max_length=120),
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
    _: ApiKey = Depends(require_api_key),
    session: Session = Depends(get_db),
) -> list[Route]:
    query = select(Route)
    if search:
        term = f"%{search.strip()}%"
        query = query.where(or_(Route.name.ilike(term), Route.description.ilike(term)))
    query = query.order_by(Route.created_at.desc()).offset(offset).limit(limit)
    return list(session.scalars(query))


@router.get("/routes/{route_id}/geometry", response_model=RouteGeometryResponse)
def v1_route_geometry(
    route_id: int,
    _: ApiKey = Depends(require_api_key),
    session: Session = Depends(get_db),
) -> RouteGeometryResponse:
    return get_route_geometry(route_id, session)
