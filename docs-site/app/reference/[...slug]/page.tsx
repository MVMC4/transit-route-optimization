/** Human-readable endpoint reference pages generated from the shared API catalog. */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";
import { CopyButton } from "../../../components/copy-button";
import { FumadocsShell } from "../../../components/fumadocs-shell";
import { API_URL } from "../../../lib/urls";
import { findEndpoint, REFERENCE_ENDPOINTS } from "../../../lib/reference";

type PageProps = { params: Promise<{ slug: string[] }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return REFERENCE_ENDPOINTS.map((endpoint) => ({ slug: endpoint.slug.split("/") }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const endpoint = findEndpoint((await params).slug);
  return endpoint ? { title: `${endpoint.title} | Tsela API` } : {};
}

export default async function ReferencePage({ params }: PageProps) {
  const endpoint = findEndpoint((await params).slug);
  if (!endpoint) notFound();
  const sampleUrl = endpoint.path.replace("{routeId}", "3").concat(endpoint.slug === "routes/nearby" ? "?lat=-24.62896&long=25.94367&radiusMeters=750" : "");
  const authHeader = endpoint.authentication === "API key" ? '-H "X-API-Key: $TSELA_API_KEY"' : endpoint.authentication === "Developer session" ? '-H "Authorization: Bearer $TSELA_SESSION"' : "";
  const body = endpoint.requestBody ? ` -H "Content-Type: application/json" --data '${endpoint.requestBody.replace(/\n/g, "").replace(/\s+/g, " ")}'` : "";
  const command = `curl -X ${endpoint.method} ${authHeader}${body} "${API_URL}${sampleUrl}"`.replace(/\s+/g, " ");

  const toc = [
    { title: "Authentication", url: "#authentication", depth: 2 },
    { title: "Parameters", url: "#parameters", depth: 2 },
    ...(endpoint.requestBody ? [{ title: "Request body", url: "#request-body", depth: 2 }] : []),
    { title: "Example request", url: "#example-request", depth: 2 },
    { title: "Response", url: "#response", depth: 2 },
    { title: "Notes", url: "#notes", depth: 2 },
  ];

  return <FumadocsShell><DocsPage toc={toc}><DocsTitle>{endpoint.title}</DocsTitle><DocsDescription>{endpoint.description}</DocsDescription><DocsBody className="reference-body">
    <div className="endpoint-signature"><span className={endpoint.method === "POST" ? "method post" : "method"}>{endpoint.method}</span><code>{endpoint.path}</code><CopyButton value={`${API_URL}${endpoint.path}`} /></div>
    <section className="reference-section"><h2 id="authentication">Authentication</h2><div className={`auth-requirement ${endpoint.authentication === "None" ? "open" : "protected"}`}><span>{endpoint.authentication === "None" ? "OPEN" : "REQUIRED"}</span><p>{endpoint.authentication === "None" ? "No credential is required for this preview endpoint." : endpoint.authentication === "API key" ? "Send your credential in the X-API-Key header. Query-string credentials are not accepted." : "Send the session token returned by developer login as a Bearer token."}</p></div></section>
    <section className="reference-section"><h2 id="parameters">Parameters</h2>{endpoint.parameters.length ? <div className="parameter-table">{endpoint.parameters.map((parameter) => <div className="parameter-row" key={parameter.name}><div><code>{parameter.name}</code><small>{parameter.location}</small></div><div><span>{parameter.type}</span>{parameter.required && <b>required</b>}</div><p>{parameter.description}</p></div>)}</div> : <p className="reference-muted">This endpoint has no parameters.</p>}</section>
    {endpoint.requestBody && <section className="reference-section"><h2 id="request-body">Request body</h2><div className="reference-code"><div><span>JSON</span><CopyButton value={endpoint.requestBody} /></div><pre><code>{endpoint.requestBody}</code></pre></div></section>}
    <section className="reference-section"><h2 id="example-request">Example request</h2><div className="reference-code"><div><span>cURL</span><CopyButton value={command} /></div><pre><code>{command}</code></pre></div></section>
    <section className="reference-section"><h2 id="response">Response</h2><div className="response-label"><span>200</span><p>Successful response</p></div><div className="reference-code light"><div><span>application/json</span><CopyButton value={endpoint.response} /></div><pre><code>{endpoint.response}</code></pre></div></section>
    <section className="reference-section"><h2 id="notes">Notes</h2><ul className="reference-notes">{endpoint.notes.map((note) => <li key={note}>{note}</li>)}</ul></section>
  </DocsBody></DocsPage></FumadocsShell>;
}
