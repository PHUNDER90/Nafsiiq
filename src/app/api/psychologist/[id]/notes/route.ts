import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { TestResult } from "@/lib/db/models/TestResult";
import { requireAuth } from "@/lib/auth/apiAuth";

interface Params { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const auth = requireAuth(req, "psychologist");
    if (auth.error) return auth.error;

    const { notes, recommendations } = await req.json();

    await connectDB();
    const result = await TestResult.findByIdAndUpdate(
      id,
      { psychologistNotes: notes, recommendations: recommendations || [] },
      { new: true }
    );
    if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ result });
  } catch (err) {
    console.error("[PUT /api/psychologist/[id]/notes]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
