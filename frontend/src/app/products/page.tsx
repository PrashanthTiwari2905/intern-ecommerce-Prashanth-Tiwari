"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProducts } from "@/services/product.service";
import { addToCart } from "@/services/cart.service";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";


interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 500;
const SKELETON_COUNT = 8;
const LOW_STOCK_THRESHOLD = 5;

function getStockInfo(stock: number) {
  if (stock <= 0) return { label: "Out of stock", color: "text-red-600", bg: "bg-red-50", border: "border-red-100", dot: "bg-red-500", isOut: true };
  if (stock <= LOW_STOCK_THRESHOLD) return { label: `Only ${stock} left`, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", dot: "bg-amber-500", isOut: false };
  return { label: "In stock", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", dot: "bg-emerald-500", isOut: false };
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [];
  pages.push(1);
  if (current > 3) pages.push("...");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [addingId, setAddingId] = useState<number | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const latestRequestId = useRef(0);

  const [cartItemsMap, setCartItemsMap] = useState<Record<number, { id: number; quantity: number }>>({});
  const router = useRouter();

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
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleUpdateCartItemQuantity = async (productId: number, newQty: number, maxStock: number) => {
    if (newQty < 1) return;
    if (newQty > maxStock) {
      toast.error(`Cannot add more than available stock (${maxStock})`);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      const localCartStr = localStorage.getItem("local_cart");
      let localCart = localCartStr ? JSON.parse(localCartStr) : [];
      const itemIndex = localCart.findIndex((item: any) => item.product.id === productId);
      if (itemIndex > -1) {
        localCart[itemIndex].quantity = newQty;
        localStorage.setItem("local_cart", JSON.stringify(localCart));
        fetchCartItems();
      }
      return;
    }

    const cartItem = cartItemsMap[productId];
    if (!cartItem) return;

    try {
      const { updateCartItem } = await import("@/services/cart.service");
      await updateCartItem(cartItem.id, newQty);
      fetchCartItems();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update quantity");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    const requestId = ++latestRequestId.current;
    (async () => {
      if (cancelled) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await getProducts(page, PAGE_SIZE, debouncedSearch);
        if (cancelled || requestId !== latestRequestId.current) return;
        setProducts(data.data);
        setTotalPages(data.meta.totalPages);
      } catch (err) {
        if (cancelled || requestId !== latestRequestId.current) return;
        console.error(err);
        setError("Couldn't load products. Please try again.");
      } finally {
        if (!cancelled && requestId === latestRequestId.current) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [page, debouncedSearch, retryKey]);

  const getQuantity = (productId: number) => {
    if (productId in cartItemsMap) {
      return cartItemsMap[productId].quantity;
    }
    return quantities[productId] ?? 1;
  };

  const setQuantity = async (productId: number, value: number, max: number) => {
    const targetQty = Math.min(Math.max(1, value), max);
    if (productId in cartItemsMap) {
      await handleUpdateCartItemQuantity(productId, targetQty, max);
    } else {
      setQuantities((prev) => ({ ...prev, [productId]: targetQty }));
    }
  };

  const handleAddToCart = async (productId: number) => {
    setAddingId(productId);
    const token = localStorage.getItem("token");
    if (!token) {
      const product = products.find((p) => p.id === productId);
      if (!product) {
        toast.error("Product not found");
        setAddingId(null);
        return;
      }
      const localCartStr = localStorage.getItem("local_cart");
      let localCart = localCartStr ? JSON.parse(localCartStr) : [];
      const existingItemIndex = localCart.findIndex(
        (item: any) => item.product.id === productId
      );
      const qtyToAdd = getQuantity(productId);

      if (existingItemIndex > -1) {
        const newQty = localCart[existingItemIndex].quantity + qtyToAdd;
        if (newQty > product.stock) {
          toast.error(`Cannot add more than available stock (${product.stock})`);
          setAddingId(null);
          return;
        }
        localCart[existingItemIndex].quantity = newQty;
      } else {
        if (qtyToAdd > product.stock) {
          toast.error(`Cannot add more than available stock (${product.stock})`);
          setAddingId(null);
          return;
        }
        localCart.push({
          id: product.id,
          quantity: qtyToAdd,
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
      setAddingId(null);
      fetchCartItems();
      return;
    }

    try {
      await addToCart(productId, getQuantity(productId));
      toast.success("Added to cart!");
      fetchCartItems();
    } catch (err) {
      console.error(err);
      toast.error("Couldn't add to cart");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
        {/* Page Header */}
        <div className="mb-12 pb-1.5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-600/20">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Products</h1>
              <p className="text-sm text-slate-500 mt-0.5">Browse our collection of premium products</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-12">
          <div className="relative flex items-center">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              style={{ backgroundColor: "#ffffff", paddingLeft: "3rem" }}
              className="w-full h-12 rounded-xl border border-slate-200 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-slate-300 transition-all shadow-sm"
            />
            {search && (
              <button
                aria-label="Clear Search"
                onClick={() => { setSearch(""); setPage(1); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 mb-12" />

        <div aria-live="polite" className="sr-only">
          {isLoading ? "Loading products" : `${products.length} products loaded`}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span>{error}</span>
            </div>
            <button onClick={() => setRetryKey((k) => k + 1)} className="text-xs font-semibold underline ml-4 shrink-0">Retry</button>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-12">
          {isLoading &&
            Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white overflow-hidden animate-pulse shadow-sm">
                <div className="aspect-square bg-slate-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-3/4 bg-slate-100 rounded-lg" />
                  <div className="h-3.5 w-full bg-slate-100 rounded-lg" />
                  <div className="h-6 w-1/3 bg-slate-100 rounded-lg mt-4" />
                  <div className="h-9 w-full bg-slate-100 rounded-xl mt-4" />
                </div>
              </div>
            ))}

          {!isLoading && !error && products.length === 0 && (
            <div className="col-span-full text-center py-24">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 mb-6">
                <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {debouncedSearch ? `No results for "${debouncedSearch}"` : "No products yet"}
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                {debouncedSearch ? "Try a different search term or check the spelling." : "Products will appear here once they're added to the catalog."}
              </p>
            </div>
          )}

          {!isLoading &&
            products.map((product) => {
              const stock = getStockInfo(product.stock);
              const quantity = getQuantity(product.id);
              const isAdding = addingId === product.id;

              return (
                <div key={product.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 group shadow-sm">
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6 relative overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.imageUrl || "https://via.placeholder.com/200"}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/200"; }}
                      />
                      {!stock.isOut && stock.label !== "In stock" && (
                        <div className="absolute top-3 left-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${stock.bg} ${stock.color} ${stock.border} border`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${stock.dot}`} />
                            {stock.label}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-5">
                    <Link href={`/products/${product.id}`}>
                      <h2 className="text-sm font-semibold text-slate-900 line-clamp-2 hover:text-blue-600 transition-colors leading-snug min-h-[2.5rem]">{product.name}</h2>
                    </Link>

                    <p className="mt-1.5 text-xs text-slate-500 line-clamp-1">{product.description}</p>

                    <div className="flex items-center justify-between mt-4">
                      <p className="text-xl font-bold text-slate-900">${product.price.toLocaleString("en-US")}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${stock.bg} ${stock.color}`}>
                        <span className={`h-1 w-1 rounded-full ${stock.dot}`} />
                        {stock.isOut ? "Out" : "In stock"}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-2.5">
                      <div className="flex items-center border border-slate-200 rounded-xl h-10 bg-slate-50">
                        <button
                          type="button"
                          disabled={stock.isOut || quantity <= 1}
                          onClick={() => setQuantity(product.id, quantity - 1, product.stock)}
                          className="w-9 h-full text-sm font-medium text-slate-600 hover:text-blue-600 disabled:opacity-30 transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-900">{quantity}</span>
                        <button
                          type="button"
                          disabled={stock.isOut || quantity >= product.stock}
                          onClick={() => setQuantity(product.id, quantity + 1, product.stock)}
                          className="w-9 h-full text-sm font-medium text-slate-600 hover:text-blue-600 disabled:opacity-30 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          if (product.id in cartItemsMap) {
                            router.push("/cart");
                          } else {
                            handleAddToCart(product.id);
                          }
                        }}
                        disabled={stock.isOut || isAdding}
                        className={`flex-1 h-10 rounded-xl text-xs font-semibold transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed shadow-sm hover:shadow-md ${
                          product.id in cartItemsMap
                            ? "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white"
                            : "bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-white"
                        }`}
                      >
                        {stock.isOut
                          ? "Out of stock"
                          : isAdding
                          ? "Adding..."
                          : product.id in cartItemsMap
                          ? "Go to Cart ✓"
                          : "Add to cart"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 mt-16 mb-16" />

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <nav className="mt-16 pb-12 flex justify-center items-center gap-2" aria-label="Product pages">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="h-10 px-5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              ← Prev
            </button>

            {getPageNumbers(page, totalPages).map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="px-2 text-sm text-slate-400">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-10 min-w-[40px] px-4 rounded-xl text-sm font-medium transition-all shadow-sm ${p === page
                      ? "bg-slate-900 text-white shadow-md"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-10 px-5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Next →
            </button>
          </nav>
        )}
      </main>
    </div>
  );
}
