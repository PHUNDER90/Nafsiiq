"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, TestTube2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { formatDate } from "@/lib/utils/cn";

interface StatsData {
  totalUsers: number;
  totalTests: number;
  recentUsers: { id: string; name: string; email: string; role: string; createdAt: string }[];
  recentResults: { id: number; completedAt: string; top: { code: string; nameAr: string; emoji: string; color: string; percentage: number } | null }[];
  typeDist: { code: string; nameAr: string; emoji: string; color: string; count: number }[];
}

export default function AdminPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) { setIsLoading(false); return; }
    fetch("/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setStats(d); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [token]);

  const statCards = [
    { icon: Users,    label: "إجمالي المستخدمين", value: stats?.totalUsers ?? "—", color: "#6C63FF" },
    { icon: TestTube2, label: "إجمالي الاختبارات", value: stats?.totalTests  ?? "—", color: "#00C9A7" },
  ];

  const chartData = stats?.typeDist.map((d) => ({
    name: `${d.emoji} ${d.nameAr}`,
    count: d.count,
    color: d.color,
  })) ?? [];

  return (
    <div dir="rtl" className="space-y-8">
      <h1 className="text-2xl font-black text-[var(--text)]">لوحة الإدارة</h1>

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

      {!isLoading && chartData.length > 0 && (
        <Card>
          <CardHeader><CardTitle>توزيع الشخصيات (الأكثر شيوعاً)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 4, right: 8, left: -8, bottom: 40 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>أحدث المستخدمين</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : (
              <div className="space-y-3">
                {stats?.recentUsers.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface-2)] transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center text-white font-bold text-sm">
                      {u.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--text)] truncate">{u.name}</p>
                      <p className="text-xs text-[var(--text-muted)] truncate">{u.email}</p>
                    </div>
                    <span className="text-xs bg-[var(--surface-2)] px-2 py-0.5 rounded-full text-[var(--text-muted)]">{u.role}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>أحدث الاختبارات</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : (
              <div className="space-y-3">
                {stats?.recentResults.map((r) => r.top && (
                  <div key={r.id} className="flex items-center gap-3 p-2 rounded-lg">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${r.top.color}22` }}>
                      {r.top.emoji}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--text)]">{r.top.nameAr} — {r.top.percentage}%</p>
                      <p className="text-xs text-[var(--text-muted)]">{formatDate(r.completedAt, "ar")}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
