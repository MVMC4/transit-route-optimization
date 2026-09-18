# Rider application

The mobile-first Next.js app on port 3002 contains Home, Plan, Explore Routes, authenticated Community, Guide, account recovery, and live-trip guidance.

```bash
npm ci
npm run dev
npm run lint
npm run build
```

Live GPS starts only after an explicit button press. The current position and get-off calculation remain in the browser. Bookmarks and recent routes are local-device state until account sync is implemented. Community input is rendered as escaped React text.

See [../docs/FRONTEND.md](../docs/FRONTEND.md) and [../docs/ROUTE_LIFECYCLE.md](../docs/ROUTE_LIFECYCLE.md).
