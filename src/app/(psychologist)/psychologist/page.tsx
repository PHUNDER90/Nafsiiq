"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { formatDate } from "@/lib/utils/cn";
import type { SessionResult } from "@/types";

interface NotesModal { result: SessionResult; notes: string; saving: boolean; }

export default function PsychologistPage() {
  const { token } = useAuth();
  const [results, setResults] = useState<SessionResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<NotesModal | null>(null);

  useEffect(() => {
    if (!token) { setIsLoading(false); return; }
    fetch("/api/results", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.results) setResults(d.results); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [token]);

  const saveNotes = async () => {
    if (!modal) return;
    setModal((m) => m ? { ...m, saving: true } : m);
    try {
      const res = await fetch(`/api/psychologist/${modal.result.sessionId}/notes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ notes: modal.notes }),
      });
      if (res.ok) {
        setResults((prev) => prev.map((r) =>
          r.sessionId === modal.result.sessionId
            ? { ...r, psychologistNotes: modal.notes }
            : r
        ));
        setModal(null);
      }
    } catch {}
    finally { setModal((m) => m ? { ...m, saving: false } : m); }
  };

  return (
    <div dir="rtl" className="space-y-6">
      <h1 className="text-2xl font-black text-[var(--text)]">نتائج المرضى</h1>

      {isLoading ? (
        <div className="space-y-4">{[1,2,3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}</div>
      ) : results.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent><p className="text-[var(--text-muted)]">لا توجد نتائج بعد</p></CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {results.map((r, i) => (
            <motion.div key={r.sessionId} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
                  <div className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl shadow" style={{ background: `${r.top.color}22` }}>
                    {r.top.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-[var(--text)]">{r.top.nameAr}</h3>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: r.top.color }}>
                        {r.top.percentage}%
                      </span>
                      {r.psychologistNotes && (
                        <span className="text-xs bg-[#00C9A722] text-[#00C9A7] px-2 py-0.5 rounded-full">لديه ملاحظات</span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">{formatDate(r.completedAt, "ar")}</p>
                    {r.psychologistNotes && (
                      <p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-2">{r.psychologistNotes}</p>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setModal({ result: r, notes: r.psychologistNotes ?? "", saving: false })}>
                    <MessageSquare size={14} />
                    {r.psychologistNotes ? "تعديل الملاحظات" : "إضافة ملاحظات"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-lg bg-[var(--surface)] rounded-2xl p-6 shadow-xl border border-[var(--border)]"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-[var(--text)]">ملاحظات المعالج — {modal.result.top.nameAr}</h2>
                <button onClick={() => setModal(null)} className="text-[var(--text-muted)] hover:text-[var(--text)]"><X size={18} /></button>
              </div>
              <textarea
                className="w-full h-40 p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] resize-none focus:outline-none focus:border-[var(--primary)] transition-colors"
                placeholder="اكتب ملاحظاتك هنا..."
                value={modal.notes}
                onChange={(e) => setModal((m) => m ? { ...m, notes: e.target.value } : m)}
              />
              <div className="flex gap-3 mt-4">
                <Button variant="secondary" className="flex-1" onClick={() => setModal(null)}>إلغاء</Button>
                <Button variant="gradient" className="flex-1" onClick={saveNotes} loading={modal.saving}>
                  <Save size={14} /> حفظ
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
