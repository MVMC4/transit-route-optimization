import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";        // ← NEW IMPORT
import { CreateNodeDTO } from "@/types/node";

export class NodeService {
  // Used by /api/routes/[routeId]/nodes (list)
  static async listNodes(routeId: number) {
    return prisma.node.findMany({
      where: { routeId },
      orderBy: { orderNum: "asc" },
      select: {
        id: true,
        routeId: true,
        label: true,
        name: true,
        lat: true,
        long: true,
        orderNum: true,
      },
    });
  }

  // Bonus: for dashboard (all nodes across routes)
  static async listAllNodes() {
    return prisma.node.findMany({
      select: {
        id: true,
        routeId: true,
        label: true,
        name: true,
        lat: true,
        long: true,
        orderNum: true,
      },
      orderBy: [{ routeId: "asc" }, { orderNum: "asc" }],
    });
  }

  static async createNode(routeId: number, data: CreateNodeDTO) {
    const label = `ROUTE${routeId}-STOP${data.orderNum}`;

    return prisma.node.create({
      data: {
        routeId,
        label,
        name: data.name,
        lat: data.lat,
        long: data.long,
        orderNum: data.orderNum,
        geom: Prisma.sql`ST_SetSRID(ST_MakePoint(${data.long}, ${data.lat}), 4326)`,
      },
      select: {
        id: true,
        routeId: true,
        label: true,
        name: true,
        lat: true,
        long: true,
        orderNum: true,
      },
    });
  }

  static async updateNode(routeId: number, nodeId: number, data: any) {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.lat !== undefined) updateData.lat = data.lat;
    if (data.long !== undefined) updateData.long = data.long;
    if (data.orderNum !== undefined) updateData.orderNum = data.orderNum;

    // Update geometry only when coordinates change
    if (data.lat !== undefined && data.long !== undefined) {
      return prisma.node.update({
        where: { id: nodeId, routeId },
        data: {
          ...updateData,
          geom: Prisma.sql`ST_SetSRID(ST_MakePoint(${data.long}, ${data.lat}), 4326)`,
        },
        select: {
          id: true,
          name: true,
          lat: true,
          long: true,
          orderNum: true,
        },
      });
    }

    return prisma.node.update({
      where: { id: nodeId, routeId },
      data: updateData,
      select: {
        id: true,
        name: true,
        lat: true,
        long: true,
        orderNum: true,
      },
    });
  }

  static async deleteNode(routeId: number, nodeId: number) {
    return prisma.node.delete({
      where: { id: nodeId, routeId },
    });
  }
}