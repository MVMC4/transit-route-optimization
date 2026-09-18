# TransitOS Rider Website

This directory contains the public Next.js brand and rider experience. It provides route discovery, journey planning, and the general rider guide. Route administration is a separate application in `../admin`.

```bash
npm ci
npm run dev
```

The rider website runs at http://localhost:3000 and calls FastAPI at `NEXT_PUBLIC_API_BASE`, which defaults to http://localhost:8000.

See the repository's [frontend and UI guide](../docs/FRONTEND.md) for page behavior, styling, data flow, and extension guidance. The public HTTP boundary is documented separately in the [API gateway guide](../docs/API_GATEWAY.md).
