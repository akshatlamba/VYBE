import { NextRequest, NextResponse } from "next/server";
import { getAllOpportunities, getStudentProfile } from "@/lib/data/mock-db";
import { checkEligibility } from "@/lib/intelligence/eligibility";
import { calculateFitScore } from "@/lib/intelligence/fit-scorer";
import { assessReadiness } from "@/lib/intelligence/readiness";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const persona = searchParams.get("persona") || "beginner";
  const student = getStudentProfile(persona);

  const allOpps = getAllOpportunities();

  // 1. HARD ELIGIBILITY FILTER: Ineligible opportunities are strictly excluded!
  const eligibleOpps = allOpps.filter((opp) => {
    const eligibility = checkEligibility(student, opp);
    return eligibility.eligible;
  });

  // 2. WEIGHTED FIT & READINESS CALCULATION
  const scoredOpps = eligibleOpps.map((opp) => {
    const fit = calculateFitScore(student, opp);
    const readiness = assessReadiness(student, opp);
    return {
      ...opp,
      fit_score: fit.total_score,
      fit_breakdown: fit,
      readiness,
      explanation_line: `${fit.total_score}/100 fit | Eligible | ${readiness.summaryLine}`,
    };
  });

  // 3. RANKING DESCENDING BY FIT SCORE
  scoredOpps.sort((a, b) => b.fit_score - a.fit_score);

  return NextResponse.json({
    success: true,
    data: {
      student_context: {
        name: student.name,
        department: student.department,
        academic_year: student.academic_year,
        primary_goal: student.primary_goal,
      },
      total_considered: allOpps.length,
      total_eligible: scoredOpps.length,
      recommendations: scoredOpps,
    },
  });
}
