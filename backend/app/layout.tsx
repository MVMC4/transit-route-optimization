// app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "TransitOS",
  description: "Transit Route Optimization System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <nav className="sidebar">
            <div className="sidebar-brand">
              <div className="brand-logo">🚌</div>
              <div>
                <div className="brand-name">TransitOS</div>
                <div className="brand-version">Route Optimizer</div>
              </div>
            </div>

            <div className="nav-section">
              <div className="nav-section-label">Navigation</div>
              <ul className="nav-links">
                <li>
                  <Link href="/" className="nav-link">
                    <span className="nav-icon">🏠</span>
                    <span>Overview</span>
                  </Link>
                </li>
                <li>
                  <Link href="/routes" className="nav-link">
                    <span className="nav-icon">🗺️</span>
                    <span>Routes</span>
                  </Link>
                </li>
                <li>
                  <Link href="/pathfind" className="nav-link">
                    <span className="nav-icon">🧭</span>
                    <span>Pathfinder</span>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="nav-link">
                    <span className="nav-icon">📊</span>
                    <span>Dashboard</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="sidebar-footer">
              <div className="status-pip" />
              <span className="status-text">System online</span>
            </div>
          </nav>

          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}