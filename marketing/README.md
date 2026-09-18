# Tsela marketing site

The editorial Next.js surface on port 3000 demonstrates the rider journey and routes visitors to separate rider, operations, and developer experiences. **Tsela** is the provisional public brand; TransitOS remains the internal platform name until legal and local-language validation is complete.

The homepage route demo uses a locked MapLibre map with OpenStreetMap tiles, hoverable origin and destination points, and the road-aligned Broadhurst-to-Main-Mall geometry returned by the API. The verified route draws progressively with a direction arrow; if the API is unavailable, the map remains visible but no unverified straight-line route is substituted. The surrounding semantic HTML, CSS, and inline SVG show the complete decision sequence—location, destination, route comparison, ride guidance, and community/API feedback.

## Identity and SEO

- `components/brand-mark.tsx` owns the reusable route-loop wordmark.
- `app/icon.svg`, `app/manifest.ts`, and `app/opengraph-image.tsx` cover browser, install, and social contexts.
- `app/robots.ts` and `app/sitemap.ts` expose crawler guidance and all Markdown blog posts.
- `/brand` documents the working identity and links to the standalone SVG.
- Set `NEXT_PUBLIC_SITE_URL` to the canonical production origin before deployment.
- Set `NEXT_PUBLIC_API_BASE` to the public API origin so the hero can load current road-aligned route geometry.

## Publishing a build-journal entry

Add a `.md` file to `content/journal/` with `title`, `date`, `summary`, and `status` frontmatter. The journal renderer intentionally supports headings, paragraphs, bullet lists, bold text, and inline code. It never injects raw HTML. Keep posts focused on shipped work, reasoning, and explicit validation gaps.

```bash
npm ci
npm run dev
npm run lint
npm run build
```

See [../docs/BRAND.md](../docs/BRAND.md).
