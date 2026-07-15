import api from "@/lib/axios";

export const getProducts = async (
  page = 1,
  limit = 10,
  search = ""
) => {
  console.log(
    "API CALL:",
    `/products?page=${page}&limit=${limit}&search=${search}`
  );

  const response = await api.get(
    `/products?page=${page}&limit=${limit}&search=${search}`
  );

  return response.data;
};