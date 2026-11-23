import { NextRequest, NextResponse } from "next/server";
import { OUTCOMES_STORE } from "@/lib/data/mock-db";
import { z } from "zod";

const EvidenceSchema = z.object({
  link_url: z.string().url("Must be a valid URL"),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = EvidenceSchema.parse(body);

    const outcome = OUTCOMES_STORE.find((o) => o.id === params.id);
    if (!outcome) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Outcome record not found" } },
        { status: 404 }
      );
    }

    outcome.evidence_url = validated.link_url;
    if (outcome.verification === "self_reported") {
      outcome.verification = "link_supported";
    }

    return NextResponse.json({
      success: true,
      data: outcome,
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
