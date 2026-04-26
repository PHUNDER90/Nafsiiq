"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const dimensions = [
  { titleKey: "aboutDim1", descKey: "aboutDim1Desc", color: "#6C63FF", icon: "⚡" },
  { titleKey: "aboutDim2", descKey: "aboutDim2Desc", color: "#00C9A7", icon: "🔍" },
  { titleKey: "aboutDim3", descKey: "aboutDim3Desc", color: "#FF6584", icon: "🧠" },
  { titleKey: "aboutDim4", descKey: "aboutDim4Desc", color: "#FFB347", icon: "🧩" },
] as const;

export function AboutSection() {
  const { t, dir } = useLanguage();

  return (
    <section id="about" dir={dir} className="py-24 bg-[var(--surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-[var(--primary-faint)] text-[var(--primary)] rounded-full px-4 py-1.5 text-sm font-semibold mb-4 border border-[#6C63FF33]"
            >
              {dir === "rtl" ? "🧬 العلم" : "🧬 The Science"}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="heading-lg text-[var(--text)] mb-6"
            >
              {t("aboutTitle")}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[var(--text-muted)] leading-relaxed mb-8"
            >
              {t("aboutDesc")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/register">
                <Button size="lg" variant="gradient" className="group">
                  {dir === "rtl" ? "اكتشف نوعك" : "Discover Your Type"}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right: dimensions grid */}
          <div className="grid grid-cols-2 gap-4">
            {dimensions.map((dim, i) => (
              <motion.div
                key={dim.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-2xl bg-[var(--bg)] border border-[var(--border)] card-hover"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
                  style={{ background: `${dim.color}22` }}
                >
                  {dim.icon}
                </div>
                <h4 className="font-semibold text-[var(--text)] text-sm mb-1">{t(dim.titleKey)}</h4>
                <p className="text-xs text-[var(--text-muted)]">{t(dim.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
