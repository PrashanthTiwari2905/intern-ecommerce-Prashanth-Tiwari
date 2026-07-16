"use client";

import { useEffect, useState } from "react";
import { getCart, removeFromCart, checkout } from "@/services/cart.service";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";

interface CartItem {
  id: number;
  quantity: number;
  product: { id: number; name: string; price: number; imageUrl?: string };
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const router = useRouter();

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    getCart()
      .then((d) => { if (active) setCart(d); })
      .catch(console.log)
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await removeFromCart(id);
      toast.success("Item removed from cart");
      fetchCart();
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      await checkout();
      toast.success("Order placed successfully!");
      fetchCart();
      router.push("/orders");
    } catch {
      toast.error("Cart is empty");
    } finally {
      setCheckingOut(false);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-10 md:py-14">
          <div className="mb-10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-600/20">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Shopping Cart</h1>
                <p className="text-sm text-slate-500 mt-0.5">Loading your cart...</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-slate-500 text-sm">
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading cart...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 md:px-10 py-12 md:py-16">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-600/20">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Shopping Cart</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {cart.length === 0 ? "Your cart is empty" : `${itemCount} item${itemCount !== 1 ? "s" : ""} in your cart`}
              </p>
            </div>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
            <div className="inline-flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-100 mb-6">
              <svg className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
            <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">Looks like you haven&apos;t added any products yet. Start exploring our collection!</p>
            <button
              onClick={() => router.push("/products")}
              className="h-12 px-8 rounded-xl bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800 transition-all shadow-sm hover:shadow-md"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 mt-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-24 w-24 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.product.imageUrl || "https://via.placeholder.com/80"}
                      alt={item.product.name}
                      className="h-20 w-20 object-contain"
                      onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/80"; }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">{item.product.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">${item.product.price.toLocaleString("en-US")} each</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-600">
                        Qty: {item.quantity}
                      </span>
                      <span className="text-sm font-bold text-slate-900">${(item.quantity * item.product.price).toLocaleString("en-US")}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="h-9 px-4 rounded-xl border border-slate-200 text-xs font-medium text-red-600 hover:bg-red-50 hover:border-red-200 transition-all shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h3>

                <div className="space-y-3 pb-5 border-b border-slate-200">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-slate-500 truncate mr-3">{item.product.name} × {item.quantity}</span>
                      <span className="text-slate-900 font-semibold shrink-0">${(item.quantity * item.product.price).toLocaleString("en-US")}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 py-5 border-b border-slate-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="text-slate-900 font-semibold">${subtotal.toLocaleString("en-US")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Shipping</span>
                    <span className={`font-semibold ${shipping === 0 ? "text-emerald-600" : "text-slate-900"}`}>
                      {shipping === 0 ? "Free" : `$${shipping}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[11px] text-slate-400">Free shipping on orders over $999</p>
                  )}
                </div>

                <div className="flex justify-between items-center pt-5 mb-6">
                  <span className="text-base font-semibold text-slate-700">Total</span>
                  <span className="text-2xl font-bold text-slate-900">${total.toLocaleString("en-US")}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="w-full h-12 rounded-xl bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  {checkingOut ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </span>
                  ) : "Proceed to Checkout"}
                </button>

                <button
                  onClick={() => router.push("/products")}
                  className="w-full h-11 mt-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
