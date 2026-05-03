import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { formatSession } from "@/lib/db/formatters";
import { requireAuth } from "@/lib/auth/apiAuth";

const sessionInclude = {
  results: {
    include: { personality: { select: { code: true, nameAr: true, emoji: true, color: true } } },
  },
};

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;
    const { payload } = auth;

    const isPrivileged = payload.role === "admin" || payload.role === "psychologist";
    const where = isPrivileged
      ? { isComplete: true }
      : { isComplete: true, userId: payload.userId };

    const sessions = await prisma.session.findMany({
      where,
      orderBy: { completedAt: "desc" },
      include: sessionInclude,
    });

    return NextResponse.json({ results: sessions.map(formatSession) });
  } catch (err) {
    console.error("[GET /api/results]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;
    const { payload } = auth;

    const { answers } = await req.json();
    // answers: { [questionId]: optionId }
    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ error: "Missing answers" }, { status: 400 });
    }

    const optionIds: number[] = Object.values(answers);

    // Fetch all option scores for chosen options
    const scoreRows = await prisma.optionScore.findMany({
      where: { optionId: { in: optionIds } },
    });

    // Compute max possible points per personality (sum of max score per question)
    const allQuestions = await prisma.question.findMany({
      include: { options: { include: { scores: true } } },
    });

    const maxPoints: Record<number, number> = {};
    for (const q of allQuestions) {
      // Max score this question can contribute to each personality
      const perPersonality: Record<number, number> = {};
      for (const opt of q.options) {
        for (const s of opt.scores) {
          if ((s.points ?? 0) > (perPersonality[s.personalityId] ?? 0)) {
            perPersonality[s.personalityId] = s.points;
          }
        }
      }
      for (const [pid, pts] of Object.entries(perPersonality)) {
        maxPoints[Number(pid)] = (maxPoints[Number(pid)] ?? 0) + pts;
      }
    }

    // Sum earned points per personality
    const totals: Record<number, number> = {};
    for (const row of scoreRows) {
      totals[row.personalityId] = (totals[row.personalityId] ?? 0) + row.points;
    }

    // Fetch all 10 personalities
    const personalities = await prisma.personality.findMany({ orderBy: { id: "asc" } });

    // Build ranked results
    type Ranked = { personalityId: number; total: number; max: number; pct: number };
    const ranked: Ranked[] = personalities.map((p) => ({
      personalityId: p.id,
      total: totals[p.id] ?? 0,
      max: maxPoints[p.id] ?? 1,
      pct: Math.round(((totals[p.id] ?? 0) / (maxPoints[p.id] ?? 1)) * 100),
    }));
    ranked.sort((a, b) => b.pct - a.pct);

    // Create session + answers + results in a transaction
    const session = await prisma.$transaction(async (tx) => {
      const sess = await tx.session.create({
        data: {
          userId: payload.userId,
          isComplete: true,
          completedAt: new Date(),
        },
      });

      // Insert answers
      const answerData = Object.entries(answers).map(([qId, oId]) => ({
        sessionId: sess.id,
        questionId: Number(qId),
        optionId: Number(oId),
      }));
      await tx.answer.createMany({ data: answerData });

      // Insert results (one row per personality)
      const resultData = ranked.map((r, i) => ({
        sessionId: sess.id,
        personalityId: r.personalityId,
        totalPoints: r.total,
        maxPoints: r.max,
        percentage: r.pct,
        rank: i + 1,
      }));
      await tx.result.createMany({ data: resultData });

      return tx.session.findUnique({
        where: { id: sess.id },
        include: sessionInclude,
      });
    });

    return NextResponse.json({ result: formatSession(session!) }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/results]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic'; 
