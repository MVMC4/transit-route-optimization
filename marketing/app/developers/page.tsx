/** Developer product metadata, overview, and access entry point. */

import type { Metadata } from "next";
import { AccessModal } from "../../components/access-modal";
import { DOCS_URL } from "../../lib/urls";

const capabilities = ["List published routes", "Fetch road-aligned geometry", "Search corridors around a place", "Plan an origin-to-destination journey"];

export const metadata: Metadata = { title: "Developers", description: "Build with the Tsela Gaborone transit API: routes, road geometry, nearby corridors, and trip planning.", alternates: { canonical: "/developers" } };

export default function DevelopersPage() {
  return (
    <>
      <section className="inner-hero developer-hero">
        <div><p className="section-number">TSELA FOR DEVELOPERS</p><h1>Build on local<br />movement.</h1><p>A small, readable API for maps, community tools, low-data channels, and the next Botswana mobility product.</p><div className="hero-actions"><AccessModal /><a className="text-link" href={DOCS_URL}>Read documentation ↗</a></div></div>
        <div className="api-sample"><span>GET /api/routes/1/geometry</span><pre>{`{
  "roadAligned": true,
  "source": "osrm",
  "coordinates": [ ... ]
}`}</pre></div>
      </section>
      <section className="developer-capabilities">
        <div><p className="section-number">THE CURRENT CONTRACT</p><h2>Useful today.<br />Explicit about tomorrow.</h2></div>
        <ol>{capabilities.map((capability, index) => <li key={capability}><span>0{index + 1}</span>{capability}</li>)}</ol>
      </section>
      <section className="access-band"><div><p className="section-number">ACCESS STATUS</p><h2>Real keys. Visible usage.</h2></div><p>Local requests remain open. Developer accounts can now issue hashed credentials for protected v1 routes and track every request against a monthly quota.</p><a href={`${DOCS_URL}/login`}>Sign in for API access ↗</a></section>
    </>
  );
}
