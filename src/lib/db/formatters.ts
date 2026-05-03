import type { User as PrismaUser } from "@prisma/client";
import type { SessionResult, PersonalityResult } from "@/types";

export function formatUser(u: PrismaUser) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role as "user" | "psychologist" | "admin",
    avatar: u.avatarUrl ?? "",
    createdAt: u.createdAt.toISOString(),
  };
}

interface RawResult {
  id: number;
  sessionId: number;
  personalityId: number;
  totalPoints: number;
  maxPoints: number;
  percentage: number;
  rank: number;
  psychologistNotes: string | null;
  recommendations: string | null;
  createdAt: Date;
  personality: { code: string; nameAr: string; emoji: string; color: string };
}

interface RawSession {
  id: number;
  userId: string | null;
  completedAt: Date | null;
  results: RawResult[];
}

export function formatSession(session: RawSession): SessionResult {
  const sorted = [...session.results].sort((a, b) => a.rank - b.rank);
  const allResults: PersonalityResult[] = sorted.map((r) => ({
    personalityId: r.personalityId,
    code: r.personality.code as any,
    nameAr: r.personality.nameAr,
    emoji: r.personality.emoji,
    color: r.personality.color,
    totalPoints: r.totalPoints,
    maxPoints: r.maxPoints,
    percentage: r.percentage,
    rank: r.rank,
  }));

  const top = allResults[0];
  // Grab notes/recommendations from rank-1 result row
  const topRow = sorted[0];

  return {
    sessionId: session.id,
    completedAt: session.completedAt?.toISOString() ?? new Date().toISOString(),
    top,
    topThree: allResults.slice(0, 3),
    all: allResults,
    psychologistNotes: topRow?.psychologistNotes ?? undefined,
    recommendations: topRow?.recommendations ?? undefined,
  };
}
