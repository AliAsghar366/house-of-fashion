"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";

export type OrderStatus =
  | "pending"
  | "accepted"
  | "shipped"
  | "declined"
  | "payment_received"
  | "delivered"
  | "closed";

export type OrderItem = {
  productSlug: string;
  productName: string;
  variantKey: string;
  variantLabel: string;
  qty: number;
  unitPrice: number;
  image: string;
};

export type Order = {
  id: string;
  items: OrderItem[];
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  paymentMethod: "easypaisa" | "cod";
  receiptImage?: string; // base64 data URL
  total: number;
  shipping: number;
  grandTotal: number;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
};

type OrderContextValue = {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "status" | "createdAt" | "updatedAt">) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrder: (orderId: string) => Order | undefined;
};

const OrderContext = createContext<OrderContextValue | null>(null);
const STORAGE_KEY = "hof_orders_v1";

// Seed demo orders for admin to see
function getSeedOrders(): Order[] {
  const now = Date.now();
  return [
    {
      id: "ORD-M1K8-X2A",
      items: [
        { productSlug: "perfumes-velvet-oud-0", productName: "Velvet Oud", variantKey: "30ml-Floral", variantLabel: "30ml / Floral", qty: 2, unitPrice: 3500, image: "/images/products/perfumes/1.jpg" },
        { productSlug: "handbags-structured-tote-0", productName: "Structured Tote", variantKey: "Tan-Chain", variantLabel: "Tan / Chain Strap", qty: 1, unitPrice: 7500, image: "/images/products/handbags/2.jpg" },
      ],
      customerName: "Ayesha Khan",
      customerPhone: "03211234567",
      customerEmail: "ayesha@email.com",
      paymentMethod: "easypaisa",
      receiptImage: undefined,
      total: 14500,
      shipping: 0,
      grandTotal: 14500,
      status: "pending",
      createdAt: now - 86400000 * 2,
      updatedAt: now - 86400000 * 2,
    },
    {
      id: "ORD-M2N9-B3C",
      items: [
        { productSlug: "jewelry-statement-necklace-0", productName: "Statement Necklace", variantKey: "Gold-Zircon", variantLabel: "Gold Plated / Zircon", qty: 3, unitPrice: 2200, image: "/images/products/jewelry/3.jpg" },
      ],
      customerName: "Fatima Ali",
      customerPhone: "03331234567",
      customerEmail: "fatima@email.com",
      paymentMethod: "cod",
      total: 6600,
      shipping: 250,
      grandTotal: 6850,
      status: "accepted",
      createdAt: now - 86400000 * 5,
      updatedAt: now - 86400000 * 3,
    },
    {
      id: "ORD-M3P1-D4E",
      items: [
        { productSlug: "womens-lawn-suits-embroidered-lawn-suit-0", productName: "Embroidered Lawn Suit", variantKey: "Unstitched-Small", variantLabel: "Unstitched / Small", qty: 6, unitPrice: 3200, image: "/images/products/womens-lawn-suits/1.jpg" },
        { productSlug: "mens-shalwar-kameez-classic-shalwar-kameez-0", productName: "Classic Shalwar Kameez", variantKey: "M-Cotton", variantLabel: "M / Cambric Cotton", qty: 2, unitPrice: 2800, image: "/images/products/mens-shalwar-kameez/1.jpg" },
      ],
      customerName: "Hassan Malik",
      customerPhone: "03001234567",
      customerEmail: "hassan@email.com",
      paymentMethod: "easypaisa",
      receiptImage: undefined,
      total: 24800,
      shipping: 0,
      grandTotal: 24800,
      status: "shipped",
      createdAt: now - 86400000 * 7,
      updatedAt: now - 86400000,
    },
    {
      id: "ORD-M4Q2-F5G",
      items: [
        { productSlug: "sunglasses-retro-sunglasses-0", productName: "Retro Sunglasses", variantKey: "Black-UV400", variantLabel: "Black / UV400", qty: 12, unitPrice: 1800, image: "/images/products/sunglasses/2.jpg" },
      ],
      customerName: "Sana Riaz",
      customerPhone: "03111234567",
      customerEmail: "sana@email.com",
      paymentMethod: "easypaisa",
      total: 21600,
      shipping: 0,
      grandTotal: 21600,
      status: "delivered",
      createdAt: now - 86400000 * 12,
      updatedAt: now - 86400000 * 6,
    },
    {
      id: "ORD-M5R3-H6I",
      items: [
        { productSlug: "candles-hand-poured-candle-0", productName: "Hand-Poured Candle", variantKey: "Vanilla-Medium", variantLabel: "Vanilla Musk / Medium", qty: 10, unitPrice: 1200, image: "/images/products/candles/1.jpg" },
      ],
      customerName: "Omar Sheikh",
      customerPhone: "03451234567",
      customerEmail: "omar@email.com",
      paymentMethod: "cod",
      total: 12000,
      shipping: 0,
      grandTotal: 12000,
      status: "payment_received",
      createdAt: now - 86400000 * 3,
      updatedAt: now - 86400000,
    },
  ];
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.length > 0) setOrders(parsed);
      } else {
        // Seed demo orders on first visit
        setOrders(getSeedOrders());
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // storage unavailable
    }
  }, [orders, hydrated]);

  function addOrder(data: Omit<Order, "id" | "status" | "createdAt" | "updatedAt">): Order {
    const now = Date.now();
    const orderCode = `ORD-${now.toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const newOrder: Order = {
      ...data,
      id: orderCode,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };
    setOrders((prev) => [newOrder, ...prev]);

    // Also save to Supabase if user is signed in
    try {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          supabase.from("orders").insert({
            order_code: orderCode,
            user_id: user.id,
            customer_name: data.customerName,
            customer_phone: data.customerPhone,
            customer_email: data.customerEmail,
            items: data.items,
            payment_method: data.paymentMethod,
            subtotal: data.total,
            shipping: data.shipping,
            grand_total: data.grandTotal,
            status: "pending",
            status_history: [{ status: "pending", at: new Date().toISOString(), note: "Order placed" }],
          });
        }
      });
    } catch {}

    return newOrder;
  }

  function updateOrderStatus(orderId: string, status: OrderStatus) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status, updatedAt: Date.now() } : o
      )
    );
  }

  function getOrder(orderId: string) {
    return orders.find((o) => o.id === orderId);
  }

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
}
