# Demo credentials & endpoints (local Compose only)

Everything below is `compose.yaml`'s local dev stack only. Demo mode is
disabled by default outside it (see `docs/AUTH_DECISION.md`). Start the
stack first:

```bash
docker compose up -d --build
```

## Demo account

| Field | Value |
| --- | --- |
| Email | `demo@tsela.local` |
| Password | `TselaDemo2026!` |

Sign in at the developer portal (http://localhost:3003) to access the protected
Fumadocs reference and developer console. The same local demo account is seeded
with the `admin` role and can be used on the separate operations sign-in page at
http://localhost:3001/login. The API checks that role on every admin request;
hiding navigation is never treated as authorization.

## URLs

| Surface | URL | Port |
| --- | --- | --- |
| Marketing homepage | http://localhost:3000 | 3000 |
| Operations dashboard (`admin`) | http://localhost:3001 | 3001 |
| Rider app | http://localhost:3002 | 3002 |
| Developer portal / docs (`docs-site`, Fumadocs) | http://localhost:3003 | 3003 |
| API (`api`, FastAPI) | http://localhost:8000 | 8000 |
| Grafana | http://localhost:3004 | 3004 |
| Prometheus | http://localhost:9090 | 9090 |

## Grafana local login

| Field | Value |
| --- | --- |
| Username | `admin` |
| Password | `GRAFANA_ADMIN_PASSWORD`, defaulting to `admin` for local Compose only |

Start it with `docker compose --profile observability up -d`. Anonymous access and public sign-up are disabled. Set a non-default `GRAFANA_ADMIN_PASSWORD` before using any shared environment; production credentials belong in a secret manager, not this file.

## API

`http://localhost:8000` directly (no gateway in front of it in dev). Auth is
an `X-API-Key` header — create a key from the developer portal's console
once signed in (`http://localhost:3003`, "Create an API key"), or use the
demo account to try it without one. Full endpoint-by-endpoint reference,
including request/response examples, is the developer portal itself — it's
a real Fumadocs reference site (dedicated page per endpoint), not a single
long page.

A first request once you have a key:

```bash
curl -H "X-API-Key: $TSELA_API_KEY" "http://localhost:8000/v1/routes"
```

## Scope

These values are convenience credentials for the local Compose stack. They are not valid production credentials and must never be copied into a deployed environment.
