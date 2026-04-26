"use client";

import { cn } from "@/lib/utils/cn";
import { useLanguage } from "@/contexts/LanguageContext";
import type { MBTIDimension } from "@/types";

export const dimensionMeta: Record<
  MBTIDimension,
  { color: string; label_en: string; label_ar: string }
> = {
  EI: { color: "#6C63FF", label_en: "Energy",     label_ar: "الطاقة"       },
  SN: { color: "#00C9A7", label_en: "Perception",  label_ar: "الإدراك"      },
  TF: { color: "#FF6584", label_en: "Judgment",    label_ar: "اتخاذ القرار" },
  JP: { color: "#FFB347", label_en: "Lifestyle",   label_ar: "نمط الحياة"   },
};

interface DimensionBadgeProps {
  dimension: MBTIDimension;
  className?: string;
}

export function DimensionBadge({ dimension, className }: DimensionBadgeProps) {
  const { locale } = useLanguage();
  const meta = dimensionMeta[dimension];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full",
        className
      )}
      style={{
        background: `${meta.color}1A`,
        color: meta.color,
        border: `1px solid ${meta.color}33`,
      }}
    >
      <span className="font-black">{dimension}</span>
      <span className="opacity-50">·</span>
      <span>{locale === "ar" ? meta.label_ar : meta.label_en}</span>
    </span>
  );
}
