import { prisma } from "@/lib/db";
import { CreateRouteDTO } from "@/types/route";

export class RouteService {
  static async listRoutes() {
    return prisma.route.findMany({
      orderBy: { createdAt: "desc" }
    });
  }

  static async getRoute(routeId: number) {
    return prisma.route.findUnique({
      where: { id: routeId }
    });
  }

  static async createRoute(data: CreateRouteDTO) {
    return prisma.route.create({
      data
    });
  }
}
