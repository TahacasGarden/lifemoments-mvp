import { NextResponse } from 'next/server';
import { sbServer } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = sbServer();
    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr) {
      return NextResponse.json({ entries: [], error: userErr.message });
    }

    if (!user) {
      // Not signed in, still return JSON
      return NextResponse.json({ entries: [] });
    }

    const { data, error } = await supabase
      .from('entries')
      .select('id, content, summary, created_at, visibility')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return NextResponse.json({ entries: data ?? [], error: error?.message || null });
  } catch (e: any) {
    return NextResponse.json({ entries: [], error: e?.message || 'Unknown error' });
  }
}
