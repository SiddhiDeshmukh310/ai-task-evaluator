import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ❌ BUGGY API FILE (purposefully broken for assignment)
export async function GET() {
  // BUG 1: No auth check
  // BUG 2: Wrong column spelling 'scor' instead of 'score'
  const { data, error } = await supabase
    .from('reports')
    .select('id, scor'); // intentionally wrong
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
