import { sbAdmin } from '@/lib/supabase-server';

export default async function SharedPage({ params }: { params: { token: string } }) {
  const supabase = sbAdmin();
  const { data: share } = await supabase.from('shares').select('*').eq('token', params.token).maybeSingle();
  if (!share) return <div style={{padding:16}}>Link not found or expired.</div>;

  const { data: entries } = await supabase.from('entries')
    .select('id, content, summary, created_at, visibility')
    .eq('user_id', share.owner_id)
    .in('visibility', share.allowed_visibility)
    .order('created_at', { ascending: false });

  return (
    <main style={{padding:16, maxWidth:900, margin:'0 auto'}}>
      <h2>{share.label}</h2>
      {entries?.map((e:any)=> (
        <article key={e.id} style={{background:'#fff', padding:12, marginBottom:8, border:'1px solid #eee'}}>
          <strong>{e.summary ?? '—'}</strong>
          <p>{e.content}</p>
          <small>{new Date(e.created_at).toLocaleString()}</small>
        </article>
      ))}
      {!entries?.length && <p>No entries available for this link yet.</p>}
    </main>
  );
}
