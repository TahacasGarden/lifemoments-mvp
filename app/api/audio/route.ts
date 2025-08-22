import { NextResponse } from 'next/server';
import { sbAdmin, sbServer } from '@/lib/supabase-server';
import { summarizeEntry } from '@/lib/ai';
import OpenAI from 'openai';

export const runtime = 'nodejs'; // ensure Node APIs

export async function POST(req: Request) {
  try {
    const supabase = sbServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const form = await req.formData();
    const file = form.get('file') as File | null;
    const visibility = (form.get('visibility') as string) || 'private';
    if (!file) return NextResponse.json({ error: 'file missing' }, { status: 400 });

    // Upload raw audio to storage
    const admin = sbAdmin();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const path = `${user.id}/${cryptoRandom(16)}.webm`;

    const { error: upErr } = await admin.storage.from('media').upload(path, buffer, {
      contentType: file.type || 'audio/webm',
      upsert: false,
    });
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

    // Transcribe with OpenAI Whisper (gpt-4o-mini-transcribe or whisper-1)
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
    const transcriptResp = await openai.audio.transcriptions.create({
      model: 'gpt-4o-mini-transcribe',
      file: new File([buffer], 'audio.webm', { type: file.type || 'audio/webm' }),
    });
    const transcript = (transcriptResp as any).text || '';

    // Summarize
    const summary = await summarizeEntry(transcript);

    // Create entry
    const { data: inserted, error: insErr } = await admin.from('entries').insert({
      user_id: user.id,
      content: transcript || '(audio entry)',
      media_type: 'audio',
      media_path: path,
      summary,
      visibility
    }).select('id').single();
    if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });

    return NextResponse.json({ ok: true, id: inserted.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown error' }, { status: 500 });
  }
}

function cryptoRandom(len: number) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  for (let i=0;i<len;i++) s += chars[Math.floor(Math.random()*chars.length)];
  return s;
}
