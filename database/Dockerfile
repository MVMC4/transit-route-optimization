FROM postgis/postgis:15-3.4

RUN apt-get update \
    && apt-get install -y --no-install-recommends postgresql-15-pgrouting \
    && rm -rf /var/lib/apt/lists/*

USER postgres

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"
