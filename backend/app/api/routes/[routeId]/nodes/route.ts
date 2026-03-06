import { NextRequest, NextResponse } from "next/server";
import { NodeService } from "@/lib/services/node-service";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1),
  lat: z.coerce.number(),
  long: z.coerce.number(),
  orderNum: z.coerce.number().int().positive(),
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ routeId: string }> }
) {
  try {
    const { routeId } = await context.params;
    const nodes = await NodeService.listNodes(Number(routeId));
    return NextResponse.json(nodes);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load nodes" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ routeId: string }> }
) {
  try {
    const { routeId } = await context.params;
    const body = await request.json();
    const data = createSchema.parse(body);
    await NodeService.createNode(Number(routeId), data);
    return NextResponse.json({ message: "Node created successfully" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Failed to create node" }, { status: 400 });
  }
}