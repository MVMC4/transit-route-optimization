# TransitOS product vision

## Product definition

TransitOS is not a conventional timetable app. It maps Gaborone's informal but repeatable combi, minibus-taxi, and local-taxi corridors so a rider can answer: “From where I am, which route gets me closest to where I want to go, where do I board, where do I ask to stop, and where do I transfer?”

The product should preserve how the network actually works:

- vehicles follow known corridors but often do not publish schedules;
- Station, Bus Rank, malls, campuses, neighborhoods, and major junctions act as recognizable hubs;
- riders may ask to alight at a safe point along the corridor rather than only at a formal stop;
- fares vary by vehicle/service type and can change before a route record is updated;
- crowding, queue length, and service conditions are time-sensitive community knowledge;
- some riders have limited data or feature phones, making USSD/SMS a meaningful access channel.

## Five product surfaces

Each surface should be an independent deployable application or service. They can share a monorepo and design tokens without sharing route trees.

| Surface | Proposed production URL | Proposed local URL | Responsibility |
| --- | --- | --- | --- |
| Marketing | `transitos.bw` | `http://localhost:3000` | Mission, services, open-data story, API offering, pricing, signup, trust, and calls to action |
| Rider app | `app.transitos.bw` | `http://localhost:3002` | Map-first trip planning, nearby routes, favorites, recent trips, reports, fares, and handoff to last-mile services |
| Operations | `ops.transitos.bw` | `http://localhost:3001` | Mobile field capture, route review, publishing, stop/hub management, fares, moderation, and system health |
| API | `api.transitos.bw` | `http://localhost:8000` | Versioned JSON API, developer keys, quotas, webhooks, and channel integrations |
| Documentation | `docs.transitos.bw` | `http://localhost:3003` | Polished public API reference, guides, examples, errors, changelog, and status links |

The first structural milestone is now in place: Marketing, Rider, Operations, API, and Documentation run as independent services on their proposed local ports. Marketing uses a focused homepage with separate Services, Developers, and Company routes; developer access has its own console and honest planned states for credentials and quotas. The Rider surface now includes a coordinate-free destination-first planner and a searchable whole-network map. Route lines use road-aligned previews rather than straight stop-to-stop segments, and the UI states clearly that field-recorded GPS traces remain the authoritative target. The next milestone is to persist verified route geometry and evolve the current `/api` contract toward versioned `/v1` endpoints with developer authentication.

## Rider experience

The rider app should open directly to the map, similar in interaction density to a ride-hailing product, without visually copying another brand.

### Primary map flow

1. The map opens near the rider's location, subject to location permission, with a search field and recent/favorite destinations above it.
2. The rider taps or drags the map to position the destination pin. Until confirmation, the pin remains editable.
3. A bottom sheet names the nearest landmark or area and offers **Confirm destination**.
4. After confirmation, the app asks for the origin. Current location is the default; the rider can move the origin pin or choose a known hub.
5. Route options appear as cards ranked by walking distance, transfers, corridor confidence, and freshness—not by a fake timetable.
6. Selecting an option draws the boarding walk, transit corridor, transfer points, requested alighting point, and final walk.
7. The trip view includes expected fare, route aliases, recognizable vehicle signage, and a clear instruction for where to ask the driver to stop.

On desktop the same state machine uses a side panel; on mobile it uses a map with a staged bottom sheet. Radius belongs in preferences and an advanced filter, not as the dominant first-run control.

### Personal rider features

- recent searches and last-used routes;
- favorite routes, hubs, home, work, and school;
- shareable trip and route links;
- notification opt-in for material route changes;
- lightweight accounts with anonymous use still supported;
- accessibility, low-data mode, Setswana-ready content, and installable PWA behavior.

## Modeling the real network

The route is more than an ordered list of stops. The domain should grow toward:

- `Operator` and `VehicleType` for combi, minibus taxi, metered/local taxi, and future modes;
- `Route`, `RouteVariant`, and direction-specific `RoutePattern`;
- a recorded PostGIS `LineString` geometry for the actual traveled corridor;
- `Hub`, `BoardingPoint`, and `Landmark`, including aliases such as Station and Bus Rank;
- `FlexibleStopSegment` for portions of a corridor where request stops are commonly and safely made;
- `FareRule` with amount, currency, effective dates, evidence, and confidence;
- `Observation` for field verification and GPS traces;
- `ServiceReport` for crowding, queue, delay, obstruction, fare change, and temporary reroute;
- `Favorite`, `RecentTrip`, and `SavedPlace` for signed-in riders;
- provenance, verification state, confidence, and last-reviewed timestamps on community-derived data.

Free-text comments should supplement structured reports, not replace them. Crowding and queue reports should decay quickly, while verified geometry and hub data should persist. Moderation, rate limits, abuse reporting, and contributor reputation are required before open comments are public.

## Operations and field capture

The operations dashboard should be a mobile-capable PWA because route capture happens in the field.

The operator workflow should support:

1. **Start recording** to capture a timestamped GPS trace while riding the route.
2. Add boarding points, landmarks, fare observations, direction, and route aliases during or after the trip.
3. Work offline and upload a draft when connectivity returns.
4. Snap and simplify the trace into a reviewable route geometry without silently changing the recorded evidence.
5. Compare the draft against existing corridors and merge duplicates.
6. Publish a reviewed version; riders receive it immediately through normal API cache invalidation.
7. Retain route-version history so an accidental edit can be audited and reversed.

Publishing should eventually require roles such as contributor, reviewer, moderator, and administrator. Drafts must never appear in the rider API until approved.

Google Maps can help operators locate and cross-check landmarks through its licensed APIs, but TransitOS should not trace, scrape, or bulk-copy Google's map content into its own route dataset. Store permitted identifiers such as Google Place IDs where useful; own route geometry should come from field GPS observations, contributors, and appropriately licensed open data.

## Developer platform and documentation

The marketing site explains the API product and handles developer signup. The developer account area issues named API keys and shows usage; it should not be confused with the route-operations dashboard.

API foundations:

- versioned endpoints under `/v1` before external release;
- hashed API keys with visible prefixes, rotation, revocation, scopes, and per-key audit events;
- anonymous low-volume access for the public rider client only through a server-side/backend-for-frontend path;
- Redis-compatible distributed rate limiting with separate public, developer, and partner tiers;
- idempotency keys for write operations and signed webhooks for partners;
- stable error codes, request IDs, pagination, cache headers, and an explicit deprecation policy;
- privacy-preserving telemetry that does not retain precise rider searches longer than necessary.

The dedicated documentation site should use the generated OpenAPI contract as a source but add editorial structure. A Figma-like documentation experience means a persistent navigation tree, excellent search, endpoint pages, request/response examples, an interactive request builder, language snippets, authentication, limits, errors, changelog, and status—not internal architecture explanations. Backend implementation documentation remains inside the repository.

Fumadocs is a strong fit because it stays within the existing Next.js stack and supports OpenAPI-generated endpoint content, MDX guides, search, navigation, and custom branding.

## USSD and SMS channel

USSD cannot reproduce the map and normally does not provide a phone's GPS position. It should expose a landmark/hub-based subset of TransitOS rather than forcing map concepts into numbered menus.

Example session:

```text
*XYZ#
1. Find a route
2. Routes from a hub
3. Fare information
4. Report crowding

From:
1. Station
2. Bus Rank
3. Main Mall
4. Airport Junction
5. Enter place code

To:
1. University of Botswana
2. BBS
3. Game City
4. BSBS/BAC
5. Enter place code
```

The response should be short: route name/alias, boarding hub, transfer if required, where to ask to stop, approximate fare, and a numbered option to receive a detailed SMS link.

Technical flow:

1. Obtain a Botswana USSD code or shared service code through an MNO or licensed aggregator and confirm BOCRA requirements.
2. The gateway sends session callbacks to `/v1/channels/ussd` with network, session ID, and user input.
3. A channel service stores short-lived menu state in Redis and calls the same journey-planning service used by the rider app.
4. Phone numbers are normalized and hashed for analytics; raw MSISDN access is tightly limited.
5. Long results are sent through an approved SMS provider with a compact web link.
6. Monitor session timeouts, per-network behavior, menu completion, and language choice.

Start with one network or aggregator pilot and a curated set of popular hubs. A universal code across Mascom, Orange, and BTC is a commercial/telecom arrangement, not merely a software feature.

## Ride-hailing handoff

Ride-hailing should complement combis as the first/last-mile fallback, not displace the core network.

- Offer a handoff when walking is excessive, no combi route is found, service is unavailable, or the rider explicitly chooses a taxi.
- Pass confirmed origin and destination only after consent.
- Label estimated ride-hailing prices as provider estimates and keep them separate from combi fares.
- Record outbound attribution without sharing the rider's full journey history.

Yango currently has the clearer integration path: its documented widget/API can calculate supported-region trip information and generate an app/web deep link containing coordinates; its `ref` parameter supports source or affiliate attribution. API credentials and order statistics require direct approval from Yango. TransitOS should begin with a compliant deep-link proof of concept and contact Yango for a Botswana partnership.

No equivalent public inDrive ride-booking, referral, or deep-link API has been identified. Do not scrape or reverse-engineer its app. Treat inDrive as a business-development track and add it only after receiving documented link/API terms.

## Delivery sequence

### Phase 1 — trustworthy core

- Validate Station, Bus Rank, major hubs, seed corridors, directions, fares, and naming through field work.
- Record route polylines and flexible alighting segments.
- Complete the destination-first rider flow and the field-capture PWA.
- Add route versioning, provenance, confidence, and review states.

### Phase 2 — product separation

- Extract the rider app to port 3002.
- Keep marketing on port 3000 and operations on 3001.
- Build the Fumadocs/OpenAPI documentation site on port 3003.
- Introduce `/v1`, developer accounts, API keys, quotas, and usage views.

### Phase 3 — community and access

- Add favorites, recents, structured reports, moderation, and freshness scoring.
- Pilot USSD/SMS with selected hubs and one telecom partner.
- Add approved Yango handoff and measure whether it helps unresolved journeys.

### Phase 4 — scale

- Expand beyond Gaborone using city/network boundaries and regional data ownership.
- Move large-network pathfinding toward persisted transfer edges and database-backed routing.
- Publish open-data exports where operator, contributor, and privacy rights allow it.
- Establish partnerships with operators, institutions, transport regulators, and mobility platforms.

## Research references

- [Botswana School of Business Sciences](https://www.bac.ac.bw/) — official institution site and former BAC naming
- [BOCRA market overview](https://www.bocra.org.bw/about-us) — Botswana's licensed mobile operators and communications context
- [Orange APIs for Middle East and Africa](https://developer.orange.com/resources/orange-apis-for-the-middle-east-africa/) — documented USSD, SMS, and payment channels
- [Yango ride-request integration](https://yango.com/en_int/partner-program/documentation/) — widget, API, coordinate deep links, and referral/source parameters
- [Yango Botswana](https://yango.com/en_bw/) — current Botswana consumer availability
- [Google Places policies](https://developers.google.com/maps/documentation/places/web-service/policies) — storage, attribution, and scraping constraints
- [Fumadocs OpenAPI integration](https://v14.fumadocs.dev/docs/ui/openapi) — generated endpoint documentation support
