"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils/cn";

const navLinks = (t: (key: any) => string, isAuth: boolean) => [
  { label: t("navHome"), href: "#home" },
  { label: t("navFeatures"), href: "#features" },
  { label: t("navHowItWorks"), href: "#how-it-works" },
  { label: t("navTestimonials"), href: "#testimonials" },
];

export function Navbar() {
  const { t, dir } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = navLinks(t, isAuthenticated);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        isScrolled ? "glass border-b border-[var(--border)] shadow-sm" : "bg-transparent"
      )}
      dir={dir}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Logo />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right controls */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <LanguageToggle />
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button size="md" variant="default">{t("navDashboard")}</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button size="md" variant="ghost">{t("navLogin")}</Button>
              </Link>
              <Link href="/register">
                <Button size="md" variant="gradient">{t("navRegister")}</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="h-9 w-9 flex items-center justify-center rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass border-b border-[var(--border)] px-4 py-4 space-y-2"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-[var(--border)] flex flex-col gap-2">
              {isAuthenticated ? (
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full" size="md">{t("navDashboard")}</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full" variant="secondary">{t("navLogin")}</Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full" variant="gradient">{t("navRegister")}</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
