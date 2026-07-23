"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, PartyPopper } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
      <div className="relative overflow-hidden rounded-lg bg-ink px-6 py-14 text-center sm:px-16">
        <div className="absolute -top-10 -left-10 h-40 w-40 bg-primary/30 blob animate-float" />
        <div className="absolute -bottom-14 -right-10 h-48 w-48 bg-mint/20 blob-alt animate-float-slow" />
        <div className="relative">
          <h2 className="font-display text-3xl sm:text-4xl text-cream">
            Get first dibs on new drops
          </h2>
          <p className="mx-auto mt-3 max-w-md text-cream/70">
            No spam, just fresh new arrivals, restocks and the occasional
            wildly good sale.
          </p>

          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-mint px-6 py-3 font-semibold text-ink"
            >
              <PartyPopper size={18} /> You&apos;re on the list!
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-6 flex max-w-md flex-col sm:flex-row gap-3"
            >
              <div className="flex flex-1 items-center gap-2 rounded-lg bg-white px-4 py-3">
                <Mail size={18} className="text-ink/55 shrink-0" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-primary px-6 py-3 font-semibold text-ink hover:bg-primary-dark transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
