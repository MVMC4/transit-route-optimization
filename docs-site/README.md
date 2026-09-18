# Developer documentation

The Next.js developer portal on port 3003 presents a Fumadocs-style sign-in and registration landing page. A valid developer session is required for the Fumadocs endpoint reference and credential/usage console. FastAPI's Swagger, ReDoc, and OpenAPI HTTP routes are disabled by default.

The documentation sidebar filters the endpoint catalog by title, path, method, and description. Every endpoint has a dedicated `/reference/...` page covering authentication, parameters, request examples, responses, and operational notes. Compact reference navigation remains available when the desktop sidebar collapses on mobile.

The root Compose stack enables a local-only demo account (`demo@tsela.local` / `TselaDemo2026!`) and displays it on the portal landing page. This is controlled by `NEXT_PUBLIC_DEMO_MODE`; leave it `false` in production and do not expose a predictable demo password on a public deployment. The portal stores its browser session in an HttpOnly cookie and proxies developer API calls through same-origin route handlers.

Protected examples send credentials in `X-API-Key`. Never put keys in query strings, screenshots, source control, or browser-visible marketing copy.

```bash
npm ci
npm run dev
npm run lint
npm run build
```

See [../docs/API_GATEWAY.md](../docs/API_GATEWAY.md), [../docs/OBSERVABILITY_AND_AUTH.md](../docs/OBSERVABILITY_AND_AUTH.md), and [../docs/WORK_ORDER.md](../docs/WORK_ORDER.md).
