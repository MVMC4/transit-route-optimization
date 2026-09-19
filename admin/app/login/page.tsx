"use client";

/** Administrator-only sign-in; the API verifies the role before console access. */

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const BASE=process.env.NEXT_PUBLIC_API_BASE??"http://localhost:8000";

export default function AdminLoginPage(){
  const router=useRouter(); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  async function submit(event:FormEvent){event.preventDefault();setBusy(true);setError("");try{const login=await fetch(`${BASE}/api/developer/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});if(!login.ok)throw new Error("Email or password is incorrect");const result=await login.json();const check=await fetch(`${BASE}/api/admin/overview`,{headers:{Authorization:`Bearer ${result.token}`}});if(check.status===403)throw new Error("This account does not have administrator access");if(!check.ok)throw new Error("Could not verify administrator access");localStorage.setItem("tsela_admin_token",result.token);router.replace("/dashboard");}catch(value){setError(value instanceof Error?value.message:"Could not sign in");}finally{setBusy(false)}}
  return <section className="admin-login"><div><span>RESTRICTED OPERATIONS</span><h1>Administrator sign in.</h1><p>Rider and developer accounts cannot enter this workspace. Access is checked again by every admin API endpoint.</p></div><form onSubmit={submit}><label>Email<input type="email" autoComplete="email" value={email} onChange={(event)=>setEmail(event.target.value)} required/></label><label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event)=>setPassword(event.target.value)} required/></label>{error&&<p role="alert">{error}</p>}<button disabled={busy}>{busy?"Verifying access…":"Sign in"}</button></form></section>;
}
