/** Cross-surface marketing footer and local development portal links. */

import Link from "next/link";
import { BrandMark } from "./brand-mark";
import { DOCS_URL, OPS_URL, RIDER_URL } from "../lib/urls";

export function SiteFooter() {
  return (
    <footer>
      <Link className="brand footer-brand" href="/"><BrandMark /></Link>
      <p>Know which combi gets you there.</p>
      <div>
        <Link href="/journal">Blog</Link>
        <Link href="/brand">Brand</Link>
        <a href={RIDER_URL}>Rider</a>
        <a href={OPS_URL}>Operations</a>
        <a href={DOCS_URL}>API docs</a>
      </div>
    </footer>
  );
}
