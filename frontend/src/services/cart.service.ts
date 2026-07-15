import api from "@/lib/axios";

export const addToCart = async (
  productId: number,
  quantity: number
) => {
  const res = await api.post("/cart/add", {
    productId,
    quantity,
  });

  return res.data;
};

export const getCart = async () => {
  const res = await api.get("/cart");
  return res.data;
};

export const removeFromCart = async (
  id: number
) => {
  const res = await api.delete(`/cart/${id}`);
  return res.data;
};

export const checkout = async () => {
  const res = await api.post("/orders/checkout");
  return res.data;
};