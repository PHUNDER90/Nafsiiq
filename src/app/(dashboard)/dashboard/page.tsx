"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, TrendingUp, Clock, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { formatDate } from "@/lib/utils/cn";
import type { SessionResult } from "@/types";

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [results, setResults] = useState<SessionResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) { setIsLoading(false); return; }
    fetch("/api/results", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.results) setResults(d.results); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [token]);

  const latest = results[0];

  const stats = [
    { icon: Award,     label: "اختبارات مكتملة", value: results.length,                       color: "#6C63FF" },
    { icon: TrendingUp, label: "أحدث شخصية",      value: latest?.top.nameAr ?? "—",            color: "#00C9A7" },
    { icon: Clock,      label: "آخر اختبار",       value: latest ? formatDate(latest.completedAt, "ar") : "—", color: "#FF6584" },
  ];

  return (
    <div dir="rtl" className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text)]">مرحباً، {user?.name} 👋</h1>
          <p className="text-[var(--text-muted)] mt-1">اكتشف شخصيتك واعرف نسبتك في كل نوع</p>
        </div>
        <Link href="/test">
          <Button size="lg" variant="gradient" className="group">
            <Play size={16} /> ابدأ الاختبار
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1 rotate-180" />
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${s.color}22` }}>
                    <Icon size={22} style={{ color: s.color }} />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-muted)] mb-0.5">{s.label}</p>
                    <div className="text-xl font-bold text-[var(--text)]">
                      {isLoading ? <Skeleton className="h-6 w-16" /> : s.value}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest result */}
        {isLoading ? (
          <Card className="lg:col-span-1"><CardContent className="p-6"><Skeleton className="h-40 w-full rounded-xl" /></CardContent></Card>
        ) : latest ? (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-1">
            <Card className="overflow-hidden">
              <div className="h-2 w-full" style={{ background: latest.top.color }} />
              <CardHeader><CardTitle>أحدث شخصيتك</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md" style={{ background: `${latest.top.color}22` }}>
                    {latest.top.emoji}
                  </div>
                  <div>
                    <p className="text-2xl font-black text-[var(--text)]">{latest.top.nameAr}</p>
                    <p className="text-sm font-semibold" style={{ color: latest.top.color }}>{latest.top.percentage}%</p>
                  </div>
                </div>
                {/* Top 3 mini bars */}
                <div className="space-y-2">
                  {latest.topThree.map((p) => (
                    <div key={p.personalityId}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-[var(--text)]">{p.emoji} {p.nameAr}</span>
                        <span style={{ color: p.color }}>{p.percentage}%</span>
                      </div>
                      <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${p.percentage}%`, background: p.color }} />
                      </div>
                    </div>
                  ))}
                </div>
                <Link href={`/results/${latest.sessionId}`}>
                  <Button variant="outline" className="w-full">عرض النتيجة الكاملة</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <Card className="h-full flex flex-col items-center justify-center p-8 text-center border-dashed">
              <div className="text-5xl mb-4">🧠</div>
              <h3 className="font-semibold text-[var(--text)] mb-2">لم تجري اختباراً بعد</h3>
              <p className="text-sm text-[var(--text-muted)] mb-4">ابدأ اختبارك لاكتشاف شخصيتك</p>
              <Link href="/test"><Button variant="gradient" size="md">ابدأ الاختبار</Button></Link>
            </Card>
          </motion.div>
        )}

        {/* Recent results list */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>الاختبارات الأخيرة</CardTitle>
              {results.length > 0 && (
                <Link href="/reports"><Button variant="ghost" size="sm">عرض الكل</Button></Link>
              )}
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>
              ) : results.length === 0 ? (
                <div className="py-8 text-center text-[var(--text-muted)]"><p>لا توجد نتائج بعد</p></div>
              ) : (
                <div className="space-y-3">
                  {results.slice(0, 5).map((r) => (
                    <Link key={r.sessionId} href={`/results/${r.sessionId}`}>
                      <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--surface-2)] transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${r.top.color}22` }}>
                          {r.top.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-[var(--text)]">{r.top.nameAr}</p>
                          <p className="text-xs text-[var(--text-muted)]">{formatDate(r.completedAt, "ar")}</p>
                        </div>
                        <span className="text-sm font-bold flex-shrink-0" style={{ color: r.top.color }}>{r.top.percentage}%</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
