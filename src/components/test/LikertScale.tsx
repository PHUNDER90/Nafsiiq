"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils/cn";

const options = [
  { value: 1, labelKey: "stronglyAgree"    as const, filled: 5 },
  { value: 2, labelKey: "agree"            as const, filled: 4 },
  { value: 3, labelKey: "neutral"          as const, filled: 3 },
  { value: 4, labelKey: "disagree"         as const, filled: 2 },
  { value: 5, labelKey: "stronglyDisagree" as const, filled: 1 },
];

interface LikertScaleProps {
  selected: number | null;
  onSelect: (value: number) => void;
}

export function LikertScale({ selected, onSelect }: LikertScaleProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-2.5">
      {options.map((opt, i) => {
        const isSelected = selected === opt.value;
        return (
          <motion.button
            key={opt.value}
            type="button"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.055, duration: 0.25 }}
            onClick={() => onSelect(opt.value)}
            className={cn(
              "w-full flex items-center gap-4 p-3.5 rounded-xl border-2 text-start",
              "transition-all duration-200 cursor-pointer",
              "hover:scale-[1.005] active:scale-[0.995]",
              isSelected
                ? "border-[var(--primary)] bg-[var(--primary-faint)] shadow-sm"
                : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/40 hover:bg-[var(--surface-2)]"
            )}
          >
            {/* Radio circle */}
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all",
                isSelected
                  ? "border-[var(--primary)] bg-[var(--primary)]"
                  : "border-[var(--border)]"
              )}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 rounded-full bg-white"
                />
              )}
            </div>

            {/* Label */}
            <span
              className={cn(
                "flex-1 text-sm font-medium transition-colors",
                isSelected ? "text-[var(--primary)]" : "text-[var(--text)]"
              )}
            >
              {t(opt.labelKey)}
            </span>

            {/* Dot weight visual */}
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }, (_, j) => (
                <div
                  key={j}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    j < opt.filled
                      ? isSelected
                        ? "bg-[var(--primary)]"
                        : "bg-[var(--text-muted)]/40"
                      : "bg-[var(--border)]"
                  )}
                />
              ))}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
