/** Mission, principles, metadata, and evidence boundaries for the company surface. */

import type { Metadata } from "next";

export const metadata: Metadata = { title: "About", description: "Why Tsela is building a community-checked map of Gaborone's combi network.", alternates: { canonical: "/company" } };
export default function CompanyPage() {
  return (
    <>
      <section className="inner-hero"><p className="section-number">ABOUT TSELA</p><h1>A combi map<br />built from local truth.</h1><p>In Gaborone, useful routes exist—but the knowledge often lives in conversations, habits, and handwritten lists. Tsela makes that shared intelligence visible without pretending informal transit is a fixed timetable.</p></section>
      <section className="principles company-principles">
        <div className="principle-lead"><p className="section-number">HOW WE BUILD</p><h2>Not a timetable<br />with a new logo.</h2></div>
        <div className="principle-list">
          <div><span>Flexible</span><p>Routes, request stops, and local landmarks—not imaginary precision.</p></div>
          <div><span>Trustworthy</span><p>Evidence, freshness, confidence, and review states on community data.</p></div>
          <div><span>Reachable</span><p>Map-first on the web, with a path toward low-data, SMS, and USSD access.</p></div>
        </div>
      </section>
      <section className="roadmap-band"><p className="section-number">BUILT FIRST FOR GABORONE</p><h2>The network grows from verified local knowledge, not imported assumptions.</h2><p>Every expansion should make the map more honest, useful, and accountable to the people who use it.</p></section>
    </>
  );
}
