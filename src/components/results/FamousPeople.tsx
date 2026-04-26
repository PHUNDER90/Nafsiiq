"use client";

import { motion } from "framer-motion";

interface FamousPeopleProps {
  people: string[];
  color?: string;
}

export function FamousPeople({ people, color = "#6C63FF" }: FamousPeopleProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {people.map((name, i) => {
        const initials = name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();

        return (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.35 }}
            className="flex items-center gap-2.5"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black shadow-sm flex-shrink-0"
              style={{ background: color }}
            >
              {initials}
            </div>
            <span className="text-sm font-medium text-[var(--text)]">{name}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
