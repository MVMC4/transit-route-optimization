/** Server-owned developer session cookie used to protect the console and API reference. */

import { NextResponse } from "next/server";
import { API_URL } from "../../../lib/urls";

const COOKIE_NAME = "tsela.developer-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export async function POST(request: Request) {
  const payload: unknown = await request.json().catch(() => null);
  const token = typeof payload === "object" && payload && "token" in payload
    ? String(payload.token)
    : "";

  if (token.length < 20 || token.length > 512) {
    return NextResponse.json({ detail: "Invalid developer session" }, { status: 401 });
  }

  const upstreamBase = process.env.API_INTERNAL_URL ?? API_URL;
  const verification = await fetch(`${upstreamBase}/api/developer/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  }).catch(() => null);

  if (!verification) {
    return NextResponse.json({ detail: "Developer API is temporarily unavailable" }, { status: 503 });
  }
  if (!verification.ok) {
    return NextResponse.json({ detail: "Developer session could not be verified" }, { status: 401 });
  }

  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE
      ? process.env.COOKIE_SECURE === "true"
      : process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}

export function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(COOKIE_NAME, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}
