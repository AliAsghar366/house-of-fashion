"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, X, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPKR } from "@/lib/currency";

const FREE_SHIPPING_THRESHOLD = 5000;

export default function CartPage() {
  const { lineDetails, setQty, removeLine, subtotal, totalItems } = useCart();

  const remainingForFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shipProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  if (lineDetails.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-24 text-center">
        <p className="text-6xl mb-4">🛍️</p>
        <h1 className="font-display text-3xl">Your cart is empty</h1>
        <p className="mt-2 text-ink/60">Let&apos;s find something fabulous.</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 font-semibold text-ink fuzzy-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
        >
          Start Shopping <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl sm:text-4xl mb-2">Your Cart</h1>
      <p className="text-ink/60 mb-6">{totalItems} item{totalItems !== 1 ? "s" : ""} ready for checkout</p>

      <div className="mb-8 rounded-lg border-2 border-ink/10 bg-white p-4">
        <div className="flex items-center gap-2 text-sm font-medium mb-2">
          <Truck size={16} className="text-ink" />
          {remainingForFreeShip > 0 ? (
            <span>
              Add <span className="font-bold text-ink">{formatPKR(remainingForFreeShip)}</span> more for free shipping
            </span>
          ) : (
            <span className="text-mint font-bold">You&apos;ve unlocked free shipping! 🎉</span>
          )}
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-lavender">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${shipProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {lineDetails.map(({ line, unitPrice, total, name, image }) => (
              <motion.div
                layout
                key={`${line.productSlug}-${line.variantKey}`}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-4 rounded-lg border-2 border-ink/10 bg-white p-4"
              >
                <Link href={`/product/${line.productSlug}`} className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-lg bg-lavender">
                  <Image src={image} alt={name} fill className="object-cover" sizes="112px" />
                </Link>
                <div className="flex flex-1 flex-col min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/product/${line.productSlug}`} className="font-semibold text-sm sm:text-base hover:text-ink transition-colors line-clamp-2">
                      {name}
                    </Link>
                    <button
                      onClick={() => removeLine(line.productSlug, line.variantKey)}
                      className="shrink-0 rounded-full p-1.5 text-ink/65 hover:bg-red-50 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <p className="text-xs text-ink/65 mt-0.5">{line.variantLabel}</p>

                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center gap-1 rounded-full border-2 border-ink/15 bg-cream">
                      <button
                        onClick={() => setQty(line.productSlug, line.variantKey, line.qty - 1)}
                        className="rounded-full p-2 hover:bg-primary/10"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{line.qty}</span>
                      <button
                        onClick={() => setQty(line.productSlug, line.variantKey, line.qty + 1)}
                        className="rounded-full p-2 hover:bg-primary/10"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg text-ink">{formatPKR(total)}</p>
                      <p className="text-[11px] text-ink/55">{formatPKR(unitPrice)} × {line.qty}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg border-2 border-ink/10 bg-white p-5">
            <h2 className="font-display text-xl mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-ink/60">
                <span>Subtotal ({totalItems} items)</span>
                <span>{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink/60">
                <span>Shipping</span>
                <span>{remainingForFreeShip > 0 ? formatPKR(250) : "Free"}</span>
              </div>
              <div className="border-t-2 border-ink/10 pt-2 flex justify-between font-display text-lg">
                <span>Total</span>
                <span className="text-ink">
                  {formatPKR(subtotal + (remainingForFreeShip > 0 ? 250 : 0))}
                </span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-primary py-3.5 font-semibold text-ink fuzzy-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </Link>
            <Link
              href="/shop"
              className="mt-3 flex items-center justify-center gap-2 rounded-full border-2 border-ink/15 py-3 text-sm font-semibold hover:bg-ink/5 transition-colors"
            >
              <ShoppingBag size={16} /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
