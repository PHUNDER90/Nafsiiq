"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import type { MBTIType } from "@/types";
import type { PersonalityInfo } from "@/lib/mbti/personalities";

interface TypeHeroCardProps {
  type: MBTIType;
  info: PersonalityInfo;
}

export function TypeHeroCard({ type, info }: TypeHeroCardProps) {
  const { locale, dir } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="rounded-2xl overflow-hidden shadow-xl relative"
      style={{
        background: `linear-gradient(135deg, ${info.color} 0%, ${info.color}CC 60%, ${info.color}88 100%)`,
      }}
    >
      {/* Dot-grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 p-8 text-white" dir={dir}>
        <div className="flex items-start gap-5">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 220, damping: 18 }}
            className="text-7xl leading-none select-none flex-shrink-0"
          >
            {info.emoji}
          </motion.div>

          <div className="flex-1 min-w-0">
            <p className="text-white/60 text-[11px] font-bold uppercase tracking-[0.22em] mb-2">
              {locale === "ar" ? "نوع شخصيتك" : "Your Personality Type"}
            </p>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="text-6xl font-black tracking-tight leading-none mb-3"
            >
              {type}
            </motion.h1>
            <h2 className="text-xl font-bold mb-1.5">
              {locale === "ar" ? info.name_ar : info.name_en}
            </h2>
            <p className="text-white/80 text-sm leading-relaxed italic">
              {locale === "ar" ? info.tagline_ar : info.tagline_en}
            </p>
          </div>
        </div>

        {/* Description strip */}
        <div className="mt-6 pt-5 border-t border-white/20">
          <p className="text-white/85 text-sm leading-relaxed">
            {locale === "ar" ? info.description_ar : info.description_en}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
