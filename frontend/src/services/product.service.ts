import api from "@/lib/axios";

export const getProducts = async (
  page = 1,
  limit = 10
) => {
  const response = await api.get(
    `/products?page=${page}&limit=${limit}`
  );

  return response.data;
};