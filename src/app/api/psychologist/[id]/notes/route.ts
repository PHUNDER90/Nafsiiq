import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/apiAuth";

interface Params { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const auth = requireAuth(req, "psychologist");
    if (auth.error) return auth.error;

    const { notes, recommendations } = await req.json();

    // Notes are stored on the rank-1 result row for this session
    const topResult = await prisma.result.findFirst({
      where: { sessionId: Number(id), rank: 1 },
    });
    if (!topResult) return NextResponse.json({ error: "Session not found" }, { status: 404 });

    const data: Record<string, string | null> = {};
    if (notes !== undefined) data.psychologistNotes = notes ?? null;
    if (recommendations !== undefined) data.recommendations = recommendations ?? null;

    await prisma.result.update({ where: { id: topResult.id }, data });

    return NextResponse.json({ message: "Notes saved" });
  } catch (err) {
    console.error("[PUT /api/psychologist/[id]/notes]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic'; 
