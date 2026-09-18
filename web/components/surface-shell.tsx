"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function PublicHeader() {
  const pathname = usePathname();
  const links = [
    { href: "/pathfind", label: "Find a route" },
    { href: "/guide", label: "Guide" },
  ];

  return (
    <header className="public-header">
      <Link className="public-brand" href="/" aria-label="TransitOS home">
        <span className="public-brand-mark">T</span>
        <span>TransitOS</span>
      </Link>
      <nav className="public-nav" aria-label="Public site navigation">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname.startsWith(link.href) ? "active" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="public-portals">
        <a href="http://localhost:8000/api/docs">Developers</a>
        <a className="public-ops-link" href="http://localhost:3001/dashboard">Operations</a>
      </div>
    </header>
  );
}

export function SurfaceShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="public-surface">
      <PublicHeader />
      <main className="public-main">{children}</main>
    </div>
  );
}
