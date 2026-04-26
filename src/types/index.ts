// ─── Core Application Types ─────────────────────────────────────────────────

export type Locale = "en" | "ar";
export type Theme = "light" | "dark";

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  _id: string;
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

// ─── MBTI ────────────────────────────────────────────────────────────────────

export type MBTIDimension = "EI" | "SN" | "TF" | "JP";
export type MBTIType =
  | "INTJ" | "INTP" | "ENTJ" | "ENTP"
  | "INFJ" | "INFP" | "ENFJ" | "ENFP"
  | "ISTJ" | "ISFJ" | "ESTJ" | "ESFJ"
  | "ISTP" | "ISFP" | "ESTP" | "ESFP";

export interface TestQuestion {
  _id: string;
  text_en: string;
  text_ar: string;
  dimension: MBTIDimension;
  /** positive score goes toward E/S/T/J, negative toward I/N/F/P */
  positiveDirection: "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";
  order: number;
}

export interface TestAnswer {
  questionId: string;
  dimension: MBTIDimension;
  value: number; // 1–5 (1=strongly toward negative pole, 5=strongly toward positive)
}

export interface MBTIScores {
  E: number; I: number;
  S: number; N: number;
  T: number; F: number;
  J: number; P: number;
}

export interface TestResult {
  _id: string;
  userId: string;
  type: MBTIType;
  scores: MBTIScores;
  answers: TestAnswer[];
  completedAt: string;
  psychologistNotes?: string;
  recommendations?: string;
}

// ─── Test Session ────────────────────────────────────────────────────────────

export interface TestSession {
  questions: TestQuestion[];
  answers: Record<string, TestAnswer>;
  currentIndex: number;
  startedAt: string;
}
