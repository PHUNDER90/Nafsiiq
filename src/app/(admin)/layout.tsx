"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, ShieldCheck, Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils/cn";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { dir } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) return (
    <div className="min-h-svh flex items-center justify-center bg-[var(--bg)]">
      <div className="animate-spin w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full" />
    </div>
  );

  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: dir === "rtl" ? "لوحة الإدارة" : "Admin Panel" },
    { href: "/admin/users", icon: Users, label: dir === "rtl" ? "المستخدمون" : "Users" },
  ];

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
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Admin</span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive ? "bg-[var(--primary)] text-white" : "text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[var(--border)] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text)]">{user?.name}</p>
              <p className="text-xs text-[var(--primary)] font-medium">Admin</p>
            </div>
          </div>
          <button
            onClick={async () => { await logout(); router.push("/login"); }}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[#EF4444] transition-colors"
          >
            <LogOut size={16} />
            {dir === "rtl" ? "تسجيل الخروج" : "Sign Out"}
          </button>
        </div>
      </aside>

      <div className={cn("flex-1 flex flex-col", dir === "rtl" ? "lg:mr-64" : "lg:ml-64")}>
        <header className="h-16 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden h-9 w-9 flex items-center justify-center rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
