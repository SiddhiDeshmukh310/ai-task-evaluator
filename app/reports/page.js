'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const loadReports = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data?.session) return;
      const userId = data.session.user.id;

      const { data: reportsData } = await supabase
        .from('reports')
        .select('id, score, created_at, tasks(title)')
        .eq('user_id', userId);

      setReports(reportsData || []);
    };
    loadReports();
  }, []);

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h1 className="text-xl font-bold mb-4">Past Reports</h1>
      {reports.length === 0 && <p className="text-sm text-gray-500">No reports yet.</p>}
      <ul className="space-y-2">
        {reports.map((r) => (
          <li
            key={r.id}
            onClick={() => router.push(`/reports/${r.id}`)}
            className="cursor-pointer text-sm p-3 border border-gray-800 rounded hover:bg-gray-900"
          >
            {r.tasks?.title || 'Untitled'} – Score: {r.score}/100
          </li>
        ))}
      </ul>
    </div>
  );
}
