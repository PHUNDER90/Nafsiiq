"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";

const cfg = {
  strength: { Icon: CheckCircle2, color: "#00C9A7", bg: "#00C9A712" },
  weakness: { Icon: AlertCircle,  color: "#FF6584", bg: "#FF658412" },
} as const;

interface TraitsListProps {
  items: string[];
  variant: "strength" | "weakness";
}

export function TraitsList({ items, variant }: TraitsListProps) {
  const { Icon, color, bg } = cfg[variant];

  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <motion.li
          key={item}
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.07, duration: 0.3 }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text)]"
          style={{ background: bg }}
        >
          <Icon size={14} style={{ color }} className="flex-shrink-0" />
          <span>{item}</span>
        </motion.li>
      ))}
    </ul>
  );
}
