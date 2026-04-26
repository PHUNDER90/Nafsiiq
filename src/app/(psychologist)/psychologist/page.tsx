"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { personalities } from "@/lib/mbti/personalities";
import { formatDate } from "@/lib/utils/cn";
import type { TestResult } from "@/types";

interface NotesModal {
  result: TestResult;
  notes: string;
  saving: boolean;
}

export default function PsychologistPage() {
  const { token } = useAuth();
  const { dir, locale } = useLanguage();
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<NotesModal | null>(null);

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
      } catch {}
      finally { setIsLoading(false); }
    };
    if (token) fetchResults(); else setIsLoading(false);
  }, [token]);

  const openNotes = (result: TestResult) => {
    setModal({ result, notes: result.psychologistNotes || "", saving: false });
  };

  const saveNotes = async () => {
    if (!modal) return;
    setModal((m) => m ? { ...m, saving: true } : m);

    try {
      const res = await fetch(`/api/psychologist/${modal.result._id}/notes`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notes: modal.notes }),
      });
      if (res.ok) {
        const data = await res.json();
        setResults((prev) => prev.map((r) => r._id === data.result._id ? data.result : r));
        setModal(null);
      }
    } catch {}
    finally {
      setModal((m) => m ? { ...m, saving: false } : m);
    }
  };

  return (
    <div dir={dir} className="space-y-6">
      <h1 className="heading-sm text-[var(--text)]">
        {dir === "rtl" ? "نتائج المرضى" : "Patient Results"}
      </h1>

      {isLoading ? (
        <div className="space-y-4">{[1,2,3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}</div>
      ) : results.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <p className="text-[var(--text-muted)]">
              {dir === "rtl" ? "لا توجد نتائج بعد" : "No results yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {results.map((result, i) => {
            const info = personalities[result.type];
            return (
              <motion.div
                key={result._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
                    <div
                      className="w-14 h-14 rounded-2xl flex-shrink-0 flex flex-col items-center justify-center text-white shadow"
                      style={{ background: info.color }}
                    >
                      <span className="text-lg">{info.emoji}</span>
                      <span className="text-xs font-black">{result.type}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-[var(--text)]">
                          {locale === "ar" ? info.name_ar : info.name_en}
                        </h3>
                        <Badge variant="secondary">{result.type}</Badge>
                        {result.psychologistNotes && (
                          <Badge variant="success">{dir === "rtl" ? "لديه ملاحظات" : "Has Notes"}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-muted)]">
                        {formatDate(result.completedAt, locale)}
                      </p>
                      {result.psychologistNotes && (
                        <p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-2">
                          {result.psychologistNotes}
                        </p>
                      )}
                    </div>

                    <Button variant="outline" size="sm" onClick={() => openNotes(result)}>
                      <MessageSquare size={14} />
                      {result.psychologistNotes
                        ? (dir === "rtl" ? "تعديل الملاحظات" : "Edit Notes")
                        : (dir === "rtl" ? "إضافة ملاحظات" : "Add Notes")}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Notes modal */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir={dir}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-lg bg-[var(--surface)] rounded-2xl p-6 shadow-xl border border-[var(--border)]"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-[var(--text)]">
                  {dir === "rtl" ? "ملاحظات المعالج" : "Psychologist Notes"} — {modal.result.type}
                </h2>
                <button onClick={() => setModal(null)} className="text-[var(--text-muted)] hover:text-[var(--text)]">
                  <X size={18} />
                </button>
              </div>
              <textarea
                className="w-full h-40 p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] resize-none focus:outline-none focus:border-[var(--primary)] transition-colors"
                placeholder={dir === "rtl" ? "أكتب ملاحظاتك هنا..." : "Write your notes here..."}
                value={modal.notes}
                onChange={(e) => setModal((m) => m ? { ...m, notes: e.target.value } : m)}
              />
              <div className="flex gap-3 mt-4">
                <Button variant="secondary" className="flex-1" onClick={() => setModal(null)}>
                  {dir === "rtl" ? "إلغاء" : "Cancel"}
                </Button>
                <Button variant="gradient" className="flex-1" onClick={saveNotes} loading={modal.saving}>
                  <Save size={14} />
                  {dir === "rtl" ? "حفظ" : "Save"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
