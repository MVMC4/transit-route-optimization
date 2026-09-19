/** Credentialed public API catalog rendered by the protected Fumadocs site. */

export type ReferenceParameter = {
  name: string;
  location: "path" | "query" | "header" | "body";
  type: string;
  required: boolean;
  description: string;
};

export type ReferenceEndpoint = {
  slug: string;
  group: "Routes";
  method: "GET";
  path: string;
  title: string;
  description: string;
  authentication: "API key" | "Developer session";
  parameters: ReferenceParameter[];
  requestBody?: string;
  response: string;
  notes: string[];
};

const apiKeyParameter: ReferenceParameter = {
  name: "X-API-Key",
  location: "header",
  type: "string",
  required: true,
  description: "A live credential issued from the developer console.",
};

export const REFERENCE_ENDPOINTS: ReferenceEndpoint[] = [
  {
    slug: "routes/list",
    group: "Routes",
    method: "GET",
    path: "/v1/routes",
    title: "List routes",
    description: "Return published routes through the metered public API.",
    authentication: "API key",
    parameters: [
      apiKeyParameter,
      { name: "search", location: "query", type: "string", required: false, description: "Case-insensitive route name or description search, up to 120 characters." },
      { name: "offset", location: "query", type: "integer", required: false, description: "Records to skip. Defaults to 0." },
      { name: "limit", location: "query", type: "integer", required: false, description: "Records to return, from 1 to 100. Defaults to 50." },
    ],
    response: `[{\n  "id": 3,\n  "name": "Broadhurst Route 1",\n  "description": "Community-sourced Gaborone starter corridor.",\n  "createdAt": "2026-09-12T08:42:12Z"\n}]`,
    notes: ["Missing, expired, revoked, or invalid keys return 401.", "Hourly or monthly quota exhaustion returns 429 with Retry-After."],
  },
  {
    slug: "routes/geometry",
    group: "Routes",
    method: "GET",
    path: "/v1/routes/{routeId}/geometry",
    title: "Get route geometry",
    description: "Resolve a published route into its ordered, road-following geometry.",
    authentication: "API key",
    parameters: [
      apiKeyParameter,
      { name: "routeId", location: "path", type: "integer", required: true, description: "The published route identifier." },
    ],
    response: `{\n  "routeId": 3,\n  "coordinates": [[25.94367, -24.62896], [25.94281, -24.62931]],\n  "distanceMeters": 5240,\n  "durationMinutes": 11,\n  "geometrySource": "osrm",\n  "isRoadAligned": true,\n  "warning": "Road-aligned preview; field verification is still required."\n}`,
    notes: ["A 404 response means the route does not exist.", "A fallback stop sequence is returned when the road router is temporarily unavailable."],
  },
];

export const REFERENCE_GROUPS = ["Routes"] as const;

export function findEndpoint(slug: string[]) {
  return REFERENCE_ENDPOINTS.find((endpoint) => endpoint.slug === slug.join("/"));
}
