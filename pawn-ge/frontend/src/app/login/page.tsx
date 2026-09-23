"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SpaceEnvironment from "@/components/universe/SpaceEnvironment";
import { api } from "@/lib/api/client";
import { setTokens } from "@/lib/auth/session";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const session = await api.login(email, password);
      setTokens(session.accessToken, session.refreshToken);
      if (session.role === "SUPER_ADMIN") router.push("/super-admin/applications");
      else if (session.role === "LOMBARD_ADMIN" || session.role === "LOMBARD_EMPLOYEE")
        router.push("/admin/dashboard");
      else router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen">
      <SpaceEnvironment />
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div
          className="w-full max-w-md rounded-[28px] p-10"
          style={{
            background: "linear-gradient(135deg, rgba(9,13,23,.94), rgba(14,17,34,.88))",
            border: "1px solid rgba(255,255,255,.09)",
            backdropFilter: "blur(28px)",
            boxShadow: "0 30px 100px rgba(0,0,0,.48)",
          }}
        >
          <Link href="/" className="text-xl font-extrabold tracking-tight text-[#F5F7FA]">
            pawn<span className="text-[#5B8CFF]">.</span>ge
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-[#F5F7FA]">Welcome back</h1>
          <p className="mt-1 text-sm text-[#7F8999]">
            Sign in to search products or manage your Lombard.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-[.18em] text-[#7F8999] mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-white/[.045] border border-white/[.11] px-4 py-3 text-[#F5F7FA] placeholder-[#5c6675] outline-none focus:border-[#5B8CFF]/60 focus:shadow-[0_0_0_3px_rgba(91,140,255,.15)] transition"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs uppercase tracking-[.18em] text-[#7F8999] mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-white/[.045] border border-white/[.11] px-4 py-3 text-[#F5F7FA] placeholder-[#5c6675] outline-none focus:border-[#5B8CFF]/60 focus:shadow-[0_0_0_3px_rgba(91,140,255,.15)] transition"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-[#ff7b7b]">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#5B8CFF,#8B6CFF)" }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-sm text-[#7F8999]">
            New here?{" "}
            <Link href="/partner/register" className="text-[#8B6CFF] hover:text-[#B9A7FF]">
              Become a Lombard Partner
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
