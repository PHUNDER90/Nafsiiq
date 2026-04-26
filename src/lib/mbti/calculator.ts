// ─── MBTI Score Calculator ────────────────────────────────────────────────────
import type { TestAnswer, MBTIScores, MBTIType, MBTIDimension } from "@/types";
import type { TestQuestion } from "@/types";

/**
 * Calculate MBTI scores from answers.
 * Each question has a positiveDirection (E/S/T/J or I/N/F/P).
 * Likert scale: 1 = strongly toward positiveDirection, 5 = strongly toward opposite.
 */
export function calculateScores(
  answers: TestAnswer[],
  questions: TestQuestion[]
): MBTIScores {
  const scores: MBTIScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  const questionMap = new Map(questions.map((q) => [q._id, q]));

  for (const answer of answers) {
    const question = questionMap.get(answer.questionId);
    if (!question) continue;

    const { dimension, positiveDirection } = question;
    const value = answer.value; // 1-5

    // Normalize: 1 → 2 points toward positive, 5 → 2 points toward negative
    const positiveScore = 3 - value; // range: -2 to +2
    const [posKey, negKey] = getDimensionKeys(dimension, positiveDirection);

    if (positiveScore >= 0) {
      scores[posKey] += positiveScore;
    } else {
      scores[negKey] += Math.abs(positiveScore);
    }
  }

  return scores;
}

function getDimensionKeys(
  dimension: MBTIDimension,
  positiveDirection: string
): [keyof MBTIScores, keyof MBTIScores] {
  const pairs: Record<MBTIDimension, [string, string]> = {
    EI: ["E", "I"],
    SN: ["S", "N"],
    TF: ["T", "F"],
    JP: ["J", "P"],
  };
  const [a, b] = pairs[dimension];
  return positiveDirection === a
    ? [a as keyof MBTIScores, b as keyof MBTIScores]
    : [b as keyof MBTIScores, a as keyof MBTIScores];
}

/**
 * Derive MBTI type string (e.g. "INTJ") from scores
 */
export function deriveType(scores: MBTIScores): MBTIType {
  const e = scores.E >= scores.I ? "E" : "I";
  const s = scores.S >= scores.N ? "S" : "N";
  const t = scores.T >= scores.F ? "T" : "F";
  const j = scores.J >= scores.P ? "J" : "P";
  return `${e}${s}${t}${j}` as MBTIType;
}

/**
 * Calculate percentage scores for chart visualization
 * Returns 0-100 for each pole
 */
export function getDimensionPercentages(scores: MBTIScores): Record<string, number> {
  const calc = (a: number, b: number) => {
    const total = a + b;
    if (total === 0) return { a: 50, b: 50 };
    return { a: Math.round((a / total) * 100), b: Math.round((b / total) * 100) };
  };

  const ei = calc(scores.E, scores.I);
  const sn = calc(scores.S, scores.N);
  const tf = calc(scores.T, scores.F);
  const jp = calc(scores.J, scores.P);

  return {
    E: ei.a, I: ei.b,
    S: sn.a, N: sn.b,
    T: tf.a, F: tf.b,
    J: jp.a, P: jp.b,
  };
}
