"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();

  const { setToken, setUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await login(data);

      setToken(response.accessToken);

      const profile = await (
        await import("@/services/auth.service")
      ).getProfile();

      setUser(profile);

      router.push("/products");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 p-10">
        <h1 className="text-4xl font-bold text-center text-slate-800">
          Welcome Back
        </h1>

        <p className="text-center text-slate-500 mt-2 mb-8">
          Login to your account
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
              })}
              className="w-full p-4 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-2">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
              })}
              className="w-full p-4 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-2">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full p-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-8 text-slate-600">
          Don't have an account?

          <span
            onClick={() => router.push("/signup")}
            className="font-bold text-blue-600 cursor-pointer ml-2 hover:text-blue-700"
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}