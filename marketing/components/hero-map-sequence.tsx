/** Lightweight product hero that explains Tsela without loading a browser map. */

import { RIDER_URL } from "../lib/urls";
import { RouteNetworkIllustration } from "./route-network-illustration";

export function HeroMapSequence() {
  return (
    <section className="platform-hero" aria-labelledby="platform-hero-title">
      <div className="platform-hero-copy">
        <p className="eyebrow"><span /> Built with Gaborone, route by route</p>
        <h1 id="platform-hero-title">Know which combi gets you there.</h1>
        <p className="platform-hero-summary">
          Choose where you are and where you&apos;re going. Tsela compares the route,
          boarding point, transfers, and the right stop.
        </p>
        <div className="platform-hero-actions">
          <a className="button button-primary" href={RIDER_URL}>Plan my trip <span>→</span></a>
          <a className="text-link" href="#start-here">Explore the platform <span>↓</span></a>
        </div>
        <dl className="platform-hero-proof" aria-label="Product capabilities">
          <div><dt>Road aligned</dt><dd>Routes follow streets</dd></div>
          <div><dt>Local first</dt><dd>Built for Gaborone</dd></div>
          <div><dt>One clear answer</dt><dd>Start to right stop</dd></div>
        </dl>
      </div>
      <div className="platform-hero-visual"><RouteNetworkIllustration /></div>
    </section>
  );
}
