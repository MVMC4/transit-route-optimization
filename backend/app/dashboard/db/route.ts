import { NextResponse } from "next/server";
import { DashboardService } from "@/lib/services/dashboard-service";

export async function GET() {
  const data = await DashboardService.dbView();
  return NextResponse.json(data);
}
