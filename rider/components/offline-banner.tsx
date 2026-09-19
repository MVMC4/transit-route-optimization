"use client";

/** Connectivity-aware status for prefetched navigation and pending framework requests. */

import { useOffline } from "next/offline";

export function OfflineBanner() {
  const isOffline = useOffline();
  if (!isOffline) return null;
  return <div className="offline-banner" role="status"><strong>You&apos;re offline.</strong><span>Saved routes remain on this device. Network requests will retry when the connection returns.</span></div>;
}
