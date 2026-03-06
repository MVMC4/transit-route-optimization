import { NextResponse } from "next/server";
import { DashboardService } from "@/lib/services/dashboard-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  try {
    const data = await DashboardService.dbView(page, limit);
    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ Dashboard error:", err);
    return NextResponse.json(
      { error: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}