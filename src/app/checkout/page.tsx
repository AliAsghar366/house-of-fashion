"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Truck, CreditCard, Banknote, PartyPopper, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPKR } from "@/lib/currency";

const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta"];

export default function CheckoutPage() {
  const { lineDetails, subtotal, totalItems, clearCart } = useCart();
  const [payment, setPayment] = useState<"cod" | "card">("cod");
  const [placed, setPlaced] = useState(false);
  const shipping = subtotal >= 5000 ? 0 : 250;
  const total = subtotal + shipping;

  function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setPlaced(true);
    clearCart();
  }

  if (placed) {
    return (
      <div className="mx-auto max-w-lg px-4 sm:px-6 py-24 text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 12 }}
        >
          <p className="text-7xl mb-4">🎉</p>
        </motion.div>
        <h1 className="font-display text-3xl">Order Placed!</h1>
        <p className="mt-2 text-ink/60">
          Thanks for shopping with House of Fashion. This is a frontend demo, so
          no real order was charged — order confirmations and tracking will
          connect once the backend is live.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 font-semibold text-ink fuzzy-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
        >
          Keep Shopping <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  if (lineDetails.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 sm:px-6 py-24 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h1 className="font-display text-3xl">Your cart is empty</h1>
        <p className="mt-2 text-ink/60">Add something before heading to checkout.</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 font-semibold text-ink fuzzy-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
        >
          Shop Now <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handlePlaceOrder} className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl sm:text-4xl mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-lg border-2 border-ink/10 bg-white p-5">
            <h2 className="font-display text-xl mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name" placeholder="e.g. Ayesha Khan" required />
              <Field label="Phone Number" placeholder="03XX XXXXXXX" type="tel" required />
              <Field label="Email" placeholder="you@example.com" type="email" className="sm:col-span-2" required />
            </div>
          </section>

          <section className="rounded-lg border-2 border-ink/10 bg-white p-5">
            <h2 className="font-display text-xl mb-4 flex items-center gap-2">
              <Truck size={20} className="text-ink" /> Shipping Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Street Address" placeholder="House #, Street, Area" className="sm:col-span-2" required />
              <div>
                <label className="text-sm font-semibold mb-1.5 block">City</label>
                <select required className="w-full rounded-xl border-2 border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary">
                  <option value="">Select a city</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <Field label="Postal Code" placeholder="e.g. 74200" />
            </div>
          </section>

          <section className="rounded-lg border-2 border-ink/10 bg-white p-5">
            <h2 className="font-display text-xl mb-4">Payment Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPayment("cod")}
                className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-colors ${
                  payment === "cod" ? "border-primary bg-primary/5" : "border-ink/15 hover:border-primary/40"
                }`}
              >
                <Banknote size={22} className="text-ink" />
                <div>
                  <p className="font-semibold text-sm">Cash on Delivery</p>
                  <p className="text-xs text-ink/65">Pay when your order arrives</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setPayment("card")}
                className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-colors ${
                  payment === "card" ? "border-primary bg-primary/5" : "border-ink/15 hover:border-primary/40"
                }`}
              >
                <CreditCard size={22} className="text-ink" />
                <div>
                  <p className="font-semibold text-sm">Card Payment</p>
                  <p className="text-xs text-ink/65">Visa, Mastercard (coming soon)</p>
                </div>
              </button>
            </div>
            {payment === "card" && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Card Number" placeholder="1234 5678 9012 3456" className="sm:col-span-2" />
                <Field label="Expiry" placeholder="MM/YY" />
                <Field label="CVC" placeholder="123" />
              </div>
            )}
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg border-2 border-ink/10 bg-white p-5">
            <h2 className="font-display text-xl mb-4">Order Summary</h2>
            <div className="max-h-64 overflow-y-auto space-y-3 mb-4">
              {lineDetails.map(({ line, total, name, image }) => (
                <div key={`${line.productSlug}-${line.variantKey}`} className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-lavender">
                    <Image src={image} alt={name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{name}</p>
                    <p className="text-[11px] text-ink/65">Qty {line.qty}</p>
                  </div>
                  <p className="text-xs font-semibold">{formatPKR(total)}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm border-t-2 border-ink/10 pt-3">
              <div className="flex justify-between text-ink/60">
                <span>Subtotal ({totalItems})</span>
                <span>{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink/60">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : formatPKR(shipping)}</span>
              </div>
              <div className="flex justify-between font-display text-lg">
                <span>Total</span>
                <span className="text-ink">{formatPKR(total)}</span>
              </div>
            </div>
            <button
              type="submit"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3.5 font-semibold text-ink fuzzy-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              <PartyPopper size={18} /> Place Order
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
  required,
  className = "",
}: {
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-sm font-semibold mb-1.5 block">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border-2 border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
      />
    </div>
  );
}
