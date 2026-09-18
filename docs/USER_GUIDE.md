# TransitOS application user guide

## Rider home

Open the rider app to see your profile, saved routes, recently inspected routes, and shortcuts to planning and network exploration. Bookmarks remain on the current device in this preview.

## Live trip and get-off reminder

Open a focused route, choose **Track this route**, select the stop where you intend to get off, and press **Use my live location**. The screen follows your device and shows a prominent warning inside roughly 450 metres. Keep checking the road and ask the driver to call your stop: this is an estimate, not vehicle telemetry.

## Community

Community requires an account. **Add a route** lets you place the start, ordered stops, and extra steering points so the preview follows roads; submissions wait for review. **Search & community board** lets members search tips, attach context to a route, or open a general discussion.

This guide covers the public rider app. The separate operations dashboard maintains the shared route map.

## Start the desktop development application

1. Start Docker Desktop.
2. From the repository directory, run `docker compose up --build`.
3. Wait for PostgreSQL, FastAPI, and the web health checks.
4. Open marketing at `http://localhost:3000` or the rider app at `http://localhost:3002`. Operators use `http://localhost:3001`, and developers start at `http://localhost:3003`.

The first container start runs the database migration and idempotently loads the Gaborone starter routes.

## Rider: plan from your location

1. Open **Plan a trip**.
2. Choose **Use my current location** or tap the starting point directly on the map. The browser asks for location permission only when you choose GPS.
3. Review each matching route, nearest stop, and approximate walking distance in the side panel.
4. Choose 500 m, 1 km, or 2 km to change how far you are willing to walk.
5. Confirm the starting point, set the destination, and choose **Find combi options**. Use the From and To cards to change either place.

The query finds routes with a mapped stop inside the radius. A line crossing the circle without a nearby mapped stop will not be returned.

## Rider: plan a journey

1. Set and confirm the starting point using GPS or the map.
2. Tap the destination; coordinates remain internal and are never entered manually.
3. Select **Find combi options**.
4. Review total time, walking, bus and waiting minutes, transfers, and the ordered boarding/alighting stops.

The planner requires a transit leg. If no route is reachable, widen the nearby search or choose points closer to mapped stops.

## Rider: inspect or contribute a route

- **Explore routes** initially shows the complete network. Selecting a route removes every other line, highlights its start and end, and shows the complete ordered stop list. **Show every route** restores the network view.
- **Community** accepts a start, stops, and optional steering points in travel order. Each added point recalculates a road-following preview. Submitted routes remain `pending_review` and never appear to riders automatically.

## Operations portal: add a route through the map

1. Open `http://localhost:3001/dashboard`.
2. Enter a route name and optional service description.
3. Click the map at each stop in actual travel order. At least two stops are required.
4. Rename every generated stop in the sequence panel.
5. Use **Undo**, **Clear**, or the remove button to correct the draft.
6. Select **Save mapped route**.

The application creates the route and all ordered stops in one database transaction, building a WGS 84 PostGIS point for every coordinate. If any part fails, nothing is committed.

## Operations portal: maintain and optimize a route

1. Open `http://localhost:3001/routes` and choose a route.
2. Edit the route name or description as needed.
3. Add, edit, reorder, or delete stops.
4. Use **Preview optimization** to compare distances without changing the route.
5. Use **Optimize & Apply** only after checking the suggested sequence and fixed endpoints.
6. Pan and zoom the route map; click a stop marker to see its name and order.

## Operations portal: check system health

The Dashboard health panel checks the API, PostgreSQL, PostGIS, and pgRouting. Green means operational. Amber means the dependency is degraded. Use **Refresh** for an immediate check or leave the 10-second auto-refresh enabled.

## Starter-data notice

The seed corridors come from the user-supplied community post about Gaborone combi routes. Landmark coordinates were geocoded against OpenStreetMap. They are intentionally marked as starter data—not an official timetable or guaranteed current route alignment. Validate direction, stop sequence, fare, and service availability with local operators.

## Map attribution and connectivity

The development maps use OpenStreetMap raster tiles through MapLibre. An internet connection is required to display the basemap. Production deployments should configure a tile provider whose service agreement matches expected traffic.

## Developer accounts and API keys

Open `http://localhost:3003/login` to create a local developer account. The console issues a key once, displays monthly usage, and lists key prefixes. Send the credential through `X-API-Key` when calling `/v1/routes`. Passwords use salted PBKDF2 hashes; session and API tokens are stored only as SHA-256 digests in PostgreSQL.
