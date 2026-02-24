import { NextResponse } from "next/server";
import { RouteService } from "@/lib/services/route-service";
import { z } from "zod";

const createSchema = z.object({
  name: z.string(),
  description: z.string().optional()
});

export async function GET() {
  try {
    const routes = await RouteService.listRoutes();
    return NextResponse.json(routes);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch routes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    const route = await RouteService.createRoute(data);

    return NextResponse.json(route);
  } catch (err) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
}
