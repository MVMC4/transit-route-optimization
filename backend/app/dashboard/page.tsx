"use client";
// PLACE AT: app/dashboard/page.tsx
import { useState, useEffect, useCallback } from "react";
import { apiClient, DashboardData } from "@/lib/api-client";

const ROUTE_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#8b5cf6", "#ec4899", "#14b8a6"
];
const getRouteColor = (id: number) => ROUTE_COLORS[id % ROUTE_COLORS.length];

const AUTO_REFRESH_MS = 10000; // 10 seconds

// Simple relative time helper
function getRelativeTime(date: Date | null): string {
  if (!date) return "";
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  return `${Math.floor(seconds / 60)}m ago`;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const limit = 10;

  const load = useCallback(async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);
      setError("");

      const newData = await apiClient.dashboard.dbView(page, limit);
      setData(newData);
      setLastUpdated(new Date());
    } catch (e: any) {
      setError(e.message ?? "Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page]);

  // Initial load + page change
  useEffect(() => {
    load();
  }, [load]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => load(), AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [autoRefresh, load]);

  const handleRefresh = () => load(true);

  return (
    <div className="page-container">
      <div className="page-header">
        <span className="page-eyebrow">📊 Admin Panel</span>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Live PostgreSQL + PostGIS snapshot • Routes &amp; Stops</p>
      </div>

      {/* Modern Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-card p-4 rounded-2xl border border-border">
        <div className="flex items-center gap-4">
          {/* Auto-refresh Toggle */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="peer sr-only"
              />
              <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-emerald-500 transition-all" />
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5" />
            </div>
            <span className="text-sm font-medium text-foreground group-hover:text-emerald-600 transition-colors">
              Auto-refresh
            </span>
          </label>

          {/* Live Indicator */}
          {autoRefresh && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              LIVE
            </div>
          )}
        </div>

        {/* Last Updated + Manual Refresh */}
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground tabular-nums">
              Updated {getRelativeTime(lastUpdated)}
            </span>
          )}

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn btn-secondary btn-sm flex items-center gap-2 hover:bg-accent transition-all active:scale-95"
          >
            {refreshing ? (
              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              "↻"
            )}
            Refresh Now
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
          <button
            onClick={() => load(true)}
            className="text-sm underline hover:text-foreground"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {(loading || refreshing) && (
        <div className="space-y-8">
          {/* Stats Skeleton */}
          <div className="grid-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="stat-card animate-pulse">
                <div className="h-6 w-6 bg-muted rounded" />
                <div className="h-9 w-16 bg-muted rounded mt-3" />
                <div className="h-3 w-24 bg-muted rounded" />
              </div>
            ))}
          </div>

          {/* Tables Skeleton */}
          {[1, 2].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="card-header">
                <div className="h-5 w-32 bg-muted rounded" />
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>{[...Array(i === 1 ? 4 : 6)].map((_, j) => <th key={j} className="h-4 w-20 bg-muted rounded" />)}</tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, j) => (
                      <tr key={j}>
                        {[...Array(i === 1 ? 4 : 6)].map((_, k) => (
                          <td key={k}><div className="h-4 bg-muted rounded" /></td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !refreshing && data && (
        <>
          {/* Stats Row */}
          <div className="grid-4 mb-8">
            <div className="stat-card">
              <div className="stat-icon blue">🗺️</div>
              <div className="stat-value">{data.routes.length}</div>
              <div className="stat-label">Routes • Page {page}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">📍</div>
              <div className="stat-value">{data.nodes.length}</div>
              <div className="stat-label">Stops • Page {page}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon amber">📄</div>
              <div className="stat-value">{page}</div>
              <div className="stat-label">Current Page</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon purple">🐘</div>
              <div className="stat-value text-lg">PostgreSQL</div>
              <div className="stat-label">+ PostGIS</div>
            </div>
          </div>

          {/* Routes Table */}
          <div className="card mb-8">
            <div className="card-header">
              <div>
                <div className="card-title">Transit Routes</div>
                <div className="card-subtitle">All corridors in the database</div>
              </div>
              <span className="badge badge-blue">{data.routes.length} records</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {data.routes.length === 0 ? (
                    <tr>
                      <td colSpan={4}>
                        <div className="empty-state">
                          <div className="empty-state-icon">🗺️</div>
                          <div className="empty-state-desc">No routes on this page</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.routes.map((r) => {
                      const color = getRouteColor(r.id);
                      return (
                        <tr key={r.id}>
                          <td>
                            <span className="badge" style={{ background: color + "18", color }}>#{r.id}</span>
                          </td>
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
                              <span className="td-primary">{r.name}</span>
                            </div>
                          </td>
                          <td className="text-muted-foreground">
                            {r.description ?? "—"}
                          </td>
                          <td className="td-mono text-sm">
                            {new Date(r.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Nodes Table */}
          <div className="card mb-8">
            <div className="card-header">
              <div>
                <div className="card-title">Stops &amp; Nodes</div>
                <div className="card-subtitle">All geographic points</div>
              </div>
              <span className="badge badge-green">{data.nodes.length} records</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Label</th>
                    <th>Stop Name</th>
                    <th>Route</th>
                    <th>Order</th>
                    <th>Coordinates</th>
                  </tr>
                </thead>
                <tbody>
                  {data.nodes.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="empty-state">
                          <div className="empty-state-icon">📍</div>
                          <div className="empty-state-desc">No stops on this page</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.nodes.map((n) => {
                      const color = getRouteColor(n.routeId);
                      return (
                        <tr key={n.id}>
                          <td className="td-mono text-muted-foreground">#{n.id}</td>
                          <td>
                            <span
                              className="badge font-mono text-xs"
                              style={{ background: color + "18", color }}
                            >
                              {n.label}
                            </span>
                          </td>
                          <td className="td-primary">{n.name}</td>
                          <td>
                            <span className="badge" style={{ background: color + "18", color }}>
                              #{n.routeId}
                            </span>
                          </td>
                          <td>
                            <span className="badge badge-gray">{n.orderNum}</span>
                          </td>
                          <td className="td-mono text-xs">
                            {n.lat.toFixed(5)}, {n.long.toFixed(5)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between bg-card border border-border px-6 py-4 rounded-2xl">
            <div className="text-sm text-muted-foreground">
              Showing page <span className="font-semibold text-foreground">{page}</span> • {limit} per page
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn btn-secondary btn-sm disabled:opacity-50"
              >
                ← Previous
              </button>

              <span className="px-5 py-2 text-sm font-semibold bg-accent rounded-xl">
                {page}
              </span>

              <button
                onClick={() => setPage(p => p + 1)}
                disabled={data.routes.length < limit && data.nodes.length < limit}
                className="btn btn-secondary btn-sm disabled:opacity-50"
              >
                Next →
              </button>

              <button
                onClick={handleRefresh}
                className="btn btn-ghost btn-sm"
              >
                ↻
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}