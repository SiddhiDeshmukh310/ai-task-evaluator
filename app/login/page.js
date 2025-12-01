'use client';

import { supabase } from "../lib/supabaseClient";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.replace("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-black/70 p-6 shadow-xl shadow-slate-950/60">
        <p className="text-sm text-emerald-300 mb-1">Welcome back</p>
        <h1 className="text-2xl font-semibold mb-1">Log in to Smart Task Evaluator</h1>
        <p className="text-xs text-slate-400 mb-6">
          Continue reviewing and unlocking your AI-generated reports.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-300 mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm outline-none focus:border-emerald-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm outline-none focus:border-emerald-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-900/40 border border-red-500/60 px-3 py-2 text-xs text-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-full bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-950 shadow-md shadow-slate-100/30 hover:bg-white disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
