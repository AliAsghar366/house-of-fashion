"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Phone, Mail, Clock, ChevronDown, ChevronUp,
  Send, Check, AlertCircle, Package, CreditCard, Truck,
  RefreshCw, HelpCircle, ArrowLeft, User, FileText, ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

const FAQ_CATEGORIES = [
  {
    icon: <Package size={18} />,
    title: "Orders & Shipping",
    faqs: [
      { q: "How long does delivery take?", a: "Standard delivery across Pakistan takes 3-5 business days. Express delivery (Karachi) is 1-2 days. Free shipping on orders over Rs 5,000." },
      { q: "How do I track my order?", a: "Go to the Track Order page and enter your order code (e.g., ORD-M1K8-X2A). You can find this code in your confirmation message." },
      { q: "Can I change my order after placing it?", a: "You can modify your order within 2 hours of placement by contacting our support team. After that, orders enter processing and cannot be changed." },
      { q: "Do you ship internationally?", a: "Currently we ship within Pakistan only. We're working on international shipping for 2026." },
    ],
  },
  {
    icon: <CreditCard size={18} />,
    title: "Payments",
    faqs: [
      { q: "What payment methods do you accept?", a: "We accept EasyPaisa transfers and Cash on Delivery (COD). For COD, please have the exact amount ready." },
      { q: "How do I pay via EasyPaisa?", a: "Place your order, select EasyPaisa, then transfer the amount to our account. Upload the screenshot as payment receipt in the checkout form." },
      { q: "Is my payment information secure?", a: "Yes. We never store your payment details. EasyPaisa transfers are processed through their secure app. COD requires no digital payment." },
    ],
  },
  {
    icon: <RefreshCw size={18} />,
    title: "Returns & Exchanges",
    faqs: [
      { q: "What is your return policy?", a: "We offer a 7-day return policy for unworn/unused items in original packaging. Contact support to initiate a return." },
      { q: "How do I exchange an item?", a: "Contact us within 7 days with your order code and the item you'd like to exchange. We'll arrange the swap." },
      { q: "When will I get my refund?", a: "Refunds for EasyPaisa payments are processed within 3-5 business days after we receive the returned item." },
    ],
  },
  {
    icon: <HelpCircle size={18} />,
    title: "Account & General",
    faqs: [
      { q: "How do I create an account?", a: "Click 'Sign In' in the header, then 'Create Account'. You'll need your name, email, and a password." },
      { q: "Can I order without an account?", a: "Yes! You can checkout as a guest. However, creating an account lets you track orders, leave reviews, and get exclusive offers." },
      { q: "How do I leave a review?", a: "Sign in to your account, go to My Account → Reviews. You can rate and review any product you've purchased." },
    ],
  },
];

const CATEGORIES = [
  { value: "general", label: "General Inquiry" },
  { value: "order", label: "Order Issue" },
  { value: "payment", label: "Payment Problem" },
  { value: "shipping", label: "Shipping Question" },
  { value: "return", label: "Return / Exchange" },
  { value: "technical", label: "Technical Issue" },
];

export default function SupportPage() {
  const { user, profile } = useAuth();
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.full_name || "",
    email: user?.email || "",
    category: "general",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketCode, setTicketCode] = useState("");
  const [formError, setFormError] = useState("");

  // Pre-fill form when auth loads
  useEffect(() => {
    if (profile || user) {
      setFormData((prev) => ({
        ...prev,
        name: profile?.full_name || prev.name,
        email: user?.email || prev.email,
      }));
    }
  }, [profile, user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    // Sanitize
    const clean = {
      name: formData.name.trim().slice(0, 100),
      email: formData.email.trim().toLowerCase().slice(0, 200),
      category: formData.category,
      subject: formData.subject.trim().slice(0, 200),
      message: formData.message.trim().slice(0, 2000),
    };

    if (!clean.name || !clean.email || !clean.subject || !clean.message) {
      setFormError("All fields are required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)) {
      setFormError("Invalid email address");
      return;
    }

    setSubmitting(true);

    const code = `TKT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

    const { error } = await supabase.from("support_tickets").insert({
      ticket_code: code,
      user_id: user?.id || null,
      name: clean.name,
      email: clean.email,
      category: clean.category,
      subject: clean.subject,
      message: clean.message,
      status: "open",
      priority: "normal",
    });

    setSubmitting(false);

    if (error) {
      setFormError("Failed to submit ticket. Please try again.");
    } else {
      setTicketCode(code);
      setSubmitted(true);
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-ink text-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-center">
          <h1 className="font-display text-3xl sm:text-4xl">Help Center</h1>
          <p className="text-sm text-cream/60 mt-2">We&apos;re here to help. Find answers or contact us directly.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { icon: <Phone size={20} />, label: "Call Us", value: "0300-1234567", href: "tel:+923001234567" },
            { icon: <MessageSquare size={20} />, label: "WhatsApp", value: "Chat Now", href: "https://wa.me/923001234567" },
            { icon: <Mail size={20} />, label: "Email", value: "support@houseoffashion.pk", href: "mailto:support@houseoffashion.pk" },
            { icon: <Clock size={20} />, label: "Hours", value: "9AM - 9PM", href: "#" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="rounded-xl border-2 border-ink/10 bg-white p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/30 mb-2 group-hover:bg-primary/50 transition-colors">
                {item.icon}
              </div>
              <p className="text-xs font-semibold text-ink/40">{item.label}</p>
              <p className="text-sm font-bold mt-0.5">{item.value}</p>
            </a>
          ))}
        </div>

        {/* FAQs */}
        <div className="mb-10">
          <h2 className="font-display text-2xl mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {FAQ_CATEGORIES.map((cat) => (
              <div key={cat.title} className="rounded-xl border-2 border-ink/10 bg-white overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 bg-primary/20">
                  {cat.icon}
                  <h3 className="font-semibold text-sm">{cat.title}</h3>
                </div>
                <div className="divide-y divide-ink/5">
                  {cat.faqs.map((faq) => {
                    const faqKey = `${cat.title}-${faq.q}`;
                    const isOpen = openFaq === faqKey;
                    return (
                      <div key={faq.q}>
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : faqKey)}
                          className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-ink/[0.02] transition-colors"
                        >
                          <span className="text-sm font-medium pr-4">{faq.q}</span>
                          {isOpen ? <ChevronUp size={16} className="text-ink/40 flex-shrink-0" /> : <ChevronDown size={16} className="text-ink/40 flex-shrink-0" />}
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <p className="px-5 pb-4 text-sm text-ink/70 leading-relaxed">{faq.a}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="rounded-xl border-2 border-ink/10 bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl">Contact Us</h2>
              <p className="text-sm text-ink/50 mt-1">Submit a ticket and we&apos;ll get back to you within 24 hours</p>
            </div>
            {user && (
              <Link href="/account" className="text-xs font-semibold text-secondary hover:underline">
                My Tickets →
              </Link>
            )}
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h3 className="font-display text-xl mb-2">Ticket Submitted!</h3>
              <p className="text-sm text-ink/60 mb-1">Your ticket code:</p>
              <p className="font-mono text-lg font-bold mb-4">{ticketCode}</p>
              <p className="text-sm text-ink/50">We&apos;ll reply to your email within 24 hours.</p>
              {user && (
                <Link href="/account" className="mt-4 inline-block text-sm font-semibold text-secondary hover:underline">
                  View in My Account →
                </Link>
              )}
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Your Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                    <input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Full name"
                      required
                      maxLength={100}
                      className="w-full rounded-xl border-2 border-ink/15 bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:border-secondary"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-xl border-2 border-ink/15 bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:border-secondary"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border-2 border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-secondary"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Subject</label>
                  <input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief description"
                    required
                    maxLength={200}
                    className="w-full rounded-xl border-2 border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-secondary"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-1.5 block">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your issue in detail..."
                  required
                  rows={5}
                  maxLength={2000}
                  className="w-full rounded-xl border-2 border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-secondary resize-none"
                />
                <p className="text-[10px] text-ink/30 mt-1">{formData.message.length}/2000 characters</p>
              </div>

              {formError && (
                <div className="flex items-center gap-1.5 text-sm text-red-500 bg-red-50 rounded-lg p-2.5">
                  <AlertCircle size={14} />
                  {formError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto rounded-xl bg-secondary px-8 py-3 font-semibold text-white hover:bg-secondary/85 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send size={16} />
                {submitting ? "Submitting..." : "Submit Ticket"}
              </button>
            </form>
          )}
        </div>

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
