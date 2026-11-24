import { NextResponse } from "next/server";
import { getWorldSignals } from "@/lib/data/mock-db";

const FASTAPI_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export async function GET() {
  try {
    const res = await fetch(`${FASTAPI_BASE_URL}/world-to-action/signals`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      return NextResponse.json({
        success: true,
        data: json.data || json,
        is_live: true,
      });
    }
  } catch {
    // Fallback
  }

  const signals = getWorldSignals();
  return NextResponse.json({
    success: true,
    data: signals,
    is_live: false,
  });
}
