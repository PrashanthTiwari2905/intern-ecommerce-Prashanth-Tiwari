"use client";

import { useEffect, useState } from "react";
import {
  getCart,
  removeFromCart,
  checkout,
} from "@/services/cart.service";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await removeFromCart(id);
      fetchCart();
    } catch (err) {
      console.log(err);
    }
  };

  const handleCheckout = async () => {
    try {
      await checkout();

      alert("Order placed successfully!");

      fetchCart();

      router.push("/orders");
    } catch (err) {
      console.log(err);
      alert("Cart is empty");
    }
  };

  const total = cart.reduce(
    (sum, item) =>
      sum +
      item.quantity * item.product.price,
    0
  );

  return (
    <div className="min-h-screen bg-slate-100 p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-slate-800 mb-10">
          My Cart
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 shadow-lg text-center">
            <h2 className="text-2xl font-bold text-slate-700">
              Cart is empty
            </h2>

            <button
              onClick={() => router.push("/products")}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="
                    bg-white
                    rounded-3xl
                    shadow-lg
                    p-8
                    flex
                    justify-between
                    items-center
                    hover:shadow-2xl
                    transition
                  "
                >
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                      {item.product.name}
                    </h2>

                    <p className="text-slate-500 mt-2">
                      Quantity: {item.quantity}
                    </p>

                    <p className="text-green-600 text-2xl font-bold mt-2">
                      ₹
                      {(
                        item.quantity *
                        item.product.price
                      ).toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      handleDelete(item.id)
                    }
                    className="
                      bg-red-500
                      hover:bg-red-600
                      text-white
                      px-6
                      py-3
                      rounded-2xl
                      font-semibold
                    "
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8 mt-10">
              <h2 className="text-4xl font-bold text-slate-800">
                Total: ₹{total.toFixed(2)}
              </h2>

              <button
                onClick={handleCheckout}
                className="
                  mt-6
                  bg-green-600
                  hover:bg-green-700
                  text-white
                  px-8
                  py-4
                  rounded-2xl
                  text-lg
                  font-semibold
                "
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}