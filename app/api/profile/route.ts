import { NextRequest, NextResponse } from "next/server";
import { getStudentProfile, PERSONAS } from "@/lib/data/mock-db";
import { ProfileUpdateSchema } from "@/lib/validations/api-schemas";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const persona = searchParams.get("persona") || "beginner";
  const profile = getStudentProfile(persona);

  return NextResponse.json({
    success: true,
    data: profile,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = ProfileUpdateSchema.parse(body);

    // In-memory update
    const active = getStudentProfile("beginner");
    Object.assign(active, validated);

    return NextResponse.json({
      success: true,
      data: active,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: err.message || "Invalid profile payload",
          details: err.errors,
        },
      },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  return POST(request);
}
