import { NextRequest, NextResponse } from "next/server";
import { getOutcomesByStudent, addOutcome, getStudentProfile, GrowthOutcome } from "@/lib/data/mock-db";
import { OutcomeCreateSchema } from "@/lib/validations/api-schemas";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const persona = searchParams.get("persona") || "beginner";
  const student = getStudentProfile(persona);

  const outcomes = getOutcomesByStudent(student.id);
  return NextResponse.json({
    success: true,
    data: outcomes,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = OutcomeCreateSchema.parse(body);

    const student = getStudentProfile("beginner");

    // Honest verification rule:
    // If evidence_url is provided, it is 'link_supported'.
    // If no evidence_url, it is 'self_reported'.
    // Only institution/admin verification flips to 'verified'.
    const verificationState = validated.evidence_url && validated.evidence_url.length > 5
      ? "link_supported"
      : "self_reported";

    const newOutcome: GrowthOutcome = {
      id: `out-${Date.now()}`,
      student_id: student.id,
      opportunity_id: validated.opportunity_id,
      title: validated.title,
      participation: validated.participation,
      reflection: validated.reflection,
      skills_gained: validated.skills_gained,
      verification: verificationState,
      evidence_url: validated.evidence_url,
      created_at: new Date().toISOString(),
    };

    addOutcome(newOutcome);

    return NextResponse.json({
      success: true,
      data: newOutcome,
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
