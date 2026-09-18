/** Primary marketing navigation with a direct rider-app action. */

import Link from "next/link";
import { BrandMark } from "./brand-mark";
import { RIDER_URL } from "../lib/urls";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Tsela home"><BrandMark /></Link>
      <nav aria-label="Main navigation">
        <Link href="/services">Product</Link>
        <Link href="/developers">Developers</Link>
        <Link href="/journal">Blog</Link>
        <Link href="/company">About</Link>
      </nav>
      <a className="header-cta" href={RIDER_URL}>Plan a trip <span>↗</span></a>
    </header>
  );
}
