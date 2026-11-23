import { NextRequest, NextResponse } from "next/server";
import { getStudentProfile, getWorldSignals, getAllOpportunities } from "@/lib/data/mock-db";
import { PulseMessageSchema } from "@/lib/validations/api-schemas";
import { getAIProvider } from "@/lib/ai/provider";

// Basic in-memory rate-limiter: max 10 requests per minute per IP/persona
const requestTimestamps: Map<string, number[]> = new Map();

function checkRateLimit(key: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const timestamps = requestTimestamps.get(key) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= limit) {
    return false;
  }

  validTimestamps.push(now);
  requestTimestamps.set(key, validTimestamps);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = PulseMessageSchema.parse(body);

    // Rate-limiting check
    const rateLimitKey = validated.persona_id || "anonymous";
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMITED",
            message: "PULSE query rate limit exceeded. Please wait a moment before sending another message.",
          },
        },
        { status: 429 }
      );
    }

    const student = getStudentProfile(validated.persona_id);
    const signal = validated.signal_id
      ? getWorldSignals().find((s) => s.id === validated.signal_id)
      : undefined;

    const provider = getAIProvider();
    const result = await provider.generatePulseGuidance(
      validated.message,
      student,
      signal,
      getAllOpportunities()
    );

    return NextResponse.json({
      success: true,
      data: result,
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
