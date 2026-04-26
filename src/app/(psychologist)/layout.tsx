"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Menu } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils/cn";

export default function PsychologistLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { dir } = useLanguage();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user?.role !== "psychologist" && user?.role !== "admin"))) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) return (
    <div className="min-h-svh flex items-center justify-center bg-[var(--bg)]">
      <div className="animate-spin w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-svh flex bg-[var(--bg)]" dir={dir}>
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={cn(
        "fixed top-0 bottom-0 z-40 flex flex-col w-64 bg-[var(--surface)] border-e border-[var(--border)] transition-transform duration-300",
        dir === "rtl" ? "right-0" : "left-0",
        sidebarOpen ? "translate-x-0" : dir === "rtl" ? "translate-x-full lg:translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-16 flex items-center px-5 border-b border-[var(--border)] gap-3">
          <Logo size={28} />
          <span className="text-xs font-bold text-[#00C9A7] uppercase tracking-wider">
            {dir === "rtl" ? "معالج" : "Psych"}
          </span>
        </div>
        <nav className="flex-1 py-4 px-3">
          <Link
            href="/psychologist"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-[var(--primary)] text-white"
          >
            <LayoutDashboard size={18} />
            {dir === "rtl" ? "نتائج المرضى" : "Patient Results"}
          </Link>
        </nav>
        <div className="p-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00C9A7] flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text)]">{user?.name}</p>
              <p className="text-xs text-[#00C9A7] font-medium">
                {dir === "rtl" ? "معالج نفسي" : "Psychologist"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className={cn("flex-1 flex flex-col", dir === "rtl" ? "lg:mr-64" : "lg:ml-64")}>
        <header className="h-16 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-4 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden h-9 w-9 flex items-center justify-center rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
