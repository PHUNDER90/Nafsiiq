"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, TestTube2, BarChart3, Activity } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { personalities } from "@/lib/mbti/personalities";
import { formatDate } from "@/lib/utils/cn";

interface StatsData {
  totalUsers: number;
  totalTests: number;
  recentUsers: { _id: string; name: string; email: string; role: string; createdAt: string }[];
  recentResults: { _id: string; type: string; completedAt: string }[];
  typeDist: { _id: string; count: number }[];
}

export default function AdminPage() {
  const { token } = useAuth();
  const { dir, locale } = useLanguage();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setStats(await res.json());
      } catch {}
      finally { setIsLoading(false); }
    };
    if (token) fetchStats(); else setIsLoading(false);
  }, [token]);

  const statCards = [
    { icon: Users, label: dir === "rtl" ? "إجمالي المستخدمين" : "Total Users", value: stats?.totalUsers ?? "—", color: "#6C63FF" },
    { icon: TestTube2, label: dir === "rtl" ? "إجمالي الاختبارات" : "Total Tests", value: stats?.totalTests ?? "—", color: "#00C9A7" },
  ];

  const chartData = stats?.typeDist.slice(0, 8).map((d) => ({
    type: d._id,
    count: d.count,
    color: personalities[d._id as keyof typeof personalities]?.color || "#6C63FF",
  })) || [];

  return (
    <div dir={dir} className="space-y-8">
      <h1 className="heading-sm text-[var(--text)]">{dir === "rtl" ? "لوحة الإدارة" : "Admin Panel"}</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${s.color}22` }}>
                    <Icon size={22} style={{ color: s.color }} />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">{s.label}</p>
                    {isLoading ? <Skeleton className="h-7 w-16 mt-1" /> : <p className="text-2xl font-black text-[var(--text)]">{s.value}</p>}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Type distribution chart */}
      {!isLoading && chartData.length > 0 && (
        <Card>
          <CardHeader><CardTitle>{dir === "rtl" ? "توزيع الشخصيات" : "Personality Distribution"}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
                <XAxis dataKey="type" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent users */}
        <Card>
          <CardHeader><CardTitle>{dir === "rtl" ? "أحدث المستخدمين" : "Recent Users"}</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : (
              <div className="space-y-3">
                {stats?.recentUsers.map((u) => (
                  <div key={u._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface-2)] transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center text-white font-bold text-sm">
                      {u.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--text)] truncate">{u.name}</p>
                      <p className="text-xs text-[var(--text-muted)] truncate">{u.email}</p>
                    </div>
                    <Badge variant="secondary">{u.role}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent results */}
        <Card>
          <CardHeader><CardTitle>{dir === "rtl" ? "أحدث النتائج" : "Recent Results"}</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : (
              <div className="space-y-3">
                {stats?.recentResults.map((r) => {
                  const info = personalities[r.type as keyof typeof personalities];
                  return (
                    <div key={r._id} className="flex items-center gap-3 p-2 rounded-lg">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: info?.color }}>
                        {r.type}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--text)]">{locale === "ar" ? info?.name_ar : info?.name_en}</p>
                        <p className="text-xs text-[var(--text-muted)]">{formatDate(r.completedAt, locale)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
