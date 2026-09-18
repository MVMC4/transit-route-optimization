"use client";

/** Searchable documentation hierarchy with real endpoint-page links. */

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { REFERENCE_ENDPOINTS, REFERENCE_GROUPS } from "../lib/reference";
import { MARKETING_URL } from "../lib/urls";

type DocsShellProps = { active: "docs" | "console"; children: ReactNode };

export function DocsShell({ active, children }: DocsShellProps) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const groups = useMemo(() => REFERENCE_GROUPS.map((label) => ({
    label,
    links: REFERENCE_ENDPOINTS.filter((endpoint) => endpoint.group === label).map((endpoint) => ({ label: endpoint.title, href: `/reference/${endpoint.slug}`, terms: `${endpoint.method} ${endpoint.path} ${endpoint.description}` })),
  })), []);
  const filteredGroups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return groups;
    return groups.map((group) => ({ ...group, links: group.links.filter((link) => `${link.label} ${link.terms}`.toLowerCase().includes(needle)) })).filter((group) => group.links.length);
  }, [groups, query]);

  return <div className="docs-shell">
    <aside className="sidebar">
      <a className="brand" href={MARKETING_URL}><span className="brand-mark">T</span><span>Tsela <small>Developers</small></span></a>
      <label className="search"><span>⌕</span><input aria-label="Search documentation" placeholder="Search endpoints" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
      <nav>
        <p>DEVELOPER HUB</p>
        <Link className={active === "docs" && pathname === "/" ? "active" : ""} href="/">Overview</Link>
        <Link className={active === "console" ? "active" : ""} href="/console">Access console</Link>
        {filteredGroups.map((group) => <div className="docs-nav-group" key={group.label}><p>{group.label.toUpperCase()}</p>{group.links.map((link) => <Link className={pathname === link.href ? "active" : ""} href={link.href} key={link.href}>{link.label}</Link>)}</div>)}
        {query && filteredGroups.length === 0 && <span className="search-empty">No matching endpoint.</span>}
        <p>REFERENCE</p><Link href="/reference/routes/list">Protected endpoint guide</Link>
      </nav>
      <div className="sidebar-foot"><i /> API status available</div>
    </aside>
    <main>
      <header className="topbar"><span>{active === "console" ? "Access console" : pathname === "/" ? "Documentation" : "API reference"}</span><div>{active === "docs" && <Link href="/login">Demo sign in</Link>}<a className="dark-link" href={MARKETING_URL}>Tsela ↗</a></div></header>
      {active === "docs" && <nav className="mobile-docs-nav" aria-label="Documentation sections"><Link href="/">Overview</Link>{REFERENCE_ENDPOINTS.map((endpoint) => <Link key={endpoint.slug} href={`/reference/${endpoint.slug}`}>{endpoint.title}</Link>)}</nav>}
      {children}
    </main>
  </div>;
}
