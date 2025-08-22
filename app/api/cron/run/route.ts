import { NextResponse } from 'next/server';
import { sbAdmin } from '@/lib/supabase-server';

// This endpoint should be called by a scheduler (e.g., GitHub Actions, Vercel Cron, Supabase cron)
// It will find due entries with scheduled_at <= now and delivered=false, then mark them delivered.
// TODO: Wire an email provider (Resend/Sendgrid) to actually send messages to recipients.

export const runtime = 'nodejs';

export async function GET() {
  const admin = sbAdmin();
  const now = new Date().toISOString();

  const { data: due, error } = await admin
    .from('entries')
    .select('*')
    .lte('scheduled_at', now)
    .eq('delivered', false);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let processed = 0;
  for (const e of due || []) {
    // Mark delivered
    await admin.from('entries').update({ delivered: true }).eq('id', e.id);
    processed++;
    // NOTE: Here you would send an email with a signed link to view the entry timeline.
    // Example signed URL for media could be created via:
    // const { data: url } = await admin.storage.from('media').createSignedUrl(e.media_path, 60*60);
  }

  return NextResponse.json({ ok: true, processed });
}
