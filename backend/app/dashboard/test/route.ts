import { NextResponse } from "next/server";
import { PathfindingService } from "@/lib/services/pathfinding-service";

export async function POST(req: Request) {
  const body = await req.json();

  const result = await PathfindingService.findPath(
    body.origin,
    body.destination
  );

  return NextResponse.json(result);
}
