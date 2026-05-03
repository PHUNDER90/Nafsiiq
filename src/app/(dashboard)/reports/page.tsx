"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { formatDate } from "@/lib/utils/cn";
import type { SessionResult } from "@/types";

export default function ReportsPage() {
  const { token } = useAuth();
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

  const handleExportPDF = async (r: SessionResult) => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text(`Nafsiiq — ${r.top.nameAr} (${r.top.percentage}%)`, 20, 30);
      doc.setFontSize(12);
      doc.text(`Completed: ${formatDate(r.completedAt, "en")}`, 20, 44);
      doc.setFontSize(13);
      doc.text("Top 3 personalities:", 20, 60);
      doc.setFontSize(10);
      r.topThree.forEach((p, i) => doc.text(`${i + 1}. ${p.nameAr} — ${p.percentage}%`, 24, 72 + i * 10));
      doc.save(`nafsiiq_${r.top.code}_${r.sessionId}.pdf`);
    } catch (err) {
      console.error("PDF export failed", err);
    }
  };

  return (
    <div dir="rtl" className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--text)]">سجل الاختبارات</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">جميع اختباراتك السابقة</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1,2,3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}</div>
      ) : results.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <FileText size={48} className="mx-auto text-[var(--text-muted)] mb-4 opacity-40" />
            <p className="text-[var(--text-muted)]">لا توجد نتائج بعد</p>
            <Link href="/test" className="mt-4 inline-block">
              <Button variant="gradient">ابدأ الاختبار</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {results.map((r, i) => (
            <motion.div key={r.sessionId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
                  <div className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl shadow-md" style={{ background: `${r.top.color}22` }}>
                    {r.top.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-[var(--text)]">{r.top.nameAr}</h3>
                      <span className="text-sm font-bold px-2 py-0.5 rounded-full text-white" style={{ background: r.top.color }}>
                        {r.top.percentage}%
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">{formatDate(r.completedAt, "ar")}</p>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {r.topThree.slice(1).map((p) => (
                        <span key={p.personalityId} className="text-xs text-[var(--text-muted)]">{p.emoji} {p.nameAr} {p.percentage}%</span>
                      ))}
                    </div>
                    {r.psychologistNotes && (
                      <p className="text-xs text-[var(--primary)] mt-1">📝 يوجد ملاحظات من المعالج</p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link href={`/results/${r.sessionId}`}>
                      <Button variant="outline" size="sm">عرض النتيجة</Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => handleExportPDF(r)} title="تصدير PDF">
                      <Download size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
