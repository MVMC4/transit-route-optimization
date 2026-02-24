import { prisma } from "@/lib/db";
import { Coordinate } from "@/types/pathfind";

const WALKING_SPEED_KMH = 5;
const BUS_SPEED_KMH = 35;
const WAIT_TIME_MIN = 7;

function kmToMinutes(distanceKm: number, speed: number) {
  return (distanceKm / speed) * 60;
}

export class PathfindingService {

  static async findNearestNode(coord: Coordinate) {
    const result = await prisma.$queryRawUnsafe<any[]>(`
      SELECT id, lat, long,
      ST_Distance(
        geom,
        ST_SetSRID(ST_MakePoint(${coord.long}, ${coord.lat}), 4326)
      ) AS distance
      FROM "Node"
      ORDER BY geom <-> ST_SetSRID(ST_MakePoint(${coord.long}, ${coord.lat}), 4326)
      LIMIT 1;
    `);

    return result[0];
  }

  static async findPath(origin: Coordinate, destination: Coordinate) {
    const startNode = await this.findNearestNode(origin);
    const endNode = await this.findNearestNode(destination);

    if (!startNode || !endNode) {
      return null;
    }

    const nodes = await prisma.node.findMany({
      orderBy: { orderNum: "asc" }
    });

    // Simple same-route Dijkstra
    const sameRoute = nodes.filter(n => n.routeId === startNode.routeId);

    if (startNode.routeId !== endNode.routeId) {
      return null;
    }

    const segment = sameRoute.filter(
      n => n.orderNum >= startNode.orderNum &&
           n.orderNum <= endNode.orderNum
    );

    const busDistanceKm = segment.length * 0.5; // assumed avg 500m between stops
    const walkingToStartKm = startNode.distance / 1000;
    const walkingToEndKm = endNode.distance / 1000;

    const walkingTime =
      kmToMinutes(walkingToStartKm, WALKING_SPEED_KMH) +
      kmToMinutes(walkingToEndKm, WALKING_SPEED_KMH);

    const busTime = kmToMinutes(busDistanceKm, BUS_SPEED_KMH);

    const total =
      walkingTime +
      busTime +
      WAIT_TIME_MIN;

    return {
      path: segment,
      totalTimeMinutes: Math.round(total),
      breakdown: {
        walking: Math.round(walkingTime),
        bus: Math.round(busTime),
        waiting: WAIT_TIME_MIN
      }
    };
  }
}
