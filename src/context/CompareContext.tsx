"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const MAX_COMPARE = 4;

type CompareContextValue = {
  slugs: string[];
  toggleCompare: (slug: string) => void;
  isComparing: (slug: string) => boolean;
  clearCompare: () => void;
  isFull: boolean;
};

const CompareContext = createContext<CompareContextValue | null>(null);
const STORAGE_KEY = "hof_compare_v1";

export function CompareProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client hydration from localStorage after SSR mount
      if (raw) setSlugs(JSON.parse(raw));
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  }, [slugs, hydrated]);

  function toggleCompare(slug: string) {
    setSlugs((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, slug];
    });
  }

  function isComparing(slug: string) {
    return slugs.includes(slug);
  }

  return (
    <CompareContext.Provider
      value={{
        slugs,
        toggleCompare,
        isComparing,
        clearCompare: () => setSlugs([]),
        isFull: slugs.length >= MAX_COMPARE,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
