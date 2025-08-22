import { NextResponse } from 'next/server';
import { sbServer } from '@/lib/supabase-server';
import crypto from 'crypto';

export async function POST(req: Request) {
  const supabase = sbServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { label, allowed_visibility } = await req.json();
  const token = crypto.randomBytes(16).toString('hex');

  const { data, error } = await supabase.from('shares').insert({
    owner_id: user.id,
    label,
    token,
    allowed_visibility
  }).select('token').single();

  return NextResponse.json({ token: data?.token, error });
}
