"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOrders } from "@/services/order.service";
import Navbar from "@/components/Navbar";

interface OrderItem {
  id: number;
  quantity: number;
  product: { name: string; price?: number; imageUrl?: string };
}

interface Order {
  id: number;
  total: number;
  createdAt?: string;
  orderItems: OrderItem[];
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login?redirect=/orders");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const data = await getOrders();
        if (!cancelled) setOrders(data);
      } catch (e) {
        console.error(e);
        router.push("/login?redirect=/orders");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 md:px-10 py-10 md:py-14">
          <div className="mb-10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-600/20">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>
                <p className="text-sm text-slate-500 mt-0.5">Loading your orders...</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-slate-500 text-sm">
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading orders...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 md:px-10 py-12 md:py-16">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-600/20">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  {orders.length === 0 ? "No orders yet" : `${orders.length} order${orders.length !== 1 ? "s" : ""} placed`}
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push("/products")}
              className="h-11 px-6 rounded-xl bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800 transition-all shadow-sm hover:shadow-md hidden sm:flex items-center gap-2"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Continue Shopping
            </button>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm mt-12">
            <div className="inline-flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-100 mb-6">
              <svg className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No orders yet</h2>
            <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">When you place an order, it will appear here. Start shopping to see your order history!</p>
            <button
              onClick={() => router.push("/products")}
              className="h-12 px-8 rounded-xl bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800 transition-all shadow-sm hover:shadow-md"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-6 mt-12">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                {/* Header */}
                <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-600/20">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-900">Order #{String(order.id).padStart(6, "0")}</p>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {order.orderItems.length} product{order.orderItems.length !== 1 ? "s" : ""}
                        {order.createdAt ? ` · ${new Date(order.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}` : ""}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Completed
                  </span>
                </div>

                {/* Items */}
                <div className="px-8 py-5">
                  <div className="space-y-3">
                    {order.orderItems.length === 0 ? (
                      <p className="text-sm text-slate-500">No products found.</p>
                    ) : (
                      order.orderItems.map((item: OrderItem) => (
                        <div key={item.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-2.5 w-2.5 rounded-full bg-blue-500 shrink-0" />
                            <span className="text-sm font-medium text-slate-900 truncate">{item.product.name}</span>
                          </div>
                          <div className="flex items-center gap-5 shrink-0 ml-4">
                            <span className="text-sm text-slate-500">Qty: {item.quantity}</span>
                            {item.product.price != null && (
                              <span className="text-sm font-bold text-slate-900">${(item.quantity * item.product.price).toLocaleString("en-US")}</span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">Order Total</span>
                  <span className="text-xl font-bold text-slate-900">${Number(order.total).toLocaleString("en-US")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
