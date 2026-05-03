import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { TestAnswers } from "@/types";

interface TestState {
  answers: TestAnswers;        // questionId → optionId
  currentIndex: number;
  startedAt: number | null;
}

interface TestActions {
  setAnswer: (questionId: number, optionId: number) => void;
  setCurrentIndex: (index: number) => void;
  startTest: () => void;
  reset: () => void;
}

const initialState: TestState = {
  answers: {},
  currentIndex: 0,
  startedAt: null,
};

export const useTestStore = create<TestState & TestActions>()(
  persist(
    (set) => ({
      ...initialState,

      setAnswer: (questionId, optionId) =>
        set((state) => ({ answers: { ...state.answers, [questionId]: optionId } })),

      setCurrentIndex: (index) => set({ currentIndex: index }),

      startTest: () =>
        set((state) => state.startedAt ? {} : { startedAt: Date.now() }),

      reset: () => set({ ...initialState }),
    }),
    {
      name: "nafsiiq-test-v2",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
