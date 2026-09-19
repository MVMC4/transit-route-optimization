# Current work orders and continuation handoff

- **Snapshot date:** 2026-09-19
- **Implementation branch:** `feat/developer-portal-repair`
- **Merge policy:** make reviewable commits on the feature branch, then squash-merge one tested change into `main`. Never add co-author trailers.

**Product state:** strong local foundation; not approved for production.

This is the source of truth for what is finished, what is still active, what is blocked by external decisions, and where to stop safely. The deeper design documents explain each subsystem; this file records execution state.

## Current validation baseline

- API: Ruff clean; all 26 tests pass, including the production-secret regression test.
- Developer portal: ESLint and the Next.js production build pass. Protected pages are generated through Fumadocs.
- Admin: ESLint and the Next.js production build pass.
- Marketing and rider: ESLint, production builds, and high-severity npm audits pass.
- Legacy web client: ESLint and the Next.js production build pass; npm audit reports zero known vulnerabilities.
- Compose and the provisioned Grafana dashboard JSON validate.
- Trivy 0.70.0 reports zero high/critical vulnerabilities, secrets, or misconfigurations in the tracked repository snapshot.
- The README gallery is regenerated from 28 live marketing, rider, and operations routes. Documentation captures remain deliberately excluded pending WO-15.
- Twenty-two stale Dependabot pull requests were closed and their remote branches deleted on 2026-09-19.

## Work-order register

| ID | Priority | State | Work order | Done when |
| --- | --- | --- | --- | --- |
| WO-01 | P0 | Repair slice complete; redesign moved to WO-15 | Repair the developer portal and documentation information architecture | One professional Fumadocs theme; public access landing only; `/reference/*` and `/console` require a live session; overview stays inside docs; public reference contains only credentialed `/v1` endpoints |
| WO-02 | P0 | Complete locally | Restore the operations dashboard hierarchy | Durable desktop sidebar, compact mobile rail, real home metrics, account and route views, and Grafana notification triage all build and work with the admin boundary |
| WO-03 | P0 | Complete locally | Make local observability usable | Grafana is provisioned with the Tsela home dashboard, Prometheus and Tempo links are correct, local credentials are documented, alerts reach the admin notification feed, and all services are healthy |
| WO-04 | P0 | Complete for current repository scope | Close runtime and container security findings | Non-root images, read-only Kubernetes filesystems, resource limits, restricted public API ingress, keyed token digests, production secret validation, and high/critical filesystem scan are clean |
| WO-05 | P1 | Complete | Clear dependency automation clutter | Old bot PRs and branches removed; monthly grouped updates; one open update per package area; `web` included in coverage |
| WO-06 | P0 | Blocked by credentials/owner decisions | Replace local identity with production Supabase Auth plus Google | Supabase project, domain, SMTP, OAuth consent screen and callbacks exist; JWT issuer/audience/JWKS validation, account mapping, MFA for operators, recovery and revocation are tested |
| WO-07 | P0 | Planned | Provision recoverable production data | PostgreSQL primary/standby, continuous WAL archive, 04:00 logical archive, encrypted off-host copy, tested clean-host PITR, S3-compatible private uploads, retention and deletion jobs |
| WO-08 | P1 | Planned | Complete the public API request lifecycle | Shared limits, scopes, idempotency where required, final status/latency/correlation accounting, audit export, version policy, cost measurements, and bounded telemetry dimensions |
| WO-09 | P1 | Planned | Establish route and navigation trust | Field-verified road geometry, data provenance/freshness, place-first planning, route comparison/focus, GPS consent, off-route handling, alighting warnings, caching and service-area enforcement |
| WO-10 | P1 | Planned | Complete community moderation | Auth-gated add-route and route-discussion tabs, reports, moderation queue, immutable audit trail, duplicate/shape/stop validation, and publish approval |
| WO-11 | P1 | Planned | Finish product-quality UX | Apple HIG-informed hierarchy review, WCAG contrast/keyboard checks, skeleton/optimistic/progress states, offline queue where safe, reduced motion, slow-network and low-end-device testing |
| WO-12 | P0 before launch | Planned | Build the production release system | Pinned images, migrations, secrets, TLS, blue/green rollout, rollback evidence, alert drill, backup restore drill, signed launch record, capacity and cost baseline |
| WO-13 | P1 | Planned | Complete privacy and compliance operations | Reviewed privacy/terms/cookies/refund position, consent records, data export/deletion, email unsubscribe, licensed assets/fonts, third-party SDK inventory, retention enforcement |
| WO-14 | P2 | Ongoing | Contributor and architecture documentation | Keep app READMEs, diagrams, decisions, work orders, screenshots, API examples, recovery procedures and contributor instructions synchronized with behavior |
| WO-15 | P1 | Planned | Split the internal handbook from the public API documentation and reskin Fumadocs | Engineering/operations material has a separately authorized home; the developer reference contains one complete page per supported endpoint; a restrained Tsela skin matches the rider system without hiding standard documentation navigation, search, code, or hierarchy |

## WO-15 — documentation boundary and reference redesign

### Goal

Turn the current mixed documentation collection into two clearly owned products:

1. **Developer API guide:** an authenticated Fumadocs site for external developers. It contains only supported public contracts, onboarding, credentials, quotas, errors, SDK/cURL examples, changelog, and migration guidance.
2. **Internal handbook:** an operator/maintainer-only home for deployment, backups, incident response, observability, data governance, architecture decisions, security controls, launch gates, and work orders. Repository Markdown may remain the source, but the rendered internal surface must enforce an operator role and must never rely on an unlisted URL as protection.

### Endpoint-page contract

Every supported public endpoint gets its own durable URL and page. Each page must include:

- method, path, plain-language purpose, stability/version status, required role or API-key scope, quota cost, and idempotency behavior;
- path, query, header, and body fields with type, required/optional state, constraints, defaults, and safe examples;
- copyable cURL plus at least one maintained JavaScript or TypeScript request example using server-side credentials;
- success schema and realistic response, all documented error statuses, retry guidance, and correlation/request-ID behavior;
- pagination, caching, timeout, rate-limit headers, and data-freshness notes where applicable;
- an authenticated demo that uses a dedicated low-privilege sandbox key, redacts secrets, blocks destructive calls, and never exposes unrestricted internal endpoints;
- a contract or snapshot test proving that the page has not drifted from the implemented `/v1` route.

The initial catalog is small—`GET /v1/routes` and `GET /v1/routes/{routeId}/geometry`—but the page template and validation must scale without returning to one long reference page.

### Visual direction

Keep Fumadocs as the recognizable documentation foundation. Preserve its desktop sidebar, mobile drawer, search, table of contents, breadcrumbs, code blocks, copy controls, keyboard behavior, and light/dark theme mechanics. Apply Tsela through design tokens and restrained components: warm off-white surfaces, black structure, cobalt actions, lime status accents, occasional pink labels, rounded corners, crisp borders, and the rider type hierarchy.

Do not turn the guide into a marketing microsite. Avoid scroll choreography, novelty cursors, excessive motion, Anime.js-style spectacle, giant display type inside reference pages, and decorative elements that compete with code or navigation. Motion is limited to short state transitions and must respect reduced-motion settings.

### Acceptance tests

- External developer accounts cannot open the internal handbook; administrators can, and the API rechecks authorization server-side.
- Internal subjects no longer appear in the public API navigation or search index.
- Every published `/v1` endpoint has exactly one canonical page satisfying the endpoint-page contract.
- Undocumented public routes and documented-but-missing routes fail CI.
- Light and dark themes meet WCAG AA contrast; sidebar, search, table of contents, deep links, keyboard navigation, mobile drawer, and code-copy controls pass interaction tests.
- Screenshots stay excluded from the root README until design review approves both themes and the content split; the gallery capture may then be run with `INCLUDE_DOCS=true`.

## Active repair scope in `feat/developer-portal-repair`

The current branch is intentionally limited to a coherent repair slice:

1. **Developer portal:** replace accumulated custom shells with the Fumadocs layout; keep sign-up/sign-in public and make documentation plus console protected; remove internal preview endpoints from the public reference; add search, pagination and limits to the documented route listing.
2. **API boundary:** publish only `/v1` through the production ingress; keep internal `/api` routes out of the public contract; hash session and API-key tokens with HMAC-SHA256 using a deployment secret; reject the local secret in production; explicitly disable secure cookies only for localhost Compose so the production-mode Next.js server remains usable over local HTTP.
3. **Admin and observability:** restore the sidebar, expose local Grafana access guidance, provision a useful home dashboard and repair Tempo service-map linkage.
4. **Runtime hardening:** non-root containers, health checks, Kubernetes security contexts, read-only root filesystems and resource limits.
5. **Dependency hygiene:** upgrade the vulnerable legacy MapLibre package and replace Dependabot PR-per-package noise with grouped monthly updates.

Do not expand this branch into Supabase integration, production database provisioning, new rider features, or Kubernetes installation. Those are separate work orders with different credentials and failure modes.

## Adequate rest point

The project is safe to pause when all of the following are true:

- [ ] The final API test count passes, Ruff is clean, and docs/admin/web lint and production builds pass.
- [ ] `docker compose` reports API, database, docs, admin, Grafana, Prometheus and Tempo running or healthy.
- [ ] A clean unauthenticated request to `/reference` and `/console` redirects to `/?next=…#access`.
- [ ] An authenticated local demo session opens the overview, endpoint reference and console without changing UI shells.
- [ ] Grafana opens at `http://localhost:3004`, uses the provisioned Tsela dashboard, and accepts the documented local credentials.
- [ ] The high/critical repository security scan passes or any remaining finding is recorded here with owner and reason.
- [ ] Changes are committed in logical slices on `feat/developer-portal-repair`, pushed, then squash-merged to `main` as one tested integration commit.
- [ ] `main` is pushed, the working tree is clean, and no Dependabot PR or remote bot branch remains open.

At that point, stop all optional local services if machine resources matter:

```bash
docker compose --profile observability stop grafana prometheus tempo postgres-exporter
```

This preserves volumes. Do not use `down -v`; that would remove local data.

## Resume procedure

1. Pull `main` and confirm the working tree is clean.
2. Read this file, [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md), and the design document for the selected work order.
3. Choose exactly one work-order ID and create a conventionally named branch such as `feat/supabase-auth-boundary` or `feat/database-recovery-runtime`.
4. Start only required services with `docker compose up -d` and add the `--profile observability` profile only when working on telemetry.
5. Reproduce the last acceptance test before changing code.
6. Implement and verify in small commits, update this register and the relevant runbook, then squash-merge to `main`.

## Recommended next phase

Start with **WO-06: production identity** only after the owner supplies the Supabase project URL, public key/JWKS issuer, Google OAuth client, approved callback domains, SMTP choice, and operator MFA policy. If those inputs are not ready, choose **WO-09: route trust** because it can progress independently through field-data provenance, geometry review and rider navigation tests.

Do not begin Kubernetes orchestration or multi-replica scaling before WO-06 and WO-07 establish the identity and durable-data boundaries. More containers do not make an undefined security or recovery model production-ready.

## Launch gate

The application is launchable only when every P0 item above and every required line in [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) is complete or accepted as a dated risk by the owner. Local Compose credentials, self-signed assumptions, example backup configurations and untested cloud manifests are not production evidence.
