import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { formatUser } from "@/lib/db/formatters";
import { requireAuth } from "@/lib/auth/apiAuth";

interface Params { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const auth = requireAuth(req);
    if (auth.error) return auth.error;
    const { payload } = auth;

    if (payload.userId !== id && payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user: formatUser(user) });
  } catch (err) {
    console.error("[GET /api/users/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const auth = requireAuth(req);
    if (auth.error) return auth.error;
    const { payload } = auth;

    if (payload.userId !== id && payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const data: Record<string, unknown> = {};
    if (body.name) data.name = String(body.name).trim();
    if (body.avatar !== undefined) data.avatarUrl = String(body.avatar);

    const user = await prisma.user.update({ where: { id }, data });

    return NextResponse.json({ user: formatUser(user) });
  } catch (err) {
    console.error("[PUT /api/users/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const auth = requireAuth(req, "admin");
    if (auth.error) return auth.error;

    if (auth.payload.userId === id) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 403 });
    }

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (target.role === "admin") {
      return NextResponse.json({ error: "Cannot delete an admin account" }, { status: 403 });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: "User deleted" });
  } catch (err) {
    console.error("[DELETE /api/users/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
