import { NextRequest, NextResponse } from "next/server";
import { questions } from "@/lib/mbti/questions";

export async function GET(_req: NextRequest) {
  return NextResponse.json({ questions });
}
