"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const MAX_RECENT = 10;

type RecentlyViewedContextValue = {
  slugs: string[];
  addRecentlyViewed: (slug: string) => void;
};

const RecentlyViewedContext = createContext<RecentlyViewedContextValue | null>(null);
const STORAGE_KEY = "hof_recently_viewed_v1";

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    } catch {
      // storage unavailable — recently-viewed still works for this session
    }
  }, [slugs, hydrated]);

  function addRecentlyViewed(slug: string) {
    setSlugs((prev) => {
      const filtered = prev.filter((s) => s !== slug);
      return [slug, ...filtered].slice(0, MAX_RECENT);
    });
  }

  return (
    <RecentlyViewedContext.Provider value={{ slugs, addRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error("useRecentlyViewed must be used within RecentlyViewedProvider");
  return ctx;
}
