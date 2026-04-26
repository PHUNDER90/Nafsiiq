"use client";

import { motion } from "framer-motion";
import { Brain, Briefcase, Heart, BarChart3, Users, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils/cn";

const featureIcons = [Brain, Briefcase, Heart, BarChart3, Users, TrendingUp];
const featureColors = [
  "from-[#6C63FF] to-[#8B85FF]",
  "from-[#00C9A7] to-[#33D4B8]",
  "from-[#FF6584] to-[#FF8FA3]",
  "from-[#6C63FF] to-[#00C9A7]",
  "from-[#FFB347] to-[#FFD580]",
  "from-[#FF6584] to-[#6C63FF]",
];

const featureKeys = [
  { title: "feature1Title", desc: "feature1Desc" },
  { title: "feature2Title", desc: "feature2Desc" },
  { title: "feature3Title", desc: "feature3Desc" },
  { title: "feature4Title", desc: "feature4Desc" },
  { title: "feature5Title", desc: "feature5Desc" },
  { title: "feature6Title", desc: "feature6Desc" },
] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturesSection() {
  const { t, dir } = useLanguage();

  return (
    <section id="features" dir={dir} className="py-24 bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-[var(--primary-faint)] text-[var(--primary)] rounded-full px-4 py-1.5 text-sm font-semibold mb-4 border border-[#6C63FF33]"
          >
            {dir === "rtl" ? "✨ المميزات" : "✨ Features"}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="heading-lg text-[var(--text)] mb-4"
          >
            {t("featuresTitle")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto"
          >
            {t("featuresSubtitle")}
          </motion.p>
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {featureKeys.map((key, i) => {
            const Icon = featureIcons[i];
            return (
              <motion.div
                key={key.title}
                variants={cardVariants}
                className="group relative p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)] transition-all duration-300 card-hover overflow-hidden"
              >
                {/* Background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#6C63FF08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                {/* Icon */}
                <div className={cn(
                  "relative w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-md",
                  featureColors[i]
                )}>
                  <Icon size={22} className="text-white" />
                </div>

                {/* Content */}
                <h3 className="relative font-semibold text-[var(--text)] mb-2 text-base">
                  {t(key.title)}
                </h3>
                <p className="relative text-sm text-[var(--text-muted)] leading-relaxed">
                  {t(key.desc)}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
