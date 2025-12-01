'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { motion } from 'framer-motion';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reportId = searchParams.get('reportId'); // ✅ define reportId


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [price] = useState(499); // mock ₹499

  useEffect(() => {
    if (!reportId) {
      setError('Missing report id');
    }
  }, [reportId]);

  const handlePay = async () => {
    if (!reportId) return;
    setLoading(true);
    setError('');

    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) throw sessionError;
      if (!sessionData?.session) throw new Error('Not logged in');

      const userId = sessionData.session.user.id;

      // 1) create mock payment row
      const { error: payError } = await supabase.from('payments').insert({
        user_id: userId,
        report_id: reportId,
        amount: price,
        currency: 'INR',
        status: 'success',
      });
      if (payError) throw payError;

      // 2) unlock report
      const { error: unlockError } = await supabase
        .from('reports')
        .update({ locked: false })
        .eq('id', reportId)
        .eq('user_id', userId);

      if (unlockError) throw unlockError;

      // 3) go back to report
      router.replace(`/reports/${reportId}`);
    } catch (e) {
      console.error(e);
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 py-10 flex items-center justify-center">
      <motion.div
        className="w-full max-w-md rounded-3xl border border-slate-800 bg-black/70 p-6 shadow-xl shadow-slate-950/70"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <p className="text-xs text-emerald-300 mb-1">Mock payment</p>
        <h1 className="text-2xl font-semibold mb-2">Unlock full report</h1>
        <p className="text-xs text-slate-400 mb-4">
          This is a mock checkout for the assignment. Clicking pay will unlock the
          improvements and refactored code for this report.
        </p>

        <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-3">
          <div>
            <p className="text-sm font-medium">Pro review</p>
            <p className="text-[11px] text-slate-400">
              Unlimited access to this report’s suggestions.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Price</p>
            <p className="text-xl font-semibold text-emerald-400">₹{price}</p>
          </div>
        </div>

        {error && (
          <div className="mb-3 rounded-2xl border border-red-500/70 bg-red-950/40 px-3 py-2 text-xs text-red-100">
            {error}
          </div>
        )}

        <button
          onClick={handlePay}
          disabled={loading || !reportId}
          className="w-full rounded-full bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/40 hover:bg-emerald-300 disabled:opacity-60"
        >
          {loading ? 'Processing…' : 'Pay & unlock'}
        </button>

        <button
          onClick={() => router.back()}
          className="mt-3 w-full text-[11px] text-slate-400 hover:text-slate-200"
        >
          Cancel and go back
        </button>
      </motion.div>
    </div>
  );
}
