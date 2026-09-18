"use client";

/** Copies documentation examples and reports the result without leaving the page. */

import { useState } from "react";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return <button className="copy-button" type="button" onClick={copy} aria-live="polite">{copied ? "Copied" : label}</button>;
}
