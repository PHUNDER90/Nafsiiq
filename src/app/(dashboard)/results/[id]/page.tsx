"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RotateCcw, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { personalities } from "@/lib/mbti/personalities";
import { getDimensionPercentages } from "@/lib/mbti/calculator";
import { TypeHeroCard } from "@/components/results/TypeHeroCard";
import { DimensionBars } from "@/components/results/DimensionBars";
import { MBTIRadarChart } from "@/components/results/MBTIRadarChart";
import { TraitsList } from "@/components/results/TraitsList";
import { CareerGrid } from "@/components/results/CareerGrid";
import { FamousPeople } from "@/components/results/FamousPeople";
import type { TestResult, MBTIType } from "@/types";

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, dir, locale } = useLanguage();
  const { token } = useAuth();

  const [result, setResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const previewType =
    id === "preview" ? (searchParams.get("type") as MBTIType | null) : null;

  useEffect(() => {
    if (previewType) { setIsLoading(false); return; }
    if (!token) { setIsLoading(false); return; }
    fetch(`/api/results/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data?.result) setResult(data.result); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [id, token, previewType]);

  const mbtiType: MBTIType | null = result?.type ?? previewType ?? null;
  const info = mbtiType ? personalities[mbtiType] : null;
  const percentages = result?.scores ? getDimensionPercentages(result.scores) : null;

  if (isLoading) {
    return (
      <div dir={dir} className="max-w-3xl mx-auto py-8 space-y-5">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-56 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (!info || !mbtiType) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20" dir={dir}>
        <p className="text-5xl mb-4">🔍</p>
        <p className="text-xl font-semibold text-[var(--text)] mb-2">
          {locale === "ar" ? "لم يتم العثور على النتيجة" : "Result not found"}
        </p>
        <p className="text-[var(--text-muted)] mb-6">{t("noData")}</p>
        <Button onClick={() => router.push("/dashboard")}>{t("back")}</Button>
      </div>
    );
  }

  const strengthsKey  = locale === "ar" ? "strengths_ar"  : "strengths_en"  as const;
  const weaknessesKey = locale === "ar" ? "weaknesses_ar" : "weaknesses_en" as const;
  const careersKey    = locale === "ar" ? "careers_ar"    : "careers_en"    as const;

  return (
    <div id="result-content" dir={dir} className="max-w-3xl mx-auto py-8 space-y-5">

      {/* Actions row */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
        >
          <ArrowLeft size={16} className={dir === "rtl" ? "rotate-180" : ""} />
          {t("back")}
        </button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/test")}>
            <RotateCcw size={14} />
            {locale === "ar" ? "إعادة" : "Retake"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigator.share?.({ title: `My MBTI: ${mbtiType}`, url: window.location.href })}
          >
            <Share2 size={14} />
            {locale === "ar" ? "مشاركة" : "Share"}
          </Button>
        </div>
      </div>

      {/* 1. Type hero */}
      <Section delay={0.05}>
        <TypeHeroCard type={mbtiType} info={info} />
      </Section>

      {/* 2. Dimension bars */}
      {percentages && (
        <Section delay={0.15}>
          <Card>
            <CardHeader><CardTitle>{t("yourScores")}</CardTitle></CardHeader>
            <CardContent>
              <DimensionBars percentages={percentages} />
            </CardContent>
          </Card>
        </Section>
      )}

      {/* 3. Radar chart */}
      {percentages && (
        <Section delay={0.22}>
          <Card>
            <CardHeader>
              <CardTitle>
                {locale === "ar" ? "مخطط الشخصية الشعاعي" : "Personality Radar"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MBTIRadarChart percentages={percentages} color={info.color} />
            </CardContent>
          </Card>
        </Section>
      )}

      {/* 4. Strengths & Weaknesses */}
      <Section delay={0.3}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle className="text-[#00C9A7]">{t("strengths")}</CardTitle></CardHeader>
            <CardContent>
              <TraitsList items={info[strengthsKey]} variant="strength" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-[#FF6584]">{t("weaknesses")}</CardTitle></CardHeader>
            <CardContent>
              <TraitsList items={info[weaknessesKey]} variant="weakness" />
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* 5. Career suggestions */}
      <Section delay={0.38}>
        <Card>
          <CardHeader><CardTitle>{t("careerSuggestions")}</CardTitle></CardHeader>
          <CardContent>
            <CareerGrid careers={info[careersKey]} color={info.color} />
          </CardContent>
        </Card>
      </Section>

      {/* 6. Famous people */}
      {info.famous_en.length > 0 && (
        <Section delay={0.45}>
          <Card>
            <CardHeader>
              <CardTitle>
                {locale === "ar" ? "أشخاص مشهورون بهذا النوع" : "Famous People with This Type"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FamousPeople people={info.famous_en} color={info.color} />
            </CardContent>
          </Card>
        </Section>
      )}

      {/* 7. Psychologist notes */}
      {result?.psychologistNotes && (
        <Section delay={0.52}>
          <Card>
            <CardHeader>
              <CardTitle>
                {locale === "ar" ? "ملاحظات المعالج النفسي" : "Psychologist Notes"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                {result.psychologistNotes}
              </p>
            </CardContent>
          </Card>
        </Section>
      )}

      {/* Bottom CTAs */}
      <Section delay={0.56}>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button variant="gradient" size="lg" className="flex-1" onClick={() => router.push("/dashboard")}>
            {locale === "ar" ? "لوحة التحكم" : "Go to Dashboard"}
          </Button>
          <Button variant="outline" size="lg" className="flex-1" onClick={() => router.push("/test")}>
            <RotateCcw size={16} />
            {t("takeAgain")}
          </Button>
        </div>
      </Section>
    </div>
  );
}
