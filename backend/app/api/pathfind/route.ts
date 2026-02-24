import { NextResponse } from "next/server";
import { PathfindingService } from "@/lib/services/pathfinding-service";
import { z } from "zod";

const schema = z.object({
  origin: z.object({ lat: z.number(), long: z.number() }),
  destination: z.object({ lat: z.number(), long: z.number() })
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const result = await PathfindingService.findPath(
      data.origin,
      data.destination
    );

    if (!result) {
      return NextResponse.json({
        message: "No bus route found. Suggested full walk."
      });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
}
