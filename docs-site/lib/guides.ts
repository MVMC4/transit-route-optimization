/** Protected production guides shown inside the authenticated Fumadocs reference. */

export type GuideSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  code?: string;
};

export type ProductionGuide = {
  slug: string;
  title: string;
  description: string;
  status: "Implemented" | "Launch requirement" | "Mixed";
  sections: GuideSection[];
};

export const PRODUCTION_GUIDES: ProductionGuide[] = [
  {
    slug: "guides/production-architecture",
    title: "Production architecture",
    description: "The launch topology, trust boundaries, and an honest view of what exists versus what still needs deployment.",
    status: "Mixed",
    sections: [
      { title: "Launch boundary", paragraphs: ["The current Compose stack is a complete development environment, not a highly available production deployment. Production adds a TLS edge, at least two stateless API replicas, a PostgreSQL primary and standby on separate failure domains, a distributed cache/rate limiter, self-hosted identity, and private S3-compatible object storage."], bullets: ["Implemented: independent web surfaces, FastAPI, PostgreSQL/PostGIS, protected docs, API keys, Prometheus, Grafana.", "Launch requirement: high availability, Supabase Auth/Google, private uploads, continuous WAL archive, external restore drills.", "Never describe a documented target as deployed infrastructure."] },
      { title: "Core topology", code: "TLS edge\n  ├─ marketing / rider / protected docs\n  ├─ FastAPI replicas\n  │    ├─ PostgreSQL primary → streaming standby\n  │    ├─ Garage S3 (uploads + separate backup bucket)\n  │    └─ Redis-compatible quota/cache store\n  └─ Prometheus → Grafana → contact points" },
      { title: "Availability targets", bullets: ["Initial availability objective: 99.5% monthly after stable launch.", "Target RPO: under five minutes while WAL archive is healthy.", "Target RTO: under 60 minutes, proven by a timed clean-host restore.", "Record achieved results; do not turn targets into guarantees without evidence."] },
    ],
  },
  {
    slug: "guides/backup-recovery",
    title: "Backup and recovery",
    description: "Daily tar archives, continuous WAL, point-in-time recovery, and the exact order for rebuilding after loss.",
    status: "Launch requirement",
    sections: [
      { title: "Three copies, two recovery paths", paragraphs: ["The primary, hot standby, and encrypted off-host repository are separate durable copies. The standby improves availability but is not a backup because destructive writes replicate. Whole-cluster point-in-time recovery uses pgBackRest plus WAL; the 04:00 tar archive is the portable, table-level fallback."], bullets: ["Continuous: streaming replication and encrypted WAL archive.", "03:00 daily: pgBackRest differential; weekly full.", "04:00 Africa/Johannesburg: verified pg_dump tar archive and SHA-256 checksum.", "Monthly: clean-host point-in-time restore and API smoke test."] },
      { title: "Recovery order", bullets: ["Freeze writers and record the desired recovery time in UTC.", "Provision a clean PostgreSQL host with matching major versions.", "Verify the repository, restore the latest base, and replay WAL to the selected point.", "Validate migrations, accounts, route counts, geometry, and auth configuration in isolation.", "Rebuild a standby before restoring full traffic.", "Record actual RPO, RTO, data loss, and corrective work."] },
      { title: "Example PITR command", code: "sudo -u postgres pgbackrest --stanza=tsela \\\n+  --type=time --target=\"2026-09-19 01:58:00+00\" \\\n+  --target-action=promote restore" },
    ],
  },
  {
    slug: "guides/object-storage",
    title: "Object storage and uploads",
    description: "A private S3-compatible upload flow for route evidence, profile media, exports, and backup objects.",
    status: "Launch requirement",
    sections: [
      { title: "Storage decision", paragraphs: ["Use a three-node Garage cluster, or one self-hosted node plus an encrypted off-site S3-compatible replica when three independent nodes are not affordable. Keep application uploads and database backups in separate buckets with separate credentials."], bullets: ["Buckets remain private.", "PostgreSQL stores metadata and opaque object keys, not binary files or public URLs.", "Object versioning/replication must be tested together with database recovery."] },
      { title: "Signed upload flow", bullets: ["The authenticated client requests an upload intent with purpose, MIME type, size, and checksum.", "FastAPI enforces ownership and quota, then returns a signed PUT URL valid for no more than ten minutes.", "The browser uploads directly; API servers do not relay the bytes.", "A worker checks signature, size, pixel count, EXIF policy, and malware policy before publication.", "Rejected and abandoned objects are removed by lifecycle rules."] },
      { title: "Current safety boundary", paragraphs: ["Upload-intent endpoints are not implemented yet. Images must remain disabled in production until signed upload, verification, quota, cleanup, and restore flows pass tests."] },
    ],
  },
  {
    slug: "guides/authentication",
    title: "Authentication and Google",
    description: "How local hashed-password development access migrates to self-hosted Supabase Auth and verified JWT identity.",
    status: "Mixed",
    sections: [
      { title: "Identity model", paragraphs: ["Development currently uses salted PBKDF2 password hashes and stores only opaque-session digests. Production should use self-hosted Supabase Auth for email/password and Google OAuth while Tsela retains authorization, quotas, API-key ownership, and audit events."], bullets: ["Passwords are hashed, not encrypted.", "Verify JWT issuer, audience, expiry, and signature server-side.", "Map the immutable subject claim to the internal account; do not authorize by email alone.", "Use HttpOnly, Secure, SameSite cookies for the application session."] },
      { title: "Google rollout", bullets: ["Create separate OAuth clients for local, staging, and production.", "Use exact callback URLs and minimum scopes: openid, email, profile.", "Store client secrets outside Git and Compose.", "Test denied consent, expired state, account linking, logout, recovery, and forced sign-in.", "Require MFA and server-side role checks for operators."] },
      { title: "Token lifecycle", bullets: ["Never log JWTs, OAuth codes, cookies, reset tokens, API keys, or provider secrets.", "Rotate signing keys with overlap where supported.", "Keep signing configuration in secret escrow; database recovery alone cannot preserve existing sessions.", "Disable local login and debug recovery output in production after migration."] },
    ],
  },
  {
    slug: "guides/operations",
    title: "Alerts and work management",
    description: "A no-license-fee operations stack using Grafana, Prometheus, and self-hosted OpenProject.",
    status: "Mixed",
    sections: [
      { title: "Tooling", bullets: ["Prometheus collects API, process, and database metrics.", "Grafana provides dashboards, alert rules, notification policies, and contact points.", "The admin dashboard stores sanitized Grafana webhook notifications for platform visibility.", "OpenProject Community Edition is the recommended self-hosted Jira alternative.", "Optional Zulip or Mattermost Community provides self-hosted team chat."] },
      { title: "Notification path", code: "Prometheus rule → Grafana Alertmanager\n  ├─ authenticated Tsela admin webhook\n  ├─ email or self-hosted chat contact point\n  └─ actionable incident linked in OpenProject" },
      { title: "Rules for useful alerts", bullets: ["Every critical alert has an owner, severity, summary, dashboard link, and runbook.", "Do not put credentials or personal data in labels and annotations.", "Route firing and resolved messages; test the real contact point.", "Deduplicate repeated symptoms before creating work items."] },
    ],
  },
  {
    slug: "guides/security-boundaries",
    title: "Security boundaries",
    description: "JSON-only inputs, SSRF defenses, role enforcement, tenant isolation, quotas, and automated CVE checks.",
    status: "Mixed",
    sections: [
      { title: "Enforced in the application", bullets: ["Body-bearing endpoints accept JSON only and reject oversized payloads before endpoint parsing.", "The road router uses HTTPS, an exact host allowlist, public-IP DNS validation, redirect revalidation, timeouts, and a two-megabyte response ceiling.", "API keys are digested, expire, record last use and rotation lineage, and have hourly/monthly hard limits.", "Every admin endpoint verifies an authenticated administrator role; a hidden link is never authorization."] },
      { title: "Identity is not CORS", paragraphs: ["CORS only constrains cooperating browsers. Scripts and raw HTTP clients ignore it. Every tenant-owned query must include the authenticated immutable owner ID, and production OAuth must validate signature, issuer, audience, expiry, and subject."] },
      { title: "Automated security", bullets: ["CodeQL, Trivy, pip-audit, and npm audit run on changes and on a weekly database refresh.", "Dependabot covers Python, npm, Actions, and Docker.", "Paid integrations require server-side credentials, a spend threshold, a hard cap, a circuit breaker, and an alert owner before enablement."] },
    ],
  },
  {
    slug: "guides/runtime-and-tracing",
    title: "Runtime, jobs, and tracing",
    description: "Kubernetes workload boundaries, idempotent CronJobs, request correlation, OpenTelemetry, and Tempo.",
    status: "Mixed",
    sections: [
      { title: "Request path", code: "client X-Request-ID\n  → FastAPI request boundary\n  → OpenTelemetry FastAPI span\n  → SQLAlchemy / HTTPX child spans\n  → Tempo trace\n  → Grafana investigation" },
      { title: "Scheduled work", bullets: ["Expired sessions and reset tokens: hourly at minute 17.", "Usage retention pruning: daily at 03:37 Africa/Gaborone.", "API-key expiry audit: daily at 04:23.", "Jobs forbid overlap and record a unique run ID because CronJobs may execute more than once."] },
      { title: "Deployment boundary", paragraphs: ["Marketing, rider, developer portal, restricted admin, and API are separate Kubernetes workloads. PostgreSQL and object storage stay outside the stateless application base. The manifests are a scaffold until real image digests, domains, secrets, ingress, and a cluster are supplied."], bullets: ["API runs at least two replicas with health probes, resource bounds, HPA, and a disruption budget.", "Pods run as non-root, drop Linux capabilities, and do not mount service-account tokens.", "Blue-green API releases switch the Service selector only after direct green-slot smoke tests."] },
    ],
  },
  {
    slug: "guides/data-and-ux",
    title: "Data and UX standards",
    description: "Entity ownership, stable identity, lifecycle timestamps, loading behavior, offline work, and accessible hierarchy.",
    status: "Mixed",
    sections: [
      { title: "Data discipline", bullets: ["Mutable email or names never act as identity; migrate public contracts to random UUID public IDs without breaking internal relationships.", "New durable records have created and updated timestamps; lifecycle events use explicit expiry, revocation, use, and deletion times.", "Historical records are archived/soft-deleted unless retention or approved erasure requires hard deletion.", "Derived dashboard totals and caches are rebuildable and never compete with the event source of truth."] },
      { title: "Loading standard", bullets: ["Under one second: no loader.", "Known layout: skeleton; short local action: adjacent indicator; measurable work: progress; long work: explanation and retry/cancel/background choice.", "Use optimistic UI only for reversible actions such as bookmarks and drafts. Security and administrative mutations remain server-confirmed."] },
      { title: "Layout and trust", bullets: ["Primary outcomes lead reading order; related controls align and group; secondary detail uses progressive disclosure.", "Touch targets are at least 44×44 CSS pixels and keyboard focus remains visible.", "Consent has equal accept/reject weight; optional analytics remain off by default; no fake reviews, hidden fees, or unsupported claims."] },
    ],
  },
  {
    slug: "guides/launch-checklist",
    title: "Launch checklist",
    description: "The evidence required before Tsela can responsibly be described as production-ready.",
    status: "Launch requirement",
    sections: [
      { title: "Identity and security", bullets: ["Supabase Auth and Google callbacks tested; operator MFA enforced.", "Recovery, session expiry, rotation, revocation, and account deletion tested.", "TLS, CSP, CORS, trusted hosts, secure cookies, and shared rate limits reviewed.", "Dependency, image, logging-redaction, SQL-injection, and XSS checks pass."] },
      { title: "Data and reliability", bullets: ["Primary and standby run in separate failure domains.", "WAL freshness, replication lag, backup age, disk, latency, errors, and certificates alert correctly.", "Latest physical and logical backups restore successfully on a clean host.", "Object versions and metadata can be reconciled.", "At least two stateless API replicas pass graceful rollout and rollback tests."] },
      { title: "Release record", paragraphs: ["Record image digests, migration revision, backup ID, last WAL timestamp, restore-drill date, alert test, smoke-test output, owner, and rollback decision. An unchecked launch requirement is a visible risk, not a hidden assumption."] },
    ],
  },
];

export function findGuide(slug: string[]) {
  return PRODUCTION_GUIDES.find((guide) => guide.slug === slug.join("/"));
}
