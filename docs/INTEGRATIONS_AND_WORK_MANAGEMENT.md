# Integrations and work management

## Free/self-hosted baseline

| Need | Choice | Why |
| --- | --- | --- |
| Metrics and dashboards | Prometheus + Grafana OSS | Already provisioned in this repository |
| Operational alert routing | Grafana Alerting | Routes alerts to email, Slack-compatible endpoints, or webhooks |
| Project/issue management | OpenProject Community Edition | Open-source, self-hosted Jira alternative |
| Team chat (optional) | Zulip or Mattermost Community | Self-hosted destination for webhook/email notifications |
| Source work | Git forge issues/PRs | Close to code; link releases to OpenProject work packages |

OpenProject states that its Community Edition is free and self-hosted. For production, use its Compose deployment with pinned versions, TLS, backups, and its own PostgreSQL lifecycle rather than the all-in-one development shortcut. Review the [official installation documentation](https://www.openproject.org/docs/installation-and-operations/) and [Docker Compose guide](https://www.openproject.org/docs/installation-and-operations/installation/docker-compose/).

OpenProject is operational infrastructure, not part of the rider request path. Give it its own database, backup policy, and resource limits. Do not share Tsela's application database.

## Grafana notification flow

```text
Prometheus rule fires
  -> Grafana Alertmanager groups and labels the alert
  -> notification policy chooses a contact point
  -> (a) Tsela admin webhook stores a sanitized notification
     (b) email or self-hosted chat receives the operator message
     (c) critical incident creates/links an OpenProject work package manually or through a reviewed bridge
```

Grafana contact points support email, Slack, and generic webhooks; notification policies decide routing. Provision non-secret parts from versioned YAML and inject credentials at deploy time. See Grafana's [contact-point documentation](https://grafana.com/docs/grafana/latest/alerting/configure-notifications/manage-contact-points/) and [file provisioning guide](https://grafana.com/docs/grafana/latest/alerting/set-up/provision-alerting-resources/file-provisioning/).

The repository already accepts sanitized Grafana webhook events for the admin notification view. Before exposing that endpoint publicly:

- put it behind TLS and an unguessable path or, preferably, an authenticated gateway;
- configure bearer authentication/signature validation;
- limit request size and rate;
- retain only required labels/annotations;
- reject links outside allow-listed Grafana origins; and
- test both firing and resolved notifications.

Grafana warns against putting webhook secrets in the URL; use its authorization fields instead. See the [webhook notifier guide](https://grafana.com/docs/grafana-cloud/observe-and-act/alert-and-measure-reliability/alerting/configure-notifications/manage-contact-points/integrations/webhook-notifier/).

## Severity policy

| Severity | Examples | Route | Expected response |
| --- | --- | --- | --- |
| Critical | API unavailable, database unavailable, WAL archive stale, restore failed | Admin webhook + email/chat | Acknowledge in 15 minutes |
| Warning | replication lag, high DB connections, elevated p95, disk trend | Admin webhook + work queue | Review same staffed day |
| Info | deploy completed, backup completed, certificate reminder | Dashboard/history | No page |

Every critical alert needs a runbook URL, service owner, useful summary, and a tested resolved notification. Avoid sending personal data or credentials in labels and annotations.

## Work-item lifecycle

1. A monitor detects a symptom and links the relevant Grafana panel/runbook.
2. The operator acknowledges and records impact, start time, and current owner.
3. Create an OpenProject incident only for actionable work; deduplicate repeated alerts by fingerprint.
4. Link the fix to its pull request and release.
5. Close after the metric is stable and any recovery/backup checks pass.
6. For material incidents, attach a blameless review with timeline, customer impact, root cause, and follow-up owners.

This setup has no per-seat SaaS fee, but it is not cost-free: compute, storage, email delivery, backups, upgrades, and operator time still have a real cost.
