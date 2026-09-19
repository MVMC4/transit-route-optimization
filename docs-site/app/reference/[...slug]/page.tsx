/** Human-readable endpoint reference pages generated from the shared API catalog. */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";
import { CopyButton } from "../../../components/copy-button";
import { FumadocsShell } from "../../../components/fumadocs-shell";
import { findGuide, PRODUCTION_GUIDES } from "../../../lib/guides";
import { API_URL } from "../../../lib/urls";
import { findEndpoint, REFERENCE_ENDPOINTS } from "../../../lib/reference";

type PageProps = { params: Promise<{ slug: string[] }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...REFERENCE_ENDPOINTS.map((endpoint) => ({ slug: endpoint.slug.split("/") })),
    ...PRODUCTION_GUIDES.map((guide) => ({ slug: guide.slug.split("/") })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = (await params).slug;
  const entry = findEndpoint(slug) ?? findGuide(slug);
  return entry ? { title: `${entry.title} | Tsela Developers` } : {};
}

export default async function ReferencePage({ params }: PageProps) {
  const slug = (await params).slug;
  const guide = findGuide(slug);
  if (guide) {
    const toc = guide.sections.map((section) => ({
      title: section.title,
      url: `#${section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      depth: 2,
    }));
    return <FumadocsShell><DocsPage toc={toc}><DocsTitle>{guide.title}</DocsTitle><DocsDescription>{guide.description}</DocsDescription><DocsBody className="reference-body production-guide">
      <div className={`guide-status ${guide.status === "Implemented" ? "implemented" : guide.status === "Mixed" ? "mixed" : "required"}`}><span>{guide.status}</span><p>Read this status literally: planned infrastructure is not presented as already deployed.</p></div>
      {guide.sections.map((section) => {
        const id = section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        return <section className="reference-section" key={section.title}><h2 id={id}>{section.title}</h2>{section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul className="reference-notes">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}{section.code && <div className="reference-code"><div><span>OPERATIONS MODEL</span><CopyButton value={section.code} /></div><pre><code>{section.code}</code></pre></div>}</section>;
      })}
    </DocsBody></DocsPage></FumadocsShell>;
  }
  const endpoint = findEndpoint(slug);
  if (!endpoint) notFound();
  const sampleUrl = endpoint.path.replace("{routeId}", "3").replace("{keyId}", "8");
  const authHeader = endpoint.authentication === "API key" ? '-H "X-API-Key: $TSELA_API_KEY"' : '-H "Authorization: Bearer $TSELA_SESSION"';
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
    <div className="endpoint-signature"><span className="method">{endpoint.method}</span><code>{endpoint.path}</code><CopyButton value={`${API_URL}${endpoint.path}`} /></div>
    <section className="reference-section"><h2 id="authentication">Authentication</h2><div className="auth-requirement protected"><span>REQUIRED</span><p>{endpoint.authentication === "API key" ? "Send your credential in the X-API-Key header. Query-string credentials are not accepted." : "Send the session token returned by developer login as a Bearer token."}</p></div></section>
    <section className="reference-section"><h2 id="parameters">Parameters</h2>{endpoint.parameters.length ? <div className="parameter-table">{endpoint.parameters.map((parameter) => <div className="parameter-row" key={parameter.name}><div><code>{parameter.name}</code><small>{parameter.location}</small></div><div><span>{parameter.type}</span>{parameter.required && <b>required</b>}</div><p>{parameter.description}</p></div>)}</div> : <p className="reference-muted">This endpoint has no parameters.</p>}</section>
    {endpoint.requestBody && <section className="reference-section"><h2 id="request-body">Request body</h2><div className="reference-code"><div><span>JSON</span><CopyButton value={endpoint.requestBody} /></div><pre><code>{endpoint.requestBody}</code></pre></div></section>}
    <section className="reference-section"><h2 id="example-request">Example request</h2><div className="reference-code"><div><span>cURL</span><CopyButton value={command} /></div><pre><code>{command}</code></pre></div></section>
    <section className="reference-section"><h2 id="response">Response</h2><div className="response-label"><span>200</span><p>Successful response</p></div><div className="reference-code light"><div><span>application/json</span><CopyButton value={endpoint.response} /></div><pre><code>{endpoint.response}</code></pre></div></section>
    <section className="reference-section"><h2 id="notes">Notes</h2><ul className="reference-notes">{endpoint.notes.map((note) => <li key={note}>{note}</li>)}</ul></section>
  </DocsBody></DocsPage></FumadocsShell>;
}
