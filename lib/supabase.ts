import { createClient } from "@supabase/supabase-js";

// Check if we're using placeholder/demo values
const isUsingPlaceholder =
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder');

// Mock user and data for development
const mockUser = {
  id: 'demo-user-123',
  email: 'demo@lifemoments.app',
  created_at: new Date().toISOString(),
};

const mockSession = {
  user: mockUser,
  access_token: 'demo-token',
  expires_at: Date.now() + 3600000,
};

const mockEntries = [
  {
    id: '1',
    user_id: mockUser.id,
    title: 'Welcome to LifeMoments! 🎉',
    content: 'This is your first memory entry. LifeMoments is working in demo mode - you can test all features! When you\'re ready to save real memories, connect to Supabase.',
    summary: 'Welcome message and demo mode introduction.',
    topics: ['welcome', 'demo'],
    visibility: 'private',
    event_date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    sort_date: new Date().toISOString().split('T')[0],
  },
  {
    id: '2',
    user_id: mockUser.id,
    title: 'Family Gathering',
    content: 'Had a wonderful family dinner. Great conversations and delicious food made for perfect memories.',
    summary: 'Family time with meaningful conversations and good food.',
    topics: ['family', 'food', 'conversation'],
    visibility: 'family',
    event_date: '2024-01-15',
    created_at: '2024-01-15T19:30:00Z',
    updated_at: '2024-01-15T19:30:00Z',
    sort_date: '2024-01-15',
  },
];

const mockSupabase = {
  auth: {
    getSession: async () => ({ data: { session: mockSession }, error: null }),
    onAuthStateChange: (callback: any) => {
      setTimeout(() => callback('SIGNED_IN', mockSession), 100);
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signOut: async () => ({ error: null })
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        order: () => ({
          limit: () => Promise.resolve({ data: mockEntries, error: null })
        })
      })
    }),
    insert: async (data: any) => {
      const newEntry = {
        id: Math.random().toString(36).substr(2, 9),
        user_id: mockUser.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sort_date: data.event_date || new Date().toISOString().split('T')[0],
        ...data
      };
      mockEntries.unshift(newEntry);
      return { data: newEntry, error: null };
    }
  }),
  storage: {
    from: () => ({
      upload: async () => ({ error: null })
    })
  }
};

// Log the mode for clarity
if (isUsingPlaceholder) {
  console.log('🧪 LifeMoments running in DEMO MODE with mock data');
} else {
  console.log('✅ LifeMoments connected to real Supabase database');
}

export const supabase = isUsingPlaceholder ? mockSupabase : createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
