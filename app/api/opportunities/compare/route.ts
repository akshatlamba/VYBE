import { NextRequest, NextResponse } from "next/server";
import { getOpportunityById, getStudentProfile } from "@/lib/data/mock-db";
import { checkEligibility } from "@/lib/intelligence/eligibility";
import { calculateFitScore } from "@/lib/intelligence/fit-scorer";
import { assessReadiness } from "@/lib/intelligence/readiness";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids");
  const persona = searchParams.get("persona") || "beginner";
  const student = getStudentProfile(persona);

  if (!idsParam) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "MISSING_PARAMS",
          message: "Please provide 'ids' query parameter (e.g. ?ids=opp-001,opp-002)",
        },
      },
      { status: 400 }
    );
  }

  const ids = idsParam.split(",").map((s) => s.trim()).filter(Boolean);
  const opportunities = ids
    .map((id) => getOpportunityById(id))
    .filter((o): o is NonNullable<typeof o> => o !== undefined);

  if (opportunities.length < 2) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INSUFFICIENT_ITEMS",
          message: "Compare requires at least 2 valid opportunity IDs",
        },
      },
      { status: 400 }
    );
  }

  const comparison = opportunities.map((opp) => {
    const eligibility = checkEligibility(student, opp);
    const fit = calculateFitScore(student, opp);
    const readiness = assessReadiness(student, opp);

    return {
      id: opp.id,
      title: opp.title,
      organizer: opp.organizer,
      type: opp.type,
      source_status: opp.source_status,
      format: opp.format,
      cost: opp.cost,
      deadline: opp.deadline,
      level: opp.level,
      skills: opp.skills,
      eligibility,
      fit_score: fit.total_score,
      fit_breakdown: fit,
      readiness,
    };
  });

  return NextResponse.json({
    success: true,
    data: comparison,
  });
}
