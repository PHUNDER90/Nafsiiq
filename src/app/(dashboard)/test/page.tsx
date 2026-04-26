"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { questions as questionBank } from "@/lib/mbti/questions";
import { calculateScores, deriveType } from "@/lib/mbti/calculator";
import { useTestStore } from "@/store/testStore";
import { QuestionCard } from "@/components/test/QuestionCard";
import { ProgressBar } from "@/components/test/ProgressBar";
import type { TestQuestion } from "@/types";
import { cn } from "@/lib/utils/cn";

// ── Confirm submit modal ────────────────────────────────────────────────────
function ConfirmModal({
  answered,
  total,
  onConfirm,
  onCancel,
}: {
  answered: number;
  total: number;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { t, dir } = useLanguage();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir={dir}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md bg-[var(--surface)] rounded-2xl p-6 shadow-xl border border-[var(--border)]"
      >
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">✅</div>
          <h2 className="heading-sm text-[var(--text)] mb-2">{t("confirmSubmitTitle")}</h2>
          <p className="text-[var(--text-muted)] text-sm">
            {t("confirmSubmitDesc", { answered, total })}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>{t("confirmNo")}</Button>
          <Button variant="gradient" className="flex-1" onClick={onConfirm}>{t("confirmYes")}</Button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Processing screen ────────────────────────────────────────────────────────
function ProcessingScreen() {
  const { t, dir } = useLanguage();
  const typeChars = ["I", "N", "T", "J"];
  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-[var(--bg)] px-4" dir={dir}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {/* Animated brain */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-4 border-t-[var(--primary)] border-[var(--border)]"
          />
          <div className="absolute inset-3 bg-primary-gradient rounded-full flex items-center justify-center text-white text-3xl">
            🧠
          </div>
        </div>

        <h2 className="heading-md text-[var(--text)] mb-3">{t("processingTitle")}</h2>
        <p className="text-[var(--text-muted)] max-w-sm mx-auto">{t("processingDesc")}</p>

        {/* Animated personality letters */}
        <div className="flex justify-center gap-3 mt-8">
          {typeChars.map((char, i) => (
            <motion.div
              key={char}
              animate={{ y: [-8, 0, -8], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
              className="w-12 h-12 rounded-xl bg-primary-gradient text-white font-black text-lg flex items-center justify-center shadow-md"
            >
              {char}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Test Page ──────────────────────────────────────────────────────────
export default function TestPage() {
  const { t, dir, locale } = useLanguage();
  const { token } = useAuth();
  const router = useRouter();

  // Build questions with fake IDs (in production these come from API)
  const allQuestions: TestQuestion[] = useMemo(
    () => questionBank.map((q, i) => ({ ...q, _id: `q_${i + 1}` })),
    []
  );

  // ── Persistent state via Zustand (survives page reloads) ──────────────────
  const {
    answers: storedAnswers,
    currentIndex,
    setAnswer,
    setCurrentIndex,
    startTest,
    reset,
  } = useTestStore();

  // Convert array → Record for O(1) lookups
  const answers = useMemo(
    () => Object.fromEntries(storedAnswers.map((a) => [a.questionId, a])),
    [storedAnswers]
  );

  // Local UI state
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Start the test (sets startedAt timestamp once)
  useEffect(() => { startTest(); }, [startTest]);

  const currentQuestion = allQuestions[currentIndex];
  const totalQuestions = allQuestions.length;
  const answeredCount = storedAnswers.length;
  const currentAnswer = answers[currentQuestion._id];

  const handleSelect = (value: number) => {
    setAnswer({
      questionId: currentQuestion._id,
      dimension: currentQuestion.dimension,
      value,
    });
    // Auto-advance after short delay
    if (currentIndex < totalQuestions - 1) {
      setTimeout(() => {
        setDirection(1);
        setCurrentIndex(currentIndex + 1);
      }, 300);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowConfirm(true);
    }
  };

  const handleSubmit = async () => {
    setShowConfirm(false);
    setIsProcessing(true);

    const answersArray = storedAnswers;
    const scores = calculateScores(answersArray, allQuestions);
    const type = deriveType(scores);

    try {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers: answersArray, scores, type }),
      });

      await new Promise((r) => setTimeout(r, 2500));
      reset(); // Clear the persisted store

      if (res.ok) {
        const data = await res.json();
        router.push(`/results/${data.result._id}`);
      } else {
        router.push(`/results/preview?type=${type}`);
      }
    } catch {
      await new Promise((r) => setTimeout(r, 2500));
      reset();
      router.push(`/results/preview?type=${type}`);
    }
  };

  if (isProcessing) return <ProcessingScreen />;

  return (
    <div dir={dir} className="max-w-2xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="heading-sm text-[var(--text)]">{t("testTitle")}</h1>
      </div>

      {/* Segmented progress bar */}
      <ProgressBar
        current={currentIndex + 1}
        total={totalQuestions}
        answered={answeredCount}
        activeDimension={currentQuestion.dimension}
      />

      {/* Question card — slides in/out */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion._id}
          initial={{ opacity: 0, x: direction * 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -60 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <QuestionCard
            question={currentQuestion}
            index={currentIndex}
            total={totalQuestions}
            currentAnswer={currentAnswer}
            onSelect={handleSelect}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          size="md"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          {dir === "rtl" ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {t("testPrev")}
        </Button>

        {currentIndex === totalQuestions - 1 ? (
          <Button
            variant="gradient"
            size="md"
            onClick={() => setShowConfirm(true)}
            disabled={answeredCount < totalQuestions}
          >
            <CheckCircle size={18} />
            {t("testSubmit")}
          </Button>
        ) : (
          <Button variant="default" size="md" onClick={handleNext}>
            {t("testNext")}
            {dir === "rtl" ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </Button>
        )}
      </div>

      {/* Dot indicators (show first 20) */}
      <div className="flex flex-wrap justify-center gap-1.5 pt-2">
        {allQuestions.slice(0, 20).map((q, i) => (
          <button
            key={q._id}
            onClick={() => setCurrentIndex(i)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              i === currentIndex ? "w-6 bg-[var(--primary)]" :
              answers[q._id] ? "bg-[var(--secondary)]" : "bg-[var(--border)]"
            )}
          />
        ))}
        {totalQuestions > 20 && (
          <span className="text-xs text-[var(--text-muted)] ml-1">+{totalQuestions - 20}</span>
        )}
      </div>

      {/* Confirm modal */}
      <AnimatePresence>
        {showConfirm && (
          <ConfirmModal
            answered={answeredCount}
            total={totalQuestions}
            onConfirm={handleSubmit}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
