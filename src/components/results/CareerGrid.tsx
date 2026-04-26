"use client";

import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

interface CareerGridProps {
  careers: string[];
  color?: string;
}

export function CareerGrid({ careers, color = "#6C63FF" }: CareerGridProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {careers.map((career, i) => (
        <motion.div
          key={career}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.07, duration: 0.3, ease: "backOut" }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-[var(--text)]"
          style={{
            background: `${color}12`,
            border: `1px solid ${color}28`,
          }}
        >
          <Briefcase size={12} style={{ color }} />
          {career}
        </motion.div>
      ))}
    </div>
  );
}
