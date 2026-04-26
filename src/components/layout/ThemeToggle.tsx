"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils/cn";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative h-9 w-9 rounded-xl flex items-center justify-center",
        "bg-[var(--surface-2)] border border-[var(--border)]",
        "hover:bg-[var(--border)] transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
        className
      )}
      aria-label="Toggle theme"
    >
      <Sun
        size={16}
        className={cn(
          "absolute transition-all duration-300",
          resolvedTheme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50"
        )}
      />
      <Moon
        size={16}
        className={cn(
          "absolute transition-all duration-300",
          resolvedTheme === "light" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
        )}
      />
    </button>
  );
}
