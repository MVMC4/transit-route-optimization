import { NextResponse } from "next/server";
import { RouteService } from "@/lib/services/route-service";

export async function GET(
  _: Request,
  { params }: { params: { routeId: string } }
) {
  try {
    const route = await RouteService.getRoute(Number(params.routeId));
    return NextResponse.json(route);
  } catch {
    return NextResponse.json({ error: "Route not found" }, { status: 404 });
  }
}
