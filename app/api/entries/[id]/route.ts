import { NextResponse } from 'next/server';
import { sbServer } from '@/lib/supabase-server';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const supabase = sbServer();
  const updates = await req.json();
  const { data, error } = await supabase
    .from('entries')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', params.id)
    .select('*')
    .single();
  return NextResponse.json({ entry: data, error });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const supabase = sbServer();
  const { error } = await supabase.from('entries').delete().eq('id', params.id);
  return NextResponse.json({ ok: !error, error });
}
