"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Truck, CreditCard, Banknote, PartyPopper, ArrowRight, Upload, MessageCircle, Copy, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import { formatPKR } from "@/lib/currency";
import { Lock } from "lucide-react";

const EASYPAISA_NUMBER = "+923120744554";
const WHATSAPP_URL = `https://wa.me/${EASYPAISA_NUMBER.replace(/[^0-9]/g, "")}`;

export default function CheckoutPage() {
  const { lineDetails, subtotal, totalItems, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user, loading } = useAuth();
  const [payment, setPayment] = useState<"easypaisa" | "cod">("easypaisa");
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [placed, setPlaced] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [orderResult, setOrderResult] = useState<{ id: string; total: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const shipping = subtotal >= 5000 ? 0 : 250;
  const total = subtotal + shipping;

  if (!loading && !user) {
    return (
      <div className="mx-auto max-w-lg px-4 sm:px-6 py-24 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/40 mb-4">
          <Lock size={28} className="text-ink" />
        </div>
        <h1 className="font-display text-3xl">Sign In Required</h1>
        <p className="mt-2 text-ink/60">You need an account to place orders.</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/auth/signup" className="rounded-lg bg-ink px-6 py-3 font-semibold text-cream hover:bg-ink/85 transition-colors">
            Create Free Account
          </Link>
          <Link href="/auth/signin" className="rounded-lg border-2 border-ink/15 px-6 py-3 font-semibold text-ink/70 hover:bg-ink/5 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  function handleReceiptUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setReceiptImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  function copyNumber() {
    navigator.clipboard.writeText(EASYPAISA_NUMBER).catch(() => {});
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  }

  function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const newOrder = addOrder({
      items: lineDetails.map((l) => ({
        productSlug: l.line.productSlug,
        productName: l.name,
        variantKey: l.line.variantKey,
        variantLabel: l.line.variantLabel,
        qty: l.line.qty,
        unitPrice: l.unitPrice,
        image: l.image,
      })),
      customerName: ((formData.get("name") as string) || "").replace(/<[^>]*>/g, "").trim().slice(0, 100),
      customerPhone: ((formData.get("phone") as string) || "").replace(/[^0-9+\-\s()]/g, "").trim().slice(0, 20),
      customerEmail: ((formData.get("email") as string) || "").trim().toLowerCase().slice(0, 200),
      paymentMethod: payment,
      receiptImage: receiptImage || undefined,
      total: subtotal,
      shipping,
      grandTotal: total,
    });

    setOrderResult({ id: newOrder.id, total });
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
        {orderResult && (
          <p className="mt-2 text-sm text-[#191510]/60">
            Order ID: <span className="font-bold text-[#191510]">{orderResult.id}</span>
          </p>
        )}
        <p className="mt-2 text-sm text-[#191510]/60">
          {payment === "easypaisa"
            ? "If you haven't uploaded your receipt yet, please send it via WhatsApp with your order ID."
            : "Your order will be confirmed shortly. Cash on delivery — pay when it arrives."}
        </p>
        <div className="mt-4 flex flex-col items-center gap-3">
          <a
            href={`${WHATSAPP_URL}?text=${encodeURIComponent(`Hi! I just placed order ${orderResult?.id}. Total: ${formatPKR(orderResult?.total || 0)}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 font-semibold text-white hover:bg-[#20BA5C] transition-colors"
          >
            <MessageCircle size={18} /> Confirm on WhatsApp
          </a>
          <Link
            href="/shop"
            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 font-semibold text-ink fuzzy-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            Keep Shopping <ArrowRight size={18} />
          </Link>
        </div>
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
          {/* Contact Info */}
          <section className="rounded-lg border-2 border-ink/10 bg-white p-5">
            <h2 className="font-display text-xl mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name" name="name" placeholder="e.g. Ayesha Khan" required />
              <Field label="Phone Number" name="phone" placeholder="03XX XXXXXXX" type="tel" required />
              <Field label="Email" name="email" placeholder="you@example.com" type="email" className="sm:col-span-2" required />
            </div>
          </section>

          {/* EasyPaisa Payment */}
          <section className="rounded-lg border-2 border-ink/10 bg-white p-5">
            <h2 className="font-display text-xl mb-4">Payment Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPayment("easypaisa")}
                className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-colors ${
                  payment === "easypaisa" ? "border-primary bg-primary/5" : "border-ink/15 hover:border-primary/40"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-700 font-bold text-xs">EP</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">EasyPaisa Transfer</p>
                  <p className="text-xs text-ink/65">Send to the number below</p>
                </div>
              </button>
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
            </div>

            {payment === "easypaisa" && (
              <div className="mt-4 space-y-4">
                {/* EasyPaisa Number */}
                <div className="rounded-xl bg-green-50 border-2 border-green-200 p-4">
                  <p className="text-sm font-semibold text-green-800 mb-2">Send payment to:</p>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-xl text-green-900 tracking-wide">{EASYPAISA_NUMBER}</span>
                    <button
                      type="button"
                      onClick={copyNumber}
                      className="rounded-lg bg-green-200 p-2 hover:bg-green-300 transition-colors"
                    >
                      {copiedNumber ? <Check size={14} className="text-green-700" /> : <Copy size={14} className="text-green-700" />}
                    </button>
                  </div>
                  <p className="text-xs text-green-700 mt-2">
                    Send <strong>{formatPKR(total)}</strong> via EasyPaisa, then upload your receipt below.
                  </p>
                </div>

                {/* Receipt Upload */}
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Upload Payment Receipt</label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-3 rounded-xl border-2 border-dashed border-ink/20 bg-[#fef3b0]/30 p-4 cursor-pointer hover:border-[#e8734a]/50 transition-colors"
                  >
                    <Upload size={20} className="text-ink/50" />
                    <div>
                      <p className="text-sm font-semibold">Click to upload receipt</p>
                      <p className="text-xs text-ink/50">JPG, PNG or PDF — screenshot of your EasyPaisa confirmation</p>
                    </div>
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleReceiptUpload}
                    className="hidden"
                  />
                  {receiptImage && (
                    <div className="mt-3 relative">
                      <div className="relative h-32 w-32 overflow-hidden rounded-lg border-2 border-ink/10">
                        <Image src={receiptImage} alt="Receipt" fill className="object-contain bg-white" sizes="128px" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setReceiptImage(null)}
                        className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white p-1 hover:bg-red-600"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                      </button>
                      <p className="text-xs text-green-700 mt-1">✓ Receipt uploaded</p>
                    </div>
                  )}
                </div>

                {/* WhatsApp Link */}
                <a
                  href={`${WHATSAPP_URL}?text=${encodeURIComponent("Hi! I'd like to place an order from House of Fashion.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-[#25D366]/10 border-2 border-[#25D366]/30 p-4 hover:bg-[#25D366]/20 transition-colors"
                >
                  <MessageCircle size={22} className="text-[#25D366]" />
                  <div>
                    <p className="font-semibold text-sm text-[#25D366]">Need help? Chat on WhatsApp</p>
                    <p className="text-xs text-ink/65">Send us a message for order assistance</p>
                  </div>
                </a>
              </div>
            )}
          </section>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg border-2 border-ink/10 bg-white p-5">
            <h2 className="font-display text-xl mb-4">Order Summary</h2>
            <div className="max-h-64 overflow-y-auto space-y-3 mb-4">
              {lineDetails.map(({ line, total: lineTotal, name, image }) => (
                <div key={`${line.productSlug}-${line.variantKey}`} className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-lavender">
                    <Image src={image} alt={name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{name}</p>
                    <p className="text-[11px] text-ink/65">Qty {line.qty}</p>
                  </div>
                  <p className="text-xs font-semibold">{formatPKR(lineTotal)}</p>
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
  name,
  placeholder,
  type = "text",
  required,
  className = "",
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-sm font-semibold mb-1.5 block">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border-2 border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
      />
    </div>
  );
}
