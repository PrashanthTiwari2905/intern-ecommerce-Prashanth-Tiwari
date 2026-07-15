import api from "@/lib/axios";

export const signup = async (
  data: {
    name: string;
    email: string;
    password: string;
  }
) => {
  const response = await api.post(
    "/auth/signup",
    data,
  );

  return response.data;
};

export const login = async (
  data: {
    email: string;
    password: string;
  }
) => {
  const response = await api.post(
    "/auth/login",
    data,
  );

  return response.data;
};

export const getProfile =
  async () => {
    const response =
      await api.get("/auth/profile");

    return response.data;
  };