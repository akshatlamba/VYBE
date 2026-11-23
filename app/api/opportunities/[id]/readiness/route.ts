import { NextRequest, NextResponse } from "next/server";
import { getOpportunityById, getStudentProfile } from "@/lib/data/mock-db";
import { assessReadiness } from "@/lib/intelligence/readiness";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const opp = getOpportunityById(params.id);
  if (!opp) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "Opportunity not found" } },
      { status: 404 }
    );
  }

  const { searchParams } = new URL(request.url);
  const persona = searchParams.get("persona") || "beginner";
  const student = getStudentProfile(persona);

  const readiness = assessReadiness(student, opp);

  return NextResponse.json({
    success: true,
    data: readiness,
  });
}
