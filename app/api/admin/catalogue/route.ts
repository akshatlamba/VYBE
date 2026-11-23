import { NextRequest, NextResponse } from "next/server";
import { INITIAL_OPPORTUNITIES, Opportunity } from "@/lib/data/mock-db";
import { z } from "zod";

const OpportunityCreateAdminSchema = z.object({
  title: z.string().min(2),
  organizer: z.string().min(2),
  type: z.enum(["Hackathon", "Internship", "Research Program", "Fellowship", "Conference"]),
  source_url: z.string().url(),
  source_status: z.enum(["sourced", "unverified", "stale"]).default("sourced"),
  dates: z.string(),
  deadline: z.string(),
  cost: z.number().min(0),
  format: z.enum(["online", "onsite", "hybrid"]),
  location: z.string(),
  level: z.enum(["Beginner", "Intermediate", "Advanced", "All Levels"]),
  description: z.string(),
  skills: z.array(z.string()),
});

export async function GET() {
  const catalogue = INITIAL_OPPORTUNITIES.map((opp) => {
    const isPast = new Date(opp.deadline).getTime() < Date.now();
    const isStale = opp.source_status === "stale";
    return {
      ...opp,
      is_past_deadline: isPast,
      needs_freshness_check: isStale,
    };
  });

  return NextResponse.json({
    success: true,
    data: catalogue,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = OpportunityCreateAdminSchema.parse(body);

    const newOpp: Opportunity = {
      id: `opp-admin-${Date.now()}`,
      title: validated.title,
      organizer: validated.organizer,
      type: validated.type,
      source_url: validated.source_url,
      source_status: validated.source_status,
      dates: validated.dates,
      deadline: validated.deadline,
      cost: validated.cost,
      format: validated.format,
      location: validated.location,
      level: validated.level,
      eligibility: {
        academic_years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
        departments: ["Computer Science", "Engineering"],
        mandatory_criteria: ["Enrolled college student"],
      },
      description: validated.description,
      preparation_checklist: [{ task: "Review requirements", done: true }],
      skills: validated.skills,
      status: "active",
      last_checked_at: new Date().toISOString(),
      is_sample: false,
    };

    INITIAL_OPPORTUNITIES.unshift(newOpp);

    return NextResponse.json({
      success: true,
      data: newOpp,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: err.message } },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, source_status, status } = body;

    const opp = INITIAL_OPPORTUNITIES.find((o) => o.id === id);
    if (!opp) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Opportunity not found" } },
        { status: 404 }
      );
    }

    if (source_status) opp.source_status = source_status;
    if (status) opp.status = status;
    opp.last_checked_at = new Date().toISOString();

    return NextResponse.json({
      success: true,
      data: opp,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
