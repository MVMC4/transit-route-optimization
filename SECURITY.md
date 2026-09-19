# Security

## Supported state

This repository is a development preview, not a certified navigation or identity product. Report vulnerabilities privately to the repository owner rather than opening a public issue with exploit details.

## Defenses already present

- SQLAlchemy parameter binding for application queries; no user input is interpolated into raw SQL.
- Pydantic length/range validation and plain-text normalization for community content.
- React's escaped text rendering; community content is never injected as HTML.
- PBKDF2-SHA256 password hashing with per-password salts.
- Opaque session, API-key, and reset tokens stored only as SHA-256 digests.
- Generic password-recovery responses to reduce account enumeration.
- Existing sessions invalidated after a successful password reset.
- Indexed API-key prefix and digest lookup, 100-request rolling-hour limit, monthly quota, and repeated-invalid-key gate.
- `nosniff`, frame denial, referrer, and browser feature-policy headers.
- JSON-only request bodies with an explicit body-size ceiling; XML and form payloads are rejected.
- SSRF-safe external routing with an exact HTTPS host allowlist, DNS/IP validation, redirect checks, timeouts, and response-size limits.
- Expiring API credentials with last-use tracking and rotation lineage.
- Administrator role checks on every operations endpoint.
- Request correlation plus opt-in OpenTelemetry spans to Tempo.
- CodeQL, Trivy, dependency audits, and Dependabot configuration.

## Required before public launch

- Move rider and developer identity to the selected managed provider and validate JWT issuer, audience, expiry, and signing keys in FastAPI.
- Configure HTTPS, HSTS, a nonce-based Content Security Policy, secret rotation, custom SMTP, email verification, and breached-password protection.
- Put rate limits in a shared edge gateway or Redis, not process memory.
- Validate `Origin` and add CSRF protection for cookie-authenticated mutations before public launch; developer portal sessions currently use an HttpOnly, SameSite=Lax cookie.
- Add community reporting, moderation, audit events, and abuse throttles.
- Run dependency, container, SAST, DAST, and migration rollback checks in CI.
- Complete a privacy review for location, analytics, retention, and deletion.

## Injection notes

Route/post search uses bound SQLAlchemy parameters and escapes wildcard characters for literal `ILIKE` behavior. React escapes stored tip text by default. Contributors must not introduce raw SQL formatting, unsafe URL navigation, or `dangerouslySetInnerHTML` without a documented sanitizer and security review.
