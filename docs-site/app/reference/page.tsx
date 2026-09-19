/** Authenticated documentation overview inside the shared Fumadocs shell. */

import Link from "next/link";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";
import { FumadocsShell } from "../../components/fumadocs-shell";

export default function ReferenceOverview() {
  return (
    <FumadocsShell>
      <DocsPage>
        <DocsTitle>Developer documentation</DocsTitle>
        <DocsDescription>Build against Tsela&apos;s credentialed route API and operate integrations safely.</DocsDescription>
        <DocsBody className="docs-overview">
          <section className="overview-callout">
            <span>START HERE</span>
            <h2>One protected workspace.</h2>
            <p>The reference, production guides, and credential console use the same authenticated Fumadocs shell. Public API requests require an API key; internal rider endpoints are not part of this contract.</p>
          </section>
          <div className="overview-grid">
            <Link href="/reference/routes/list"><small>API REFERENCE</small><strong>Call the route API</strong><span>Credential headers, parameters, examples, and responses.</span></Link>
            <Link href="/console"><small>DEVELOPER CONSOLE</small><strong>Manage credentials</strong><span>Create, rotate, revoke, and inspect API-key usage.</span></Link>
            <Link href="/reference/guides/security-boundaries"><small>SECURITY</small><strong>Understand the boundary</strong><span>Authentication, SSRF, request validation, quotas, and alerts.</span></Link>
            <Link href="/reference/guides/production-architecture"><small>OPERATIONS</small><strong>Prepare production</strong><span>Deployment, tracing, backups, recovery, and launch gates.</span></Link>
          </div>
        </DocsBody>
      </DocsPage>
    </FumadocsShell>
  );
}
