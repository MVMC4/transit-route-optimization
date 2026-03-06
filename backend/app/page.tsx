"use client";

import Link from "next/link";

const ROUTE_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#8b5cf6"];

const modules = [
  {
    href: "/routes",
    emoji: "🗺️",
    title: "Route Management",
    desc: "Create routes, add stops, and manage your transit network.",
    color: "#3b6bff",
    colorBg: "#ebefff",
    badge: "CRUD",
  },
  {
    href: "/pathfind",
    emoji: "🧭",
    title: "Pathfinder",
    desc: "Enter origin & destination coordinates to find the fastest route.",
    color: "#22c55e",
    colorBg: "#f0fdf4",
    badge: "LIVE",
  },
  {
    href: "/dashboard",
    emoji: "📊",
    title: "Admin Dashboard",
    desc: "Browse all routes and nodes stored in the database.",
    color: "#f59e0b",
    colorBg: "#fffbeb",
    badge: "READ",
  },
];

const apiEndpoints = [
  ["GET", "/api/routes", "List all routes", "/routes"],
  ["POST", "/api/routes", "Create a new route", "/routes"],
  ["GET", "/api/routes/[routeId]", "Get single route", "/routes/[id]"],
  ["GET", "/api/routes/[routeId]/nodes", "List stops for a route", "/routes/[id]"],
  ["POST", "/api/routes/[routeId]/nodes", "Add a stop to a route", "/routes/[id]"],
  ["POST", "/api/pathfind", "Compute optimal transit path", "/pathfind"],
  ["GET", "/dashboard/db", "Database overview (paginated)", "/dashboard"],
];

export default function HomePage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <span className="page-eyebrow">🚌 Transit Optimization System</span>
        <h1 className="page-title">Welcome to TransitOS</h1>
        <p className="page-subtitle">
          Manage transit routes, configure stops, and simulate pathfinding — all from one place.
        </p>
      </div>

      {/* Module cards */}
      <div className="grid-3" style={{ marginBottom: 40 }}>
        {modules.map((m) => (
          <Link key={m.href} href={m.href} style={{ textDecoration: "none" }}>
            <div
              className="card"
              style={{
                height: "100%",
                cursor: "pointer",
                transition: "all 0.18s",
                borderTop: `3px solid ${m.color}`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "translateY(-2px)";
                el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "";
                el.style.boxShadow = "";
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: m.colorBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                  }}
                >
                  {m.emoji}
                </div>

                <span
                  className="badge"
                  style={{
                    background: m.colorBg,
                    color: m.color,
                    fontSize: "0.68rem",
                  }}
                >
                  {m.badge}
                </span>
              </div>

              <div
                style={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "var(--text-primary)",
                  marginBottom: 6,
                }}
              >
                {m.title}
              </div>

              <p
                style={{
                  fontSize: "0.83rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.65,
                }}
              >
                {m.desc}
              </p>

              <div
                style={{
                  marginTop: 16,
                  fontSize: "0.82rem",
                  color: m.color,
                  fontWeight: 600,
                }}
              >
                Open →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* API Reference */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">API Endpoints</div>
            <div className="card-subtitle">
              All backend routes consumed by this frontend
            </div>
          </div>
          <span className="badge badge-gray">{apiEndpoints.length} endpoints</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Method</th>
                <th>Endpoint</th>
                <th>Description</th>
                <th>Page</th>
              </tr>
            </thead>
            <tbody>
              {apiEndpoints.map(([method, path, desc, page]) => {
                // Check if page contains dynamic segments like [id]
                const isDynamic = page.includes("[");

                return (
                  <tr key={path}>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background: method === "GET" ? "#ebefff" : "#f0fdf4",
                          color: method === "GET" ? "#3b6bff" : "#16a34a",
                        }}
                      >
                        {method}
                      </span>
                    </td>

                    <td className="td-mono td-primary">{path}</td>

                    <td>{desc}</td>

                    <td>
                      {isDynamic ? (
                        /* Render static text if dynamic, as Next.js won't resolve [id] in Link */
                        <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                          {page}
                        </span>
                      ) : (
                        <Link
                          href={page}
                          style={{
                            color: "var(--blue)",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                          }}
                        >
                          {page}
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}