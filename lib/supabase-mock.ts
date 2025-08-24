// Mock Supabase client for local development when no real database is available

// Mock user data
const mockUser = {
  id: 'mock-user-123',
  email: 'demo@lifemoments.app',
  created_at: new Date().toISOString(),
};

// Mock session data
const mockSession = {
  user: mockUser,
  access_token: 'mock-token',
  expires_at: Date.now() + 3600000, // 1 hour from now
};

// Mock entries data
const mockEntries = [
  {
    id: '1',
    user_id: mockUser.id,
    title: 'Welcome to LifeMoments',
    content: 'This is your first memory entry. Start capturing your precious moments here!',
    summary: 'Welcome message and introduction to the platform.',
    topics: ['welcome', 'first-memory'],
    visibility: 'private',
    event_date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    sort_date: new Date().toISOString().split('T')[0],
  },
  {
    id: '2',
    user_id: mockUser.id,
    title: 'Family Dinner',
    content: 'Had a wonderful dinner with the family. Mom made her famous lasagna and we shared stories about our childhood.',
    summary: 'Family gathering with home-cooked meal and nostalgic conversations.',
    topics: ['family', 'food', 'memories'],
    visibility: 'family',
    event_date: '2024-01-15',
    created_at: '2024-01-15T19:30:00Z',
    updated_at: '2024-01-15T19:30:00Z',
    sort_date: '2024-01-15',
  },
];

// Mock Supabase client
export const supabase = {
  auth: {
    getSession: async () => {
      return { 
        data: { session: mockSession }, 
        error: null 
      };
    },
    
    onAuthStateChange: (callback: any) => {
      // Immediately call callback with mock session
      callback('SIGNED_IN', mockSession);
      
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    },
    
    signOut: async () => {
      return { error: null };
    },
    
    signInWithPassword: async () => {
      return { 
        data: { user: mockUser, session: mockSession }, 
        error: null 
      };
    }
  },
  
  from: (table: string) => {
    if (table === 'v_timeline' || table === 'entries') {
      return {
        select: () => ({
          eq: () => ({
            order: () => ({
              limit: () => Promise.resolve({
                data: mockEntries,
                error: null
              })
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
          
          return { 
            data: newEntry, 
            error: null 
          };
        }
      };
    }
    
    if (table === 'entry_media') {
      return {
        insert: async () => ({ error: null })
      };
    }
    
    return {
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ error: null }),
      update: () => Promise.resolve({ error: null }),
      delete: () => Promise.resolve({ error: null })
    };
  },
  
  storage: {
    from: () => ({
      upload: async () => ({ error: null }),
      download: async () => ({ data: null, error: null })
    })
  }
};
