# System design playbook

Tsela adds complexity when measurements justify it, not to collect architecture names.

| Pressure | First response | Scale trigger | Later option |
| --- | --- | --- | --- |
| Read latency | correct indexes, bounded queries, route-data cache | sustained database read saturation or p95 breach | read replicas with measured replica lag |
| Write volume | batch usage events and async noncritical work | lock/IO contention or queueable bursts | partitioning, then sharding only with a proven key |
| Live vehicle data | server-sent events for one-way updates | bidirectional control is actually required | WebSockets with backpressure |
| Long work | idempotent Kubernetes Jobs/CronJobs | multi-step workflows need pause/retry/compensation | durable workflow engine |
| Dependency failure | deadlines, bounded exponential backoff with jitter, circuit breaker | repeated dependency incidents | bulkheads/fallback providers |
| Reporting load | rebuildable read projections | operational queries harm writes | CQRS read store |

Scheduled maintenance cleans expired auth records hourly, audits expiring keys daily, and prunes usage by retention policy daily. Every execution has a unique database run record because Kubernetes CronJobs can be delayed, skipped, or duplicated.

The developer portal is already a separate deployable from marketing, rider, admin, and API. Documentation and developer console remain together for now because they share identity, cookie, release, and traffic boundaries. Split them only if their security ownership, scaling profile, or release cadence diverges.

OpenTelemetry traces FastAPI, SQLAlchemy, and outbound HTTP to Tempo when explicitly enabled. Prometheus remains the numeric health source. `X-Request-ID` gives support a stable reference even when trace sampling drops a request.

