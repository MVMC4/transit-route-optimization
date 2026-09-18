/** Safe, dependency-light renderer for the journal's intentionally limited Markdown subset. */

import type { ReactNode } from "react";

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
    return part;
  });
}

export function MarkdownArticle({ source }: { source: string }) {
  const blocks: ReactNode[] = [];
  const lines = source.split(/\r?\n/);
  for (let index = 0; index < lines.length;) {
    const line = lines[index].trim();
    if (!line) { index += 1; continue; }
    if (line.startsWith("## ")) { blocks.push(<h2 key={index}>{inline(line.slice(3))}</h2>); index += 1; continue; }
    if (line.startsWith("### ")) { blocks.push(<h3 key={index}>{inline(line.slice(4))}</h3>); index += 1; continue; }
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith("- ")) { items.push(lines[index].trim().slice(2)); index += 1; }
      blocks.push(<ul key={`list-${index}`}>{items.map((item) => <li key={item}>{inline(item)}</li>)}</ul>);
      continue;
    }
    const paragraph = [line]; index += 1;
    while (index < lines.length && lines[index].trim() && !/^(## |### |- )/.test(lines[index].trim())) { paragraph.push(lines[index].trim()); index += 1; }
    blocks.push(<p key={`paragraph-${index}`}>{inline(paragraph.join(" "))}</p>);
  }
  return <div className="markdown-body">{blocks}</div>;
}
