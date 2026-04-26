"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Syncs a state value to localStorage.
 * SSR-safe — returns defaultValue during server render.
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? (JSON.parse(stored) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const set = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof newValue === "function"
          ? (newValue as (p: T) => T)(prev)
          : newValue;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch { /* quota exceeded or private mode */ }
        return next;
      });
    },
    [key]
  );

  // Keep in sync when another tab changes the same key
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== key) return;
      try {
        setValue(e.newValue !== null ? (JSON.parse(e.newValue) as T) : defaultValue);
      } catch { /* ignore */ }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key, defaultValue]);

  return [value, set] as const;
}
