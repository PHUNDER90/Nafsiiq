"use client";

import { motion } from "framer-motion";
import { ClipboardList, Cpu, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const steps = [
  { icon: ClipboardList, color: "#6C63FF", titleKey: "how1Title", descKey: "how1Desc" },
  { icon: Cpu,           color: "#00C9A7", titleKey: "how2Title", descKey: "how2Desc" },
  { icon: FileText,      color: "#FF6584", titleKey: "how3Title", descKey: "how3Desc" },
] as const;

export function HowItWorksSection() {
  const { t, dir } = useLanguage();

  return (
    <section id="how-it-works" dir={dir} className="py-24 bg-[var(--surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-[var(--primary-faint)] text-[var(--primary)] rounded-full px-4 py-1.5 text-sm font-semibold mb-4 border border-[#6C63FF33]"
          >
            {dir === "rtl" ? "🔄 الطريقة" : "🔄 Process"}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="heading-lg text-[var(--text)] mb-4"
          >
            {t("howTitle")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[var(--text-muted)] max-w-xl mx-auto"
          >
            {t("howSubtitle")}
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-[#6C63FF] via-[#00C9A7] to-[#FF6584] opacity-30" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.titleKey}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="flex flex-col items-center text-center relative"
                >
                  {/* Step number ring */}
                  <div className="relative mb-6">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg mb-0 animate-pulse-glow"
                      style={{ background: `${step.color}22`, border: `2px solid ${step.color}44` }}
                    >
                      <Icon size={32} style={{ color: step.color }} />
                    </div>
                    <div
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center shadow"
                      style={{ background: step.color }}
                    >
                      {i + 1}
                    </div>
                  </div>

                  <h3 className="heading-sm text-[var(--text)] mb-3">{t(step.titleKey)}</h3>
                  <p className="text-[var(--text-muted)] leading-relaxed max-w-xs">{t(step.descKey)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
