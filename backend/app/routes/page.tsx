"use client";
// PLACE AT: app/routes/page.tsx
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { apiClient, Route } from "@/lib/api-client";

const ROUTE_COLORS = ["#ef4444","#f97316","#eab308","#22c55e","#06b6d4","#8b5cf6","#ec4899","#14b8a6"];

function getRouteColor(id: number) {
  return ROUTE_COLORS[id % ROUTE_COLORS.length];
}

export default function RoutesPage() {
  const [routes, setRoutes]       = useState<Route[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");
  const [name, setName]           = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting]   = useState(false);

  const loadRoutes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setRoutes(await apiClient.routes.list());
    } catch (e: any) {
      setError(e.message ?? "Failed to load routes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRoutes(); }, [loadRoutes]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setSubmitting(true);
      setError("");
      await apiClient.routes.create({ name: name.trim(), description: description.trim() || undefined });
      setSuccess("Route created successfully!");
      setName("");
      setDescription("");
      await loadRoutes();
      setTimeout(() => setSuccess(""), 4000);
    } catch (e: any) {
      setError(e.message ?? "Failed to create route");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <span className="page-eyebrow">🗺️ Route Management</span>
        <h1 className="page-title">Transit Routes</h1>
        <p className="page-subtitle">View and manage all transit corridors in the network.</p>
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>

        {/* ── Route List ── */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>
              All Routes
            </div>
            <span className="badge badge-blue">{routes.length} routes</span>
          </div>

          {loading && (
            <div className="loading-row">
              <div className="spinner" />
              Loading routes…
            </div>
          )}

          {!loading && error && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              {error}
            </div>
          )}

          {!loading && routes.length === 0 && !error && (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">🗺️</div>
                <div className="empty-state-title">No routes yet</div>
                <div className="empty-state-desc">Create your first transit route using the form →</div>
              </div>
            </div>
          )}

          {routes.map((r) => {
            const color = getRouteColor(r.id);
            return (
              <Link key={r.id} href={`/routes/${r.id}`} className="route-card">
                <div className="route-color-bar" style={{ background: color }} />
                <div className="route-card-body">
                  <div className="route-card-name">{r.name}</div>
                  <div className="route-card-meta">
                    {r.description ?? "No description"} · Created {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>
                <span className="badge" style={{ background: color + "18", color }}>
                  #{r.id}
                </span>
                <span className="route-card-arrow">›</span>
              </Link>
            );
          })}
        </div>

        {/* ── Create Form ── */}
        <div className="card">
          <div className="card-header" style={{ marginBottom: 20 }}>
            <div>
              <div className="card-title">Create New Route</div>
              <div className="card-subtitle">Add a new corridor to the network</div>
            </div>
            <span style={{ fontSize: 28 }}>➕</span>
          </div>

          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success">
              <span className="alert-icon">✅</span>
              {success}
            </div>
          )}

          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Route Name *</label>
              <input
                id="name"
                className="form-input"
                type="text"
                placeholder="e.g. North–South Corridor"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="desc">Description <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span></label>
              <textarea
                id="desc"
                className="form-textarea"
                placeholder="Brief description of this route…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={submitting || !name.trim()}
            >
              {submitting
                ? <><div className="spinner spinner-sm" style={{ borderTopColor: "#fff", borderColor: "rgba(255,255,255,0.3)" }} /> Creating…</>
                : "Create Route"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}