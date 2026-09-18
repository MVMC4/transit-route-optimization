# Cost and capacity model

The API enforces 100 protected calls per rolling hour per key by default and also checks a monthly quota. This reduces accidental loops; it is not a substitute for an edge rate limiter.

`ESTIMATED_COST_PER_1000_REQUESTS_USD` is intentionally unset. Populate it only after measuring a representative month:

```text
(compute + database + road-router + observability + egress) / protected requests * 1000
```

The developer console multiplies this measured blended rate by current request count. It does not claim per-request billing accuracy. Track cache hit ratio, database query time, road-router latency, response size, error rate, and p95 latency before setting the value.

Database efficiency comes from indexed account email, session digest, API key prefix/digest, usage key/time, stop route/order, geometry GiST, community route/time, and status/time access paths. Search remains bounded to 100 posts and uses parameterized expressions.
