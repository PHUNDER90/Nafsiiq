"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import type { MBTIDimension } from "@/types";

const segments: {
  dim: MBTIDimension;
  color: string;
  label_en: string;
  label_ar: string;
}[] = [
  { dim: "EI", color: "#6C63FF", label_en: "Energy",     label_ar: "الطاقة"  },
  { dim: "SN", color: "#00C9A7", label_en: "Perception",  label_ar: "الإدراك" },
  { dim: "TF", color: "#FF6584", label_en: "Judgment",    label_ar: "القرار"  },
  { dim: "JP", color: "#FFB347", label_en: "Lifestyle",   label_ar: "الحياة"  },
];

interface ProgressBarProps {
  current: number;       // 1-based question number
  total: number;
  answered: number;
  activeDimension?: MBTIDimension;
}

export function ProgressBar({ current, total, answered, activeDimension }: ProgressBarProps) {
  const { locale } = useLanguage();
  const pct = Math.round((answered / total) * 100);
  const questionsPerDim = total / segments.length;

  return (
    <div className="space-y-2">
      {/* Header row */}
      <div className="flex justify-between text-sm">
        <span className="text-[var(--text-muted)]">
          {locale === "ar"
            ? `سؤال ${current} من ${total}`
            : `Question ${current} of ${total}`}
        </span>
        <span className="font-semibold text-[var(--primary)]">{pct}%</span>
      </div>

      {/* Segmented bar */}
      <div className="flex gap-1 h-2.5">
        {segments.map(({ dim, color }, segIdx) => {
          const segStart = segIdx * questionsPerDim;
          const segAnswered = Math.min(Math.max(0, answered - segStart), questionsPerDim);
          const segPct = (segAnswered / questionsPerDim) * 100;
          const isActive = dim === activeDimension;

          return (
            <div
              key={dim}
              className="flex-1 rounded-full overflow-hidden bg-[var(--surface-2)] relative"
            >
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: color }}
                initial={{ width: 0 }}
                animate={{ width: `${segPct}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              {isActive && segPct < 100 && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ repeat: Infinity, duration: 1.6 }}
                  style={{ background: `${color}30` }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Dimension labels */}
      <div className="flex">
        {segments.map(({ dim, color, label_en, label_ar }) => {
          const isActive = dim === activeDimension;
          return (
            <div key={dim} className="flex-1 text-center">
              <span
                className="text-[10px] font-bold transition-colors"
                style={{ color: isActive ? color : "var(--text-muted)" }}
              >
                {locale === "ar" ? label_ar : label_en}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
