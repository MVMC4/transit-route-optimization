# Production architecture

This document defines the intended launch topology for Tsela. It deliberately separates what the repository runs today from infrastructure that must be provisioned and proven before launch.

## Readiness status

| Capability | Repository today | Production gate |
| --- | --- | --- |
| Web surfaces | Five independently deployable services | CDN/TLS, immutable images, health checks, two API replicas |
| API access | Hashed API keys, hourly/monthly quotas, one-time secret display | Rotate signing secrets, distributed rate-limit store, audit export |
| Developer identity | Local accounts and server-verified sessions | Self-hosted Supabase Auth, Google OAuth, MFA for operators |
| Database | PostgreSQL/PostGIS with Alembic migrations | Primary + streaming standby + encrypted pgBackRest repository |
| File uploads | No production upload endpoint yet | Private S3-compatible bucket, signed URLs, type/size scanning |
| Metrics | Prometheus, PostgreSQL Exporter, Grafana dashboards/alerts | Durable metrics volume, external probes, tested contact points |
| Work management | Repository issues only | Self-hosted OpenProject Community Edition |
| Backups | Procedure and examples in this repository | Provision, run restore drill, record achieved RPO/RTO |

Anything in the last column is a launch requirement, not a claim about the local Compose stack.

## Recommended self-hosted topology

```text
Internet
   |
TLS reverse proxy / WAF
   |
   +-- marketing, rider, docs (2 stateless replicas where needed)
   +-- FastAPI (2+ stateless replicas)
           |
           +-- PostgreSQL primary ---- streaming ---- PostgreSQL standby
           |          |
           |          +-- continuous encrypted WAL archive
           |
           +-- Garage S3 cluster (private uploads and backup repository)
           +-- Redis-compatible cache/rate-limit store
           +-- Supabase Auth / GoTrue (Google + password identity)

Operations network
   +-- Prometheus --> Grafana --> webhook/email/chat contact points
   +-- OpenProject Community Edition
   +-- backup verifier and restore-drill host
```

Run the database primary, standby, and object-storage quorum on separate failure domains. A standby is not a backup: operator mistakes and destructive SQL can replicate immediately. The third durable copy is an encrypted, versioned backup repository with an off-host copy.

## Request and data flows

### Rider and community requests

1. The browser calls FastAPI through the TLS proxy.
2. FastAPI validates the session or API key before parsing protected work.
3. SQLAlchemy sends parameterized statements to PostgreSQL; HTML is never stored as executable markup.
4. Route geometry is read from PostGIS or computed by the routing adapter and cached for bounded periods.
5. Prometheus records latency, status, route, and resource metrics without recording credentials or personal payloads.

### Image upload

1. An authenticated client asks FastAPI for an upload intent.
2. FastAPI validates ownership, content type, byte limit, and object prefix, then creates a short-lived signed PUT URL.
3. The browser uploads directly to the private S3-compatible bucket; API servers do not relay the file body.
4. A worker verifies size, MIME signature, malware policy, and image dimensions before marking the object usable.
5. PostgreSQL stores metadata and the opaque object key, never a public bucket URL.

See [Object storage and uploads](OBJECT_STORAGE.md). Until that flow exists, production uploads must remain disabled.

### Developer authentication

The public developer landing page is available without an account. The Fumadocs reference and API console are protected by server-side session verification. Production identity moves to self-hosted Supabase Auth; the application verifies its JWT and maps the immutable `sub` claim to an internal account. See [Production authentication](PRODUCTION_AUTH.md).

## Availability targets

Initial targets must be measured during drills rather than advertised as guarantees:

- Web/API availability objective: 99.5% monthly after the first stable launch.
- Database recovery point objective (RPO): under five minutes when WAL archiving is healthy.
- Database recovery time objective (RTO): under 60 minutes for a documented operator-led restore.
- Object recovery: versioned objects retained for 30 days; deleted objects recoverable within the same RTO.
- Alert acknowledgement: 15 minutes for critical production alerts during staffed hours.

If a restore drill misses a target, record the achieved number and fix the runbook before changing the target.

## Secrets and encryption

- Terminate only modern TLS at the public edge and use encrypted links to databases on untrusted networks.
- Put database passwords, OAuth client secrets, JWT signing keys, SMTP credentials, S3 keys, and pgBackRest cipher material in a host secret store—not Compose files or Git.
- Use separate credentials and buckets for application uploads and database backups.
- Encrypt the pgBackRest repository client-side. Enable object-store server-side encryption as defense in depth.
- Rotate API keys from the developer console. Rotate infrastructure secrets with overlapping versions and an audited runbook.
- Back up signing configuration securely; restoring the database without the matching auth configuration will invalidate sessions.

## Production change path

1. Merge tested code and build immutable, versioned container images.
2. Apply database migrations once from a dedicated migration job.
3. Deploy stateless services using readiness checks and rolling replacement.
4. Run smoke tests through the public TLS endpoint.
5. Check Prometheus targets, Grafana alerts, WAL archive freshness, replication lag, and latest backup verification.
6. Roll back the image if application checks fail. Never reverse a destructive migration without an explicit data recovery plan.

The full gate is in [Launch checklist](LAUNCH_CHECKLIST.md).
