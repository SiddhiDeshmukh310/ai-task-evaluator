'use client';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function NavBar() {
  const router = useRouter();
  const logout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  return (
    <nav className="p-4 flex justify-between text-sm border-b border-gray-800">
      <button onClick={() => router.push('/dashboard')}>Home</button>
      <button onClick={() => router.push('/reports')}>Reports</button>
      <button onClick={() => router.push('/payment')}>Payments</button>
      <button onClick={logout} className="text-red-400">Logout</button>
    </nav>
  );
}
