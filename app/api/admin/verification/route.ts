import { NextRequest, NextResponse } from "next/server";
import { OUTCOMES_STORE } from "@/lib/data/mock-db";

export async function GET() {
  // Returns outcomes pending verification review
  const queue = OUTCOMES_STORE.map((out) => ({
    id: out.id,
    student_id: out.student_id,
    title: out.title,
    participation: out.participation,
    reflection: out.reflection,
    skills_gained: out.skills_gained,
    verification: out.verification,
    evidence_url: out.evidence_url,
    created_at: out.created_at,
  }));

  return NextResponse.json({
    success: true,
    data: queue,
  });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { outcome_id, verification } = body;

    const outcome = OUTCOMES_STORE.find((o) => o.id === outcome_id);
    if (!outcome) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Outcome not found" } },
        { status: 404 }
      );
    }

    outcome.verification = verification;

    return NextResponse.json({
      success: true,
      data: outcome,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
