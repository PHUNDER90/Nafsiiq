"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { personalities } from "@/lib/mbti/personalities";
import { formatDate } from "@/lib/utils/cn";
import type { TestResult } from "@/types";

export default function ReportsPage() {
  const { token } = useAuth();
  const { t, dir, locale } = useLanguage();
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch("/api/results", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch {}
      finally { setIsLoading(false); }
    };
    if (token) fetch_(); else setIsLoading(false);
  }, [token]);

  const handleExportPDF = async (result: TestResult) => {
    try {
      const { jsPDF } = await import("jspdf");
      const info = personalities[result.type];
      const doc = new jsPDF();

      doc.setFontSize(22);
      doc.text(`Nafsiiq — ${result.type}`, 20, 30);

      doc.setFontSize(14);
      doc.text(info.name_en, 20, 44);
      doc.text(info.tagline_en, 20, 54);

      doc.setFontSize(11);
      doc.text(`Completed: ${formatDate(result.completedAt, "en")}`, 20, 70);

      doc.setFontSize(13);
      doc.text("Strengths:", 20, 90);
      doc.setFontSize(10);
      info.strengths_en.forEach((s, i) => doc.text(`• ${s}`, 24, 100 + i * 8));

      doc.setFontSize(13);
      doc.text("Weaknesses:", 20, 100 + info.strengths_en.length * 8 + 8);
      doc.setFontSize(10);
      info.weaknesses_en.forEach((w, i) =>
        doc.text(`• ${w}`, 24, 110 + info.strengths_en.length * 8 + i * 8)
      );

      doc.save(`nafsiiq_${result.type}_${result._id}.pdf`);
    } catch (err) {
      console.error("PDF export failed", err);
    }
  };

  return (
    <div dir={dir} className="space-y-6">
      <div>
        <h1 className="heading-sm text-[var(--text)]">{t("navReports")}</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          {dir === "rtl" ? "سجل جميع اختباراتك السابقة" : "History of all your past tests"}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
        </div>
      ) : results.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <FileText size={48} className="mx-auto text-[var(--text-muted)] mb-4 opacity-40" />
            <p className="text-[var(--text-muted)]">{t("noData")}</p>
            <Link href="/test" className="mt-4 inline-block">
              <Button variant="gradient">{t("startTest")}</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {results.map((result, i) => {
            const info = personalities[result.type];
            return (
              <motion.div
                key={result._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
                    {/* Type badge */}
                    <div
                      className="w-16 h-16 rounded-2xl flex-shrink-0 flex flex-col items-center justify-center text-white shadow-md"
                      style={{ background: info.color }}
                    >
                      <span className="text-lg">{info.emoji}</span>
                      <span className="text-xs font-black">{result.type}</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-[var(--text)]">
                          {locale === "ar" ? info.name_ar : info.name_en}
                        </h3>
                        <Badge variant="secondary">{result.type}</Badge>
                      </div>
                      <p className="text-xs text-[var(--text-muted)]">
                        {t("completedOn")} {formatDate(result.completedAt, locale)}
                      </p>
                      {result.psychologistNotes && (
                        <p className="text-xs text-[var(--primary)] mt-1 truncate">
                          📝 {dir === "rtl" ? "يوجد ملاحظات من المعالج" : "Psychologist notes available"}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <Link href={`/results/${result._id}`}>
                        <Button variant="outline" size="sm">{t("viewResult")}</Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExportPDF(result)}
                        title={dir === "rtl" ? "تصدير PDF" : "Export PDF"}
                      >
                        <Download size={14} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
