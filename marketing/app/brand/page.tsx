/** Public identity reference with downloadable Tsela logo and icon usage guidance. */

import type { Metadata } from "next";
import { BrandMark } from "../../components/brand-mark";

export const metadata: Metadata = { title: "Brand and icons", description: "The working Tsela name, route-loop logo, app icon, and public colour system.", alternates: { canonical: "/brand" } };

export default function BrandPage() {
  return <>
    <section className="inner-hero brand-hero"><p className="section-number">IDENTITY / WORKING DIRECTION</p><h1>A name that feels<br />like a way forward.</h1><p>Tsela means path, road, or way in Setswana. The public identity is warm and direct; TransitOS remains only the internal platform name while local-language, domain, and trademark validation continues.</p></section>
    <section className="brand-showcase"><article className="brand-lockup-card"><span>PRIMARY LOCKUP</span><BrandMark /><a href="/brand/tsela-mark.svg" download>Download SVG ↘</a></article><article className="brand-icon-card"><span>APP ICON</span><BrandMark compact /><p>The route loops from a starting point to a destination. It stays legible at favicon and home-screen size.</p></article></section>
      <section className="brand-colors"><div><p className="section-number">COLOUR SYSTEM</p><h2>Bright enough to guide.<br />Calm enough to trust.</h2></div><div className="swatches"><span className="swatch blue"><b>Primary blue</b>#3157FF</span><span className="swatch lime"><b>Go lime</b>#C8FF3D</span><span className="swatch cream"><b>Paper</b>#FFFAF0</span><span className="swatch red"><b>Signal red</b>#FF4F3D</span></div></section>
    <section className="brand-caution"><strong>Working identity—not legal clearance.</strong><p>Before public launch, complete Botswana and regional trademark searches, domain and handle checks, and pronunciation testing with Setswana-speaking riders.</p></section>
  </>;
}
