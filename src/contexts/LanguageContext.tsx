"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { translations, type SupportedLocale, type TranslationKey } from "@/lib/i18n/translations";

interface LanguageContextValue {
  locale: SupportedLocale;
  dir: "ltr" | "rtl";
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  setLocale: (locale: SupportedLocale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("nafsiiq_locale") as SupportedLocale | null;
    if (saved && (saved === "en" || saved === "ar")) {
      setLocaleState(saved);
      document.documentElement.lang = saved;
      document.body.dir = saved === "ar" ? "rtl" : "ltr";
    }
  }, []);

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem("nafsiiq_locale", newLocale);
    document.documentElement.lang = newLocale;
    document.body.dir = newLocale === "ar" ? "rtl" : "ltr";
  };

  const t = (key: TranslationKey, vars?: Record<string, string | number>): string => {
    let text: string = translations[locale][key] ?? translations["en"][key] ?? key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ locale, dir: locale === "ar" ? "rtl" : "ltr", t, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
