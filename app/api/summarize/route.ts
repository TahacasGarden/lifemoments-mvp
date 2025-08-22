import { NextResponse } from 'next/server';
import { sbServer } from '@/lib/supabase-server';
import { summarizeEntry } from '@/lib/ai';

export async function POST(req: Request) {
  const { entryId, content } = await req.json();
  const summary = await summarizeEntry(content);
  const supabase = sbServer();
  await supabase.from('entries').update({ summary }).eq('id', entryId);
  return NextResponse.json({ summary });
}
