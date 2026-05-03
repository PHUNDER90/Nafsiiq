"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTestStore } from "@/store/testStore";
import { QuestionCard } from "@/components/test/QuestionCard";
import { ProgressBar } from "@/components/test/ProgressBar";
import type { TestQuestion } from "@/types";

function ConfirmModal({ answered, total, onConfirm, onCancel }: {
  answered: number; total: number; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md bg-[var(--surface)] rounded-2xl p-6 shadow-xl border border-[var(--border)]"
      >
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">✅</div>
          <h2 className="text-xl font-bold text-[var(--text)] mb-2">هل أنت مستعد لإرسال إجاباتك؟</h2>
          <p className="text-[var(--text-muted)] text-sm">أجبت على {answered} من أصل {total} سؤال</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>لا، تراجع</Button>
          <Button variant="gradient" className="flex-1" onClick={onConfirm}>نعم، أرسل</Button>
        </div>
      </motion.div>
    </div>
  );
}

function ProcessingScreen() {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-[var(--bg)] px-4" dir="rtl">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-4 border-t-[var(--primary)] border-[var(--border)]"
          />
          <div className="absolute inset-3 bg-primary-gradient rounded-full flex items-center justify-center text-3xl">🧠</div>
        </div>
        <h2 className="text-2xl font-bold text-[var(--text)] mb-3">جاري تحليل شخصيتك...</h2>
        <p className="text-[var(--text-muted)] max-w-sm mx-auto">نحلل إجاباتك ونحسب نسبتك في كل شخصية</p>
      </motion.div>
    </div>
  );
}

export default function TestPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [isLoadingQ, setIsLoadingQ] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  const { answers, currentIndex, setAnswer, setCurrentIndex, startTest, reset } = useTestStore();

  useEffect(() => {
    fetch("/api/questions")
      .then((r) => r.json())
      .then((d) => { setQuestions(d.questions ?? []); startTest(); })
      .finally(() => setIsLoadingQ(false));
  }, [startTest]);

  if (isLoadingQ) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (isProcessing) return <ProcessingScreen />;

  const currentQuestion = questions[currentIndex];
  const total = questions.length;
  const answeredCount = Object.keys(answers).length;
  const selectedOptionId = currentQuestion ? answers[currentQuestion.id] : undefined;

  const handleSelect = (optionId: number) => {
    setAnswer(currentQuestion.id, optionId);
    if (currentIndex < total - 1) {
      setTimeout(() => { setDirection(1); setCurrentIndex(currentIndex + 1); }, 300);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) { setDirection(-1); setCurrentIndex(currentIndex - 1); }
  };

  const handleNext = () => {
    if (currentIndex < total - 1) { setDirection(1); setCurrentIndex(currentIndex + 1); }
    else setShowConfirm(true);
  };

  const handleSubmit = async () => {
    setShowConfirm(false);
    setIsProcessing(true);
    try {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ answers }),
      });
      await new Promise((r) => setTimeout(r, 2500));
      reset();
      if (res.ok) {
        const data = await res.json();
        router.push(`/results/${data.result.sessionId}`);
      } else {
        router.push("/dashboard");
      }
    } catch {
      await new Promise((r) => setTimeout(r, 2500));
      reset();
      router.push("/dashboard");
    }
  };

  if (!currentQuestion) return null;

  return (
    <div dir="rtl" className="max-w-2xl mx-auto py-8 space-y-6">
      <h1 className="text-xl font-bold text-[var(--text)]">اختبار الشخصية</h1>

      <ProgressBar current={currentIndex + 1} total={total} answered={answeredCount} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: direction * 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -60 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <QuestionCard
            question={currentQuestion}
            index={currentIndex}
            total={total}
            selectedOptionId={selectedOptionId}
            onSelect={handleSelect}
          />
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <Button variant="secondary" size="md" onClick={handlePrev} disabled={currentIndex === 0}>
          <ChevronRight size={18} /> السابق
        </Button>

        {currentIndex === total - 1 ? (
          <Button variant="gradient" size="md" onClick={() => setShowConfirm(true)} disabled={answeredCount < total}>
            <CheckCircle size={18} /> إرسال النتيجة
          </Button>
        ) : (
          <Button variant="default" size="md" onClick={handleNext}>
            التالي <ChevronLeft size={18} />
          </Button>
        )}
      </div>

      {/* Dot indicators */}
      <div className="flex flex-wrap justify-center gap-1.5 pt-2">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setCurrentIndex(i)}
            className={[
              "rounded-full transition-all",
              i === currentIndex ? "w-6 h-2 bg-[var(--primary)]" :
              answers[q.id] ? "w-2 h-2 bg-[var(--secondary)]" : "w-2 h-2 bg-[var(--border)]",
            ].join(" ")}
          />
        ))}
      </div>

      <AnimatePresence>
        {showConfirm && (
          <ConfirmModal
            answered={answeredCount}
            total={total}
            onConfirm={handleSubmit}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
