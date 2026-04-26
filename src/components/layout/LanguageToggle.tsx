"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils/cn";

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { locale, setLocale } = useLanguage();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "ar" : "en")}
      className={cn(
        "h-9 px-3 rounded-xl flex items-center gap-1.5 text-sm font-semibold",
        "bg-[var(--surface-2)] border border-[var(--border)]",
        "hover:bg-[var(--border)] transition-all duration-200 text-[var(--text)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
        className
      )}
      aria-label="Toggle language"
    >
      {locale === "en" ? (
        <>
          <span className="text-base leading-none">ع</span>
          <span className="hidden sm:inline text-xs">AR</span>
        </>
      ) : (
        <>
          <span className="text-base leading-none">A</span>
          <span className="hidden sm:inline text-xs">EN</span>
        </>
      )}
    </button>
  );
}
