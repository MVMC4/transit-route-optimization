# Security architecture and abuse-cost controls

## Enforced now

- JSON-only body boundary: XML, form, and other unexpected media types are rejected with `415`; request bodies over the configured ceiling receive `413`.
- Server-side outbound routing uses HTTPS, an exact host allowlist, DNS/IP checks against private, loopback, link-local, and reserved networks, redirect revalidation, timeouts, and a response-size ceiling.
- API keys are stored as digests, expire after 90 days by default, record rotation lineage and last use, and are checked before quota queries.
- Hourly and monthly hard limits run before public endpoint work. They are local-database controls; a shared gateway/Redis limiter remains mandatory before horizontal scale.
- Administrator endpoints require an authenticated account with the `admin` role. Hiding navigation is not an authorization control.
- Request IDs are validated/generated, returned to callers, and written to structured access logs without bodies, tokens, raw query strings, or location trails.
- Local databases and dashboards bind to loopback; Grafana anonymous access is disabled.

## SSRF rules

Any new URL-fetch feature must use the shared outbound client. User-controlled arbitrary URLs are denied. A product owner must add the exact required host, protocol, port, maximum bytes, timeout, content type, and redirect policy. Cloud metadata addresses and internal service discovery names are never permitted. Kubernetes egress policy provides a second boundary; production should use a dedicated egress proxy when the allowlist grows.

## Identity and tenant isolation

CORS is a browser policy, not API authentication. Every object query must include the authenticated owner or tenant predicate. Operator/admin permissions are server-side role checks. Password-reset tokens expire in 30 minutes and are one-use. Production OAuth must validate signature, fixed algorithms, issuer, audience, expiry, nonce/state, and immutable subject; authorization never uses email alone.

## Cost containment

Paid integrations remain disabled until they have a per-request timeout, retry budget, circuit breaker, hourly spend threshold, hard monthly cap, and alert owner. Browser bundles never receive privileged API keys. AI execution is default-deny: allowlisted tools, sandboxed credentials, minimal scopes, bounded tokens/cost, human approval for consequential actions, and immutable audit events.

## Automated checks

CI runs tests and linting. The security workflow runs CodeQL, Trivy vulnerability/secret/misconfiguration scanning, Python dependency auditing, and npm audits on pull requests, `main`, and a weekly refresh. Dependabot opens bounded updates for Python, npm, Actions, and Docker. Findings are triaged; a green scanner is evidence, not a guarantee.

