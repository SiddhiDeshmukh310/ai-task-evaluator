'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function ReportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    const load = async () => {
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) {
          setError(sessionError.message);
          return;
        }

        if (!sessionData?.session) {
          setError('Not logged in');
          router.replace('/login');
          return;
        }

        const userId = sessionData.session.user.id;

        const { data, error } = await supabase
          .from('reports')
          .select(
            'id, score, criteria, strengths, improvements, refactored_code, locked, created_at, tasks(title, description, code)'
          )
          .eq('id', id)
          .eq('user_id', userId)
          .single();

        if (error) {
          setError(error.message);
          return;
        }

        setReport(data);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      load();
    } else {
      setError('Missing report id');
      setLoading(false);
    }
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading evaluation report...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold">Could not load report</h1>
          <p className="text-sm text-red-400">{error || 'No data found'}</p>
          <button
            onClick={() => router.push('/reports')}
            className="mt-3 px-4 py-2 rounded bg-blue-600 text-sm"
          >
            Back to reports
          </button>
        </div>
      </div>
    );
  }

  const defaultCriteria = {
    correctness: { score: 4, justification: 'Functional implementation' },
    readability: { score: 4, justification: 'Clean function layout' },
    efficiency: { score: 4, justification: 'Optimal loop complexity' },
    security_edge_cases: { score: 4, justification: 'Standard input handling' },
  };

  const activeCriteria = report.criteria || defaultCriteria;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800 pb-4 gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Evaluation Report
            </span>
            <h1 className="text-2xl font-bold">
              {report.tasks?.title || 'Task Evaluation'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-2xl font-extrabold text-emerald-400">
                {report.score ?? 'N/A'}
              </span>
              <span className="text-xs text-gray-500"> / 100</span>
            </div>
            {report.locked && (
              <span className="px-2.5 py-1 text-xs rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Locked Preview
              </span>
            )}
          </div>
        </div>

        {/* Task Submission details */}
        <div className="rounded-2xl bg-gray-900/80 border border-gray-800 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-300">Task Statement & Source Code</h2>
          <p className="text-sm text-gray-300">{report.tasks?.description}</p>
          <pre className="text-xs bg-black/90 font-mono text-gray-200 rounded-xl p-4 overflow-auto border border-gray-800">
            {report.tasks?.code}
          </pre>
        </div>

        {/* Criterion Ratings Breakdown */}
        <div className="rounded-2xl bg-gray-900/80 border border-gray-800 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-emerald-400">Criteria Breakdown (1–5 Ratings)</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(activeCriteria).map(([key, item]) => (
              <div key={key} className="p-3 rounded-xl bg-black/60 border border-gray-800/80 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="capitalize font-medium text-gray-300">{key.replace('_', ' ')}</span>
                  <span className="font-bold text-emerald-400">{item.score} / 5</span>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full"
                    style={{ width: `${(item.score / 5) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">{item.justification}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Feedback */}
        <div className="rounded-2xl bg-gray-900/80 border border-gray-800 p-5 space-y-5">
          <h2 className="text-sm font-semibold text-gray-200">AI Code Review</h2>

          <div>
            <h3 className="text-xs font-semibold text-emerald-300 mb-2">Key Strengths</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
              {(report.strengths || []).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-amber-300 mb-2">Improvement Suggestions</h3>
            {report.locked ? (
              <p className="text-xs text-gray-500 italic">
                Full concrete improvement suggestions are locked in preview mode.
              </p>
            ) : (
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                {(report.improvements || []).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="text-xs font-semibold text-blue-300 mb-2">Refactored Clean Solution</h3>
            {report.locked ? (
              <div className="h-28 bg-black/80 rounded-xl border border-gray-800 flex items-center justify-center text-xs text-gray-500">
                Refactored code snippet is locked. Unlock to view full refactored output.
              </div>
            ) : (
              <pre className="text-xs bg-black/90 font-mono text-emerald-200 rounded-xl p-4 overflow-auto border border-gray-800">
                {report.refactored_code}
              </pre>
            )}
          </div>

          {report.locked && (
            <button
              onClick={() => router.push(`/payment?reportId=${report.id}`)}
              className="mt-2 w-full sm:w-auto px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors shadow-lg shadow-emerald-500/20"
            >
              Unlock Full Report (₹499)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}