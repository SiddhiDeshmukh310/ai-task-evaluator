'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';

export default function SubmitTaskPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data?.session) {
        // If you want to force login:
        // router.replace('/login');
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) throw sessionError;
      if (!sessionData?.session) {
        throw new Error('Not logged in');
      }

      const userId = sessionData.session.user.id;

      // Insert task (we only save title/description/code to avoid DB issues)
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .insert({
          user_id: userId,
          title,
          description,
          code,
        })
        .select()
        .single();

      if (taskError) throw taskError;

      // Call AI evaluation endpoint
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, code }),
      });

      if (!res.ok) throw new Error('AI evaluation failed');

      const evalResult = await res.json();

      const { data: report, error: reportError } = await supabase
        .from('reports')
        .insert({
          task_id: task.id,
          user_id: userId,
          score: evalResult.score,
          strengths: evalResult.strengths,
          improvements: evalResult.improvements,
          refactored_code: evalResult.refactored_code,
          locked: true,
        })
        .select()
        .single();

      if (reportError) throw reportError;

      router.push(`/reports/${report.id}`);
    } catch (e) {
      console.error(e);
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-56px)] bg-slate-950 text-slate-50 px-4 py-8 overflow-hidden">
      {/* Soft gradient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute -top-32 left-0 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs text-emerald-300 mb-1">Step 1 · Paste your assignment</p>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Submit a Coding Task
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Add your problem statement and code. We’ll generate a scored, structured AI review.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="rounded-full border border-emerald-400/60 bg-emerald-500/10 px-3 py-1 text-emerald-200">
              100 free evaluations • Mock
            </span>
            <span className="rounded-full border border-slate-600 px-3 py-1 text-slate-300">
              Supabase · OpenAI (mock)
            </span>
          </div>
        </div>

        {/* Main layout: form + tips */}
        <motion.div
          className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Form card */}
          <div className="rounded-3xl border border-slate-800 bg-black/70 p-5 sm:p-6 shadow-xl shadow-slate-950/70">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Meta row: language + difficulty */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs sm:text-sm outline-none transition-colors focus:border-emerald-400"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Difficulty
                  </label>
                  <div className="flex gap-2">
                    {['easy', 'medium', 'hard'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setDifficulty(level)}
                        className={`flex-1 rounded-2xl border px-2 py-1.5 text-xs capitalize transition-all 
                          ${
                            difficulty === level
                              ? 'border-emerald-400 bg-emerald-500/15 text-emerald-200'
                              : 'border-slate-700 bg-slate-950/60 text-slate-300 hover:border-slate-500'
                          }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Title
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm outline-none transition-colors focus:border-emerald-400"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Array Sum Problem"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Task Description
                </label>
                <textarea
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm outline-none transition-colors focus:border-emerald-400 resize-none"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the problem, input/output format, constraints, etc."
                  required
                />
              </div>

              {/* Code editor style area */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-medium text-slate-300">
                    Your Code
                  </label>
                  <span className="text-[10px] text-slate-500">
                    Paste a function, solution, or full file
                  </span>
                </div>
                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900">
                  <div className="flex items-center gap-1 border-b border-slate-800 bg-slate-950/80 px-3 py-1.5 text-[10px] text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-red-500/70" />
                    <span className="h-2 w-2 rounded-full bg-amber-400/70" />
                    <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
                    <span className="ml-3 uppercase tracking-wide text-[9px] text-slate-500">
                      {language} · editor
                    </span>
                  </div>
                  <textarea
                    className="w-full bg-transparent px-3 py-3 text-xs sm:text-sm font-mono text-slate-100 outline-none resize-none min-h-[220px]"
                    rows={10}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={
                      language === 'javascript'
                        ? `function sumArray(arr) {\n  return arr.reduce((a, b) => a + b, 0);\n}`
                        : ''
                    }
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-500/70 bg-red-950/40 px-3 py-2 text-xs text-red-100">
                  {error}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center rounded-full bg-emerald-400 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/40 transition-all hover:bg-emerald-300 disabled:opacity-60"
                >
                  {loading ? 'Submitting & running AI…' : 'Submit & Run AI'}
                </button>
                <p className="text-[11px] text-slate-500">
                  We’ll store your task and AI report securely under your account.
                </p>
              </div>
            </form>
          </div>

          {/* Right side: tips / info */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-800 bg-black/70 p-4 text-xs sm:text-sm text-slate-300 shadow-lg shadow-slate-950/70">
              <h3 className="text-sm font-semibold mb-2 text-emerald-300">
                What you’ll get
              </h3>
              <ul className="list-disc space-y-1 pl-4">
                <li>Score out of 100 based on readability, correctness and structure.</li>
                <li>3 key strengths and 3 concrete improvement suggestions.</li>
                <li>A refactored code snippet that you can compare with your own.</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-[11px] text-slate-400">
              <h4 className="text-xs font-semibold mb-2 text-slate-200">
                Tips for better evaluations
              </h4>
              <ul className="list-disc space-y-1 pl-4">
                <li>Include edge cases in your description.</li>
                <li>Mention time / space constraints if they matter.</li>
                <li>Paste the smallest code that still shows your logic.</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
