"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Lock, Eye, EyeOff, Package, ShoppingCart, BarChart3, Tag,
  LogOut, ChevronDown, Check, X, Search, Filter, Plus, Trash2,
  Edit3, Save, Users, Globe, Monitor, Smartphone, Tablet,
  ArrowLeft, ExternalLink, TrendingUp, Calendar, AlertCircle, ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrders, type Order, type OrderStatus } from "@/context/OrderContext";
import {
  useDynamicProducts,
  type DynamicProduct,
  type DynamicCategory,
} from "@/context/DynamicProductContext";
import { formatPKR } from "@/lib/currency";
import { getAnalyticsSummary, seedAnalyticsData } from "@/lib/analytics";

const ADMIN_PASSWORD = "1234abcd";

const STATUS_OPTIONS: { value: OrderStatus; label: string; color: string }[] = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "accepted", label: "Accepted", color: "bg-blue-100 text-blue-800" },
  { value: "shipped", label: "Shipped", color: "bg-purple-100 text-purple-800" },
  { value: "payment_received", label: "Payment Received", color: "bg-green-100 text-green-800" },
  { value: "delivered", label: "Delivered", color: "bg-emerald-100 text-emerald-800" },
  { value: "declined", label: "Declined", color: "bg-red-100 text-red-800" },
  { value: "closed", label: "Closed", color: "bg-gray-100 text-gray-800" },
];

type AdminTab = "orders" | "products" | "categories" | "analytics";

// ===================== LOGIN =====================
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("hof_admin_auth", "true");
      onLogin();
    } else {
      setError("Incorrect password. Try again.");
      setPassword("");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fef3b0] via-[#fff8e7] to-[#61ce70]/20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="rounded-2xl border-2 border-[#191510]/10 bg-white p-8 shadow-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#fef3b0] mb-4">
              <Lock size={28} className="text-[#191510]" />
            </div>
            <h1 className="font-display text-3xl text-[#191510]">Admin Panel</h1>
            <p className="text-sm text-[#191510]/60 mt-1">House of Fashion Management</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-1.5 block text-[#191510]">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter admin password"
                  autoFocus
                  className="w-full rounded-xl border-2 border-[#191510]/15 bg-white px-4 py-3 pr-12 text-sm outline-none focus:border-[#e8734a] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#191510]/50 hover:text-[#191510]"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 flex items-center gap-1"
              >
                <AlertCircle size={14} /> {error}
              </motion.p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-[#191510] py-3 font-semibold text-[#fef3b0] hover:bg-[#191510]/85 transition-colors"
            >
              Sign In
            </button>
          </form>

          <Link
            href="/"
            className="mt-4 flex items-center justify-center gap-1 text-sm text-[#191510]/60 hover:text-[#191510] transition-colors"
          >
            <ArrowLeft size={14} /> Back to store
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// ===================== ORDERS TAB =====================
function OrdersTab() {
  const { orders, updateOrderStatus } = useOrders();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        !searchQuery ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerPhone.includes(searchQuery) ||
        o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#191510]/50" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID, name, phone, or email..."
            className="w-full rounded-xl border-2 border-[#191510]/15 bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#e8734a]"
          />
        </div>
        <div className="relative">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#191510]/50" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
            className="rounded-xl border-2 border-[#191510]/15 bg-white pl-9 pr-10 py-2.5 text-sm outline-none focus:border-[#e8734a] appearance-none"
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#191510]/50 pointer-events-none" />
        </div>
      </div>

      <div className="text-sm text-[#191510]/60">
        Showing {filteredOrders.length} of {orders.length} orders
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart size={48} className="mx-auto text-[#191510]/20 mb-3" />
          <p className="font-display text-xl text-[#191510]/40">
            {orders.length === 0 ? "No orders yet" : "No orders match your search"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const statusInfo = STATUS_OPTIONS.find((s) => s.value === order.status);
            const isExpanded = expandedOrder === order.id;
            return (
              <motion.div
                key={order.id}
                layout
                className="rounded-xl border-2 border-[#191510]/10 bg-white overflow-hidden"
              >
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-[#fef3b0]/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{order.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusInfo?.color}`}>
                        {statusInfo?.label}
                      </span>
                    </div>
                    <p className="text-xs text-[#191510]/60 mt-0.5">
                      {order.customerName} • {order.customerPhone} • {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[#191510]">{formatPKR(order.grandTotal)}</span>
                  <ChevronRight
                    size={18}
                    className={`text-[#191510]/40 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t-2 border-[#191510]/10 p-4 space-y-4">
                        {/* Customer Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="rounded-lg bg-[#fef3b0]/30 p-3">
                            <p className="text-xs text-[#191510]/60">Customer</p>
                            <p className="text-sm font-semibold">{order.customerName}</p>
                            <p className="text-xs text-[#191510]/60">{order.customerPhone}</p>
                            <p className="text-xs text-[#191510]/60">{order.customerEmail}</p>
                          </div>
                          <div className="rounded-lg bg-[#fef3b0]/30 p-3">
                            <p className="text-xs text-[#191510]/60">Payment</p>
                            <p className="text-sm font-semibold capitalize">{order.paymentMethod}</p>
                            <p className="text-xs text-[#191510]/60">Subtotal: {formatPKR(order.total)}</p>
                            <p className="text-xs text-[#191510]/60">Shipping: {order.shipping === 0 ? "Free" : formatPKR(order.shipping)}</p>
                          </div>
                          <div className="rounded-lg bg-[#fef3b0]/30 p-3">
                            <p className="text-xs text-[#191510]/60">Total</p>
                            <p className="text-lg font-bold">{formatPKR(order.grandTotal)}</p>
                            <p className="text-xs text-[#191510]/60">
                              Placed: {new Date(order.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div>
                          <p className="text-sm font-semibold mb-2">Items ({order.items.length})</p>
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3 rounded-lg bg-[#fff8e7] p-2">
                                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#fff3d0]">
                                  <Image src={item.image} alt={item.productName} fill className="object-cover" sizes="48px" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold truncate">{item.productName}</p>
                                  <p className="text-[11px] text-[#191510]/60">{item.variantLabel} × {item.qty}</p>
                                </div>
                                <p className="text-xs font-bold">{formatPKR(item.unitPrice * item.qty)}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Receipt */}
                        {order.receiptImage && (
                          <div>
                            <p className="text-sm font-semibold mb-2">Payment Receipt</p>
                            <div className="relative h-48 w-48 overflow-hidden rounded-lg border-2 border-[#191510]/10">
                              <Image src={order.receiptImage} alt="Payment receipt" fill className="object-contain bg-white" sizes="192px" />
                            </div>
                          </div>
                        )}

                        {/* Status Change */}
                        <div>
                          <p className="text-sm font-semibold mb-2">Change Status</p>
                          <div className="flex flex-wrap gap-2">
                            {STATUS_OPTIONS.map((s) => (
                              <button
                                key={s.value}
                                onClick={() => updateOrderStatus(order.id, s.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                  order.status === s.value
                                    ? `${s.color} ring-2 ring-[#191510]/30`
                                    : "bg-[#191510]/5 text-[#191510]/70 hover:bg-[#191510]/10"
                                }`}
                              >
                                {order.status === s.value && <Check size={12} className="inline mr-1" />}
                                {s.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ===================== PRODUCTS TAB =====================
function ProductsTab() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useDynamicProducts();
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editingProduct, setEditingProduct] = useState<DynamicProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = categoryFilter === "all" || p.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [products, searchQuery, categoryFilter]);

  function handleDelete(id: string) {
    deleteProduct(id);
    setConfirmDelete(null);
  }

  function handleEdit(product: DynamicProduct) {
    setEditingProduct(product);
    setMode("edit");
  }

  function handleSave(product: DynamicProduct) {
    if (mode === "edit" && editingProduct) {
      updateProduct(editingProduct.id, product);
    } else {
      addProduct(product);
    }
    setMode("list");
    setEditingProduct(null);
  }

  if (mode === "add" || mode === "edit") {
    return (
      <ProductForm
        product={mode === "edit" ? editingProduct! : null}
        categories={categories}
        onSave={handleSave}
        onCancel={() => { setMode("list"); setEditingProduct(null); }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#191510]/50" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border-2 border-[#191510]/15 bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#e8734a]"
          />
        </div>
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border-2 border-[#191510]/15 bg-white px-4 pr-10 py-2.5 text-sm outline-none focus:border-[#e8734a] appearance-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.emoji} {c.name}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#191510]/50 pointer-events-none" />
        </div>
        <button
          onClick={() => setMode("add")}
          className="inline-flex items-center gap-2 rounded-xl bg-[#e8734a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#e8734a]/85 transition-colors"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="text-sm text-[#191510]/60">
        Showing {filtered.length} of {products.length} products
      </div>

      <div className="rounded-xl border-2 border-[#191510]/10 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#fef3b0]/40 border-b-2 border-[#191510]/10">
                <th className="text-left px-4 py-3 font-semibold">Product</th>
                <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-semibold">Price</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Stock</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-[#191510]/5 hover:bg-[#fef3b0]/20">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[#fff3d0]">
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="40px" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-xs truncate max-w-[200px]">{product.name}</p>
                        <p className="text-[11px] text-[#191510]/60 sm:hidden">{categories.find(c => c.slug === product.category)?.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#191510]/70 hidden sm:table-cell">
                    {categories.find(c => c.slug === product.category)?.name || product.category}
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold">{formatPKR(product.tiers[0]?.price || 0)}</td>
                  <td className="px-4 py-3 text-xs hidden md:table-cell">{product.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(product)}
                        className="rounded-lg p-1.5 text-[#191510]/60 hover:bg-[#fef3b0] hover:text-[#191510] transition-colors"
                        title="Edit"
                      >
                        <Edit3 size={14} />
                      </button>
                      {confirmDelete === product.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="rounded-lg p-1.5 bg-red-500 text-white hover:bg-red-600 transition-colors"
                            title="Confirm delete"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="rounded-lg p-1.5 bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(product.id)}
                          className="rounded-lg p-1.5 text-[#191510]/60 hover:bg-red-50 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ===================== PRODUCT FORM =====================
function ProductForm({
  product,
  categories,
  onSave,
  onCancel,
}: {
  product: DynamicProduct | null;
  categories: DynamicCategory[];
  onSave: (product: DynamicProduct) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [category, setCategory] = useState(product?.category || categories[0]?.slug || "");
  const [price, setPrice] = useState(product?.tiers[0]?.price?.toString() || "");
  const [stock, setStock] = useState(product?.stock?.toString() || "50");
  const [imageUrl, setImageUrl] = useState(product?.images?.[0] || "");
  const [bullets, setBullets] = useState(product?.bullets?.join("\n") || "");
  const [isNew, setIsNew] = useState(product?.isNew || false);
  const [isBestseller, setIsBestseller] = useState(product?.isBestseller || false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const slug = (product?.slug || `admin-${Date.now()}`);
    const newProduct: DynamicProduct = {
      id: product?.id || slug,
      slug,
      name,
      category,
      niche: category,
      description,
      bullets: bullets.split("\n").filter(Boolean),
      images: imageUrl ? [imageUrl] : ["/images/products/perfumes/1.jpg"],
      tiers: [
        { minQty: 1, price: Number(price) || 0 },
        { minQty: 5, price: Math.round((Number(price) || 0) * 0.9) },
        { minQty: 20, price: Math.round((Number(price) || 0) * 0.78) },
      ],
      moq: 1,
      variants: product?.variants || [],
      rating: product?.rating || 4.5,
      reviewCount: product?.reviewCount || 0,
      stock: Number(stock) || 50,
      isNew,
      isBestseller,
      tags: [category],
    };
    onSave(newProduct);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl">{product ? "Edit Product" : "Add New Product"}</h3>
        <button type="button" onClick={onCancel} className="text-sm text-[#191510]/60 hover:text-[#191510]">
          ← Cancel
        </button>
      </div>

      <div className="rounded-xl border-2 border-[#191510]/10 bg-white p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold mb-1.5 block">Product Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Velvet Oud Perfume"
              className="w-full rounded-xl border-2 border-[#191510]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#e8734a]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold mb-1.5 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Product description..."
              className="w-full rounded-xl border-2 border-[#191510]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#e8734a] resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border-2 border-[#191510]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#e8734a]"
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.emoji} {c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Price (PKR)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="e.g. 2500"
              className="w-full rounded-xl border-2 border-[#191510]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#e8734a]"
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full rounded-xl border-2 border-[#191510]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#e8734a]"
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Image URL</label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="/images/products/perfumes/1.jpg"
              className="w-full rounded-xl border-2 border-[#191510]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#e8734a]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold mb-1.5 block">Bullet Points (one per line)</label>
            <textarea
              value={bullets}
              onChange={(e) => setBullets(e.target.value)}
              rows={3}
              placeholder={"Premium materials\nShips from Karachi\n7-day easy return"}
              className="w-full rounded-xl border-2 border-[#191510]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#e8734a] resize-none"
            />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
              <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} className="rounded accent-[#e8734a]" />
              New Arrival
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
              <input type="checkbox" checked={isBestseller} onChange={(e) => setIsBestseller(e.target.checked)} className="rounded accent-[#e8734a]" />
              Bestseller
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-[#e8734a] px-6 py-3 font-semibold text-white hover:bg-[#e8734a]/85 transition-colors"
        >
          <Save size={16} /> {product ? "Update Product" : "Add Product"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border-2 border-[#191510]/15 px-6 py-3 font-semibold text-[#191510]/70 hover:bg-[#191510]/5 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ===================== CATEGORIES TAB =====================
function CategoriesTab() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useDynamicProducts();
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editingCategory, setEditingCategory] = useState<DynamicCategory | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function handleSave(cat: DynamicCategory) {
    if (mode === "edit" && editingCategory) {
      updateCategory(editingCategory.slug, cat);
    } else {
      addCategory(cat);
    }
    setMode("list");
    setEditingCategory(null);
  }

  function handleDelete(slug: string) {
    deleteCategory(slug);
    setConfirmDelete(null);
  }

  if (mode === "add" || mode === "edit") {
    return (
      <CategoryForm
        category={mode === "edit" ? editingCategory! : null}
        onSave={handleSave}
        onCancel={() => { setMode("list"); setEditingCategory(null); }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#191510]/60">{categories.length} categories</p>
        <button
          onClick={() => setMode("add")}
          className="inline-flex items-center gap-2 rounded-xl bg-[#e8734a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#e8734a]/85 transition-colors"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((cat) => {
          const productCount = products.filter((p) => p.category === cat.slug).length;
          return (
            <div
              key={cat.slug}
              className="rounded-xl border-2 border-[#191510]/10 bg-white p-4 hover:border-[#e8734a]/30 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm">{cat.name}</p>
                    <p className="text-xs text-[#191510]/60">{cat.tagline}</p>
                    <p className="text-xs text-[#191510]/50 mt-1">{productCount} products</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => { setEditingCategory(cat); setMode("edit"); }}
                    className="rounded-lg p-1.5 text-[#191510]/60 hover:bg-[#fef3b0] hover:text-[#191510] transition-colors"
                  >
                    <Edit3 size={14} />
                  </button>
                  {confirmDelete === cat.slug ? (
                    <>
                      <button
                        onClick={() => handleDelete(cat.slug)}
                        className="rounded-lg p-1.5 bg-red-500 text-white hover:bg-red-600"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="rounded-lg p-1.5 bg-gray-200 text-gray-600 hover:bg-gray-300"
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(cat.slug)}
                      className="rounded-lg p-1.5 text-[#191510]/60 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===================== CATEGORY FORM =====================
function CategoryForm({
  category,
  onSave,
  onCancel,
}: {
  category: DynamicCategory | null;
  onSave: (cat: DynamicCategory) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(category?.name || "");
  const [tagline, setTagline] = useState(category?.tagline || "");
  const [emoji, setEmoji] = useState(category?.emoji || "📦");
  const [slug, setSlug] = useState(category?.slug || "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    onSave({
      slug: finalSlug,
      name,
      tagline,
      emoji,
      imageFolder: finalSlug,
      imageCount: 15,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl">{category ? "Edit Category" : "Add New Category"}</h3>
        <button type="button" onClick={onCancel} className="text-sm text-[#191510]/60 hover:text-[#191510]">
          ← Cancel
        </button>
      </div>

      <div className="rounded-xl border-2 border-[#191510]/10 bg-white p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Category Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Home Decor"
              className="w-full rounded-xl border-2 border-[#191510]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#e8734a]"
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Emoji</label>
            <input
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="📦"
              className="w-full rounded-xl border-2 border-[#191510]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#e8734a]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold mb-1.5 block">Tagline</label>
            <input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="A short description..."
              className="w-full rounded-xl border-2 border-[#191510]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#e8734a]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold mb-1.5 block">URL Slug (auto-generated if empty)</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="home-decor"
              disabled={!!category}
              className="w-full rounded-xl border-2 border-[#191510]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#e8734a] disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-[#e8734a] px-6 py-3 font-semibold text-white hover:bg-[#e8734a]/85 transition-colors"
        >
          <Save size={16} /> {category ? "Update Category" : "Add Category"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border-2 border-[#191510]/15 px-6 py-3 font-semibold text-[#191510]/70 hover:bg-[#191510]/5 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ===================== ANALYTICS TAB =====================
function AnalyticsTab() {
  const [analytics, setAnalytics] = useState<ReturnType<typeof getAnalyticsSummary> | null>(null);

  useEffect(() => {
    seedAnalyticsData();
    setAnalytics(getAnalyticsSummary());
  }, []);

  // Refresh on mount
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics(getAnalyticsSummary());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!analytics) return <div className="text-center py-10 text-[#191510]/50">Loading analytics...</div>;

  const uniqueCount = analytics.uniqueVisitors.size;
  const regionEntries = Object.entries(analytics.regionCounts).sort((a, b) => b[1] - a[1]);
  const cityEntries = Object.entries(analytics.cityCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const deviceEntries = Object.entries(analytics.deviceCounts).sort((a, b) => b[1] - a[1]);
  const browserEntries = Object.entries(analytics.browserCounts).sort((a, b) => b[1] - a[1]);
  const last7Days = Object.entries(analytics.dailyViews)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-7);

  const maxRegion = Math.max(...regionEntries.map(([, v]) => v), 1);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={<Eye size={20} />} label="Total Page Views" value={analytics.totalViews.toLocaleString()} />
        <StatCard icon={<Users size={20} />} label="Unique Visitors" value={uniqueCount.toLocaleString()} />
        <StatCard icon={<Globe size={20} />} label="Regions" value={regionEntries.length.toString()} />
        <StatCard icon={<TrendingUp size={20} />} label="Avg Views/Day" value={(analytics.totalViews / Math.max(last7Days.length, 1)).toFixed(0)} />
      </div>

      {/* Daily Views Chart */}
      <div className="rounded-xl border-2 border-[#191510]/10 bg-white p-5">
        <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
          <Calendar size={16} /> Last 7 Days — Page Views
        </h3>
        <div className="flex items-end gap-2 h-32">
          {last7Days.map(([date, count]) => {
            const maxViews = Math.max(...last7Days.map(([, v]) => v), 1);
            const height = (count / maxViews) * 100;
            return (
              <div key={date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-semibold text-[#191510]/60">{count}</span>
                <div
                  className="w-full rounded-t-md bg-[#e8734a] transition-all"
                  style={{ height: `${Math.max(height, 4)}%` }}
                />
                <span className="text-[9px] text-[#191510]/40">{date.slice(5)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Region Demographics */}
        <div className="rounded-xl border-2 border-[#191510]/10 bg-white p-5">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <Globe size={16} /> Region Demographics
          </h3>
          <div className="space-y-2.5">
            {regionEntries.map(([region, count]) => (
              <div key={region}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold">{region}</span>
                  <span className="text-[#191510]/60">{count} views ({((count / analytics.totalViews) * 100).toFixed(1)}%)</span>
                </div>
                <div className="h-2 bg-[#fef3b0]/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#61ce70] rounded-full transition-all"
                    style={{ width: `${(count / maxRegion) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Cities */}
        <div className="rounded-xl border-2 border-[#191510]/10 bg-white p-5">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
            🏙️ Top Cities
          </h3>
          <div className="space-y-2">
            {cityEntries.map(([city, count], idx) => (
              <div key={city} className="flex items-center justify-between py-1.5 border-b border-[#191510]/5 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#191510]/40 w-5">#{idx + 1}</span>
                  <span className="text-sm font-semibold">{city}</span>
                </div>
                <span className="text-xs text-[#191510]/60">{count} views</span>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="rounded-xl border-2 border-[#191510]/10 bg-white p-5">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
            📱 Device Breakdown
          </h3>
          <div className="space-y-3">
            {deviceEntries.map(([device, count]) => {
              const icon = device === "Mobile" ? <Smartphone size={16} /> : device === "Desktop" ? <Monitor size={16} /> : <Tablet size={16} />;
              const pct = ((count / analytics.totalViews) * 100).toFixed(1);
              return (
                <div key={device} className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#fef3b0] p-2">{icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold">{device}</span>
                      <span className="text-[#191510]/60">{count} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 bg-[#fef3b0]/50 rounded-full overflow-hidden">
                      <div className="h-full bg-[#e8734a] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Browser Breakdown */}
        <div className="rounded-xl border-2 border-[#191510]/10 bg-white p-5">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
            🌐 Browser Breakdown
          </h3>
          <div className="space-y-3">
            {browserEntries.map(([browser, count]) => {
              const pct = ((count / analytics.totalViews) * 100).toFixed(1);
              const colors: Record<string, string> = {
                Chrome: "bg-blue-500",
                Safari: "bg-purple-500",
                Firefox: "bg-orange-500",
                Edge: "bg-cyan-500",
                Other: "bg-gray-400",
              };
              return (
                <div key={browser}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold">{browser}</span>
                    <span className="text-[#191510]/60">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-[#fef3b0]/50 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${colors[browser] || "bg-gray-400"}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border-2 border-[#191510]/10 bg-white p-4">
      <div className="flex items-center gap-2 mb-2 text-[#191510]/60">{icon}<span className="text-xs font-semibold">{label}</span></div>
      <p className="font-display text-2xl text-[#191510]">{value}</p>
    </div>
  );
}

// ===================== MAIN ADMIN PAGE =====================
export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("orders");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const authed = sessionStorage.getItem("hof_admin_auth") === "true";
    setIsAuthed(authed);
    setHydrated(true);
  }, []);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("hof_admin_auth");
    setIsAuthed(false);
  }, []);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff8e7]">
        <div className="animate-pulse text-[#191510]/50">Loading...</div>
      </div>
    );
  }

  if (!isAuthed) {
    return <AdminLogin onLogin={() => setIsAuthed(true)} />;
  }

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: "orders", label: "Orders", icon: <ShoppingCart size={16} /> },
    { id: "products", label: "Products", icon: <Package size={16} /> },
    { id: "categories", label: "Categories", icon: <Tag size={16} /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#fff8e7]">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 bg-[#191510] text-[#fef3b0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg">Admin Panel</span>
            <span className="hidden sm:inline text-xs text-[#fef3b0]/60">House of Fashion</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-lg px-3 py-1.5 text-xs font-semibold bg-[#fef3b0]/10 hover:bg-[#fef3b0]/20 transition-colors"
            >
              <ExternalLink size={12} className="inline mr-1" />
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold bg-[#fef3b0]/10 hover:bg-red-500/30 transition-colors"
            >
              <LogOut size={12} className="inline mr-1" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b-2 border-[#191510]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-1 overflow-x-auto py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#191510] text-[#fef3b0]"
                    : "text-[#191510]/70 hover:bg-[#fef3b0]/50"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "orders" && <OrdersTab />}
            {activeTab === "products" && <ProductsTab />}
            {activeTab === "categories" && <CategoriesTab />}
            {activeTab === "analytics" && <AnalyticsTab />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
