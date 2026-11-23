import { NextResponse } from "next/server";
import { getWorldSignals } from "@/lib/data/mock-db";

export async function GET() {
  const signals = getWorldSignals();
  return NextResponse.json({
    success: true,
    data: signals,
  });
}
