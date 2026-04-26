/**
 * Zustand store for persisting test session progress.
 * Survives accidental page reloads during the 40-question test.
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { TestAnswer } from "@/types";

interface TestState {
  /** All answers keyed by questionId */
  answers: TestAnswer[];
  /** Index of the currently displayed question */
  currentIndex: number;
  /** Timestamp the test was started (ms since epoch) */
  startedAt: number | null;
}

interface TestActions {
  setAnswer: (answer: TestAnswer) => void;
  setCurrentIndex: (index: number) => void;
  startTest: () => void;
  reset: () => void;
}

const initialState: TestState = {
  answers: [],
  currentIndex: 0,
  startedAt: null,
};

export const useTestStore = create<TestState & TestActions>()(
  persist(
    (set) => ({
      ...initialState,

      setAnswer: (answer) =>
        set((state) => {
          const idx = state.answers.findIndex((a) => a.questionId === answer.questionId);
          if (idx >= 0) {
            const updated = [...state.answers];
            updated[idx] = answer;
            return { answers: updated };
          }
          return { answers: [...state.answers, answer] };
        }),

      setCurrentIndex: (index) => set({ currentIndex: index }),

      startTest: () =>
        set((state) =>
          state.startedAt ? {} : { startedAt: Date.now() }
        ),

      reset: () => set({ ...initialState }),
    }),
    {
      name: "nafsiiq-test",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
