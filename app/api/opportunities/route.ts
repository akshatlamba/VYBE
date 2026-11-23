import { NextRequest, NextResponse } from "next/server";
import { getAllOpportunities } from "@/lib/data/mock-db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const search = searchParams.get("search")?.toLowerCase();

  let opportunities = getAllOpportunities();

  if (type && type !== "all") {
    opportunities = opportunities.filter((o) =>
      o.type.toLowerCase().includes(type.toLowerCase())
    );
  }

  if (search) {
    opportunities = opportunities.filter(
      (o) =>
        o.title.toLowerCase().includes(search) ||
        o.organizer.toLowerCase().includes(search) ||
        o.skills.some((s) => s.toLowerCase().includes(search))
    );
  }

  return NextResponse.json({
    success: true,
    data: opportunities,
  });
}
