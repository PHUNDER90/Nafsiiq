export type Locale = "en" | "ar";
export type Theme = "light" | "dark";

// ── Auth ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "psychologist" | "admin";
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

// ── Personality test ──────────────────────────────────────────────────────────
export type PersonalityCode = "S1" | "S2" | "S3" | "S4" | "S5" | "S6" | "S7" | "S8" | "S9" | "S10";

export interface PersonalityInfo {
  id: number;
  code: PersonalityCode;
  nameAr: string;
  emoji: string;
  color: string;
  descriptionAr: string;
  traitsAr: string[];
  careersAr: string[];
}

export interface TestOption {
  id: number;
  orderNum: number;
  textAr: string;
}

export interface TestQuestion {
  id: number;
  orderNum: number;
  textAr: string;
  axisNameAr: string;
  options: TestOption[];
}

// answer the user gave: questionId → optionId
export type TestAnswers = Record<number, number>;

// ── Session result ────────────────────────────────────────────────────────────
export interface PersonalityResult {
  personalityId: number;
  code: PersonalityCode;
  nameAr: string;
  emoji: string;
  color: string;
  totalPoints: number;
  maxPoints: number;
  percentage: number;
  rank: number;
}

export interface SessionResult {
  sessionId: number;
  completedAt: string;
  top: PersonalityResult;       // rank 1
  topThree: PersonalityResult[];
  all: PersonalityResult[];
  psychologistNotes?: string;
  recommendations?: string;
}
