"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { useLanguage } from "@/contexts/LanguageContext";

const footerLinks = {
  product: ["navFeatures", "navHowItWorks", "navTestimonials"],
  company: ["About", "Blog", "Careers"],
  legal: ["Privacy Policy", "Terms of Service"],
};

export function Footer() {
  const { t, dir } = useLanguage();

  return (
    <footer
      dir={dir}
      className="bg-[var(--surface)] border-t border-[var(--border)] mt-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-[var(--text-muted)] leading-relaxed max-w-xs">
              {t("appDescription")}
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text)] mb-4 uppercase tracking-wider">
              {dir === "rtl" ? "المنتج" : "Product"}
            </h4>
            <ul className="space-y-3">
              {[t("navFeatures"), t("navHowItWorks"), t("navTestimonials")].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text)] mb-4 uppercase tracking-wider">
              {dir === "rtl" ? "الشركة" : "Company"}
            </h4>
            <ul className="space-y-3">
              {["About", "Blog", "Careers"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & CTA */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text)] mb-4 uppercase tracking-wider">
              {dir === "rtl" ? "تواصل معنا" : "Connect"}
            </h4>
            <div className="flex gap-3">
              {/* Twitter */}
              <a href="#" aria-label="Twitter" className="h-9 w-9 rounded-xl flex items-center justify-center bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              {/* LinkedIn */}
              <a href="#" aria-label="LinkedIn" className="h-9 w-9 rounded-xl flex items-center justify-center bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            {dir === "rtl"
              ? `© ${new Date().getFullYear()} نفسيّك. جميع الحقوق محفوظة.`
              : `© ${new Date().getFullYear()} Nafsiiq. All rights reserved.`}
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
              {dir === "rtl" ? "سياسة الخصوصية" : "Privacy Policy"}
            </a>
            <a href="#" className="text-xs text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
              {dir === "rtl" ? "شروط الخدمة" : "Terms of Service"}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
