# LifeMoments MVP

Capture wisdom. Share your legacy. For the people you love.

## Stack
- Next.js (App Router)
- Supabase (Auth, Postgres, Storage)
- Chakra UI
- OpenAI (Summaries), Whisper (optional STT)
- SWR

## Quick Start
1. `cp .env.example .env.local` and fill values.
2. In Supabase SQL Editor, run the SQL in `supabase/schema.sql` and `supabase/storage-policies.sql`.
3. `npm install`
4. `npm run dev`
5. Visit `http://localhost:3000`

## Notes
- The *share* page uses a server-side admin client. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.
- Set up OAuth providers in Supabase if desired.
- Optional: Add a CRON or edge function for future message delivery and "On this day" resurfacing.

## Security
- RLS policies lock down user data. Review them before production.
- The service role key must never be exposed in client code.

## Step 10 Features
- Google OAuth on `/sign-in` (enable Google provider in Supabase Auth).
- Audio capture + transcription:
  - Record in dashboard, uploads to `media/{user_id}/...`.
  - Transcribed via OpenAI (gpt-4o-mini-transcribe) and summarized.
- Future delivery cron:
  - `GET /api/cron/run` finds due entries and marks delivered.
  - Hook this to a scheduler (Vercel Cron, GitHub Actions, Supabase cron).
  - TODO: integrate an email provider (Resend/Sendgrid) to actually send.
- Export to PDF:
  - `GET /api/export/pdf?scope=all|family|public` generates a Life Book PDF.
Deployed without pdf export Fri Aug 22 13:07:22 EDT 2025
