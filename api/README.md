# API service

FastAPI is the only application service allowed to read or write PostgreSQL. It owns published routes, spatial queries, trip planning, road-geometry orchestration, accounts, credentials, quotas, and community writes.

## Develop

```bash
pip install -e ".[dev]"
alembic upgrade head
uvicorn app.main:app --reload
pytest
ruff check .
```

Key modules: `app/main.py` composes the service, `app/models.py` owns persistence models, `app/schemas.py` owns request/response validation, `app/routers/` owns HTTP boundaries, and `app/services/` contains domain/infrastructure helpers. Never format user input into SQL. Add schema changes through a new Alembic revision.

`DEMO_ACCOUNT_ENABLED` defaults to `false`. The local Compose profile enables it and seeds a predictable developer account so contributors can inspect the console immediately. Never enable this flag with the sample password in a public or production environment.

See [../docs/BACKEND.md](../docs/BACKEND.md), [../docs/API_GATEWAY.md](../docs/API_GATEWAY.md), and [../SECURITY.md](../SECURITY.md).
