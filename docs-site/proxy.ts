/** Redirect unauthenticated requests away from protected documentation and console routes. */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("tsela.developer-session")?.value;
  const apiBase = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";
  let clearInvalidSession = false;
  if (token) {
    const verification = await fetch(`${apiBase}/api/developer/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }).catch(() => null);
    if (verification?.ok) return NextResponse.next();
    clearInvalidSession = verification?.status === 401 || verification?.status === 403;
  }

  const destination = new URL("/", request.url);
  destination.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  destination.hash = "access";
  const response = NextResponse.redirect(destination);
  if (clearInvalidSession) response.cookies.set("tsela.developer-session", "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}

export const config = {
  matcher: ["/console/:path*", "/reference/:path*"],
};
