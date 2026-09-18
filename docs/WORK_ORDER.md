# Work order: Tsela product and production foundation

**Status:** Active plan. UI and developer portal changes are implemented in the current feature branch; production identity and observability remain planned work.

**Verified 2026-09-18 (commit pass for this branch):** `admin`, `marketing`, `rider`, and `docs-site` each build clean with `next build`; ESLint is clean except one pre-existing informational warning in `docs-site/postcss.config.mjs` (anonymous default export, not worth restructuring). `api` passes its full pytest suite (18 tests) and is clean under `ruff check`. No functional gaps were found beyond what this document already lists as remaining work. Two items are still open from this pass specifically: the root README has no real screenshot/GIF yet (placeholder comment left in place — capturing one needs the full Compose stack running, which wasn't done in this session), and `.github/PULL_REQUEST_TEMPLATE.md`, `LICENSE` (MIT), and `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1) were added but have not been exercised by a real PR yet.

## Objective

Deliver a Gaborone-first combi discovery product with trustworthy road-following routes, a clear rider journey, a useful contributor community, protected developer access, and an operable API. Keep the marketing site public and welcoming. Put developer registration/sign-in at the developer portal entrance; require a valid account session for the dashboard and every documentation page.

## Completed in this branch

- Split the former monolithic app into marketing, operations, rider, API, database, and developer documentation surfaces.
- Added a scroll-led marketing map sequence and direct entry points for trip planning, services, API access, and the build journal.
- Replaced the developer docs shell with Fumadocs UI and dedicated endpoint pages with search, navigation, examples, and response details.
- Made the developer portal root a public sign-in/registration landing page. Protected `/console` and `/reference/*` with live server-side session verification.
- Put the browser session in an HttpOnly cookie and send browser account calls through the docs server. Revoke the API session on sign-out.
- Disabled FastAPI's public Swagger, ReDoc, and OpenAPI routes by default; the editorial reference is the developer documentation surface.
- Added local API keys, account recovery scaffolding, route contributions, map-based rider and operator surfaces, and starter Gaborone route data.
- Added root architecture, security, contributing, service-area, route-lifecycle, and product notes.

## Remaining work orders

### P0 — identity and launch security

- Configure the production identity provider and Google sign-in after Supabase project, domain, email, and redirect credentials are available. Keep the current account API as a documented migration seam until then.
- Decide whether Supabase issues access tokens directly to FastAPI or whether the developer portal keeps a server session and exchanges it at the API boundary.
- If JWTs are introduced, validate signature against the issuer's rotating JWKS, fixed allowed algorithms, `iss`, `aud`, `exp`, and `nbf`; reject unknown key IDs safely and refresh JWKS with a bounded cache.
- Add production email delivery, verified-email policy, CSRF checks for cookie-authenticated mutations, secure cookies, CSP, HSTS, secret rotation, and password abuse controls.
- Ensure API, admin, and dashboard endpoints have explicit authentication and role boundaries. The public demo account must remain disabled outside local Compose.

### P1 — API lifecycle and observability

- Define API-key lifecycle states and add expiry, last-used timestamp, scopes, owner actions, rotation lineage, and audited revocation.
- Record one usage event per accepted key request with a normalized route template, final HTTP status, latency, and request ID. Preserve quota accounting separately from operational metrics.
- Move hourly invalid-credential and API-key limits to a shared gateway or Redis before running multiple API replicas.
- Add the optional Prometheus/Grafana/OpenTelemetry stack described in [Observability and authentication architecture](OBSERVABILITY_AND_AUTH.md).
- Establish baseline latency/error/service-availability SLIs before setting production SLO targets. Add alerts only when an owner and response action are defined.

### P1 — route trust and rider completion

- Validate every published route against field evidence and local rider/operator review. Treat router-generated geometry as a candidate corridor, never as proof of operation.
- Keep origin/destination selection place-first with GPS opt-in, visible route comparison, selected-route focus, ordered stops, and clear walking/transfer steps.
- Add permission-aware live location, off-route detection, an advance alighting reminder, and a stop-now action. Test denied permissions, poor GPS, backgrounding, and reduced motion.
- Enforce the approved Gaborone service-area boundary on both client and server for proposed stops and route geometry.
- Add route response caching with data-version invalidation; measure hit ratio and stale-data behavior before increasing cache lifetime.

### P1 — community and operations

- Keep community entry account-gated with separate route-submission and route-search/tips/discussion views.
- Add a moderation queue, reports, audit trail, and review status before community route changes become public.
- Add operator validation for route shape, stop order, duplicates, corridor bounds, and optimized paths before publishing.

### P2 — maintainability and release readiness

- Keep README and architecture notes at each app boundary; add top-of-file purpose comments to new modules and enforce the header check.
- Add accessibility, responsive, performance, API contract, auth-gating, migration, and security checks to CI.
- Document deployment, backup/restore, incident response, retention, rollback, and data-subject deletion before public launch.

## Acceptance criteria

- An unauthenticated visitor can reach only the developer portal landing, sign-in/registration, and recovery flow on port 3003. Direct requests for documentation and dashboard routes redirect to that landing while preserving the requested same-origin path.
- Expired or revoked sessions lose access on the next protected request; signing out revokes the server session and clears the HttpOnly cookie.
- No developer session token is persisted in browser local storage. API keys are never shown again after initial creation and never appear in query strings or logs.
- All published route lines follow verified road geometry or are explicitly marked as an unverified fallback.
- API limits, dashboards, and alerts use bounded dimensions and do not expose passwords, tokens, precise rider locations, or unbounded per-user metric labels.
- Contributors can run each app, tests, migrations, and optional observability services from documented instructions.
