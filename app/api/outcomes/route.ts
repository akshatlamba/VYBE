import { NextRequest, NextResponse } from "next/server";
import { getOutcomesByStudent, addOutcome, getStudentProfile, GrowthOutcome } from "@/lib/data/mock-db";
import { OutcomeCreateSchema } from "@/lib/validations/api-schemas";

const FASTAPI_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const persona = searchParams.get("persona") || "beginner";
  const student = getStudentProfile(persona);

  // Attempt to fetch from real backend
  try {
    const res = await fetch(`${FASTAPI_BASE_URL}/growth-passport/projects/student/1`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json.projects && json.projects.length > 0) {
        // Transform backend projects to outcome format if available
        const transformed: GrowthOutcome[] = json.projects.map((p: any) => ({
          id: `proj-${p.id}`,
          student_id: String(p.student_id),
          title: p.title,
          participation: p.category || "Project Lead",
          reflection: p.description || "Completed milestone deliverables.",
          skills_gained: p.milestones.map((m: any) => m.title).slice(0, 3),
          verification: p.verification || (p.evidence.length > 0 ? "link_supported" : "self_reported"),
          evidence_url: p.evidence[0]?.url,
          created_at: p.created_at || new Date().toISOString(),
        }));
        return NextResponse.json({
          success: true,
          data: transformed,
          is_live: true,
        });
      }
    }
  } catch {}

  const outcomes = getOutcomesByStudent(student.id);
  return NextResponse.json({
    success: true,
    data: outcomes,
    is_live: false,
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
    const verificationState =
      validated.evidence_url && validated.evidence_url.length > 5
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

    // Attempt to persist in FastAPI backend
    try {
      const projRes = await fetch(`${FASTAPI_BASE_URL}/growth-passport/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: 1,
          title: validated.title,
          description: validated.reflection,
          category: validated.participation,
        }),
      });
      if (projRes.ok) {
        const projData = await projRes.json();
        if (validated.evidence_url) {
          await fetch(`${FASTAPI_BASE_URL}/growth-passport/projects/${projData.project_id}/evidence`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: "Project Proof Link",
              url: validated.evidence_url,
              evidence_type: "project_link",
            }),
          });
        }
      }
    } catch {}

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
