"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import type { TestQuestion } from "@/types";

interface Props {
  question: TestQuestion;
  index: number;
  total: number;
  selectedOptionId: number | undefined;
  onSelect: (optionId: number) => void;
}

export function QuestionCard({ question, index, total, selectedOptionId, onSelect }: Props) {
  return (
    <Card className="overflow-hidden">
      <div className="px-6 pt-5 pb-2">
        <p className="text-xs font-semibold text-[var(--primary)] mb-1">{question.axisNameAr}</p>
        <p className="text-xs text-[var(--text-muted)] mb-3">{index + 1} / {total}</p>
        <h2 className="text-lg font-bold text-[var(--text)] leading-relaxed">{question.textAr}</h2>
      </div>
      <CardContent className="px-6 pb-6 pt-3 space-y-3">
        {question.options.map((opt) => {
          const selected = selectedOptionId === opt.id;
          return (
            <motion.button
              key={opt.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(opt.id)}
              className={[
                "w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150 text-start",
                selected
                  ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md"
                  : "bg-[var(--surface-2)] text-[var(--text)] border-[var(--border)] hover:border-[var(--primary)]",
              ].join(" ")}
            >
              {opt.textAr}
            </motion.button>
          );
        })}
      </CardContent>
    </Card>
  );
}
