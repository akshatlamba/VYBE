import { NextRequest, NextResponse } from "next/server";
import { getStudentProfile, getWorldSignals, getAllOpportunities } from "@/lib/data/mock-db";
import { PulseMessageSchema } from "@/lib/validations/api-schemas";
import { getAIProvider } from "@/lib/ai/provider";

const FASTAPI_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

// Basic in-memory rate-limiter: max 15 requests per minute per IP/persona
const requestTimestamps: Map<string, number[]> = new Map();

function checkRateLimit(key: string, limit: number = 15, windowMs: number = 60000): boolean {
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

    const language = body.language || "en";

    // 1. First attempt: Query real FastAPI backend with Gemini integration
    try {
      const fastApiRes = await fetch(`${FASTAPI_BASE_URL}/pulse/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: body.student_id || 1,
          question: validated.message,
          signal_id: validated.signal_id,
          persona_id: validated.persona_id,
          language: language,
        }),
      });

      if (fastApiRes.ok) {
        const fastApiJson = await fastApiRes.json();
        return NextResponse.json({
          success: true,
          data: {
            content: fastApiJson.content,
            why_this: fastApiJson.why_this,
            action_proposals: fastApiJson.action_proposals,
            opportunity_ids: fastApiJson.opportunity_ids,
            is_live_ai: fastApiJson.is_live_ai,
            model_used: fastApiJson.model_used,
            provider: fastApiJson.provider,
            notice: fastApiJson.notice,
          },
        });
      }
    } catch {
      // FastAPI is offline, gracefully fall through to structured provider
    }

    // 2. Fallback: Contextual provider with explicit offline indicator
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
      data: {
        ...result,
        is_live_ai: false,
        provider: "Deterministic Student Guidance Engine",
        notice: "Operating in offline guidance mode. Personalization is generated deterministically from your Student DNA without unverified AI hallucinations.",
      },
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
