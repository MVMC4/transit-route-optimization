"use client";

/** Accessible dialog that routes developer prospects to the account console. */

import { useRef } from "react";
import { DOCS_URL } from "../lib/urls";

export function AccessModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button className="button button-dark access-trigger" onClick={() => dialogRef.current?.showModal()}>
        Request API access <span>→</span>
      </button>
      <dialog className="access-dialog" ref={dialogRef} onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current.close();
      }}>
        <button className="dialog-close" aria-label="Close access dialog" onClick={() => dialogRef.current?.close()}>×</button>
        <p className="section-number">DEVELOPER PREVIEW</p>
        <h2>Start with the live contract.</h2>
        <p>Create a developer account to issue a hashed API key, call the protected v1 routes, and see your monthly request usage.</p>
        <div className="dialog-status"><span>Available now</span><strong>Accounts, API keys, quotas, usage</strong></div>
        <div className="dialog-status"><span>Local development</span><strong>Open docs and unkeyed /api routes</strong></div>
        <div className="dialog-actions">
          <a className="button button-dark" href={`${DOCS_URL}/login`}>Sign in for API access <span>↗</span></a>
          <a className="text-link" href={DOCS_URL}>Read the docs</a>
        </div>
      </dialog>
    </>
  );
}
