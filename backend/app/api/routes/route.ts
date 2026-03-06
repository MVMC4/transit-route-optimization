import { NextResponse } from "next/server";
import { RouteService } from "@/lib/services/route-service";
import { z } from "zod";

const createSchema = z.object({
  name: z.string(),
  description: z.string().optional()
});

export async function GET() {
  console.log("→ GET /api/routes called");

  try {
    console.log("Calling RouteService.listRoutes() …");
    const routes = await RouteService.listRoutes();
    console.log(`→ Found ${routes.length} routes`);
    return NextResponse.json(routes);
  } catch (err) {
    console.error("!!! ERROR in GET /api/routes !!!");
    console.error(err);
    if (err instanceof Error) {
      console.error(err.stack);
    }
    return NextResponse.json(
      { error: "Failed to fetch routes", details: err?.message },
      { status: 500 }
    );
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
