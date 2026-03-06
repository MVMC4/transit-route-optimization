import { NextResponse } from "next/server";
import { RouteService } from "@/lib/services/route-service";

export async function GET(
  _: Request,
  context: { params: Promise<{ routeId: string }> }
) {
  const { routeId } = await context.params;

  try {
    const route = await RouteService.getRoute(Number(routeId));
    return NextResponse.json(route);
  } catch {
    return NextResponse.json({ error: "Route not found" }, { status: 404 });
  }
}