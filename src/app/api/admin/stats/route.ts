import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { formatUser } from "@/lib/db/formatters";
import { requireAuth } from "@/lib/auth/apiAuth";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req, "admin");
    if (auth.error) return auth.error;

    const [totalUsers, totalTests, recentUserRows, recentSessions, personalityGroups] = await Promise.all([
      prisma.user.count(),
      prisma.session.count({ where: { isComplete: true } }),
      prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.session.findMany({
        where: { isComplete: true },
        orderBy: { completedAt: "desc" },
        take: 5,
        include: {
          results: {
            where: { rank: 1 },
            include: { personality: { select: { code: true, nameAr: true, emoji: true, color: true } } },
          },
        },
      }),
      prisma.result.groupBy({
        by: ["personalityId"],
        where: { rank: 1 },
        _count: { personalityId: true },
        orderBy: { _count: { personalityId: "desc" } },
      }),
    ]);

    const recentUsers = recentUserRows.map(formatUser);

    const recentResults = recentSessions.map((s) => ({
      id: s.id,
      completedAt: s.completedAt?.toISOString() ?? "",
      top: s.results[0]
        ? {
            code: s.results[0].personality.code,
            nameAr: s.results[0].personality.nameAr,
            emoji: s.results[0].personality.emoji,
            color: s.results[0].personality.color,
            percentage: s.results[0].percentage,
          }
        : null,
    }));

    // Resolve personality names for distribution
    const personalities = await prisma.personality.findMany();
    const pMap = Object.fromEntries(personalities.map((p) => [p.id, p]));
    const typeDist = personalityGroups.map((g) => ({
      code: pMap[g.personalityId]?.code ?? String(g.personalityId),
      nameAr: pMap[g.personalityId]?.nameAr ?? "",
      emoji: pMap[g.personalityId]?.emoji ?? "",
      color: pMap[g.personalityId]?.color ?? "#6C63FF",
      count: g._count.personalityId,
    }));

    return NextResponse.json({ totalUsers, totalTests, recentUsers, recentResults, typeDist });
  } catch (err) {
    console.error("[GET /api/admin/stats]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
