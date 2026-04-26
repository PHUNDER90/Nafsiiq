"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Dashboard error]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-sm w-full"
      >
        <div className="w-16 h-16 rounded-2xl bg-[#EF444422] flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="text-[#EF4444]" size={28} />
        </div>
        <h2 className="text-xl font-bold text-[var(--text)] mb-2">Something went wrong</h2>
        <p className="text-[var(--text-muted)] text-sm mb-6 leading-relaxed">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <Button variant="gradient" onClick={reset} className="gap-2">
          <RotateCcw size={16} />
          Try again
        </Button>
      </motion.div>
    </div>
  );
}
