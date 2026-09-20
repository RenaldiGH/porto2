"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/admin";

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal login");
        setLoading(false);
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Tidak bisa menghubungi server. Coba lagi.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 bg-grid-pattern">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl border border-zinc-800 bg-surface items-center justify-center mb-2">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white font-mono tracking-tight">REYNALDI🤓</h1>
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">Admin Workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-zinc-800 bg-surface space-y-5">
          <div>
            <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                placeholder="admin@reynaldi.dev"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white text-sm transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white text-sm transition-colors"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/30 border border-rose-900/50 rounded-lg px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors disabled:opacity-60"
          >
            <span>{loading ? "Memproses..." : "Masuk"}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-600 font-mono">Khusus administrator portofolio.</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
