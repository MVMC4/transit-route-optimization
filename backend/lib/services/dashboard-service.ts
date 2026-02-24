import { prisma } from "@/lib/db";

export class DashboardService {

  static async dbView(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const routes = await prisma.route.findMany({
      skip,
      take: limit
    });

    const nodes = await prisma.node.findMany({
      skip,
      take: limit
    });

    return { routes, nodes };
  }
}
