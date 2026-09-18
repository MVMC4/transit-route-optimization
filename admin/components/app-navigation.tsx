"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type IconName = "overview" | "routes" | "pathfind" | "dashboard" | "docs" | "guide";

const items: Array<{ href: string; label: string; icon: IconName }> = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/routes", label: "Routes", icon: "routes" },
];

function NavIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    overview: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    routes: <><path d="M5 19V8.5a3.5 3.5 0 0 1 7 0v7a3.5 3.5 0 0 0 7 0V5" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="5" r="2" /></>,
    pathfind: <><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="6" r="2.5" /><path d="M8 16 16 8" /><path d="m12 7 4 1 1 4" /></>,
    dashboard: <><path d="M4 13h6V4H4zM14 20h6v-9h-6zM4 20h6v-3H4zM14 7h6V4h-6z" /></>,
    docs: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>,
    guide: <><circle cx="12" cy="12" r="9" /><path d="M9.8 9a2.4 2.4 0 1 1 3.6 2.1c-.9.5-1.4 1-1.4 2.2M12 17h.01" /></>,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function AppNavigation() {
  const pathname = usePathname();

  return (
    <nav className="sidebar" aria-label="Primary navigation">
      <Link href="/dashboard" className="sidebar-brand" aria-label="TransitOS operations dashboard">
        <span className="brand-logo">T</span>
        <span className="brand-name">Operations</span>
      </Link>

      <ul className="nav-links">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`nav-link${isActive(pathname, item.href) ? " active" : ""}`}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
            >
              <span className="nav-icon"><NavIcon name={item.icon} /></span>
              <span className="nav-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <span className="status-pip" />
        <span className="status-text">Gaborone network</span>
        <a href="http://localhost:3002" className="ops-exit">Rider app</a>
        <a href="http://localhost:3003" className="ops-exit">API docs</a>
      </div>
    </nav>
  );
}
