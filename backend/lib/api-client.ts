// lib/api-client.ts
// ─────────────────────────────────────────────
// Frontend HTTP utilities. Named api-client.ts to avoid
// conflicting with the existing backend lib/api.ts.
//
// Base URL config:
//   - Same Next.js project (frontend + backend together): leave BASE as ""
//   - Separate projects: set NEXT_PUBLIC_API_BASE=http://localhost:PORT in .env.local
// ─────────────────────────────────────────────
const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── Types ────────────────────────────────────────────────────────────────────
export interface Route {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
}

export interface Node {
  id: number;
  routeId: number;
  label: string;
  name: string;
  lat: number;
  long: number;
  orderNum: number;
}

export interface PathfindResult {
  path: Node[];
  totalTimeMinutes: number;
  breakdown: { walking: number; bus: number; waiting: number };
}

export interface PathfindNoRoute {
  message: string;
}

export interface DashboardData {
  routes: Route[];
  nodes: Node[];
}

// ── API methods ──────────────────────────────────────────────────────────────
export const apiClient = {
  routes: {
    list: () => request<Route[]>("/api/routes"),
    get: (id: number) => request<Route>(`/api/routes/${id}`),
    create: (body: { name: string; description?: string }) =>
      request<Route>("/api/routes", { method: "POST", body: JSON.stringify(body) }),
  },
  nodes: {
    list: (routeId: number) => request<Node[]>(`/api/routes/${routeId}/nodes`),
    create: (
      routeId: number,
      body: { lat: number; long: number; name: string; orderNum: number }
    ) =>
      request<{ message: string }>(`/api/routes/${routeId}/nodes`, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (
      routeId: number,
      nodeId: number,
      body: Partial<{ lat: number; long: number; name: string; orderNum: number }>
    ) =>
      request<{ message: string }>(`/api/routes/${routeId}/nodes/${nodeId}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    delete: (routeId: number, nodeId: number) =>
      request<{ message: string }>(`/api/routes/${routeId}/nodes/${nodeId}`, {
        method: "DELETE",
      }),
  },
  pathfind: {
    find: (body: {
      origin: { lat: number; long: number };
      destination: { lat: number; long: number };
    }) =>
      request<PathfindResult | PathfindNoRoute>("/api/pathfind", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },
  dashboard: {
    // Fixed: was "/dashboard/db" (missing /api prefix)
    dbView: (page = 1, limit = 10) =>
      request<DashboardData>(`/api/dashboard/db?page=${page}&limit=${limit}`),
  },
};

// ── Flat alias ───────────────────────────────────────────────────────────────
// Allows components to `import { api } from "@/lib/apiClient"` without
// needing to rename every import across the codebase.
export const api = {
  getRoutes: () => apiClient.routes.list(),
  createRoute: (name: string) => apiClient.routes.create({ name }),
  getRouteNodes: (routeId: number) => apiClient.nodes.list(routeId),
  createNode: (
    routeId: number,
    data: { name: string; lat: number; long: number; orderNum: number }
  ) => apiClient.nodes.create(routeId, data),
  updateNode: (
    routeId: number,
    nodeId: number,
    data: { name: string; lat: number; long: number; orderNum: number }
  ) => apiClient.nodes.update(routeId, nodeId, data),
  deleteNode: (routeId: number, nodeId: number) =>
    apiClient.nodes.delete(routeId, nodeId),
};