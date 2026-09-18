"""Create the TransitOS geospatial schema.

Revision ID: 0001
Revises:
"""

from alembic import op

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS postgis")
    op.execute("CREATE EXTENSION IF NOT EXISTS pgrouting")
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "Route" (
            id SERIAL PRIMARY KEY,
            name VARCHAR(120) NOT NULL,
            description TEXT,
            "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "Node" (
            id SERIAL PRIMARY KEY,
            "routeId" INTEGER NOT NULL REFERENCES "Route"(id) ON DELETE CASCADE,
            label VARCHAR(160) NOT NULL,
            name VARCHAR(160) NOT NULL,
            lat DOUBLE PRECISION NOT NULL,
            long DOUBLE PRECISION NOT NULL,
            "orderNum" INTEGER NOT NULL CHECK ("orderNum" > 0),
            geom geometry(Point, 4326)
        )
        """
    )
    op.execute(
        """
        UPDATE "Node"
        SET geom = ST_SetSRID(ST_MakePoint(long, lat), 4326)
        WHERE geom IS NULL
        """
    )
    op.execute('ALTER TABLE "Node" DROP CONSTRAINT IF EXISTS "Node_routeId_fkey"')
    op.execute(
        """
        ALTER TABLE "Node"
        ADD CONSTRAINT "Node_routeId_fkey"
        FOREIGN KEY ("routeId") REFERENCES "Route"(id)
        ON DELETE CASCADE
        """
    )
    op.execute('CREATE INDEX IF NOT EXISTS ix_node_route_order ON "Node" ("routeId", "orderNum")')
    op.execute('CREATE INDEX IF NOT EXISTS ix_node_geom_gist ON "Node" USING GIST (geom)')


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS ix_node_geom_gist")
    op.execute("DROP INDEX IF EXISTS ix_node_route_order")
