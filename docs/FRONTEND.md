# TransitOS frontend and UI

## Rider page hierarchy

The rider app is layered rather than a single planner page. `/` is a personal home with profile state, bookmarks, and recently inspected routes. `/plan` owns place-based trip planning. `/routes` owns network search and focused route inspection. `/live/[routeId]` owns consent-driven GPS guidance. `/community` is authenticated and separates route drawing from the searchable board. `/guide` explains controls, limitations, and field tips.

Bookmarks and recent routes are local storage adapters. This makes them fast and offline-friendly today while preserving a clear seam for account sync later.

## Live location

GPS access is requested only when a rider presses the live-tracking button. The client watches position, finds the closest mapped stop, measures distance to the rider-selected alighting stop, and changes to a get-ready state within 450 metres. The browser does not upload a live trail. The estimate cannot identify the vehicle, infer direction reliably, or detect diversions.

## Untrusted content

Community text is rendered as ordinary React children, never as HTML. Navigation uses fixed internal destinations. API validation bounds every authored field. See `SECURITY.md` before introducing rich text or dynamic redirect URLs.

TransitOS has four independent Next.js 16 applications. They share an API contract and visual language, but they run on separate ports and do not share route trees.

## Product surfaces

| Surface | Local URL | Routes | Audience |
| --- | --- | --- | --- |
| Marketing site | `http://localhost:3000` | `/`, `/services`, `/developers`, `/company` | Public visitors and partners |
| Operations dashboard | `http://localhost:3001` | `/dashboard`, `/routes`, `/routes/{routeId}` | Route operators |
| Rider app | `http://localhost:3002` | `/`, `/pathfind`, `/routes`, `/community`, `/guide` | Public riders |
| Developer portal | `http://localhost:3003` | `/` is public access; `/console` and `/reference/*` require a live session | Developers and integrators |

The admin app redirects rider and documentation links out to their owning services. The previous combined `web/` client remains temporarily as migration reference and is not started by Compose.

## Public experiences

The `marketing/` application is a deliberately small entry page with dedicated service, developer, and company routes. Shared header, footer, network-preview, and access-dialog components keep page composition out of one monolithic file. The `rider/` application owns route discovery and the general guide, with secondary links back to marketing and developer documentation.

- `/` in the rider app opens directly to an origin-first map flow with optional browser GPS, followed by destination selection. Either place remains editable and coordinates stay internal.
- `/pathfind` exposes the same map-first journey planner for existing links.
- `/routes` shows the complete road-aligned network and filters it by route, area, or stop name. Selecting a route isolates its line, start, end, and ordered stops.
- `/community` draws road-following route proposals through user-selected stops and steering points, then submits them for moderation.
- `/guide` explains the rider workflow and the limitations of community-sourced starter data.

`rider/components/nearby-routes-map.tsx` owns place selection, radius visualization, and nearby results. `rider/components/all-routes-map.tsx` owns the searchable whole-network map. Both use `GET /api/routes/{routeId}/geometry` so lines follow roads instead of joining stops directly. These are explicitly labeled road-aligned previews until field-recorded GPS traces replace them.

## Operations dashboard

The `admin/` application uses the compact black navigation rail and restrained lime/purple accents derived from the supplied logistics references. It contains no rider pages.

- `/dashboard` combines a click-to-draw route builder, network totals, stored route/stop snapshots, and live API/PostgreSQL/PostGIS/pgRouting status.
- `/routes` lists routes and starts conventional route creation.
- `/routes/{routeId}` manages metadata and stops, previews or applies optimization, and visualizes the ordered route on a MapLibre map.

The map builder posts the route and complete ordered stop sequence to `POST /api/routes/map` in one transaction.

## Visual system

Each application keeps its own `app/globals.css`, allowing the products to evolve independently. The marketing and developer sites use a restrained editorial system, while the rider app mixes hard borders and offset shadows with rounded workspaces and a floating left/bottom dock. Operations remains compact and utilitarian.

- neutral surfaces, black navigation, acid-lime actions, and restrained purple accents;
- DM Sans for interface text and DM Mono for endpoint and code labels;
- custom SVG interface icons rather than emoji;
- responsive map, card, table, form, badge, alert, and skeleton primitives;
- route colors selected deterministically from the route ID;
- explicit loading, empty, error, success, and health states.

MapLibre renders OpenStreetMap raster tiles for development. Production should use a tile provider and service agreement appropriate for the expected traffic.

## Client data flow

The rider and operations applications have a local `lib/api-client.ts` adapter:

1. Read `NEXT_PUBLIC_API_BASE`, defaulting to `http://localhost:8000`.
2. Call FastAPI using typed request and response shapes.
3. Convert non-2xx responses to browser `Error` objects using FastAPI's `detail` field.
4. Keep persistence, routing, optimization, and validation rules in the backend.

## Directory layout

```text
marketing/                        Public brand site, port 3000
├── app/page.tsx                  Focused homepage doorway
├── app/services/page.tsx         Product surfaces
├── app/developers/page.tsx       API and access overview
├── app/company/page.tsx          Mission and principles
└── components/                   Shared navigation, preview, and modal

admin/                            Operations application, port 3001
├── app/dashboard/page.tsx        Route builder and health dashboard
├── app/routes/page.tsx           Route inventory
├── app/routes/[routeId]/         Route maintenance and route map
├── components/route-builder-map.tsx
└── components/app-navigation.tsx

rider/                            Rider application, port 3002
├── app/page.tsx                  Map-first journey entry
├── app/pathfind/page.tsx         Nearby search and journey planner
├── app/routes/page.tsx           Searchable whole-network map
├── app/community/page.tsx        Road-following community contribution editor
├── app/guide/page.tsx            General rider guide
├── components/nearby-routes-map.tsx
└── components/all-routes-map.tsx

docs-site/                        Developer portal and protected documentation, port 3003
├── app/page.tsx                  Quickstart and endpoint catalog
├── app/console/page.tsx          Honest API access and key status
├── app/login/page.tsx            Developer registration and sign-in
└── components/docs-shell.tsx     Shared developer navigation shell

api/                              API and generated docs, port 8000
```

## Run locally

Start the complete system from the repository root:

```powershell
docker compose up --build
```

For standalone frontend development, run `npm ci` once and `npm run dev` inside `marketing/`, `admin/`, `rider/`, or `docs-site/`. Their scripts bind to ports 3000, 3001, 3002, and 3003 respectively.

## Current UI gaps

- Authentication and role-based access to the operations application are not yet implemented.
- Developer sessions currently use browser storage; production hardening should move them to secure same-site HTTP-only cookies behind TLS.
- There is no browser end-to-end test suite yet.
- Stop ordering uses an explicit numeric position instead of drag and drop.
- Maps and fonts currently depend on public network resources.
