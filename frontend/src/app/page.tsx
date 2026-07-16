"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="max-w-5xl w-full mx-auto text-center">

        {/* Logo */}
        <h1
          className="
            text-7xl
            md:text-8xl
            font-black
            tracking-tight
            bg-gradient-to-r
            from-cyan-400
            via-blue-400
            to-violet-500
            bg-clip-text
            text-transparent
          "
        >
          INDMart
        </h1>

        {/* Tagline */}
        <p className="mt-5 text-2xl md:text-3xl font-medium text-slate-300">
          Shop Smarter, Live Better.
        </p>

        {/* Description */}
        <div className="mt-8 flex justify-center">
          <p
            className="
              max-w-3xl
              text-center
              text-lg
              md:text-xl
              leading-8
              text-slate-400
            "
          >
            Discover premium products, manage your cart effortlessly,
            and enjoy a seamless shopping experience with India&apos;s modern
            shopping destination.
          </p>
        </div>

        {/* Buttons */}
        <div
          className="
            mt-14
            flex
            flex-col
            sm:flex-row
            items-center
            justify-center
            gap-6
          "
        >
          <button
            onClick={() => router.push("/login")}
            className="
              w-64
              rounded-2xl
              border
              border-white/10
              bg-white/10
              px-8
              py-4
              text-lg
              font-semibold
              text-white
              backdrop-blur-xl
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-white/20
              hover:shadow-2xl
            "
          >
            Sign In
          </button>

          <button
            onClick={() => router.push("/signup")}
            className="
              w-64
              rounded-2xl
              bg-gradient-to-r
              from-cyan-500
              via-blue-600
              to-violet-600
              px-8
              py-4
              text-lg
              font-semibold
              text-white
              shadow-xl
              transition-all
              duration-300
              hover:-translate-y-1
              hover:scale-105
              hover:shadow-cyan-500/30
            "
          >
            Create Account
          </button>
        </div>

        {/* Footer */}
        <div className="mt-20">
          <p className="text-sm text-slate-500">
            Trusted by shoppers across India • Fast • Secure • Modern
          </p>
        </div>
      </div>
    </div>
  );
}