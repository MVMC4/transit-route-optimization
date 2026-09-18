"""Add recovery, community discussion, and hourly API limits.

Revision ID: 0003
Revises: 0002
"""

from alembic import op

revision = "0003"
down_revision = "0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        'ALTER TABLE "ApiKey" ADD COLUMN IF NOT EXISTS "hourlyLimit" INTEGER NOT NULL DEFAULT 100'
    )
    op.execute(
        """ALTER TABLE "RouteContribution"
        ADD COLUMN IF NOT EXISTS "accountId" INTEGER
        REFERENCES "DeveloperAccount"(id) ON DELETE SET NULL"""
    )
    op.execute(
        """CREATE INDEX IF NOT EXISTS ix_route_contribution_account
        ON "RouteContribution" ("accountId")"""
    )
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "PasswordResetToken" (
            id SERIAL PRIMARY KEY,
            "accountId" INTEGER NOT NULL REFERENCES "DeveloperAccount"(id) ON DELETE CASCADE,
            "tokenHash" VARCHAR(64) NOT NULL UNIQUE,
            "expiresAt" TIMESTAMPTZ NOT NULL,
            "usedAt" TIMESTAMPTZ,
            "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    op.execute(
        """CREATE INDEX IF NOT EXISTS ix_password_reset_account_time
        ON "PasswordResetToken" ("accountId", "expiresAt")"""
    )
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS "CommunityPost" (
            id SERIAL PRIMARY KEY,
            "accountId" INTEGER NOT NULL REFERENCES "DeveloperAccount"(id) ON DELETE CASCADE,
            "routeId" INTEGER REFERENCES "Route"(id) ON DELETE SET NULL,
            kind VARCHAR(20) NOT NULL DEFAULT 'tip',
            title VARCHAR(120) NOT NULL,
            body TEXT NOT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'published',
            "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    op.execute(
        """CREATE INDEX IF NOT EXISTS ix_community_post_route_time
        ON "CommunityPost" ("routeId", "createdAt")"""
    )
    op.execute(
        """CREATE INDEX IF NOT EXISTS ix_community_post_status_time
        ON "CommunityPost" (status, "createdAt")"""
    )


def downgrade() -> None:
    op.execute('DROP TABLE IF EXISTS "CommunityPost"')
    op.execute('DROP TABLE IF EXISTS "PasswordResetToken"')
    op.execute('DROP INDEX IF EXISTS ix_route_contribution_account')
    op.execute('ALTER TABLE "RouteContribution" DROP COLUMN IF EXISTS "accountId"')
    op.execute('ALTER TABLE "ApiKey" DROP COLUMN IF EXISTS "hourlyLimit"')
