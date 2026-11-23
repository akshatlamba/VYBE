import { NextRequest, NextResponse } from "next/server";
import {
  getApplicationsByStudent,
  addApplication,
  updateApplicationStage,
  getOpportunityById,
  getStudentProfile,
  Application,
} from "@/lib/data/mock-db";
import { ApplicationCreateSchema, ApplicationUpdateSchema } from "@/lib/validations/api-schemas";
import { calculateFitScore } from "@/lib/intelligence/fit-scorer";
import { assessReadiness } from "@/lib/intelligence/readiness";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const persona = searchParams.get("persona") || "beginner";
  const student = getStudentProfile(persona);

  const apps = getApplicationsByStudent(student.id);
  return NextResponse.json({
    success: true,
    data: apps,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = ApplicationCreateSchema.parse(body);

    const student = getStudentProfile("beginner");
    const opp = getOpportunityById(validated.opportunity_id);

    if (!opp) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Opportunity not found" } },
        { status: 404 }
      );
    }

    const fit = calculateFitScore(student, opp);
    const readiness = assessReadiness(student, opp);

    const newApp: Application = {
      id: `app-${Date.now()}`,
      student_id: student.id,
      opportunity_id: opp.id,
      opportunity: opp,
      stage: validated.stage,
      notes: validated.notes || "Added to tracker from Opportunity Radar.",
      fit_score: fit.total_score,
      fit_breakdown: fit,
      readiness_snapshot: {
        prerequisites_met: readiness.prerequisitesMet,
        skills_to_strengthen: readiness.skillsToStrengthen,
        checklist_completion_ratio: readiness.checklistRatio,
        readiness_percentage: readiness.readinessPercentage,
      },
      tasks: opp.preparation_checklist.map((c, i) => ({
        id: `task-${Date.now()}-${i}`,
        application_id: `app-${Date.now()}`,
        title: c.task,
        due_date: new Date(Date.now() + (i + 1) * 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        priority: i === 0 ? "high" : "medium",
        completed: c.done,
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    addApplication(newApp);

    return NextResponse.json({
      success: true,
      data: newApp,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "VALIDATION_ERROR", message: err.message, details: err.errors },
      },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = ApplicationUpdateSchema.parse(body);

    const updated = updateApplicationStage(validated.id, validated.stage);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Application not found" } },
        { status: 404 }
      );
    }

    if (validated.notes) {
      updated.notes = validated.notes;
    }

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "VALIDATION_ERROR", message: err.message, details: err.errors },
      },
      { status: 400 }
    );
  }
}
