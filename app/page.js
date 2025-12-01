'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Lottie from 'lottie-react';

import animation from './lottie/intro-bg.json';
import FeatureGrid from './components/FeatureGrid';
import PricingSection from './components/PricingSection';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-50">
      {/* INTRO SPLASH WITH LOTTIE */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Lottie background */}
            <Lottie
              animationData={animation}
              loop={true}
              className="absolute inset-0 h-full w-full opacity-40 pointer-events-none"
            />

            {/* Title on top */}
            <div className="relative z-10 text-center px-4">
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-300 via-sky-300 to-cyan-300 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                Smart Task Evaluator
              </motion.h1>
              <motion.p
                className="mt-3 text-sm text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Where the next wave of task evaluation happens.
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN PAGE CONTENT (VISIBLE UNDER SPLASH) */}
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-12">
        {/* HERO */}
        <motion.section
          className="text-center space-y-4"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <p className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-1 text-[11px] font-medium text-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI Mini-SaaS · Code Review
          </p>

          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Where the next wave of{' '}
            <span className="text-emerald-400">task evaluation</span> happens.
          </h2>

          <p className="max-w-xl mx-auto text-sm text-slate-300">
            Upload your coding task, run an AI evaluation, and unlock
            structured feedback with scores, strengths, improvements and
            refactored code.
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <motion.a
              href="/submit-task"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-6 py-2.5 text-sm font-medium text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-white"
            >
              Start evaluation
            </motion.a>
            <motion.a
              href="/reports"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-6 py-2.5 text-sm text-slate-200 shadow-sm hover:border-emerald-400 hover:text-emerald-200"
            >
              View reports
            </motion.a>
          </div>
        </motion.section>

        {/* FEATURES */}
        <motion.section
          className="space-y-4 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <h3 className="text-xl font-semibold">Built for code assignments</h3>
          <p className="max-w-2xl mx-auto text-sm text-slate-400">
            Evaluate coding questions, mini projects and take-home tasks in a
            single place, backed by Supabase and generative AI.
          </p>

          <FeatureGrid />
        </motion.section>

        {/* PRICING */}
        <motion.section
          className="space-y-4 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <h3 className="text-xl font-semibold">Subscription plans</h3>
          <PricingSection />
        </motion.section>
      </div>
    </div>
  );
}
