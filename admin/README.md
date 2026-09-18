# TransitOS Operations Dashboard

This directory contains the separate operator-facing Next.js application. It supports map-based route creation, route and stop maintenance, optimization, and API/database health inspection.

The dashboard is overview-first: network totals, route density, infrastructure health, recent corridors, and the current stop window appear before editing tools. Route mapping opens in a focused overlay so operators can create a corridor without losing the monitoring context underneath. Network and service status refresh every ten seconds by default, with pause and manual-refresh controls.

```bash
npm ci
npm run dev
```

The dashboard runs at http://localhost:3001 and calls FastAPI at `NEXT_PUBLIC_API_BASE`, which defaults to http://localhost:8000. The rider app is isolated at http://localhost:3002 and the developer portal is at http://localhost:3003; sign-in is required before opening its endpoint reference and access console. FastAPI's generated explorer endpoints are disabled by default.

See the repository's [frontend and UI guide](../docs/FRONTEND.md) for page behavior, styling, data flow, and extension guidance. The public HTTP boundary is documented separately in the [API gateway guide](../docs/API_GATEWAY.md).
