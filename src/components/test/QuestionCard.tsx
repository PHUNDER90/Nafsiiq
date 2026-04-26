"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DimensionBadge } from "./DimensionBadge";
import { LikertScale } from "./LikertScale";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TestQuestion, TestAnswer } from "@/types";

interface QuestionCardProps {
  question: TestQuestion;
  index: number;
  total: number;
  currentAnswer: TestAnswer | undefined;
  onSelect: (value: number) => void;
}

export function QuestionCard({
  question,
  index,
  total,
  currentAnswer,
  onSelect,
}: QuestionCardProps) {
  const { locale } = useLanguage();

  return (
    <Card className="overflow-hidden">
      {/* Colour stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-[#6C63FF] via-[#00C9A7] to-[#FF6584]" />

      <CardContent className="p-6 sm:p-8">
        {/* Top row: dimension + counter */}
        <div className="flex items-center justify-between mb-6">
          <DimensionBadge dimension={question.dimension} />
          <span className="text-xs font-medium text-[var(--text-muted)] tabular-nums">
            {index + 1} / {total}
          </span>
        </div>

        {/* Question text */}
        <p className="text-lg font-medium text-[var(--text)] leading-relaxed mb-8">
          {locale === "ar" ? question.text_ar : question.text_en}
        </p>

        {/* Likert scale */}
        <LikertScale
          selected={currentAnswer?.value ?? null}
          onSelect={onSelect}
        />
      </CardContent>
    </Card>
  );
}
