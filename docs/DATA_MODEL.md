# Data model and lifecycle

This catalog is the source of truth for what Tsela persists and why. Schema changes start here, then receive an Alembic migration, query/index review, API contract update, and restore test.

## Entities and relationships

| Entity | Durable facts | Relationships | High-traffic lookup |
| --- | --- | --- | --- |
| DeveloperAccount | immutable identity, email, display name, password digest, role | owns sessions, API keys, posts, contributions | email, role |
| DeveloperSession | token digest, expiry | belongs to one account | token digest, expiry |
| ApiKey | secret digest, prefix, quota, expiry, last use, rotation parent, revocation | belongs to one account; owns usage events | prefix+digest, account, expiry |
| ApiUsage | normalized path, method, status, occurrence time | belongs to one API key | key+time, time |
| Route | name, description, publication lifecycle | owns ordered nodes | name, creation/publication state |
| Node | stable stop identity, label, coordinates, order | belongs to one route | route+order, spatial geometry |
| RouteContribution | proposed waypoints/geometry, review state | belongs to an account when known | account, status+time |
| CommunityPost | kind, title, plain-text body, moderation state | belongs to account; optionally route | route+time, state+time |
| PasswordResetToken | token digest, expiry, use time | belongs to one account | digest, account+expiry |
| GrafanaNotification | fingerprint, state, severity, safe message | derives from alert delivery | state+time, fingerprint |
| MaintenanceRun | job name, unique run ID, result, safe detail | independent audit record | run ID, job+time |

## Identity policy

Existing database integers remain internal primary keys until a compatibility migration is complete. Public contracts must move to random UUID `publicId` values without changing existing IDs in place. Email, names, slugs, and labels are mutable attributes and are never authorization identifiers. JWT authorization maps the provider's immutable subject to the internal account.

## Time and deletion policy

Every new durable business entity receives `createdAt` and `updatedAt`. Security lifecycle records also use explicit event times such as `expiresAt`, `revokedAt`, `usedAt`, and `lastUsedAt`. Append-only usage and audit events are not edited.

Records referenced by history are soft-deleted with `deletedAt` or moved through a lifecycle state. Hard deletion is reserved for expired ephemeral tokens, retention enforcement, legally approved erasure, and unreferenced objects. A deletion job must preserve referential integrity and record its run. Route publication uses states rather than deleting evidence.

## Single source of truth

Do not persist derived balances or duplicate current usage. API usage is derived from immutable usage events; dashboard totals are projections that can be rebuilt. Route geometry may be cached, but its source route/data version is stored and invalidates the cache. Grafana is the metric source; the admin UI is a view, not a second monitoring database.

## Staged correction plan

1. Add UUID public IDs and `updatedAt` without changing current integer relationships.
2. Backfill and make them non-null; expose UUIDs alongside legacy IDs.
3. Move clients and caches to UUIDs, then stop exposing integers.
4. Add lifecycle fields to routes, stops, posts, and contributions; change destructive UI actions to archive/restore.
5. Add database constraints and partial indexes for active records.
6. Remove legacy public IDs only after telemetry shows no callers and a rollback window has elapsed.

