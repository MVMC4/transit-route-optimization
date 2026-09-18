# TransitOS backend

The backend is a FastAPI service that owns validation, route and stop persistence, geospatial data, journey planning, optimization, health reporting, and the OpenAPI contract. Next.js does not connect directly to PostgreSQL.

## Runtime flow

1. Docker Compose starts PostgreSQL with PostGIS and pgRouting.
2. The API waits for PostgreSQL's health check.
3. The API container runs `alembic upgrade head` before starting Uvicorn.
4. FastAPI validates incoming JSON with Pydantic.
5. Router functions use a request-scoped SQLAlchemy session.
6. Mutations commit atomically and responses are serialized to the public camelCase contract.
7. The rider and operations clients call FastAPI over HTTP from separate origins.

## Backend layout

```text
api/
├── app/
│   ├── main.py                 FastAPI setup, CORS, and router registration
│   ├── config.py               Environment-backed runtime settings
│   ├── database.py             SQLAlchemy engine and request sessions
│   ├── models.py               Route and Node ORM models
│   ├── schemas.py              Pydantic request/response contracts
│   ├── routers/
│   │   ├── routes.py           Route, stop, and optimization operations
│   │   ├── pathfinding.py      Journey-planning gateway
│   │   ├── dashboard.py        Dashboard read model
│   │   └── health.py           Dependency health checks
│   └── services/
│       ├── routing.py          Graph construction and Dijkstra search
│       └── optimizer.py        OR-Tools route sequencing
├── alembic/                    Schema migration environment and revisions
├── tests/                      Contract, routing, and optimizer tests
├── Dockerfile
└── pyproject.toml
```

## Data model

### Route

- `id`: integer primary key
- `name`: required, maximum 120 characters
- `description`: optional text
- `createdAt`: timezone-aware server timestamp

### Node

- `id`: integer primary key
- `routeId`: foreign key to Route with `ON DELETE CASCADE`
- `label`: regenerated as `ROUTE{id}-STOP{order}`
- `name`: required, maximum 160 characters
- `lat` and `long`: validated coordinate values
- `orderNum`: one-based position within the route
- `geom`: PostGIS `Point` using SRID 4326

The migration enables `postgis` and `pgrouting`, backfills missing geometry, creates a route/order B-tree index, and creates a GiST spatial index. Removing a route removes its stops.

## Route and stop mutations

Route CRUD is conventional SQLAlchemy persistence. Stop mutations also maintain sequence invariants:

The map builder uses `POST /api/routes/map`, which inserts the route and complete stop sequence in a single transaction. The stop array order is normalized to contiguous one-based positions.

- Inserting at position `n` increments existing positions at or after `n`.
- Moving a stop shifts only the positions crossed by the move.
- Deleting a stop decrements all later positions.
- After any sequence mutation, labels are regenerated from the stored order.
- Updating latitude or longitude rebuilds the PostGIS point.

Each mutation uses one session and commits after all related updates. A missing route or route-scoped stop is converted to HTTP `404`.

## Journey planning

The current journey planner builds an in-memory graph from ordered stops:

- Consecutive stops on a route receive bidirectional bus edges.
- Stops on different routes receive transfer edges when they are within `MAX_TRANSFER_METERS`.
- The five closest origin and destination candidates are connected when they are within `MAX_WALK_METERS`.
- Edge distances use the Haversine formula in meters.
- Travel time derives from configurable bus and walking speeds.
- Dijkstra's algorithm minimizes elapsed minutes and requires at least one bus edge, preventing a walking-only result.
- Initial waiting time and per-transfer penalties are added to the final breakdown.

PostGIS and pgRouting are installed and monitored, but this version performs graph construction and Dijkstra search in Python. A future large-network implementation can persist graph edges and move the shortest-path query to pgRouting.

### Complexity consideration

Transfer discovery currently compares stops across routes pairwise. That is appropriate for a small management system but grows quadratically. For production-scale feeds, use `ST_DWithin` against the GiST index or a precomputed transfer-edge table.

## Route optimization

The optimizer builds a Haversine distance matrix and gives it to Google OR-Tools:

- one vehicle represents one route;
- the first and last stops are fixed;
- `PATH_CHEAPEST_ARC` produces the initial solution;
- guided local search improves the sequence until the request time limit expires;
- the API reports original distance, optimized distance, and percentage savings;
- preview mode is read-only, while apply mode stores the new order and labels.

Routes with two stops or fewer are already fixed. An optimization request requires at least two stops.

## Configuration

Settings are read from environment variables or `api/.env`:

| Variable | Default | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Local PostgreSQL on port 6000 | SQLAlchemy connection URL |
| `CORS_ORIGINS` | `http://localhost:3000` | Comma-separated allowed browser origins; Compose supplies ports 3000 and 3001 |
| `BUS_SPEED_KMH` | `35` | Bus edge time calculation |
| `WALKING_SPEED_KMH` | `5` | Walking edge time calculation |
| `INITIAL_WAIT_MINUTES` | `7` | Initial boarding wait |
| `TRANSFER_PENALTY_MINUTES` | `3` | Additional wait per transfer |
| `MAX_WALK_METERS` | `2500` | Origin/destination connection radius |
| `MAX_TRANSFER_METERS` | `400` | Inter-route transfer radius |

The SQLAlchemy pool uses pre-ping, a base size of 10, and up to 20 overflow connections.

## Health behavior

`GET /api/health` checks, in order:

1. the API process;
2. a PostgreSQL `SELECT 1` and its latency;
3. `PostGIS_Version()`;
4. `pgr_version()`.

Dependency failures produce a `degraded` payload rather than an exception so dashboards and container health probes receive structured status information.

## Gaborone starter data

`python -m app.seed` idempotently creates seven community-sourced starter corridors and their landmark stops. The Docker API startup runs it after Alembic. Existing route names are left untouched, so container restarts do not duplicate data.

The supplied Gaborone combi post establishes which named corridors serve the malls and activity hubs. Landmark coordinates were geocoded against OpenStreetMap in September 2026. These records are deliberately described as starter corridors because the source is community-maintained and does not provide authoritative turn-by-turn geometry or operating schedules.

## Run and test the backend

With Docker:

```powershell
docker compose up --build db api
```

Directly from Windows after the database is running:

```powershell
cd api
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -e ".[dev]"
alembic upgrade head
uvicorn app.main:app --reload
```

Quality checks:

```powershell
cd api
.venv\Scripts\python -m pytest
.venv\Scripts\python -m ruff check .
```

## Adding a backend operation

1. Define or extend the Pydantic contract in `app/schemas.py`.
2. Put reusable business logic in `app/services/`.
3. Add the HTTP handler to the appropriate router.
4. Register a new router in `app/main.py` only when introducing a new domain.
5. Add contract and service tests.
6. Confirm `app.openapi()` contains the expected paths. The HTTP OpenAPI document is disabled by default; set `API_DOCS_ENABLED=true` only for isolated development checks.
7. Add the public operation to [API_GATEWAY.md](API_GATEWAY.md) and the web API client if the UI uses it.

## Current production gaps

- Authentication, authorization, rate limiting, audit logging, and TLS termination must be supplied before internet exposure.
- The dashboard read model paginates routes and stops independently; it is operational telemetry, not a relational export.
- Pathfinding loads all stops into memory and should be moved toward spatial database queries for large datasets.
- Metrics and distributed tracing are not yet configured.
