/** Structured API reference content shared by navigation, index, and endpoint pages. */

export type ReferenceParameter = {
  name: string;
  location: "path" | "query" | "header" | "body";
  type: string;
  required: boolean;
  description: string;
};

export type ReferenceEndpoint = {
  slug: string;
  group: "Routes" | "Journey planning" | "Community" | "Developer access" | "Platform";
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  title: string;
  description: string;
  authentication: "None" | "Developer session" | "API key";
  parameters: ReferenceParameter[];
  requestBody?: string;
  response: string;
  notes: string[];
};

export const REFERENCE_ENDPOINTS: ReferenceEndpoint[] = [
  {
    slug: "routes/list",
    group: "Routes",
    method: "GET",
    path: "/api/routes",
    title: "List routes",
    description: "Return published routes with bounded pagination and optional name or description search.",
    authentication: "None",
    parameters: [
      { name: "search", location: "query", type: "string", required: false, description: "Case-insensitive route name or description search, up to 120 characters." },
      { name: "offset", location: "query", type: "integer", required: false, description: "Number of records to skip. Defaults to 0." },
      { name: "limit", location: "query", type: "integer", required: false, description: "Records to return, from 1 to 500. Defaults to 100." },
    ],
    response: `[{\n  "id": 3,\n  "name": "Broadhurst Route 1",\n  "description": "Community-sourced Gaborone starter corridor.",\n  "createdAt": "2026-09-12T08:42:12Z"\n}]`,
    notes: ["This preview endpoint does not require a credential.", "Use /v1/routes for metered production-style access."],
  },
  {
    slug: "routes/geometry",
    group: "Routes",
    method: "GET",
    path: "/api/routes/{routeId}/geometry",
    title: "Get route geometry",
    description: "Resolve a route's ordered stops into a road-following GeoJSON-compatible coordinate sequence.",
    authentication: "None",
    parameters: [{ name: "routeId", location: "path", type: "integer", required: true, description: "The published route identifier." }],
    response: `{\n  "routeId": 3,\n  "coordinates": [[25.94367, -24.62896], [25.94281, -24.62931]],\n  "distanceMeters": 5240,\n  "durationMinutes": 11,\n  "geometrySource": "osrm",\n  "isRoadAligned": true,\n  "warning": "Road-aligned preview; field verification is still required."\n}`,
    notes: ["A 422 response means the route has fewer than two stops.", "When road routing is unavailable, the endpoint returns the stop sequence with isRoadAligned set to false."],
  },
  {
    slug: "routes/nearby",
    group: "Routes",
    method: "GET",
    path: "/api/routes/nearby",
    title: "Find nearby routes",
    description: "Find each route's nearest stop to a location using an indexed PostGIS distance query.",
    authentication: "None",
    parameters: [
      { name: "lat", location: "query", type: "number", required: true, description: "Latitude between -90 and 90." },
      { name: "long", location: "query", type: "number", required: true, description: "Longitude between -180 and 180." },
      { name: "radiusMeters", location: "query", type: "integer", required: false, description: "Search radius from 50 to 5,000 metres. Defaults to 750." },
    ],
    response: `{\n  "location": { "lat": -24.62896, "long": 25.94367 },\n  "radiusMeters": 750,\n  "routes": [{\n    "route": { "id": 3, "name": "Broadhurst Route 1" },\n    "nearestStop": { "name": "Broadhurst" },\n    "distanceMeters": 0\n  }]\n}`,
    notes: ["Coordinates are intended for devices and map clicks; the rider UI uses place names.", "Results contain only the nearest matching stop per route."],
  },
  {
    slug: "journeys/pathfind",
    group: "Journey planning",
    method: "POST",
    path: "/api/pathfind",
    title: "Plan a journey",
    description: "Find a walk-and-combi journey between two places, including transfers and the correct alighting stop.",
    authentication: "None",
    parameters: [{ name: "body", location: "body", type: "application/json", required: true, description: "Origin and destination coordinates." }],
    requestBody: `{\n  "origin": { "lat": -24.62896, "long": 25.94367 },\n  "destination": { "lat": -24.65816, "long": 25.91594 }\n}`,
    response: `{\n  "totalMinutes": 18,\n  "walkingMeters": 180,\n  "segments": [{\n    "mode": "transit",\n    "routeName": "Broadhurst Route 1",\n    "boardAt": "Broadhurst",\n    "alightAt": "Main Mall"\n  }]\n}`,
    notes: ["A successful 200 can contain a no-route message when no transit path falls within walking range.", "Walking speed, wait time, and transfer penalties are server-configurable."],
  },
  {
    slug: "community/preview-route",
    group: "Community",
    method: "POST",
    path: "/api/community/routes/preview",
    title: "Preview a route contribution",
    description: "Snap an ordered set of contributor waypoints to the road before the route is submitted for review.",
    authentication: "Developer session",
    parameters: [
      { name: "Authorization", location: "header", type: "Bearer token", required: true, description: "Developer session token returned by login." },
      { name: "body", location: "body", type: "application/json", required: true, description: "Two or more ordered waypoints inside Greater Gaborone." },
    ],
    requestBody: `{\n  "waypoints": [\n    { "lat": -24.62896, "long": 25.94367 },\n    { "lat": -24.65816, "long": 25.91594 }\n  ]\n}`,
    response: `{\n  "coordinates": [[25.94367, -24.62896], [25.91594, -24.65816]],\n  "distanceMeters": 5240,\n  "durationMinutes": 11,\n  "geometrySource": "osrm"\n}`,
    notes: ["Out-of-area waypoints are rejected before a road-router request is spent.", "Previewing does not publish or persist the route."],
  },
  {
    slug: "developers/create-key",
    group: "Developer access",
    method: "POST",
    path: "/api/developer/keys",
    title: "Create an API key",
    description: "Issue a metered credential for the signed-in developer account. The full secret is returned once.",
    authentication: "Developer session",
    parameters: [
      { name: "Authorization", location: "header", type: "Bearer token", required: true, description: "Developer session token returned by login." },
      { name: "body", location: "body", type: "application/json", required: true, description: "A memorable name for the credential." },
    ],
    requestBody: `{ "name": "Local prototype" }`,
    response: `{\n  "id": 8,\n  "name": "Local prototype",\n  "prefix": "tos_live_ab12cd",\n  "key": "tos_live_••••••••",\n  "monthlyQuota": 10000,\n  "hourlyLimit": 100,\n  "createdAt": "2026-09-19T08:42:12Z",\n  "revokedAt": null\n}`,
    notes: ["Store the secret immediately; the server persists only its SHA-256 hash.", "Revoke a leaked credential from the access console."],
  },
  {
    slug: "developers/rotate-key",
    group: "Developer access",
    method: "POST",
    path: "/api/developer/keys/{keyId}/rotate",
    title: "Rotate an API key",
    description: "Atomically revoke an active credential and issue its one-time replacement with the same name and limits.",
    authentication: "Developer session",
    parameters: [
      { name: "Authorization", location: "header", type: "Bearer token", required: true, description: "Developer session token returned by login." },
      { name: "keyId", location: "path", type: "integer", required: true, description: "An active API key owned by the signed-in account." },
    ],
    response: `{\n  "id": 9,\n  "name": "Local prototype",\n  "prefix": "tos_live_ef34gh",\n  "key": "tos_live_••••••••",\n  "monthlyQuota": 10000,\n  "hourlyLimit": 100,\n  "revokedAt": null\n}`,
    notes: ["The old credential stops working in the same database transaction.", "The replacement secret is returned once; copy or download it before dismissing the console notice.", "A revoked key cannot be rotated."],
  },
  {
    slug: "developers/revoke-key",
    group: "Developer access",
    method: "DELETE",
    path: "/api/developer/keys/{keyId}",
    title: "Revoke an API key",
    description: "Immediately prevent a credential owned by the signed-in developer from authorizing new requests.",
    authentication: "Developer session",
    parameters: [
      { name: "Authorization", location: "header", type: "Bearer token", required: true, description: "Developer session token returned by login." },
      { name: "keyId", location: "path", type: "integer", required: true, description: "The API key to revoke." },
    ],
    response: `204 No Content`,
    notes: ["Revocation is irreversible. Create or rotate another key before revoking the only credential used by a live service.", "Requests made with the revoked secret return 401."],
  },
  {
    slug: "v1/list-routes",
    group: "Developer access",
    method: "GET",
    path: "/v1/routes",
    title: "List routes with an API key",
    description: "Call the metered v1 route catalog and count the request against the key's hourly and monthly limits.",
    authentication: "API key",
    parameters: [{ name: "X-API-Key", location: "header", type: "string", required: true, description: "A live key issued from the access console." }],
    response: `[{\n  "id": 3,\n  "name": "Broadhurst Route 1",\n  "description": "Community-sourced Gaborone starter corridor."\n}]`,
    notes: ["Missing, invalid, and revoked keys return 401.", "Quota exhaustion or repeated invalid attempts return 429 with Retry-After."],
  },
  {
    slug: "platform/health",
    group: "Platform",
    method: "GET",
    path: "/api/health",
    title: "Check service health",
    description: "Inspect the API and its database, PostGIS, and pgRouting dependencies.",
    authentication: "None",
    parameters: [],
    response: `{\n  "status": "ok",\n  "database": "connected",\n  "postgis": "available",\n  "pgrouting": "available"\n}`,
    notes: ["Use this endpoint for local readiness checks.", "A non-200 response indicates a degraded dependency."],
  },
];

export const REFERENCE_GROUPS = Array.from(new Set(REFERENCE_ENDPOINTS.map((endpoint) => endpoint.group)));

export function findEndpoint(slug: string[]) {
  return REFERENCE_ENDPOINTS.find((endpoint) => endpoint.slug === slug.join("/"));
}
