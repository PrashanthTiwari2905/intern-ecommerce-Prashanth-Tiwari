"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/services/product.service";
import { addToCart } from "@/services/cart.service";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] =
    useState(1);
  const [search, setSearch] = useState("");  

  const [debouncedSearch, setDebouncedSearch] =
  useState("");

  useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
  }, 500);

  return () => clearTimeout(timer);
}, [search]);

  useEffect(() => {
  fetchProducts();
}, [page, debouncedSearch]);

  const fetchProducts = async () => {
  try {
    if (page > 3) return;

    const data = await getProducts(
  page,
  10,
  debouncedSearch
);

setProducts(data.data);
setTotalPages(3);

    setProducts(data.data);

    setTotalPages(3);
  } catch (err) {
    console.log(err);
  }
};

  const handleAddToCart = async (
  productId: number
) => {
  try {
    await addToCart(
      productId,
      1
    );

    alert("Added to cart!");
  } catch (err) {
    console.log(err);

    alert("Failed to add to cart");
  }
};

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      {/* Navbar */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">

        <div className="max-w-7xl mx-auto p-5 flex justify-between items-center">
  <h1 className="text-3xl font-bold text-slate-800">
    E-Commerce Store
  </h1>

  <div className="flex gap-4">
    <button
      onClick={() =>
        router.push("/cart")
      }
      className="bg-blue-600 text-white px-5 py-2 rounded-xl"
    >
      Cart
    </button>

    <button
      onClick={() =>
        router.push("/orders")
      }
      className="bg-green-600 text-white px-5 py-2 rounded-xl"
    >
      Orders
    </button>

    <button
      onClick={logout}
      className="bg-red-500 text-white px-5 py-2 rounded-xl"
    >
      Logout
    </button>
  </div>
</div>
</div>


<div className="max-w-7xl mx-auto px-8 pt-8">
  <input
    type="text"
    placeholder="Search products..."
    value={search}
    onChange={(e) => {
      setSearch(e.target.value);
      setPage(1);
    }}
    className="
      w-full
      p-4
      rounded-2xl
      border
      border-slate-300
      bg-white
      shadow-sm
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
    "
  />
</div>

      {/* Products */}
      <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="
              bg-white
              rounded-3xl
              overflow-hidden
              shadow-md
              hover:shadow-2xl
              hover:-translate-y-2
              transition-all
              duration-300
              border border-slate-100
            "
          >
            <div className="h-56 bg-slate-50 flex items-center justify-center relative">
              <img
                src={
                  product.imageUrl ||
                  "https://via.placeholder.com/300"
                }
                alt={product.name}
                className="h-44 object-contain"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/300";
                }}
              />

              <span className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                In Stock
              </span>
            </div>

            <div className="p-5">
              <h2 className="text-lg font-bold text-slate-800 line-clamp-2">
                {product.name}
              </h2>

              <p className="text-slate-500 text-sm mt-2 line-clamp-3">
                {product.description}
              </p>

              <div className="flex justify-between items-center mt-5">
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    ₹{product.price}
                  </p>

                  <p className="text-sm text-slate-500">
                    Stock: {product.stock}
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                    handleAddToCart(
                        product.id
                    )
                }
                className="
                    mt-5
                    w-full
                    bg-slate-900
                    text-white
                    py-3
                    rounded-2xl
                    font-semibold
                    hover:bg-blue-600
                    transition
                "
                >
                    Add to Cart
                </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pb-12 flex justify-center items-center gap-5">
        <button
          disabled={page === 1}
          onClick={() =>
            setPage(page - 1)
          }
          className="
            px-5
            py-3
            rounded-xl
            bg-slate-900
            text-white
            disabled:opacity-40
          "
        >
          Previous
        </button>

        <div className="font-semibold text-slate-700">
          Page {page} of {totalPages}
        </div>

        <button
          disabled={page === totalPages}
          onClick={() =>
            setPage(page + 1)
          }
          className="
            px-5
            py-3
            rounded-xl
            bg-slate-900
            text-white
            disabled:opacity-40
          "
        >
          Next
        </button>
      </div>
    </div>
  );
}