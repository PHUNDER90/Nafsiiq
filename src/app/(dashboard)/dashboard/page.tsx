"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, TrendingUp, Clock, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { personalities } from "@/lib/mbti/personalities";
import { formatDate } from "@/lib/utils/cn";
import type { TestResult } from "@/types";

export default function DashboardPage() {
  const { t, dir, locale } = useLanguage();
  const { user, token } = useAuth();
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("/api/results", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchResults();
    else setIsLoading(false);
  }, [token]);

  const latestResult = results[0];
  const personalityInfo = latestResult ? personalities[latestResult.type] : null;

  return (
    <div dir={dir} className="space-y-8">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="heading-md text-[var(--text)]">
            {dir === "rtl" ? `مرحبًا، ${user?.name} 👋` : `Welcome back, ${user?.name} 👋`}
          </h1>
          <p className="text-[var(--text-muted)] mt-1">{t("dashboardSubtitle")}</p>
        </div>
        <Link href="/test">
          <Button size="lg" variant="gradient" className="group">
            <Play size={16} />
            {t("startTest")}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Award, label: dir === "rtl" ? "اختبارات مكتملة" : "Tests Completed", value: results.length, color: "#6C63FF" },
          { icon: TrendingUp, label: dir === "rtl" ? "أحدث نوع" : "Latest Type", value: latestResult?.type || "—", color: "#00C9A7" },
          { icon: Clock, label: dir === "rtl" ? "آخر اختبار" : "Last Test", value: latestResult ? formatDate(latestResult.completedAt, locale) : "—", color: "#FF6584" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}22` }}>
                    <Icon size={22} style={{ color: stat.color }} />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-muted)] mb-0.5">{stat.label}</p>
                    <div className="text-xl font-bold text-[var(--text)]">{isLoading ? <Skeleton className="h-6 w-16" /> : stat.value}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest personality result */}
        {isLoading ? (
          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <Skeleton className="h-32 w-full rounded-xl mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ) : latestResult && personalityInfo ? (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <Card className="overflow-hidden">
              <div className="h-2 w-full" style={{ background: personalityInfo.color }} />
              <CardHeader>
                <CardTitle>{dir === "rtl" ? "أحدث شخصيتك" : "Your Latest Type"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg text-center leading-none"
                    style={{ background: personalityInfo.color }}
                  >
                    {personalityInfo.emoji}
                  </div>
                  <div>
                    <p className="text-3xl font-black text-[var(--text)]">{personalityInfo.type}</p>
                    <p className="text-sm font-semibold text-[var(--text-muted)]">
                      {locale === "ar" ? personalityInfo.name_ar : personalityInfo.name_en}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed line-clamp-3">
                  {locale === "ar" ? personalityInfo.tagline_ar : personalityInfo.tagline_en}
                </p>
                <Link href={`/results/${latestResult._id}`}>
                  <Button variant="outline" className="w-full">{t("viewResult")}</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="h-full flex flex-col items-center justify-center p-8 text-center border-dashed">
              <div className="text-5xl mb-4">🧠</div>
              <h3 className="font-semibold text-[var(--text)] mb-2">{t("noResults")}</h3>
              <p className="text-sm text-[var(--text-muted)] mb-4">{t("noResultsDesc")}</p>
              <Link href="/test">
                <Button variant="gradient" size="md">{t("startTest")}</Button>
              </Link>
            </Card>
          </motion.div>
        )}

        {/* Recent results list */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t("recentResults")}</CardTitle>
              {results.length > 0 && (
                <Link href="/reports">
                  <Button variant="ghost" size="sm">{dir === "rtl" ? "عرض الكل" : "View All"}</Button>
                </Link>
              )}
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
                </div>
              ) : results.length === 0 ? (
                <div className="py-8 text-center text-[var(--text-muted)]">
                  <p>{t("noData")}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {results.slice(0, 5).map((result) => {
                    const info = personalities[result.type];
                    return (
                      <Link key={result._id} href={`/results/${result._id}`}>
                        <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--surface-2)] transition-colors cursor-pointer">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                            style={{ background: info.color }}
                          >
                            {result.type}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-[var(--text)]">
                              {locale === "ar" ? info.name_ar : info.name_en}
                            </p>
                            <p className="text-xs text-[var(--text-muted)]">
                              {t("completedOn")} {formatDate(result.completedAt, locale)}
                            </p>
                          </div>
                          <Badge variant="secondary">{result.type}</Badge>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
