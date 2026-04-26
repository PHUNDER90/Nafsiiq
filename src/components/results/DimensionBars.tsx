"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils/cn";

interface BarItemProps {
  letterA: string;
  letterB: string;
  pctA: number;
  labelA_en: string;
  labelA_ar: string;
  labelB_en: string;
  labelB_ar: string;
  color: string;
  delay?: number;
}

function BarItem({
  letterA,
  letterB,
  pctA,
  labelA_en,
  labelA_ar,
  labelB_en,
  labelB_ar,
  color,
  delay = 0,
}: BarItemProps) {
  const { locale } = useLanguage();
  const pctB = 100 - pctA;
  const dominantA = pctA >= pctB;

  return (
    <div className="space-y-2">
      {/* Pole labels */}
      <div className="flex justify-between items-end">
        <div className={cn("transition-opacity duration-300", !dominantA && "opacity-40")}>
          <div
            className="text-2xl font-black leading-none"
            style={{ color: dominantA ? color : "var(--text-muted)" }}
          >
            {letterA}
          </div>
          <div className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-tight">
            {locale === "ar" ? labelA_ar : labelA_en}
          </div>
        </div>

        <div className={cn("text-right transition-opacity duration-300", dominantA && "opacity-40")}>
          <div
            className="text-2xl font-black leading-none"
            style={{ color: !dominantA ? color : "var(--text-muted)" }}
          >
            {letterB}
          </div>
          <div className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-tight">
            {locale === "ar" ? labelB_ar : labelB_en}
          </div>
        </div>
      </div>

      {/* Track */}
      <div className="relative h-3.5 rounded-full overflow-hidden bg-[var(--surface-2)]">
        {/* Filled A-side */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pctA}%` }}
          transition={{ duration: 0.9, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: color }}
        />
        {/* Centre marker */}
        <div className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 z-10 bg-[var(--border)]" />
      </div>

      {/* Percentage labels */}
      <div className="flex justify-between">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.55 }}
          className="text-sm font-bold"
          style={{ color: dominantA ? color : "var(--text-muted)" }}
        >
          {pctA}%
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.55 }}
          className="text-sm font-bold"
          style={{ color: !dominantA ? color : "var(--text-muted)" }}
        >
          {pctB}%
        </motion.span>
      </div>
    </div>
  );
}

const dimensionConfig = [
  {
    letterA: "E", letterB: "I",
    labelA_en: "Extroversion", labelA_ar: "انبساطية",
    labelB_en: "Introversion", labelB_ar: "انطوائية",
    color: "#6C63FF",
  },
  {
    letterA: "S", letterB: "N",
    labelA_en: "Sensing",    labelA_ar: "الإحساس",
    labelB_en: "Intuition",  labelB_ar: "الحدس",
    color: "#00C9A7",
  },
  {
    letterA: "T", letterB: "F",
    labelA_en: "Thinking",   labelA_ar: "التفكير",
    labelB_en: "Feeling",    labelB_ar: "المشاعر",
    color: "#FF6584",
  },
  {
    letterA: "J", letterB: "P",
    labelA_en: "Judging",    labelA_ar: "الحكم",
    labelB_en: "Perceiving", labelB_ar: "الإدراك",
    color: "#FFB347",
  },
];

interface DimensionBarsProps {
  percentages: Record<string, number>;
}

export function DimensionBars({ percentages }: DimensionBarsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
      {dimensionConfig.map(({ letterA, letterB, color, ...labels }, i) => (
        <BarItem
          key={letterA}
          letterA={letterA}
          letterB={letterB}
          pctA={percentages[letterA] ?? 50}
          color={color}
          delay={i * 0.13}
          {...labels}
        />
      ))}
    </div>
  );
}
