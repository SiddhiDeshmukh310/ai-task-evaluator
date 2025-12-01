'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (error) throw error;

      // after signup, send user to login
      router.push('/login');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-black/70 p-6 shadow-xl shadow-emerald-900/50">
        <p className="text-xs text-emerald-300 mb-1">Get started</p>
        <h1 className="text-xl font-semibold">Create your account</h1>
        <p className="mt-1 text-[11px] text-slate-400">
          Set up Smart Task Evaluator in seconds. No credit card required for this demo.
        </p>

        <form onSubmit={handleSignup} className="mt-5 space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-700 bg-black/60 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300">Password</label>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-700 bg-black/60 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              placeholder="at least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-[11px] text-red-400 bg-red-950/40 border border-red-900 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-400 px-4 py-2 text-xs font-medium text-slate-950 hover:bg-emerald-300 disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="mt-4 text-[11px] text-slate-500">
          Already have an account?{' '}
          <a href="/login" className="text-emerald-300 hover:text-emerald-200">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
