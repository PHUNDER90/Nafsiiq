"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { personalities } from "@/lib/personality/personalities";
import { formatDate } from "@/lib/utils/cn";
import type { SessionResult } from "@/types";

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { token } = useAuth();
  const [result, setResult] = useState<SessionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) { setIsLoading(false); return; }
    fetch(`/api/results/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.result) setResult(d.result); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [id, token]);

  if (isLoading) {
    return (
      <div dir="rtl" className="max-w-2xl mx-auto py-8 space-y-4">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20" dir="rtl">
        <p className="text-5xl mb-4">🔍</p>
        <p className="text-xl font-semibold text-[var(--text)] mb-4">لم يتم العثور على النتيجة</p>
        <Button onClick={() => router.push("/dashboard")}>العودة للرئيسية</Button>
      </div>
    );
  }

  const topInfo = personalities[result.top.code];

  return (
    <div dir="rtl" className="max-w-2xl mx-auto py-8 space-y-5">

      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
      >
        <ArrowRight size={16} /> رجوع
      </button>

      {/* 1 — Primary personality hero */}
      <Section delay={0.05}>
        <Card className="overflow-hidden">
          <div className="h-2 w-full" style={{ background: result.top.color }} />
          <CardContent className="p-6">
            <p className="text-xs text-[var(--text-muted)] mb-4">{formatDate(result.completedAt, "ar")}</p>
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg flex-shrink-0"
                style={{ background: `${result.top.color}22`, border: `2px solid ${result.top.color}` }}
              >
                {result.top.emoji}
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)] mb-0.5">شخصيتك الأساسية</p>
                <h1 className="text-3xl font-black text-[var(--text)]">{result.top.nameAr}</h1>
                <p className="text-lg font-bold mt-0.5" style={{ color: result.top.color }}>
                  {result.top.percentage}%
                </p>
              </div>
            </div>
            {topInfo && (
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{topInfo.descriptionAr}</p>
            )}
          </CardContent>
        </Card>
      </Section>

      {/* 2 — Top 3 */}
      <Section delay={0.15}>
        <Card>
          <CardHeader><CardTitle>أعلى 3 شخصيات لديك</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {result.topThree.map((p, i) => (
              <div key={p.personalityId}>
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-xl">{p.emoji}</span>
                  <span className="font-semibold text-sm text-[var(--text)] flex-1">{p.nameAr}</span>
                  <span className="text-sm font-bold" style={{ color: p.color }}>{p.percentage}%</span>
                </div>
                <div className="h-3 bg-[var(--border)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p.percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: p.color }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </Section>

      {/* 3 — All 10 personalities */}
      <Section delay={0.25}>
        <Card>
          <CardHeader><CardTitle>نسبتك في جميع الشخصيات العشر</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {result.all.map((p, i) => (
              <div key={p.personalityId}>
                <div className="flex items-center gap-2 mb-1">
                  <span>{p.emoji}</span>
                  <span className="text-sm text-[var(--text)] flex-1">{p.nameAr}</span>
                  <span className="text-xs font-semibold text-[var(--text-muted)]">{p.percentage}%</span>
                </div>
                <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p.percentage}%` }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.05, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: p.color }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </Section>

      {/* 4 — Traits & careers */}
      {topInfo && (
        <Section delay={0.35}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-[#00C9A7]">صفاتك البارزة</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {topInfo.traitsAr.map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm text-[var(--text)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C9A7] flex-shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-[var(--primary)]">مجالات تناسبك</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {topInfo.careersAr.map((c) => (
                    <li key={c} className="flex items-center gap-2 text-sm text-[var(--text)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] flex-shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </Section>
      )}

      {/* 5 — Psychologist notes */}
      {result.psychologistNotes && (
        <Section delay={0.45}>
          <Card>
            <CardHeader><CardTitle>ملاحظات المعالج النفسي</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{result.psychologistNotes}</p>
            </CardContent>
          </Card>
        </Section>
      )}

      {/* CTAs */}
      <Section delay={0.5}>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button variant="gradient" size="lg" className="flex-1" onClick={() => router.push("/dashboard")}>
            لوحة التحكم
          </Button>
          <Button variant="outline" size="lg" className="flex-1" onClick={() => router.push("/test")}>
            <RotateCcw size={16} /> إعادة الاختبار
          </Button>
        </div>
      </Section>
    </div>
  );
}
