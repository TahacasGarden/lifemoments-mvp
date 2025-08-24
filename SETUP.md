# LifeMoments Beta - Production Setup Guide

## 🚀 Quick Deploy to Production

### 1. Database Setup (Supabase)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Wait for database to initialize

2. **Run Database Schema**
   ```sql
   -- Create entries table
   CREATE TABLE entries (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     title TEXT,
     content TEXT,
     summary TEXT,
     topics TEXT[],
     visibility TEXT CHECK (visibility IN ('private', 'family', 'link', 'public')) DEFAULT 'private',
     event_date DATE,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Create entry_media table for audio/video
   CREATE TABLE entry_media (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     entry_id UUID REFERENCES entries(id) ON DELETE CASCADE,
     kind TEXT NOT NULL,
     storage_path TEXT NOT NULL,
     mime_type TEXT,
     duration_seconds INTEGER,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Create timeline view
   CREATE VIEW v_timeline AS
   SELECT 
     e.*,
     COALESCE(e.event_date::text, e.created_at::date::text) as sort_date
   FROM entries e;

   -- Enable RLS (Row Level Security)
   ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
   ALTER TABLE entry_media ENABLE ROW LEVEL SECURITY;

   -- RLS Policies
   CREATE POLICY "Users can view own entries" ON entries
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own entries" ON entries
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update own entries" ON entries
     FOR UPDATE USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete own entries" ON entries
     FOR DELETE USING (auth.uid() = user_id);

   CREATE POLICY "Users can view own media" ON entry_media
     FOR SELECT USING (auth.uid() = (SELECT user_id FROM entries WHERE id = entry_id));

   CREATE POLICY "Users can insert own media" ON entry_media
     FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM entries WHERE id = entry_id));
   ```

3. **Set up Storage Bucket**
   - Go to Storage in Supabase dashboard
   - Create bucket named `media`
   - Set bucket to public if you want sharable links

### 2. Environment Variables

Get these from your Supabase project:
- **Project URL**: Settings → API → Project URL
- **Anon Key**: Settings → API → Project API keys → anon public
- **Service Role Key**: Settings → API → Project API keys → service_role (keep secret!)

Get OpenAI API key from [platform.openai.com](https://platform.openai.com)

### 3. Deploy Options

#### Option A: Netlify (Recommended)
1. Connect GitHub repo to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically

#### Option B: Vercel
1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically

### 4. Environment Variables to Set

In your deployment platform, set these:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
NEXTAUTH_SECRET=random_secret_key
NEXTAUTH_URL=https://your-domain.com
```

### 5. Optional: Enable OAuth

In Supabase dashboard:
- Go to Authentication → Providers
- Enable Google/GitHub/etc.
- Add OAuth app credentials

## 🎉 Your LifeMoments Beta is Ready!

After deployment, users can:
- ✅ Sign up and create accounts
- ✅ Capture text and audio memories
- ✅ Organize with topics and visibility
- ✅ Timeline view of all memories
- ✅ Share memories with family

## Support

For issues or questions:
- Check logs in your deployment platform
- Verify environment variables are set
- Ensure Supabase database schema is applied
