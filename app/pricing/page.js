'use client';

import { motion } from "framer-motion";
import PricingSection from "../components/PricingSection";

export default function PricingPage() {
  return (
    <motion.div
      className="min-h-[calc(100vh-56px)] px-4 py-10"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="text-xs text-emerald-300 mb-1">Pricing</p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Choose a plan that fits your workflow.
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mt-2">
            For the assignment, these are mock plans—but the structure shows how you could
            turn Smart Task Evaluator into a real SaaS product.
          </p>
        </div>

        <PricingSection />
      </div>
    </motion.div>
  );
}

