"use client";
// PLACE AT: app/pathfind/page.tsx
import { useState } from "react";
import { apiClient, PathfindResult, PathfindNoRoute } from "@/lib/api-client";

function isNoRoute(r: PathfindResult | PathfindNoRoute): r is PathfindNoRoute {
  return "message" in r;
}

export default function PathfindPage() {
  const [originLat, setOriginLat]   = useState("");
  const [originLong, setOriginLong] = useState("");
  const [destLat, setDestLat]       = useState("");
  const [destLong, setDestLong]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [result, setResult]         = useState<PathfindResult | PathfindNoRoute | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true); setError(""); setResult(null);
      setResult(await apiClient.pathfind.find({
        origin:      { lat: parseFloat(originLat),  long: parseFloat(originLong) },
        destination: { lat: parseFloat(destLat),    long: parseFloat(destLong) },
      }));
    } catch (e: any) {
      setError(e.message ?? "Pathfinding failed");
    } finally {
      setLoading(false);
    }
  }

  function fillExample() {
    setOriginLat("51.505"); setOriginLong("-0.09");
    setDestLat("51.515");   setDestLong("-0.1");
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <span className="page-eyebrow">🧭 Route Calculator</span>
        <h1 className="page-title">Pathfinder</h1>
        <p className="page-subtitle">
          Enter origin and destination coordinates to compute the optimal transit path with a time breakdown.
        </p>
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>

        {/* ── Input Panel ── */}
        <div className="card">
          <div className="card-header" style={{ marginBottom: 24 }}>
            <div>
              <div className="card-title">Enter Coordinates</div>
              <div className="card-subtitle">Decimal degrees (WGS84)</div>
            </div>
            <button type="button" className="btn btn-secondary btn-sm" onClick={fillExample}>
              Try example
            </button>
          </div>

          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Origin */}
            <div className="coord-section-label">
              <div className="coord-dot" style={{ background: "#22c55e" }} />
              <span className="coord-section-title">Origin</span>
            </div>
            <div className="input-group" style={{ marginBottom: 20 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Latitude</label>
                <input className="form-input" type="number" step="any" placeholder="51.505"
                  value={originLat} onChange={(e) => setOriginLat(e.target.value)} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Longitude</label>
                <input className="form-input" type="number" step="any" placeholder="-0.09"
                  value={originLong} onChange={(e) => setOriginLong(e.target.value)} required />
              </div>
            </div>

            {/* Visual connector */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 2, height: 32, background: "var(--border)", marginLeft: 4 }} />
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>transit path</span>
            </div>

            {/* Destination */}
            <div className="coord-section-label">
              <div className="coord-dot" style={{ background: "#ef4444" }} />
              <span className="coord-section-title">Destination</span>
            </div>
            <div className="input-group" style={{ marginBottom: 24 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Latitude</label>
                <input className="form-input" type="number" step="any" placeholder="51.515"
                  value={destLat} onChange={(e) => setDestLat(e.target.value)} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Longitude</label>
                <input className="form-input" type="number" step="any" placeholder="-0.1"
                  value={destLong} onChange={(e) => setDestLong(e.target.value)} required />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading
                ? <><div className="spinner spinner-sm" style={{ borderTopColor: "#fff", borderColor: "rgba(255,255,255,0.3)" }} /> Computing path…</>
                : "🧭 Find Path"}
            </button>
          </form>
        </div>

        {/* ── Result Panel ── */}
        <div>
          {!result && !loading && (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">🧭</div>
                <div className="empty-state-title">No results yet</div>
                <div className="empty-state-desc">Enter coordinates and click Find Path to see the journey details.</div>
              </div>
            </div>
          )}

          {loading && (
            <div className="card">
              <div className="empty-state">
                <div className="spinner spinner-lg" />
                <div className="empty-state-title" style={{ marginTop: 16 }}>Computing…</div>
                <div className="empty-state-desc">Finding the nearest nodes and calculating transit time.</div>
              </div>
            </div>
          )}

          {result && isNoRoute(result) && (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">🚶</div>
                <div className="empty-state-title">No transit route found</div>
                <div className="empty-state-desc">{result.message}</div>
              </div>
              <div className="alert alert-warning" style={{ marginTop: 16, marginBottom: 0 }}>
                <span className="alert-icon">💡</span>
                Try coordinates closer to existing route stops, or add more stops to your routes.
              </div>
            </div>
          )}

          {result && !isNoRoute(result) && (
            <>
              {/* Journey time hero card */}
              <div className="journey-card">
                <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", fontWeight: 600,
                  textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                  Total journey time
                </div>
                <div>
                  <span className="journey-time">{result.totalTimeMinutes}</span>
                  <span className="journey-unit">min</span>
                </div>
                <div className="journey-label">
                  via {result.path.length} stops · {result.path[0]?.name} → {result.path[result.path.length - 1]?.name}
                </div>

                <div className="breakdown-row">
                  <div className="breakdown-pill">
                    <div style={{ fontSize: "1.5rem", marginBottom: 4 }}>🚶</div>
                    <div className="breakdown-pill-val">{result.breakdown.walking}<span style={{ fontSize: "0.85rem" }}>m</span></div>
                    <div className="breakdown-pill-label">Walking</div>
                  </div>
                  <div className="breakdown-pill">
                    <div style={{ fontSize: "1.5rem", marginBottom: 4 }}>🚌</div>
                    <div className="breakdown-pill-val">{result.breakdown.bus}<span style={{ fontSize: "0.85rem" }}>m</span></div>
                    <div className="breakdown-pill-label">On Bus</div>
                  </div>
                  <div className="breakdown-pill">
                    <div style={{ fontSize: "1.5rem", marginBottom: 4 }}>⏳</div>
                    <div className="breakdown-pill-val">{result.breakdown.waiting}<span style={{ fontSize: "0.85rem" }}>m</span></div>
                    <div className="breakdown-pill-label">Waiting</div>
                  </div>
                </div>
              </div>

              {/* Stop sequence */}
              <div className="card">
                <div className="card-header">
                  <div>
                    <div className="card-title">Route Segment</div>
                    <div className="card-subtitle">Stops along your journey</div>
                  </div>
                  <span className="badge badge-blue">{result.path.length} stops</span>
                </div>

                <div className="stop-list">
                  {result.path.map((node, i) => {
                    const isFirst = i === 0;
                    const isLast  = i === result.path.length - 1;
                    return (
                      <div key={node.id} className="stop-item">
                        <div className="stop-connector">
                          <div className={`stop-dot ${isFirst ? "first" : isLast ? "last" : "middle"}`} />
                          {!isLast && <div className="stop-line" />}
                        </div>
                        <div className="stop-body">
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div className="stop-name">{node.name}</div>
                            {isFirst && <span className="badge badge-green" style={{ fontSize: "0.65rem" }}>Board</span>}
                            {isLast  && <span className="badge badge-red"   style={{ fontSize: "0.65rem" }}>Alight</span>}
                          </div>
                          <div className="stop-coords">{node.lat.toFixed(5)}, {node.long.toFixed(5)}</div>
                        </div>
                        <span className="badge badge-gray">#{node.orderNum}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}