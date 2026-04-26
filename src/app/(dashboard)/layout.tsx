"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FlaskConical, FileText, Settings, LogOut, Menu, X
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils/cn";

const navItems = (t: (k: any) => string) => [
  { href: "/dashboard",  icon: LayoutDashboard, label: t("navDashboard") },
  { href: "/test",       icon: FlaskConical,    label: t("navTests") },
  { href: "/reports",    icon: FileText,        label: t("navReports") },
  { href: "/settings",   icon: Settings,        label: t("navSettings") },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { t, dir } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login");
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-[var(--bg)]">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full" />
      </div>
    );
  }

  const items = navItems(t);

  return (
    <div className="min-h-svh flex bg-[var(--bg)]" dir={dir}>
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 z-40 flex flex-col w-64 bg-[var(--surface)] border-e border-[var(--border)] transition-transform duration-300",
          dir === "rtl" ? "right-0" : "left-0",
          sidebarOpen ? "translate-x-0" : dir === "rtl" ? "translate-x-full lg:translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo area */}
        <div className="h-16 flex items-center px-5 border-b border-[var(--border)]">
          <Logo size={32} />
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[var(--primary)] text-white shadow-md"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="p-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text)] truncate">{user?.name}</p>
              <p className="text-xs text-[var(--text-muted)] truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); router.push("/"); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[var(--text-muted)] hover:bg-[#EF444422] hover:text-[#EF4444] transition-all"
          >
            <LogOut size={16} />
            {t("navLogout")}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={cn("flex-1 flex flex-col min-w-0", dir === "rtl" ? "lg:mr-64" : "lg:ml-64")}>
        {/* Top bar */}
        <header className="h-16 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden h-9 w-9 flex items-center justify-center rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)]"
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
