import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { formatUser } from "@/lib/db/formatters";
import { requireAuth } from "@/lib/auth/apiAuth";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req, "admin");
    if (auth.error) return auth.error;

    const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ users: users.map(formatUser) });
  } catch (err) {
    console.error("[GET /api/admin/users]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
