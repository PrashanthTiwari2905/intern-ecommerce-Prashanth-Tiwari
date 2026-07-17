"use client";

import { useEffect, useState } from "react";
import { getProduct } from "@/services/product.service";
import { addToCart } from "@/services/cart.service";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";

interface ProductDetail {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [localQuantity, setLocalQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const [cartItemsMap, setCartItemsMap] = useState<Record<number, { id: number; quantity: number }>>({});

  const fetchCartItems = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      const localCartStr = localStorage.getItem("local_cart");
      if (localCartStr) {
        try {
          const localCart = JSON.parse(localCartStr);
          const map: Record<number, { id: number; quantity: number }> = {};
          localCart.forEach((item: any) => {
            map[item.product.id] = { id: item.id, quantity: item.quantity };
          });
          setCartItemsMap(map);
          if (product && product.id in map) {
            setLocalQuantity(map[product.id].quantity);
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        setCartItemsMap({});
      }
      return;
    }

    try {
      const { getCart } = await import("@/services/cart.service");
      const cartData = await getCart();
      const map: Record<number, { id: number; quantity: number }> = {};
      cartData.forEach((item: any) => {
        map[item.product.id] = { id: item.id, quantity: item.quantity };
      });
      setCartItemsMap(map);
      if (product && product.id in map) {
        setLocalQuantity(map[product.id].quantity);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [product]);

  const handleUpdateQuantity = async (newQty: number) => {
    if (!product) return;
    const maxStock = product.stock;
    const targetQty = Math.min(Math.max(1, newQty), maxStock);
    
    setLocalQuantity(targetQty);

    if (product.id in cartItemsMap) {
      const token = localStorage.getItem("token");
      if (!token) {
        const localCartStr = localStorage.getItem("local_cart");
        let localCart = localCartStr ? JSON.parse(localCartStr) : [];
        const itemIndex = localCart.findIndex((item: any) => item.product.id === product.id);
        if (itemIndex > -1) {
          localCart[itemIndex].quantity = targetQty;
          localStorage.setItem("local_cart", JSON.stringify(localCart));
          fetchCartItems();
        }
        return;
      }

      const cartItem = cartItemsMap[product.id];
      if (!cartItem) return;

      try {
        const { updateCartItem } = await import("@/services/cart.service");
        await updateCartItem(cartItem.id, targetQty);
        fetchCartItems();
      } catch (err) {
        console.error(err);
        toast.error("Failed to update quantity");
      }
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getProduct(Number(params.id));
        if (!cancelled) setProduct(data);
      } catch (err) { console.log(err); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);
    const token = localStorage.getItem("token");
    if (!token) {
      const localCartStr = localStorage.getItem("local_cart");
      let localCart = localCartStr ? JSON.parse(localCartStr) : [];
      const existingItemIndex = localCart.findIndex(
        (item: any) => item.product.id === product.id
      );

      if (existingItemIndex > -1) {
        const newQty = localCart[existingItemIndex].quantity + localQuantity;
        if (newQty > product.stock) {
          toast.error(`Cannot add more than available stock (${product.stock})`);
          setIsAdding(false);
          return;
        }
        localCart[existingItemIndex].quantity = newQty;
      } else {
        if (localQuantity > product.stock) {
          toast.error(`Cannot add more than available stock (${product.stock})`);
          setIsAdding(false);
          return;
        }
        localCart.push({
          id: product.id,
          quantity: localQuantity,
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
          },
        });
      }
      localStorage.setItem("local_cart", JSON.stringify(localCart));
      toast.success("Added to cart!");
      setIsAdding(false);
      fetchCartItems();
      return;
    }

    try {
      await addToCart(product.id, localQuantity);
      toast.success("Added to cart!");
      fetchCartItems();
    } catch (err) {
      console.log(err);
      toast.error("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 md:py-14">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-4 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-[400px] animate-pulse" />
              <div className="p-10 space-y-4">
                <div className="h-8 w-3/4 bg-slate-200 rounded-lg animate-pulse" />
                <div className="h-4 w-full bg-slate-200 rounded-lg animate-pulse" />
                <div className="h-4 w-2/3 bg-slate-200 rounded-lg animate-pulse" />
                <div className="h-10 w-1/3 bg-slate-200 rounded-lg animate-pulse mt-6" />
                <div className="h-12 w-full bg-slate-200 rounded-xl animate-pulse mt-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 md:py-14">
          <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/products" className="hover:text-blue-600 transition-colors">Products</Link>
            <svg className="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <span className="text-slate-900 font-medium">Not Found</span>
          </nav>
          <div className="flex flex-col items-center justify-center py-24">
            <div className="inline-flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-100 mb-6">
              <svg className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Product Not Found</h2>
            <p className="text-sm text-slate-500 mb-8 max-w-sm text-center">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Link href="/products" className="h-12 px-8 rounded-xl bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800 transition-all shadow-sm hover:shadow-md">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stockInfo = product.stock > 0
    ? { label: `${product.stock} in stock`, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", dot: "bg-emerald-500" }
    : { label: "Out of stock", color: "text-red-600", bg: "bg-red-50", border: "border-red-100", dot: "bg-red-500" };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 md:px-10 py-10 md:py-14">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm">
          <Link href="/products" className="text-slate-500 hover:text-blue-600 transition-colors">Products</Link>
          <svg className="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <span className="text-slate-900 font-medium truncate">{product.name}</span>
        </nav>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-10 min-h-[400px] relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.imageUrl || "https://via.placeholder.com/300"}
                alt={product.name}
                className="max-h-80 w-auto object-contain"
              />
              {!stockInfo.dot.includes("red") && product.stock <= 5 && product.stock > 0 && (
                <div className="absolute top-6 left-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${stockInfo.bg} ${stockInfo.color} ${stockInfo.border} border`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${stockInfo.dot}`} />
                    Only {product.stock} left
                  </span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-10 flex flex-col justify-center">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 leading-snug">{product.name}</h1>
              <p className="text-sm text-slate-500 mt-4 leading-relaxed">{product.description}</p>

              <div className="mt-6 flex items-baseline gap-3">
                <p className="text-3xl font-bold text-slate-900">${product.price.toLocaleString("en-US")}</p>
                {product.stock > 0 && (
                  <span className="text-sm text-slate-400 line-through">${Math.round(product.price * 1.2).toLocaleString("en-US")}</span>
                )}
              </div>

              <div className="mt-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${stockInfo.bg} ${stockInfo.color} ${stockInfo.border}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${stockInfo.dot}`} />
                  {stockInfo.label}
                </span>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center border border-slate-200 rounded-xl h-12 bg-slate-50">
                  <button
                    type="button"
                    disabled={product.stock <= 0 || localQuantity <= 1}
                    onClick={() => handleUpdateQuantity(localQuantity - 1)}
                    className="w-11 h-full text-lg font-medium text-slate-600 hover:text-blue-600 disabled:opacity-30 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-slate-900">{localQuantity}</span>
                  <button
                    type="button"
                    disabled={product.stock <= 0 || localQuantity >= product.stock}
                    onClick={() => handleUpdateQuantity(localQuantity + 1)}
                    className="w-11 h-full text-lg font-medium text-slate-600 hover:text-blue-600 disabled:opacity-30 transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (product.id in cartItemsMap) {
                      router.push("/cart");
                    } else {
                      handleAddToCart();
                    }
                  }}
                  disabled={product.stock <= 0 || isAdding}
                  className={`flex-1 h-12 rounded-xl text-sm font-semibold transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed shadow-sm hover:shadow-md flex items-center justify-center gap-2 ${
                    product.id in cartItemsMap
                      ? "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white"
                      : "bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-white"
                  }`}
                >
                  {product.stock <= 0 ? (
                    "Out of Stock"
                  ) : isAdding ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Adding...
                    </>
                  ) : product.id in cartItemsMap ? (
                    <>
                      Go to Cart ✓
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                      </svg>
                      Add to Cart
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H6.375c-.621 0-1.125-.504-1.125-1.125V14.25m17.25 4.5V6.75a3 3 0 00-3-3H6.375a3 3 0 00-3 3v8.25m16.5 0h1.5" />
                  </svg>
                  Free shipping over $999
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                  </svg>
                  30-day returns
                </div>
              </div>

              <Link
                href="/products"
                className="mt-6 h-12 w-full rounded-xl border border-slate-200 flex items-center justify-center text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
