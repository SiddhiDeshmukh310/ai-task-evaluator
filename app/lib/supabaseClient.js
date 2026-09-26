import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let clientInstance = null;

if (supabaseUrl && supabaseAnonKey) {
  clientInstance = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // During static prerendering / npm run build, provide a dummy client so build succeeds.
  // At runtime, accessing any method will throw a clear explicit error.
  const dummy = createClient('https://placeholder.supabase.co', 'placeholder-anon-key');
  clientInstance = new Proxy(dummy, {
    get(target, prop) {
      if (typeof window !== 'undefined' || process.env.NODE_ENV !== 'production') {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          console.error('[Supabase Config Error] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
        }
      }
      return target[prop];
    }
  });
}

export const supabase = clientInstance;