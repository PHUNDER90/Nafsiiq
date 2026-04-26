"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function CTASection() {
  const { dir } = useLanguage();

  return (
    <section dir={dir} className="py-24 bg-[var(--bg)] overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-primary-gradient p-12 text-center overflow-hidden"
        >
          {/* Background decorations */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
              <Sparkles size={14} />
              {dir === "rtl" ? "مجاني تمامًا للبدء" : "Completely free to start"}
            </div>

            <h2 className="heading-lg text-white mb-4">
              {dir === "rtl"
                ? "هل أنت مستعد لاكتشاف شخصيتك الحقيقية؟"
                : "Ready to Discover Your True Personality?"}
            </h2>

            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              {dir === "rtl"
                ? "انضم إلى أكثر من 50,000 شخص اكتشفوا ذواتهم من خلال تقييماتنا الشاملة."
                : "Join 50,000+ people who've discovered themselves through our comprehensive assessments."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="xl"
                  className="bg-white text-[#6C63FF] hover:bg-white/90 font-bold shadow-xl group"
                >
                  {dir === "rtl" ? "ابدأ التقييم مجانًا" : "Start Free Assessment"}
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
