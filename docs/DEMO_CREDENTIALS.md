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

Sign in at the developer portal (http://localhost:3003) — it doubles as the
public landing page and the auth gateway for both the docs' interactive
console and the operations dashboard. This is the one seeded account; there
is no separate admin-only login documented elsewhere in this repo.

## URLs

| Surface | URL | Port |
| --- | --- | --- |
| Marketing homepage | http://localhost:3000 | 3000 |
| Operations dashboard (`admin`) | http://localhost:3001 | 3001 |
| Rider app | http://localhost:3002 | 3002 |
| Developer portal / docs (`docs-site`, Fumadocs) | http://localhost:3003 | 3003 |
| API (`api`, FastAPI) | http://localhost:8000 | 8000 |

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

## Note on what wasn't independently verified here

This file was written from the developer portal's own displayed
credentials and `compose.yaml`'s port mappings, not by re-testing every
login path end-to-end in this pass — if the admin dashboard's auth gate
behaves differently than described (e.g. a separate account is actually
required), treat this file as the starting point to correct, not as
independently confirmed.
