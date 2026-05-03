import type { PersonalityResult, TestAnswers } from "@/types";

interface OptionScoreRow {
  optionId: number;
  personalityId: number;
  points: number;
}

interface PersonalityMeta {
  id: number;
  code: string;
  nameAr: string;
  emoji: string;
  color: string;
}

/**
 * Calculate personality scores from user answers.
 * answers: { questionId -> optionId }
 * scoreRows: all option_scores rows for the chosen options
 * maxPoints: max possible points per personality (pre-computed server-side)
 */
export function calculateResults(
  answers: TestAnswers,
  scoreRows: OptionScoreRow[],
  maxPoints: Record<number, number>,
  personalities: PersonalityMeta[]
): PersonalityResult[] {
  // Sum points per personality
  const totals: Record<number, number> = {};
  for (const row of scoreRows) {
    totals[row.personalityId] = (totals[row.personalityId] ?? 0) + row.points;
  }

  const results: PersonalityResult[] = personalities.map((p) => {
    const total = totals[p.id] ?? 0;
    const max = maxPoints[p.id] ?? 1;
    return {
      personalityId: p.id,
      code: p.code as any,
      nameAr: p.nameAr,
      emoji: p.emoji,
      color: p.color,
      totalPoints: total,
      maxPoints: max,
      percentage: Math.round((total / max) * 100),
      rank: 0,
    };
  });

  // Sort descending by percentage, assign rank
  results.sort((a, b) => b.percentage - a.percentage);
  results.forEach((r, i) => { r.rank = i + 1; });

  return results;
}
