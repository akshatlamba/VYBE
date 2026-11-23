import { NextRequest, NextResponse } from "next/server";
import { APPLICATIONS_STORE } from "@/lib/data/mock-db";

const MIN_COHORT_SIZE = 5;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const departmentFilter = searchParams.get("department");

  // Mock student cohort count for demo
  const sampleCohortCount = departmentFilter === "Design" ? 3 : 18; // Design cohort < 5 triggers suppression!

  if (sampleCohortCount < MIN_COHORT_SIZE) {
    return NextResponse.json({
      success: true,
      data: {
        suppressed: true,
        message: `Privacy Guardrail: Filtered cohort size is ${sampleCohortCount} (less than minimum threshold of ${MIN_COHORT_SIZE}). Aggregated metrics are suppressed to prevent re-identification.`,
        cohort_count: sampleCohortCount,
      },
    });
  }

  // Aggregated application stages
  const stageCounts = {
    saved: 7,
    preparing: 8,
    applied: 5,
    attended: 4,
    done: 6,
  };

  // Top skill gaps demand across campus applications
  const skillGaps = [
    { skill: "AI Agents", count: 14, category: "Technical" },
    { skill: "Distributed Systems", count: 11, category: "Engineering" },
    { skill: "Product Management", count: 9, category: "Product" },
    { skill: "PyTorch", count: 8, category: "Technical" },
    { skill: "Pitching", count: 7, category: "Business" },
  ];

  // Engagement trends
  const engagement = {
    total_active_students: sampleCohortCount,
    average_readiness: 68,
    verified_outcomes_count: 24,
    top_participating_departments: [
      { name: "Computer Science", percentage: 55 },
      { name: "Data Science", percentage: 25 },
      { name: "Business", percentage: 20 },
    ],
  };

  return NextResponse.json({
    success: true,
    data: {
      suppressed: false,
      cohort_count: sampleCohortCount,
      stage_counts: stageCounts,
      skill_gaps: skillGaps,
      engagement,
    },
  });
}
