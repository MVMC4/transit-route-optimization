"use client";

/** One-use developer password reset form; existing sessions are invalidated server-side. */

import Link from "next/link";
import { useState } from "react";
import { developerApi } from "../../lib/developer-api";

export default function ResetPage(){const[token,setToken]=useState("");const[password,setPassword]=useState("");const[message,setMessage]=useState("");const[error,setError]=useState("");async function submit(event:React.FormEvent){event.preventDefault();setError("");try{await developerApi.resetPassword(token,password);setMessage("Password updated. Sign in again.");}catch(requestError:unknown){setError(requestError instanceof Error?requestError.message:"Reset failed");}}return <main className="auth-page"><div className="auth-intro"><p className="eyebrow">SECURE RESET</p><h1>Choose a new password.</h1><p>Recovery tokens expire after 30 minutes and work once.</p><Link href="/login">← Back to sign in</Link></div><div className="auth-card"><form onSubmit={submit}><label>Recovery token<input value={token} onChange={(event)=>setToken(event.target.value)} required minLength={20}/></label><label>New password<input type="password" value={password} onChange={(event)=>setPassword(event.target.value)} minLength={10} required/></label>{error&&<div className="auth-error">{error}</div>}<button className="console-primary">Update password</button></form>{message&&<p className="auth-hint">{message}</p>}</div></main>}
