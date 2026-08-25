"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Package, Star, MessageSquare, LogOut, Camera, Save,
  ChevronRight, Clock, Check, Truck, AlertCircle, ArrowLeft,
  Search, Eye, Phone, Mail, MapPin, Edit2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { formatPKR } from "@/lib/currency";

type Tab = "orders" | "reviews" | "support" | "profile";

type ServerOrder = {
  id: string;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  items: { productName: string; qty: number; unitPrice: number; image: string; variantLabel: string }[];
  grand_total: number;
  status: string;
  status_history: { status: string; at: string; note?: string }[];
  created_at: string;
};

type Review = {
  id: string;
  product_slug: string;
  rating: number;
  title: string;
  body: string;
  created_at: string;
};

type Ticket = {
  id: string;
  ticket_code: string;
  subject: string;
  category: string;
  status: string;
  admin_reply: string;
  created_at: string;
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock size={14} className="text-yellow-500" />,
  accepted: <Check size={14} className="text-blue-500" />,
  shipped: <Truck size={14} className="text-purple-500" />,
  payment_received: <Check size={14} className="text-green-500" />,
  delivered: <Check size={14} className="text-emerald-500" />,
  declined: <AlertCircle size={14} className="text-red-500" />,
  closed: <AlertCircle size={14} className="text-gray-400" />,
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending Review",
  accepted: "Order Accepted",
  shipped: "Shipped",
  payment_received: "Payment Confirmed",
  delivered: "Delivered",
  declined: "Declined",
  closed: "Closed",
};

export default function AccountPage() {
  const { user, profile, loading: authLoading, signOut, updateProfile } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<ServerOrder[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile editing
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editCity, setEditCity] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Redirect if not signed in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
    }
  }, [authLoading, user, router]);

  // Load data
  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const [ordersRes, reviewsRes, ticketsRes] = await Promise.all([
      supabase
        .from("orders")
        .select("id, order_code, customer_name, customer_phone, items, grand_total, status, status_history, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("reviews")
        .select("id, product_slug, rating, title, body, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("support_tickets")
        .select("id, ticket_code, subject, category, status, admin_reply, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

    setOrders(ordersRes.data || []);
    setReviews(reviewsRes.data || []);
    setTickets(ticketsRes.data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Sync profile to form
  useEffect(() => {
    if (profile) {
      setEditName(profile.full_name || "");
      setEditPhone(profile.phone || "");
      setEditAddress(profile.address || "");
      setEditCity(profile.city || "");
    }
  }, [profile]);

  async function handleSaveProfile() {
    setSaving(true);
    setSaveMsg("");
    const result = await updateProfile({
      full_name: editName,
      phone: editPhone,
      address: editAddress,
      city: editCity,
    });
    setSaving(false);
    setSaveMsg(result.error ? result.error : "Profile updated!");
    if (!result.error) setTimeout(() => setSaveMsg(""), 3000);
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-ink/50">Loading...</div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: "orders", label: "Orders", icon: <Package size={16} />, count: orders.length },
    { id: "reviews", label: "Reviews", icon: <Star size={16} />, count: reviews.length },
    { id: "support", label: "Support", icon: <MessageSquare size={16} />, count: tickets.length },
    { id: "profile", label: "Profile", icon: <User size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-ink text-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-ink font-display text-xl">
                {profile?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div>
                <h1 className="font-display text-xl">{profile?.full_name || "My Account"}</h1>
                <p className="text-xs text-cream/60">{user.email}</p>
              </div>
            </div>
            <button onClick={handleSignOut} className="rounded-lg bg-cream/10 hover:bg-red-500/30 px-3 py-2 text-xs font-semibold transition-colors">
              <LogOut size={14} className="inline mr-1" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b-2 border-ink/10 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-1 overflow-x-auto py-2 scrollbar-none">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors ${
                  tab === t.id ? "bg-ink text-cream" : "text-ink/70 hover:bg-primary/30"
                }`}
              >
                {t.icon}
                {t.label}
                {t.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tab === t.id ? "bg-cream/20" : "bg-ink/10"}`}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* ─── Orders Tab ─── */}
            {tab === "orders" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl">My Orders</h2>
                  <Link href="/track" className="text-sm font-semibold text-secondary hover:underline">
                    Track an order →
                  </Link>
                </div>

                {loading ? (
                  <div className="text-center py-12 text-ink/50">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16 rounded-xl border-2 border-ink/10 bg-white">
                    <Package size={48} className="mx-auto text-ink/20 mb-3" />
                    <p className="font-display text-xl text-ink/40">No orders yet</p>
                    <p className="text-sm text-ink/30 mt-1">Start shopping to see your orders here</p>
                    <Link href="/shop" className="mt-4 inline-block rounded-lg bg-secondary px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary/85">
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div key={order.id} className="rounded-xl border-2 border-ink/10 bg-white p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="text-sm font-bold">{order.order_code}</span>
                            <span className="text-xs text-ink/40 ml-2">{new Date(order.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {STATUS_ICONS[order.status]}
                            <span className="text-xs font-semibold">{STATUS_LABELS[order.status] || order.status}</span>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-2">
                          {order.items?.slice(0, 3).map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm">
                              <div className="w-10 h-10 rounded-lg bg-primary/30 overflow-hidden flex-shrink-0">
                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{item.productName}</p>
                                <p className="text-xs text-ink/50">{item.variantLabel} × {item.qty}</p>
                              </div>
                              <span className="text-xs font-bold">{formatPKR(item.unitPrice * item.qty)}</span>
                            </div>
                          ))}
                          {order.items?.length > 3 && (
                            <p className="text-xs text-ink/40">+{order.items.length - 3} more items</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-ink/5">
                          <span className="text-sm font-bold">Total: {formatPKR(order.grand_total)}</span>
                          <Link
                            href={`/track?code=${order.order_code}`}
                            className="text-xs font-semibold text-secondary hover:underline"
                          >
                            Track →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── Reviews Tab ─── */}
            {tab === "reviews" && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl">My Reviews</h2>
                {loading ? (
                  <div className="text-center py-12 text-ink/50">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-16 rounded-xl border-2 border-ink/10 bg-white">
                    <Star size={48} className="mx-auto text-ink/20 mb-3" />
                    <p className="font-display text-xl text-ink/40">No reviews yet</p>
                    <p className="text-sm text-ink/30 mt-1">Rate products after your purchase</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((review) => (
                      <div key={review.id} className="rounded-xl border-2 border-ink/10 bg-white p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={14}
                                className={s <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-ink/15"}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-ink/40">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-ink/50 mb-1">{review.product_slug}</p>
                        {review.title && <p className="font-semibold text-sm mb-1">{review.title}</p>}
                        <p className="text-sm text-ink/70">{review.body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── Support Tab ─── */}
            {tab === "support" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl">Support Tickets</h2>
                  <Link href="/support" className="text-sm font-semibold text-secondary hover:underline">
                    New Ticket →
                  </Link>
                </div>

                {loading ? (
                  <div className="text-center py-12 text-ink/50">Loading tickets...</div>
                ) : tickets.length === 0 ? (
                  <div className="text-center py-16 rounded-xl border-2 border-ink/10 bg-white">
                    <MessageSquare size={48} className="mx-auto text-ink/20 mb-3" />
                    <p className="font-display text-xl text-ink/40">No support tickets</p>
                    <Link href="/support" className="mt-4 inline-block rounded-lg bg-secondary px-5 py-2.5 text-sm font-semibold text-white">
                      Contact Support
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="rounded-xl border-2 border-ink/10 bg-white p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-ink/40">{ticket.ticket_code}</span>
                            <h3 className="font-semibold text-sm">{ticket.subject}</h3>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            ticket.status === "open" ? "bg-green-100 text-green-700" :
                            ticket.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                            ticket.status === "resolved" ? "bg-emerald-100 text-emerald-700" :
                            "bg-gray-100 text-gray-600"
                          }`}>
                            {ticket.status.replace("_", " ")}
                          </span>
                        </div>
                        {ticket.admin_reply && (
                          <div className="mt-3 p-3 bg-primary/30 rounded-lg">
                            <p className="text-[10px] font-semibold text-ink/40 mb-1">ADMIN REPLY</p>
                            <p className="text-sm text-ink/70">{ticket.admin_reply}</p>
                          </div>
                        )}
                        <p className="text-xs text-ink/40 mt-2">{new Date(ticket.created_at).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── Profile Tab ─── */}
            {tab === "profile" && (
              <div className="space-y-4 max-w-lg">
                <h2 className="font-display text-2xl">My Profile</h2>

                <div className="rounded-xl border-2 border-ink/10 bg-white p-5 space-y-4">
                  <div>
                    <label className="text-sm font-semibold mb-1.5 block">Full Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
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
                        value={user.email || ""}
                        disabled
                        className="w-full rounded-xl border-2 border-ink/10 bg-ink/5 pl-9 pr-4 py-2.5 text-sm text-ink/50"
                      />
                    </div>
                    <p className="text-[10px] text-ink/30 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-1.5 block">Phone</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                      <input
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="03XX-XXXXXXX"
                        maxLength={20}
                        className="w-full rounded-xl border-2 border-ink/15 bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:border-secondary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-1.5 block">Address</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-3 text-ink/40" />
                      <textarea
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        placeholder="Your delivery address"
                        rows={2}
                        maxLength={200}
                        className="w-full rounded-xl border-2 border-ink/15 bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:border-secondary resize-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-1.5 block">City</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                      <input
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                        placeholder="Karachi, Lahore, etc."
                        maxLength={50}
                        className="w-full rounded-xl border-2 border-ink/15 bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:border-secondary"
                      />
                    </div>
                  </div>

                  {saveMsg && (
                    <p className={`text-sm ${saveMsg.includes("error") || saveMsg.includes("Error") ? "text-red-500" : "text-green-600"}`}>
                      {saveMsg}
                    </p>
                  )}

                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="w-full rounded-xl bg-ink py-2.5 font-semibold text-cream hover:bg-ink/85 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Save size={16} />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>

                {/* Account info */}
                <div className="rounded-xl border-2 border-ink/10 bg-white p-5">
                  <h3 className="font-semibold text-sm mb-3">Account Info</h3>
                  <div className="space-y-2 text-sm text-ink/60">
                    <p>Member since: {new Date(user.created_at).toLocaleDateString()}</p>
                    <p>Orders: {orders.length}</p>
                    <p>Reviews: {reviews.length}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
