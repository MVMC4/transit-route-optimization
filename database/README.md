# Database image

This directory builds the PostgreSQL image with PostGIS and pgRouting extensions. Alembic in the API service owns application tables and indexes; do not maintain a second hand-written schema here.

Spatial points use WGS84 / SRID 4326. Coordinate order differs by context: database point construction and GeoJSON use longitude then latitude, while user-facing API objects use named `lat` and `long` fields.

See [../docs/BACKEND.md](../docs/BACKEND.md) and [../ARCHITECTURE.md](../ARCHITECTURE.md).
