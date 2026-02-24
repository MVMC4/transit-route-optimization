import { prisma } from "@/lib/db";
import { CreateNodeDTO } from "@/types/node";

export class NodeService {
  static async listNodes(routeId: number) {
    return prisma.node.findMany({
      where: { routeId },
      orderBy: { orderNum: "asc" }
    });
  }

  static async createNode(routeId: number, data: CreateNodeDTO) {
    const label = `ROUTE${routeId}-STOP${data.orderNum}`;

    const node = await prisma.$executeRaw`
      INSERT INTO "Node" 
      ("routeId", label, name, lat, long, "orderNum", geom)
      VALUES (
        ${routeId},
        ${label},
        ${data.name},
        ${data.lat},
        ${data.long},
        ${data.orderNum},
        ST_SetSRID(ST_MakePoint(${data.long}, ${data.lat}), 4326)
      )
    `;

    return node;
  }
}
