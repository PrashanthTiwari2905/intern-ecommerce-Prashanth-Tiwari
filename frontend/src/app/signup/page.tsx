"use client";

import { useState } from "react";
import { signup } from "@/services/auth.service";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] =
    useState("");
  const [password, setPassword] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await signup({
        name,
        email,
        password,
      });

      alert(
        "Signup successful"
      );

      router.push("/login");
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="w-[450px] p-10 rounded-3xl bg-white shadow-2xl border border-gray-200">
        <h1 className="text-4xl font-bold text-center text-slate-800 mb-8">
          Create Account
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            className="w-full p-4 rounded-xl bg-slate-100 border border-slate-300 text-slate-800"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="w-full p-4 rounded-xl bg-slate-100 border border-slate-300 text-slate-800"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full p-4 rounded-xl bg-slate-100 border border-slate-300 text-slate-800"
          />

          <button className="w-full p-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition">
            Signup
          </button>
        </form>

        <p className="text-center mt-6 text-slate-600">
          Already have an account?

          <span
            onClick={() =>
              router.push(
                "/login"
              )
            }
            className="font-bold text-blue-600 cursor-pointer ml-2"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}