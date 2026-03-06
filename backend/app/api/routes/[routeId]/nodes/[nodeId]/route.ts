import { NextRequest, NextResponse } from "next/server";
import { NodeService } from "@/lib/services/node-service";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1),
  lat: z.coerce.number(),
  long: z.coerce.number(),
  orderNum: z.coerce.number().int().positive(),
});

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ routeId: string; nodeId: string }> }
) {
  const { routeId, nodeId } = await context.params;

  try {
    const body = await req.json();
    const data = updateSchema.parse(body);

    await NodeService.updateNode(Number(routeId), Number(nodeId), data);

    return NextResponse.json({ message: "Node updated successfully" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Invalid input" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ routeId: string; nodeId: string }> }
) {
  const { routeId, nodeId } = await context.params;

  try {
    await NodeService.deleteNode(Number(routeId), Number(nodeId));

    return NextResponse.json({ message: "Node deleted successfully" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Failed to delete node" },
      { status: 500 }
    );
  }
}