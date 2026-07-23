"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPKR } from "@/lib/currency";

export function CartDrawer() {
  const { isOpen, closeCart, lineDetails, setQty, removeLine, subtotal, totalItems } =
    useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl"
          >
            <div className="flex items-center justify-between border-b-2 border-ink/10 px-5 py-4">
              <h2 className="font-display text-xl flex items-center gap-2">
                <ShoppingBag size={22} /> Your Cart ({totalItems})
              </h2>
              <button
                onClick={closeCart}
                className="rounded-full p-2 hover:bg-primary/10"
                aria-label="Close cart"
              >
                <X size={22} />
              </button>
            </div>

            {lineDetails.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
                <span className="text-5xl">🛍️</span>
                <p className="font-display text-lg">Your cart is feeling light</p>
                <p className="text-sm text-ink/60">
                  Add a few great finds and they&apos;ll show up here.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="mt-2 rounded-lg bg-primary px-6 py-2.5 font-semibold text-ink hover:bg-primary-dark transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                  {lineDetails.map(({ line, unitPrice, total, name, image }) => (
                    <motion.div
                      layout
                      key={`${line.productSlug}-${line.variantKey}`}
                      className="flex gap-3 rounded-lg border-2 border-ink/10 bg-white p-3"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-lavender">
                        <Image src={image} alt={name} fill className="object-cover" sizes="80px" />
                      </div>
                      <div className="flex flex-1 flex-col min-w-0">
                        <p className="truncate text-sm font-semibold">{name}</p>
                        <p className="text-xs text-ink/65">{line.variantLabel}</p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-full border-2 border-ink/15 bg-cream">
                            <button
                              onClick={() => setQty(line.productSlug, line.variantKey, line.qty - 1)}
                              className="rounded-full p-1.5 hover:bg-primary/10"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold">{line.qty}</span>
                            <button
                              onClick={() => setQty(line.productSlug, line.variantKey, line.qty + 1)}
                              className="rounded-full p-1.5 hover:bg-primary/10"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="text-sm font-bold text-ink">{formatPKR(total)}</span>
                        </div>
                        <p className="text-[11px] text-ink/55">{formatPKR(unitPrice)} / unit</p>
                      </div>
                      <button
                        onClick={() => removeLine(line.productSlug, line.variantKey)}
                        className="self-start rounded-full p-1 text-ink/65 hover:bg-red-50 hover:text-red-500"
                        aria-label="Remove item"
                      >
                        <X size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>

                <div className="border-t-2 border-ink/10 p-5 space-y-3">
                  <div className="flex items-center justify-between text-sm text-ink/60">
                    <span>Subtotal</span>
                    <span>{formatPKR(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between font-display text-lg">
                    <span>Total</span>
                    <span className="text-ink">{formatPKR(subtotal)}</span>
                  </div>
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="block rounded-lg bg-ink py-3 text-center font-semibold text-cream hover:bg-ink/80 transition-colors"
                  >
                    View Cart & Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
