"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { tieredUnitPrice } from "@/lib/pricing";
import { getProduct } from "@/data/products";

export type CartLine = {
  productSlug: string;
  variantKey: string;
  variantLabel: string;
  qty: number;
};

type CartContextValue = {
  lines: CartLine[];
  addToCart: (productSlug: string, variantKey: string, variantLabel: string, qty: number) => void;
  removeLine: (productSlug: string, variantKey: string) => void;
  setQty: (productSlug: string, variantKey: string, qty: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  subtotal: number;
  lineDetails: {
    line: CartLine;
    unitPrice: number;
    total: number;
    name: string;
    image: string;
  }[];
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "hof_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client hydration from localStorage after SSR mount
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // storage unavailable (private browsing, quota exceeded, etc.) — cart still works for this session
    }
  }, [lines, hydrated]);

  function addToCart(productSlug: string, variantKey: string, variantLabel: string, qty: number) {
    setLines((prev) => {
      const existing = prev.find(
        (l) => l.productSlug === productSlug && l.variantKey === variantKey
      );
      if (existing) {
        return prev.map((l) =>
          l.productSlug === productSlug && l.variantKey === variantKey
            ? { ...l, qty: l.qty + qty }
            : l
        );
      }
      return [...prev, { productSlug, variantKey, variantLabel, qty }];
    });
    setIsOpen(true);
  }

  function removeLine(productSlug: string, variantKey: string) {
    setLines((prev) =>
      prev.filter((l) => !(l.productSlug === productSlug && l.variantKey === variantKey))
    );
  }

  function setQty(productSlug: string, variantKey: string, qty: number) {
    if (qty < 1) return;
    setLines((prev) =>
      prev.map((l) =>
        l.productSlug === productSlug && l.variantKey === variantKey ? { ...l, qty } : l
      )
    );
  }

  function clearCart() {
    setLines([]);
  }

  const lineDetails = useMemo(() => {
    return lines
      .map((line) => {
        const product = getProduct(line.productSlug);
        if (!product) return null;
        const unitPrice = tieredUnitPrice(product.tiers, line.qty);
        return {
          line,
          unitPrice,
          total: unitPrice * line.qty,
          name: product.name,
          image: product.images[0],
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [lines]);

  const totalItems = lines.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = lineDetails.reduce((sum, l) => sum + l.total, 0);

  return (
    <CartContext.Provider
      value={{
        lines,
        addToCart,
        removeLine,
        setQty,
        clearCart,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        totalItems,
        subtotal,
        lineDetails,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
