"""Low-cardinality Prometheus metrics for HTTP traffic and application health."""

import time

from fastapi import Request
from prometheus_client import Counter, Gauge, Histogram

HTTP_REQUESTS = Counter(
    "tsela_http_requests_total",
    "HTTP requests processed by the Tsela API.",
    ("method", "route", "status"),
)
HTTP_DURATION = Histogram(
    "tsela_http_request_duration_seconds",
    "HTTP request latency by stable route template.",
    ("method", "route"),
    buckets=(0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5),
)
HTTP_IN_FLIGHT = Gauge("tsela_http_requests_in_flight", "Requests currently being processed.")
GRAFANA_NOTIFICATIONS = Counter(
    "tsela_grafana_notifications_total",
    "Grafana alert webhook notifications accepted by state and severity.",
    ("state", "severity"),
)


async def metrics_middleware(request: Request, call_next):
    """Measure requests without using raw URLs as unbounded metric labels."""

    if request.url.path == "/metrics":
        return await call_next(request)

    started = time.perf_counter()
    HTTP_IN_FLIGHT.inc()
    status_code = 500
    try:
        response = await call_next(request)
        status_code = response.status_code
        return response
    finally:
        route = request.scope.get("route")
        route_label = getattr(route, "path", None) or "unmatched"
        method = request.method
        HTTP_IN_FLIGHT.dec()
        HTTP_REQUESTS.labels(method, route_label, str(status_code)).inc()
        HTTP_DURATION.labels(method, route_label).observe(time.perf_counter() - started)
