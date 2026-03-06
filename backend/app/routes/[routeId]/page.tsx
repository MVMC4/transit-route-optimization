"use client";
// PLACE AT: app/routes/[routeId]/page.tsx
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiClient, Route, Node } from "@/lib/api-client";

const ROUTE_COLORS = ["#ef4444","#f97316","#eab308","#22c55e","#06b6d4","#8b5cf6","#ec4899","#14b8a6"];
const getRouteColor = (id: number) => ROUTE_COLORS[id % ROUTE_COLORS.length];

interface EditState {
  name: string;
  lat: string;
  long: string;
  orderNum: string;
}

export default function RouteDetailPage() {
  const params = useParams();
  const routeId = Number(params.routeId);

  const [route, setRoute]           = useState<Route | null>(null);
  const [nodes, setNodes]           = useState<Node[]>([]);
  const [loadingRoute, setLoadingRoute] = useState(true);
  const [loadingNodes, setLoadingNodes] = useState(true);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");

  // Add stop form
  const [nodeName, setNodeName]     = useState("");
  const [lat, setLat]               = useState("");
  const [long, setLong]             = useState("");
  const [orderNum, setOrderNum]     = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit state
  const [editingId, setEditingId]   = useState<number | null>(null);
  const [editState, setEditState]   = useState<EditState>({ name: "", lat: "", long: "", orderNum: "" });
  const [saving, setSaving]         = useState(false);

  // Delete state
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const loadRoute = useCallback(async () => {
    try { setRoute(await apiClient.routes.get(routeId)); }
    catch { setError("Route not found."); }
    finally { setLoadingRoute(false); }
  }, [routeId]);

  const loadNodes = useCallback(async () => {
    try { setNodes(await apiClient.nodes.list(routeId)); }
    catch { setError("Failed to load stops."); }
    finally { setLoadingNodes(false); }
  }, [routeId]);

  useEffect(() => { loadRoute(); loadNodes(); }, [loadRoute, loadNodes]);

  function flashSuccess(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 4000);
  }

  // ── Add stop ──────────────────────────────────────────────────────────────
  async function handleAddNode(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      await apiClient.nodes.create(routeId, {
        name: nodeName.trim(),
        lat: parseFloat(lat),
        long: parseFloat(long),
        orderNum: parseInt(orderNum),
      });
      flashSuccess("Stop added!");
      setNodeName(""); setLat(""); setLong(""); setOrderNum("");
      await loadNodes();
    } catch (e: any) {
      setError(e.message ?? "Failed to add stop.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Start editing ─────────────────────────────────────────────────────────
  function startEdit(node: Node) {
    setEditingId(node.id);
    setConfirmDeleteId(null);
    setEditState({
      name: node.name,
      lat: String(node.lat),
      long: String(node.long),
      orderNum: String(node.orderNum),
    });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  // ── Save edit ─────────────────────────────────────────────────────────────
  async function handleSaveEdit(nodeId: number) {
    try {
      setSaving(true);
      setError("");
      await apiClient.nodes.update(routeId, nodeId, {
        name: editState.name.trim(),
        lat: parseFloat(editState.lat),
        long: parseFloat(editState.long),
        orderNum: parseInt(editState.orderNum),
      });
      flashSuccess("Stop updated!");
      setEditingId(null);
      await loadNodes();
    } catch (e: any) {
      setError(e.message ?? "Failed to update stop.");
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function handleDelete(nodeId: number) {
    try {
      setDeletingId(nodeId);
      setError("");
      await apiClient.nodes.delete(routeId, nodeId);
      flashSuccess("Stop deleted.");
      setConfirmDeleteId(null);
      await loadNodes();
    } catch (e: any) {
      setError(e.message ?? "Failed to delete stop.");
    } finally {
      setDeletingId(null);
    }
  }

  const color = getRouteColor(routeId);

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link href="/routes">Routes</Link>
        <span className="breadcrumb-sep">›</span>
        <span>{loadingRoute ? "…" : (route?.name ?? "Unknown")}</span>
      </div>

      {/* Header */}
      <div className="page-header" style={{ borderLeft: `4px solid ${color}`, paddingLeft: 16 }}>
        <span className="page-eyebrow" style={{ background: color + "18", color }}>
          Route #{routeId}
        </span>
        <h1 className="page-title">{loadingRoute ? "Loading…" : (route?.name ?? "Not Found")}</h1>
        {route?.description && <p className="page-subtitle">{route.description}</p>}
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Stats */}
      {!loadingRoute && route && (
        <div className="grid-3" style={{ marginBottom: 28 }}>
          <div className="stat-card">
            <div className="stat-icon blue">🆔</div>
            <div className="stat-value">#{route.id}</div>
            <div className="stat-label">Route ID</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">📍</div>
            <div className="stat-value">{loadingNodes ? "…" : nodes.length}</div>
            <div className="stat-label">Total Stops</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon amber">📅</div>
            <div className="stat-value" style={{ fontSize: "1.15rem" }}>
              {new Date(route.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
            <div className="stat-label">Created</div>
          </div>
        </div>
      )}

      <div className="grid-2" style={{ alignItems: "start" }}>

        {/* ── Stop List ── */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Stops</div>
              <div className="card-subtitle">Ordered stop sequence for this route</div>
            </div>
            {!loadingNodes && (
              <span className="badge" style={{ background: color + "18", color }}>
                {nodes.length} stops
              </span>
            )}
          </div>

          {loadingNodes && (
            <div className="loading-row">
              <div className="spinner" /> Loading stops…
            </div>
          )}

          {!loadingNodes && nodes.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">📍</div>
              <div className="empty-state-title">No stops yet</div>
              <div className="empty-state-desc">Add the first stop to this route using the form</div>
            </div>
          )}

          {success && (
            <div className="alert alert-success" style={{ marginBottom: 12 }}>
              <span className="alert-icon">✅</span>
              {success}
            </div>
          )}

          <div className="stop-list">
            {nodes.map((n, i) => {
              const isFirst   = i === 0;
              const isLast    = i === nodes.length - 1;
              const isEditing = editingId === n.id;
              const isDeleting = deletingId === n.id;
              const isConfirmingDelete = confirmDeleteId === n.id;

              return (
                <div key={n.id} className="stop-item" style={{ flexDirection: "column", gap: 0, padding: 0 }}>
                  {/* Top row: connector + content + actions */}
                  <div style={{ display: "flex", alignItems: "flex-start", padding: "12px 14px", gap: 0 }}>
                    {/* Connector */}
                    <div className="stop-connector">
                      <div
                        className={`stop-dot ${isFirst ? "first" : isLast ? "last" : "middle"}`}
                        style={!isFirst && !isLast ? { background: color, borderColor: color } : {}}
                      />
                      {!isLast && <div className="stop-line" />}
                    </div>

                    {/* Body */}
                    <div className="stop-body" style={{ flex: 1 }}>
                      {isEditing ? (
                        /* ── Inline edit form ── */
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <input
                            className="form-input"
                            style={{ fontSize: "0.82rem", padding: "5px 9px" }}
                            placeholder="Stop name"
                            value={editState.name}
                            onChange={(e) => setEditState((s) => ({ ...s, name: e.target.value }))}
                          />
                          <div style={{ display: "flex", gap: 6 }}>
                            <input
                              className="form-input"
                              style={{ fontSize: "0.78rem", padding: "5px 9px", flex: 1 }}
                              type="number"
                              step="any"
                              placeholder="Latitude"
                              value={editState.lat}
                              onChange={(e) => setEditState((s) => ({ ...s, lat: e.target.value }))}
                            />
                            <input
                              className="form-input"
                              style={{ fontSize: "0.78rem", padding: "5px 9px", flex: 1 }}
                              type="number"
                              step="any"
                              placeholder="Longitude"
                              value={editState.long}
                              onChange={(e) => setEditState((s) => ({ ...s, long: e.target.value }))}
                            />
                            <input
                              className="form-input"
                              style={{ fontSize: "0.78rem", padding: "5px 9px", width: 64 }}
                              type="number"
                              min="1"
                              placeholder="Order"
                              value={editState.orderNum}
                              onChange={(e) => setEditState((s) => ({ ...s, orderNum: e.target.value }))}
                            />
                          </div>
                          <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
                            <button
                              className="btn btn-primary"
                              style={{ fontSize: "0.78rem", padding: "5px 14px" }}
                              disabled={saving || !editState.name.trim()}
                              onClick={() => handleSaveEdit(n.id)}
                            >
                              {saving ? "Saving…" : "Save"}
                            </button>
                            <button
                              className="btn"
                              style={{ fontSize: "0.78rem", padding: "5px 14px", background: "var(--surface-1)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                              onClick={cancelEdit}
                              disabled={saving}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div className="stop-name">{n.name}</div>
                            {isFirst && <span className="badge badge-green" style={{ fontSize: "0.65rem" }}>Start</span>}
                            {isLast  && <span className="badge badge-red"   style={{ fontSize: "0.65rem" }}>End</span>}
                          </div>
                          <div className="stop-coords">{n.lat.toFixed(5)}, {n.long.toFixed(5)}</div>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>{n.label}</div>
                        </>
                      )}
                    </div>

                    {/* Right side: order badge + actions */}
                    {!isEditing && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8, flexShrink: 0 }}>
                        <span className="badge badge-gray">#{n.orderNum}</span>
                        <button
                          title="Edit stop"
                          onClick={() => startEdit(n)}
                          style={{
                            background: "none",
                            border: "1px solid var(--border)",
                            borderRadius: "var(--radius-sm)",
                            padding: "3px 7px",
                            cursor: "pointer",
                            color: "var(--text-muted)",
                            fontSize: "0.78rem",
                            lineHeight: 1,
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-1)"; (e.currentTarget as HTMLButtonElement).style.color = color; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
                        >
                          ✏️
                        </button>
                        <button
                          title="Delete stop"
                          disabled={isDeleting}
                          onClick={() => setConfirmDeleteId(isConfirmingDelete ? null : n.id)}
                          style={{
                            background: isConfirmingDelete ? "#fee2e2" : "none",
                            border: `1px solid ${isConfirmingDelete ? "#fca5a5" : "var(--border)"}`,
                            borderRadius: "var(--radius-sm)",
                            padding: "3px 7px",
                            cursor: "pointer",
                            color: isConfirmingDelete ? "#ef4444" : "var(--text-muted)",
                            fontSize: "0.78rem",
                            lineHeight: 1,
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={(e) => { if (!isConfirmingDelete) { (e.currentTarget as HTMLButtonElement).style.background = "#fee2e2"; (e.currentTarget as HTMLButtonElement).style.color = "#ef4444"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#fca5a5"; } }}
                          onMouseLeave={(e) => { if (!isConfirmingDelete) { (e.currentTarget as HTMLButtonElement).style.background = "none"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; } }}
                        >
                          {isDeleting ? "…" : "🗑️"}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Delete confirmation banner */}
                  {isConfirmingDelete && !isEditing && (
                    <div style={{
                      margin: "0 14px 12px 14px",
                      background: "#fef2f2",
                      border: "1px solid #fca5a5",
                      borderRadius: "var(--radius-sm)",
                      padding: "9px 12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 8,
                    }}>
                      <span style={{ fontSize: "0.8rem", color: "#b91c1c", fontWeight: 500 }}>
                        Delete <strong>{n.name}</strong>? This cannot be undone.
                      </span>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <button
                          className="btn"
                          style={{ fontSize: "0.75rem", padding: "4px 10px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer" }}
                          disabled={isDeleting}
                          onClick={() => handleDelete(n.id)}
                        >
                          {isDeleting ? "Deleting…" : "Yes, delete"}
                        </button>
                        <button
                          className="btn"
                          style={{ fontSize: "0.75rem", padding: "4px 10px", background: "var(--surface-1)", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", cursor: "pointer" }}
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Add Stop Form ── */}
        <div className="card">
          <div className="card-header" style={{ marginBottom: 20 }}>
            <div>
              <div className="card-title">Add a Stop</div>
              <div className="card-subtitle">Append a new node to this route</div>
            </div>
            <span style={{ fontSize: 24 }}>📍</span>
          </div>

          <form onSubmit={handleAddNode}>
            <div className="form-group">
              <label className="form-label">Stop Name *</label>
              <input className="form-input" type="text" placeholder="e.g. Central Station"
                value={nodeName} onChange={(e) => setNodeName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Coordinates *</label>
              <div className="input-group">
                <div>
                  <input className="form-input" type="number" step="any" placeholder="Latitude"
                    value={lat} onChange={(e) => setLat(e.target.value)} required />
                  <div className="form-hint">e.g. 51.5074</div>
                </div>
                <div>
                  <input className="form-input" type="number" step="any" placeholder="Longitude"
                    value={long} onChange={(e) => setLong(e.target.value)} required />
                  <div className="form-hint">e.g. -0.1278</div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Stop Order *</label>
              <input className="form-input" type="number" min="1" placeholder="e.g. 3"
                value={orderNum} onChange={(e) => setOrderNum(e.target.value)} required />
              <div className="form-hint">Position in the route sequence (1 = first stop)</div>
            </div>

            {/* Label preview */}
            {orderNum && (
              <div style={{ background: "var(--surface-0)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)", padding: "10px 14px", marginBottom: 16,
                display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Auto label:</span>
                <span className="td-mono" style={{ fontSize: "0.82rem", color, fontWeight: 600 }}>
                  ROUTE{routeId}-STOP{orderNum}
                </span>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
              {submitting
                ? <><div className="spinner spinner-sm" style={{ borderTopColor: "#fff", borderColor: "rgba(255,255,255,0.3)" }} /> Adding…</>
                : "Add Stop"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}