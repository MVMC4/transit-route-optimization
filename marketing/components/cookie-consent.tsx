"use client";

/** Non-coercive privacy choices; optional tracking remains disabled unless chosen. */

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "tsela-privacy-choice-v1";

export function CookieConsent() {
  const [visible,setVisible]=useState(false);
  useEffect(()=>{const frame=requestAnimationFrame(()=>setVisible(localStorage.getItem(KEY)===null));return()=>cancelAnimationFrame(frame);},[]);
  function choose(value:"necessary"|"optional") { localStorage.setItem(KEY,value); setVisible(false); }
  if(!visible) return null;
  return <aside className="cookie-consent" aria-label="Privacy choices" role="dialog" aria-modal="false"><div><strong>Your privacy, without tricks.</strong><p>Tsela uses necessary storage for sign-in and this choice. Optional analytics are not installed today.</p><Link href="/legal/cookies">Read the cookie policy</Link></div><div><button type="button" onClick={()=>choose("necessary")}>Necessary only</button><button type="button" onClick={()=>choose("optional")}>Allow optional</button></div></aside>;
}
