/** Public Fumadocs-style developer portal with sign-up, sign-in, and the local preview account. */

import Link from "next/link";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { LoginForm } from "../components/login-form";

export default function DeveloperLanding() {
  return (
    <HomeLayout
      nav={{ title: <span className="fuma-brand"><b>T</b><span>Tsela <small>Developers</small></span></span>, url: "/" }}
      links={[
        { type: "main", text: "API reference", url: "/reference/routes/list" },
        { type: "button", text: "Dashboard", url: "/console" },
      ]}
      className="developer-landing"
    >
      <section className="developer-landing-hero">
        <div className="developer-landing-copy">
          <p className="eyebrow">TSELA DEVELOPER PORTAL</p>
          <h1>Build with the routes people use.</h1>
          <p>Sign in or create a developer account to explore the route API, issue a key, and follow your usage in one place.</p>
          <div className="developer-landing-points">
            <span>Gaborone routes with road aligned geometry</span>
            <span>Clear API examples and request limits</span>
            <span>Protected production, recovery, storage, and auth runbooks</span>
          </div>
        </div>
        <LoginForm />
      </section>

      <section className="developer-portal-paths" aria-label="After sign in">
        <Link href="/reference/routes/list"><span>01 / REFERENCE</span><strong>Browse the API guide</strong><small>Endpoint details, examples, and responses</small></Link>
        <Link href="/console"><span>02 / DASHBOARD</span><strong>Manage your access</strong><small>Keys, limits, and request activity</small></Link>
        <Link href="/reference/guides/production-architecture"><span>03 / OPERATIONS</span><strong>Read the production runbooks</strong><small>Architecture, backup, recovery, uploads, identity, and launch gates</small></Link>
      </section>
    </HomeLayout>
  );
}
