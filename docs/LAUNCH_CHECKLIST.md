# Launch checklist

No production launch should be approved until every required item is complete or explicitly accepted as a dated risk by the project owner.

## Identity and access

- [ ] Self-hosted Supabase Auth is pinned, configured, backed up, and monitored.
- [ ] Google OAuth uses exact production callback URLs and minimum scopes.
- [ ] Recovery email works without account enumeration.
- [ ] Operator/admin MFA and role checks are enforced server-side.
- [ ] Local debug recovery output is disabled.
- [ ] JWT, session, infrastructure-secret, and API-key rotation have been tested.
- [ ] Docs/reference and console reject missing, expired, and forged sessions.

## Data and storage

- [ ] PostgreSQL primary and standby run on separate failure domains.
- [ ] Continuous WAL archiving is healthy and alerts before the RPO is missed.
- [ ] Weekly full, daily differential, and 04:00 logical tar jobs are active.
- [ ] Backups are encrypted, checksummed, retained, and copied off-host.
- [ ] A clean-host point-in-time restore meets the recorded RPO/RTO.
- [ ] S3-compatible upload and backup buckets use distinct credentials.
- [ ] Uploads use private signed URLs, content validation, quotas, and cleanup.
- [ ] Object version recovery and metadata reconciliation have been tested.

## Application security

- [ ] TLS, HSTS, secure cookies, CSP, CORS, trusted hosts, and proxy headers are reviewed.
- [ ] Rate limits are shared across API replicas rather than process-local.
- [ ] SQL remains parameterized; migrations run through a restricted role.
- [ ] User content renders as text; no unsafe HTML injection path exists.
- [ ] Dependencies and container images pass vulnerability and license review.
- [ ] Audit events exist for login, role changes, key create/rotate/revoke, exports, and deletes.
- [ ] Logs redact cookies, tokens, API keys, OAuth codes, passwords, and personal payloads.

## Reliability and operations

- [ ] At least two stateless API replicas pass readiness and graceful-shutdown tests.
- [ ] Prometheus targets, Grafana dashboards, alert rules, and contact points are green.
- [ ] API latency/error, database saturation, replication, WAL, backups, disk, and certificate expiry are alerted.
- [ ] Critical alerts include a runbook and have fired successfully through the real contact point.
- [ ] OpenProject or the chosen incident tracker is backed up separately.
- [ ] On-call ownership, maintenance windows, rollback, and incident communication are written down.
- [ ] Resource and cost measurements replace estimates in the capacity document.

## Product and privacy

- [ ] Route, stop, fare, and service data have provenance and freshness labels.
- [ ] Community moderation/reporting and account deletion flows work.
- [ ] Privacy notice, terms, retention periods, and consent for location/media are reviewed.
- [ ] Accessibility, keyboard, responsive, slow-network, and low-end-device checks pass.
- [ ] Analytics avoid storing exact rider journeys unless clearly necessary and consented.
- [ ] Support and status channels are visible to users.

## Release evidence

Record the release image digests, migration revision, smoke-test output, backup ID, last WAL timestamp, restore-drill date, alert test, owner, and rollback decision in one signed-off launch record.
