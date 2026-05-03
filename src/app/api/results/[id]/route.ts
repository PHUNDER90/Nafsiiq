import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { formatSession } from "@/lib/db/formatters";
import { requireAuth } from "@/lib/auth/apiAuth";

interface Params { params: Promise<{ id: string }> }

const sessionInclude = {
  results: {
    include: { personality: { select: { code: true, nameAr: true, emoji: true, color: true } } },
  },
};

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const auth = requireAuth(req);
    if (auth.error) return auth.error;
    const { payload } = auth;

    const session = await prisma.session.findUnique({
      where: { id: Number(id) },
      include: sessionInclude,
    });
    if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isOwner = session.userId === payload.userId;
    const isPrivileged = payload.role === "admin" || payload.role === "psychologist";
    if (!isOwner && !isPrivileged) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ result: formatSession(session) });
  } catch (err) {
    console.error("[GET /api/results/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const auth = requireAuth(req);
    if (auth.error) return auth.error;
    const { payload } = auth;

    const session = await prisma.session.findUnique({ where: { id: Number(id) } });
    if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isOwner = session.userId === payload.userId;
    if (!isOwner && payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.session.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error("[DELETE /api/results/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
