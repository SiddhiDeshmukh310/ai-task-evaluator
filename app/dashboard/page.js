'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data?.session) {
        router.replace('/login');
      } else {
        setEmail(data.session.user.email);
      }
      setChecking(false);
    };
    init();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.replace('/login');
          }}
          className="px-4 py-1 rounded bg-gray-800 text-sm"
        >
          Logout
        </button>
      </div>
       <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Dashboard Ready ✅</h1>
        <button
          onClick={() => router.push('/submit-task')}
          className="px-4 py-2 bg-blue-600 rounded text-sm"
        >
          Submit New Task
        </button>
      </div>
    </div>
      <div className="space-y-3">
        <button
          onClick={() => router.push('/submit-task')}
          className="px-4 py-2 rounded bg-blue-600 text-sm"
        >
          + Submit Task
        </button>
        <button
          onClick={() => router.push('/reports')}
          className="px-4 py-2 rounded bg-gray-900 border border-gray-800 text-sm"
        >
          View Past Reports
        </button>
      </div>

      {email && (
        <p className="mt-6 text-sm text-gray-500">Logged in as: {email}</p>
      )}
    </main>
  );
}

