"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, X, ShoppingCart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [showModal, setShowModal] = useState(false);

  if (loading) return <>{children}</>;

  if (!user) {
    return (
      <>
        <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowModal(true); }} className="cursor-pointer">
          {children}
        </div>

        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/40 mb-4">
                    <Lock size={28} className="text-ink" />
                  </div>
                  <h2 className="font-display text-2xl mb-2">Sign In Required</h2>
                  <p className="text-sm text-ink/60 mb-6">
                    You need an account to shop, add items to cart, and track orders. It&apos;s free and takes 30 seconds.
                  </p>

                  <div className="space-y-3">
                    <Link
                      href="/auth/signup"
                      className="block w-full rounded-xl bg-ink py-3 font-semibold text-cream hover:bg-ink/85 transition-colors text-center"
                    >
                      Create Free Account
                    </Link>
                    <Link
                      href="/auth/signin"
                      className="block w-full rounded-xl border-2 border-ink/15 py-3 font-semibold text-ink/70 hover:bg-ink/5 transition-colors text-center"
                    >
                      Already have an account? Sign In
                    </Link>
                  </div>

                  <button
                    onClick={() => setShowModal(false)}
                    className="mt-4 text-xs text-ink/40 hover:text-ink/60"
                  >
                    Maybe later
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return <>{children}</>;
}
