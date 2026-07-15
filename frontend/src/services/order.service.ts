import api from "@/lib/axios";

export const getOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};