import { createClient } from "@supabase/supabase-js";

// Check if we're using placeholder/demo values
const isUsingPlaceholder =
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder');

let supabase: any;

if (isUsingPlaceholder) {
  // Use mock client for development
  console.log('🧪 Using mock Supabase client for development');
  import('./supabase-mock').then(mock => {
    Object.assign(supabase, mock.supabase);
  });

  // Temporary mock until dynamic import loads
  supabase = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signOut: async () => ({ error: null })
    },
    from: () => ({
      select: () => ({ eq: () => ({ order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }) }) }),
      insert: () => Promise.resolve({ error: null })
    }),
    storage: { from: () => ({ upload: () => Promise.resolve({ error: null }) }) }
  };
} else {
  // Use real Supabase client
  supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export { supabase };
