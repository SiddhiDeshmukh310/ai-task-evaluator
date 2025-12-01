'use client';

import { motion } from 'framer-motion';

export default function PricingSection() {
  return (
    <section className="space-y-4" id="pricing">
      <h2 className="text-lg sm:text-xl font-semibold">Start creating</h2>
      <p className="max-w-2xl text-sm text-slate-300">
        100 evaluations free for this assignment. Upgrade to a mock{' '}
        <span className="text-emerald-300">Studio</span> plan to show how you
        could monetize Smart Task Evaluator as a real product.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Starter */}
        <motion.div
          className="group relative rounded-2xl border border-slate-800 bg-black/60 p-4 shadow-sm shadow-slate-950/40 transition-all duration-200 hover:-translate-y-1 hover:border-slate-500 hover:shadow-slate-500/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <p className="text-xs font-semibold text-slate-300">Starter</p>
          <p className="mt-1 text-3xl font-semibold text-slate-50">
            ₹0<span className="text-sm text-slate-500"> / month</span>
          </p>
          <p className="mt-2 text-xs text-slate-400">
            For candidates and learners who want quick feedback on small coding
            tasks.
          </p>
          <ul className="mt-3 space-y-1 text-xs text-slate-200">
            <li>• 10 AI evaluations per day</li>
            <li>• Score + strengths included</li>
            <li>• Reports stored in Supabase</li>
          </ul>
          <a
            href="/signup"
            className="mt-4 inline-flex rounded-full bg-slate-100 px-4 py-1.5 text-xs font-medium text-slate-950 shadow-sm shadow-slate-100/30 transition-all duration-200 group-hover:scale-105 group-hover:bg-white"
          >
            Get started free
          </a>
        </motion.div>

        {/* Studio */}
        <motion.div
          className="group relative overflow-hidden rounded-2xl border border-emerald-400/60 bg-gradient-to-br from-emerald-500/10 via-slate-950 to-slate-950 p-4 shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:-translate-y-1 hover:shadow-emerald-400/60"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.1 }}
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/30 blur-3xl" />
          <p className="text-xs font-semibold text-emerald-300">Studio</p>
          <p className="mt-1 text-3xl font-semibold text-emerald-300">
            ₹499<span className="text-sm text-slate-400"> / month</span>
          </p>
          <p className="mt-2 text-xs text-slate-200">
            For hiring teams or bootcamps who want consistent evaluation across
            many candidates.
          </p>
          <ul className="mt-3 space-y-1 text-xs text-slate-100">
            <li>• Unlimited evaluations</li>
            <li>• Full improvements + refactored code unlocked</li>
            <li>• Shareable report links</li>
            <li>• Priority processing (mock)</li>
          </ul>
          <a
            href="/submit-task"
            className="mt-4 inline-flex rounded-full bg-emerald-400 px-4 py-1.5 text-xs font-medium text-slate-950 shadow-md shadow-emerald-400/40 transition-all duration-200 group-hover:scale-105 group-hover:bg-emerald-300"
          >
            Try Studio flow
          </a>
        </motion.div>
      </div>
    </section>
  );
}
