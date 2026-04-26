import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { TestResult } from "@/lib/db/models/TestResult";
import { requireAuth } from "@/lib/auth/apiAuth";

interface Params { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const auth = requireAuth(req);
    if (auth.error) return auth.error;
    const { payload } = auth;

    await connectDB();
    const result = await TestResult.findById(id).lean();
    if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const ownerId = result.userId.toString();
    if (ownerId !== payload.userId && payload.role !== "admin" && payload.role !== "psychologist") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ result });
  } catch (err) {
    console.error("[GET /api/results/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
