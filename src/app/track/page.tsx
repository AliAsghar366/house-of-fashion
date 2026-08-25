"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Clock, Check, Truck, AlertCircle, ArrowLeft, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPKR } from "@/lib/currency";

type TrackedOrder = {
  id: string;
  order_code: string;
  customer_name: string;
  items: { productName: string; qty: number; unitPrice: number; image: string; variantLabel: string }[];
  grand_total: number;
  status: string;
  status_history: { status: string; at: string; note?: string }[];
  created_at: string;
  updated_at: string;
};

const STATUS_STEPS = [
  { key: "pending", label: "Order Placed", icon: <Package size={18} /> },
  { key: "accepted", label: "Accepted", icon: <Check size={18} /> },
  { key: "payment_received", label: "Payment Confirmed", icon: <Check size={18} /> },
  { key: "shipped", label: "Shipped", icon: <Truck size={18} /> },
  { key: "delivered", label: "Delivered", icon: <MapPin size={18} /> },
];

function getStatusIndex(status: string): number {
  const idx = STATUS_STEPS.findIndex((s) => s.key === status);
  if (idx >= 0) return idx;
  if (status === "declined" || status === "closed") return -1;
  return 0;
}

export default function TrackPage() {
  const [code, setCode] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    if (!clean) return;

    setLoading(true);
    setError("");
    setOrder(null);
    setSearched(true);

    const { data, error: dbError } = await supabase
      .from("orders")
      .select("id, order_code, customer_name, items, grand_total, status, status_history, created_at, updated_at")
      .eq("order_code", clean)
      .single();

    setLoading(false);

    if (dbError || !data) {
      setError("Order not found. Please check your order code and try again.");
    } else {
      setOrder(data);
    }
  }

  const statusIdx = order ? getStatusIndex(order.status) : 0;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-ink text-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-center">
          <h1 className="font-display text-3xl sm:text-4xl">Track Your Order</h1>
          <p className="text-sm text-cream/60 mt-2">Enter your order code to see real-time status</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Search form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                type="text"
                value={code}
                onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(""); }}
                placeholder="Enter order code (e.g. ORD-M1K8-X2A)"
                autoFocus
                className="w-full rounded-xl border-2 border-ink/15 bg-white pl-9 pr-4 py-3 text-sm font-mono outline-none focus:border-secondary transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="rounded-xl bg-secondary px-6 py-3 font-semibold text-white hover:bg-secondary/85 transition-colors disabled:opacity-50"
            >
              {loading ? "..." : "Track"}
            </button>
          </div>
        </form>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-sm text-red-500 bg-red-50 rounded-xl p-4 mb-6"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order result */}
        <AnimatePresence>
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Order header */}
              <div className="rounded-xl border-2 border-ink/10 bg-white p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs text-ink/40">Order Code</span>
                    <h2 className="font-mono text-lg font-bold">{order.order_code}</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-ink/40">Total</span>
                    <p className="text-lg font-bold">{formatPKR(order.grand_total)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-ink/50">
                  <span>Placed: {new Date(order.created_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{order.customer_name}</span>
                </div>
              </div>

              {/* Progress tracker */}
              <div className="rounded-xl border-2 border-ink/10 bg-white p-5">
                <h3 className="font-semibold text-sm mb-6">Order Progress</h3>
                <div className="relative">
                  {/* Progress line */}
                  <div className="absolute top-5 left-5 right-5 h-0.5 bg-ink/10" />
                  <div
                    className="absolute top-5 left-5 h-0.5 bg-secondary transition-all duration-500"
                    style={{ width: `${Math.max(0, (statusIdx / (STATUS_STEPS.length - 1)) * 100)}%` }}
                  />

                  {/* Steps */}
                  <div className="relative flex justify-between">
                    {STATUS_STEPS.map((step, i) => {
                      const isCompleted = i <= statusIdx;
                      const isCurrent = i === statusIdx;
                      return (
                        <div key={step.key} className="flex flex-col items-center" style={{ width: 80 }}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                            isCompleted
                              ? "bg-secondary border-secondary text-white"
                              : isCurrent
                                ? "bg-secondary/20 border-secondary text-secondary"
                                : "bg-ink/5 border-ink/15 text-ink/30"
                          }`}>
                            {step.icon}
                          </div>
                          <span className={`text-[10px] mt-2 text-center leading-tight ${
                            isCompleted ? "text-ink font-semibold" : "text-ink/40"
                          }`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Declined/Closed state */}
                {(order.status === "declined" || order.status === "closed") && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg text-sm text-red-600">
                    <AlertCircle size={14} className="inline mr-1" />
                    This order has been {order.status}. Please contact support for details.
                  </div>
                )}
              </div>

              {/* Status timeline */}
              {order.status_history && order.status_history.length > 0 && (
                <div className="rounded-xl border-2 border-ink/10 bg-white p-5">
                  <h3 className="font-semibold text-sm mb-4">Status History</h3>
                  <div className="space-y-3">
                    {order.status_history.map((entry, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                          {i < (order.status_history?.length || 0) - 1 && (
                            <div className="w-0.5 flex-1 bg-ink/10 mt-1" />
                          )}
                        </div>
                        <div className="pb-3">
                          <p className="text-sm font-semibold capitalize">{entry.status.replace("_", " ")}</p>
                          <p className="text-xs text-ink/40">{new Date(entry.at).toLocaleString()}</p>
                          {entry.note && <p className="text-xs text-ink/60 mt-0.5">{entry.note}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Items */}
              <div className="rounded-xl border-2 border-ink/10 bg-white p-5">
                <h3 className="font-semibold text-sm mb-3">Items Ordered</h3>
                <div className="space-y-2">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/30 overflow-hidden flex-shrink-0">
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.productName}</p>
                        <p className="text-xs text-ink/50">{item.variantLabel} × {item.qty}</p>
                      </div>
                      <span className="text-sm font-bold">{formatPKR(item.unitPrice * item.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Help */}
              <div className="text-center text-sm text-ink/50">
                Need help?{" "}
                <Link href="/support" className="font-semibold text-secondary hover:underline">
                  Contact Support
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!searched && !order && (
          <div className="text-center py-12">
            <Package size={64} className="mx-auto text-ink/15 mb-4" />
            <p className="font-display text-xl text-ink/30">Enter your order code above</p>
            <p className="text-sm text-ink/20 mt-1">You received this code in your order confirmation</p>
          </div>
        )}

        <Link
          href="/"
          className="mt-8 flex items-center justify-center gap-1 text-sm text-ink/50 hover:text-ink transition-colors"
        >
          <ArrowLeft size={14} /> Back to store
        </Link>
      </div>
    </div>
  );
}
