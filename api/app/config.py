"""Environment-backed application settings and safe operational defaults."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "TransitOS API"
    app_version: str = "1.0.0"
    developer_portal_url: str = "http://localhost:3003"
    api_docs_enabled: bool = False
    database_url: str = (
        "postgresql+psycopg://transitsym:metro@localhost:6000/transit?connect_timeout=3"
    )
    cors_origins: str = "http://localhost:3000"
    bus_speed_kmh: float = 35
    walking_speed_kmh: float = 5
    initial_wait_minutes: float = 7
    transfer_penalty_minutes: float = 3
    max_walk_meters: float = 2500
    max_transfer_meters: float = 400
    road_router_url: str = "https://router.project-osrm.org"
    road_router_allowed_hosts: str = "router.project-osrm.org"
    road_router_timeout_seconds: float = 15
    road_router_max_response_bytes: int = 2_000_000
    developer_session_days: int = 30
    api_key_lifetime_days: int = 90
    api_key_rotation_warning_days: int = 14
    api_usage_retention_days: int = 400
    default_monthly_api_quota: int = 10000
    default_hourly_api_limit: int = 100
    invalid_key_attempts_per_hour: int = 20
    max_request_body_bytes: int = 1_000_000
    estimated_cost_per_1000_requests_usd: float | None = None
    password_reset_debug: bool = False
    demo_account_enabled: bool = False
    demo_account_email: str = "demo@tsela.local"
    demo_account_password: str = "TselaDemo2026!"
    demo_account_name: str = "Tsela Demo"
    grafana_webhook_secret: str = "local-grafana-webhook"
    grafana_public_url: str = "http://localhost:3004"
    prometheus_public_url: str = "http://localhost:9090"
    prometheus_internal_url: str = "http://prometheus:9090"
    deployment_environment: str = "development"
    otel_enabled: bool = False
    otel_service_name: str = "tsela-api"
    otel_exporter_otlp_endpoint: str = "http://tempo:4317"
    otel_exporter_otlp_insecure: bool = True
    otel_trace_sample_ratio: float = 0.1

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def road_router_allowed_host_list(self) -> list[str]:
        return [
            host.strip().lower()
            for host in self.road_router_allowed_hosts.split(",")
            if host.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    return Settings()
