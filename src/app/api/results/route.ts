import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { TestResult } from "@/lib/db/models/TestResult";
import { requireAuth } from "@/lib/auth/apiAuth";

// ── GET /api/results — list user's results ────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;
    const { payload } = auth;

    await connectDB();

    const query = payload.role === "admin"
      ? {}
      : { userId: payload.userId };

    const results = await TestResult.find(query)
      .sort({ completedAt: -1 })
      .lean();

    return NextResponse.json({ results });
  } catch (err) {
    console.error("[GET /api/results]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── POST /api/results — save a new result ────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;
    const { payload } = auth;

    const { answers, scores, type } = await req.json();
    if (!answers || !scores || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    const result = await TestResult.create({
      userId: payload.userId,
      type,
      scores,
      answers,
      completedAt: new Date(),
    });

    return NextResponse.json({ result }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/results]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
