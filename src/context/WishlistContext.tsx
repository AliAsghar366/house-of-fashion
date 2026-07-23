"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type WishlistContextValue = {
  slugs: string[];
  toggleWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "hof_wishlist_v1";

export function WishlistProvider({ children }: { children: ReactNode }) {
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

  function toggleWishlist(slug: string) {
    setSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  function isWishlisted(slug: string) {
    return slugs.includes(slug);
  }

  return (
    <WishlistContext.Provider value={{ slugs, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
