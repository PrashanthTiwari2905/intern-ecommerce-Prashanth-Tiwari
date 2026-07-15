"use client";

import { useEffect, useState } from "react";
import { getOrders } from "@/services/order.service";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-slate-800 mb-10">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-700">
              No orders yet
            </h2>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="
                  bg-white
                  rounded-3xl
                  shadow-lg
                  p-8
                "
              >
                <h2 className="text-2xl font-bold text-slate-800">
                  Order #{order.id}
                </h2>

                <p className="text-slate-600 mt-3">
                  Total: ₹
                  {order.total.toFixed(2)}
                </p>

                <p className="text-slate-500">
                  Items:
                  {" "}
                  {order.orderItems.length}
                </p>

                <div className="mt-5 space-y-2">
                  {order.orderItems.map(
                    (item: any) => (
                      <div
                        key={item.id}
                        className="border rounded-xl p-4"
                      >
                        <p className="font-semibold text-slate-800">
                          {item.product.name}
                        </p>

                        <p className="text-slate-500">
                          Quantity:
                          {" "}
                          {item.quantity}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}