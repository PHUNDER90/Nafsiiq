"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md w-full"
      >
        {/* Animated 404 number */}
        <motion.div
          className="relative mb-8 select-none"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <span
            className="text-[10rem] font-black leading-none"
            style={{
              background: "linear-gradient(135deg, #6C63FF 0%, #00C9A7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </span>
          {/* Floating glow blobs */}
          <div
            className="absolute -top-4 -left-4 w-24 h-24 rounded-full blur-3xl opacity-30"
            style={{ background: "#6C63FF" }}
          />
          <div
            className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full blur-3xl opacity-20"
            style={{ background: "#00C9A7" }}
          />
        </motion.div>

        <motion.h1
          className="text-2xl font-bold text-[var(--text)] mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Page not found
        </motion.h1>

        <motion.p
          className="text-[var(--text-muted)] mb-8 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </motion.p>

        <motion.div
          className="flex items-center justify-center gap-3 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button variant="ghost" onClick={() => window.history.back()} className="gap-2">
            <ArrowLeft size={16} />
            Go Back
          </Button>
          <Button variant="gradient" asChild className="gap-2">
            <Link href="/">
              <Home size={16} />
              Home
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
