import { NextRequest, NextResponse } from "next/server";
import { NodeService } from "@/lib/services/node-service";
import { z } from "zod";

const schema = z.object({
  lat: z.number(),
  long: z.number(),
  name: z.string(),
  orderNum: z.number(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { routeId: string } }
) {
  const { routeId } = params;
  const nodes = await NodeService.listNodes(Number(routeId));
  return NextResponse.json(nodes);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { routeId: string } }
) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    await NodeService.createNode(Number(params.routeId), data);

    return NextResponse.json({ message: "Node created" });
  } catch (err) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
}
