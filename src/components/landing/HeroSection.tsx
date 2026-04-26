"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Brain, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

// Animated stat card
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm"
    >
      <span className="text-3xl font-bold gradient-text">{value}</span>
      <span className="text-sm text-[var(--text-muted)] mt-1">{label}</span>
    </motion.div>
  );
}

// Floating personality type badge
function TypeBadge({ type, color, x, y, delay }: { type: string; color: string; x: string; y: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="absolute hidden lg:flex items-center gap-2 glass px-3 py-2 rounded-xl shadow-lg"
      style={{ left: x, top: y }}
    >
      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: color }}>
        {type[0]}
      </div>
      <span className="text-sm font-semibold text-[var(--text)]">{type}</span>
    </motion.div>
  );
}

export function HeroSection() {
  const { t, dir } = useLanguage();

  const floatingTypes = [
    { type: "INTJ", color: "#6C63FF", x: "5%",  y: "20%", delay: 0.8 },
    { type: "ENFP", color: "#FFB347", x: "5%",  y: "65%", delay: 1.0 },
    { type: "ISTP", color: "#A8E6CF", x: "78%", y: "18%", delay: 1.2 },
    { type: "ENTJ", color: "#FF6584", x: "80%", y: "62%", delay: 0.9 },
  ];

  return (
    <section
      id="home"
      dir={dir}
      className="relative min-h-[100svh] flex flex-col items-center justify-center bg-hero-gradient overflow-hidden pt-20"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#6C63FF0D] blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-[#00C9A70D] blur-3xl" />
      </div>

      {/* Floating type badges */}
      {floatingTypes.map((badge) => (
        <TypeBadge key={badge.type} {...badge} />
      ))}

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-[var(--primary-faint)] text-[var(--primary)] rounded-full px-4 py-1.5 text-sm font-semibold mb-6 border border-[#6C63FF33]"
        >
          <Sparkles size={14} />
          {dir === "rtl" ? "تحليل شخصية مدعوم بالذكاء الاصطناعي" : "AI-Powered Personality Analysis"}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="heading-xl text-[var(--text)] mb-6"
        >
          {(() => {
            const words = t("heroHeadline").split(" ");
            const gradientStart = Math.max(0, words.length - 2);
            return words.map((word, i) =>
              i >= gradientStart ? (
                <span key={i} className="gradient-text">{word} </span>
              ) : (
                `${word} `
              )
            );
          })()}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t("heroSubheadline")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/register">
            <Button size="xl" variant="gradient" className="group shadow-lg shadow-[#6C63FF33]">
              {t("heroCta")}
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button size="xl" variant="secondary">
              {t("heroCtaSecondary")}
            </Button>
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-2 mt-8 text-sm text-[var(--text-muted)]"
        >
          <div className="flex -space-x-2">
            {["#6C63FF", "#FF6584", "#00C9A7", "#FFB347"].map((c, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full border-2 border-[var(--bg)]"
                style={{ background: c }}
              />
            ))}
          </div>
          <span>{dir === "rtl" ? "انضم إلى أكثر من 50,000 مستخدم" : "Join 50,000+ users"}</span>
        </motion.div>
      </div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 mt-16 grid grid-cols-3 gap-4"
      >
        <StatCard value={t("heroStats1")} label={t("heroStats1Label")} />
        <StatCard value={t("heroStats2")} label={t("heroStats2Label")} />
        <StatCard value={t("heroStats3")} label={t("heroStats3Label")} />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-[var(--text-muted)]"
        >
          <ChevronDown size={28} />
        </motion.div>
      </motion.div>
    </section>
  );
}
