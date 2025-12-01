'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

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
        // 1) Check session
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) {
          console.error(sessionError);
          setError(sessionError.message);
          return;
        }

        if (!sessionData?.session) {
          setError('Not logged in');
          router.replace('/login');
          return;
        }

        const userId = sessionData.session.user.id;

        // 2) Load report for this user + id
        const { data, error } = await supabase
          .from('reports')
          .select(
            'id, score, strengths, improvements, refactored_code, locked, created_at, tasks(title, description, code)'
          )
          .eq('id', id)
          .eq('user_id', userId)
          .single();

        if (error) {
          console.error(error);
          setError(error.message);
          return;
        }

        setReport(data);
      } catch (e) {
        console.error(e);
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
      } finally {
        // ✅ always stop loading
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
        <p className="text-sm text-gray-400">Loading report…</p>
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

  // ✅ success UI
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {report.tasks?.title || 'Task report'}
          </h1>
          <span className="text-sm text-gray-400">
            Score: {report.score ?? 'N/A'}/100
          </span>
        </div>

        <div className="rounded-xl bg-gray-900 border border-gray-800 p-4">
          <h2 className="text-sm font-semibold mb-1">Task Description</h2>
          <p className="text-sm text-gray-200 mb-2">
            {report.tasks?.description}
          </p>
          <h3 className="text-xs font-medium text-gray-400 mb-1">Code</h3>
          <pre className="text-xs bg-black rounded-lg p-3 overflow-auto">
            {report.tasks?.code}
          </pre>
        </div>

        <div className="rounded-xl bg-gray-900 border border-gray-800 p-4 space-y-3">
          <h2 className="text-sm font-semibold">AI Feedback</h2>

          <div>
            <h3 className="text-xs font-medium text-gray-400 mb-1">
              Strengths
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-200">
              {(report.strengths || []).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium text-gray-400 mb-1">
              Improvements
            </h3>
            {report.locked ? (
              <p className="text-sm text-gray-500">
                Full improvements and refactored code are locked. Unlock to see
                details.
              </p>
            ) : (
              <ul className="list-disc list-inside text-sm text-gray-200">
                {(report.improvements || []).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="text-xs font-medium text-gray-400 mb-1">
              Refactored Code
            </h3>
            {report.locked ? (
              <div className="h-32 bg-black rounded-lg flex items-center justify-center text-xs text-gray-500">
                Refactored code is locked. Unlock to view.
              </div>
            ) : (
              <pre className="text-xs bg-black rounded-lg p-3 overflow-auto">
                {report.refactored_code}
              </pre>
            )}
          </div>

          {report.locked && (
            <button
              onClick={() => router.push(`/payment?reportId=${report.id}`)}
              className="mt-2 px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-sm"
            >
              Pay to unlock full report
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
