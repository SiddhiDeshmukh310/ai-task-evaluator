'use client';

import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 * i, duration: 0.4, ease: 'easeOut' },
  }),
};

export default function FeatureGrid() {
  const items = [
    {
      title: 'Consistent',
      description:
        'Every task is evaluated with the same structure: score, strengths, improvements and refactored code.',
    },
    {
      title: 'Actionable',
      description:
        'Instead of vague comments, get concrete suggestions and code-level edits you can apply instantly.',
    },
    {
      title: 'Developer-first',
      description:
        'Built around real coding workflows: paste a snippet, push it through AI, store the result in Supabase.',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item, i) => (
        <motion.div
          key={item.title}
          className="group rounded-2xl border border-slate-800 bg-black/40 p-4 shadow-sm shadow-slate-950/40 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-emerald-500/30"
          custom={i}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={itemVariants}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 group-hover:text-emerald-300">
            {item.title}
          </p>
          <p className="mt-2 text-sm text-slate-200">{item.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
