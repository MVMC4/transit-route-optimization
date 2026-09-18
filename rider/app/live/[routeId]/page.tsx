/** Dynamic live-trip entry validates the route id before mounting GPS guidance. */

import { notFound } from "next/navigation";
import { LiveTrip } from "@/components/live-trip";

export default async function LiveRoutePage({ params }: { params: Promise<{ routeId: string }> }) {
  const { routeId: rawRouteId } = await params; const routeId = Number(rawRouteId);
  if (!Number.isInteger(routeId) || routeId < 1) notFound();
  return <LiveTrip routeId={routeId} />;
}
