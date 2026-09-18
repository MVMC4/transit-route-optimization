"use client";

/** Unified rider account entry for profile, bookmarks sync groundwork, and community access. */

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { accountApi, saveAccountToken } from "@/lib/account-api";

export default function AccountLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const result = mode === "login" ? await accountApi.login({ email, password }) : await accountApi.register({ email, password, displayName });
      saveAccountToken(result.token);
      router.replace("/community");
    } catch (requestError: unknown) { setError(requestError instanceof Error ? requestError.message : "Could not continue"); }
    finally { setLoading(false); }
  }

  return <div className="account-page"><section className="account-card"><Link className="account-back" href="/">← Rider home</Link><span className="page-eyebrow">One account</span><h1>{mode === "login" ? "Welcome back." : "Join the community."}</h1><p>Sign in to trace routes, post tips, and build your rider profile.</p><div className="account-tabs"><button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Sign in</button><button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>Create account</button></div><form onSubmit={submit}>{mode === "register" && <label>Display name<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} minLength={2} maxLength={120} required /></label>}<label>Email<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Password<input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} minLength={mode === "register" ? 10 : 1} required /></label>{error && <div className="alert alert-error">{error}</div>}<button className="btn btn-dark" disabled={loading}>{loading ? "Working…" : mode === "login" ? "Sign in →" : "Create account →"}</button></form><Link className="forgot-link" href="/account/recover">Forgot your password?</Link><div className="auth-provider-note"><strong>Google sign-in scaffolded</strong><p>Supabase Auth + Google is the recommended production provider; credentials are not configured in this repository.</p></div></section></div>;
}
