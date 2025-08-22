import { NextRequest, NextResponse } from 'next/server';
import { sbServer } from '@/lib/supabase-server';
import PDFDocument from 'pdfkit';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const supabase = sbServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const scope = searchParams.get('scope') || 'all';

  let q = supabase.from('entries')
    .select('content, summary, created_at, visibility')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  if (scope === 'public') q = q.eq('visibility', 'public');
  if (scope === 'family') q = q.in('visibility', ['family','public'] as any);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const doc = new PDFDocument({ size: 'LETTER', margin: 48 });
  const chunks: Buffer[] = [];
  doc.on('data', (c) => chunks.push(c));
  const done = new Promise<Buffer>((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });

  doc.fontSize(20).text('LifeMoments — Life Book', { align: 'center' });
  doc.moveDown();
  for (const e of data || []) {
    doc.fontSize(12).fillColor('#111').text(new Date(e.created_at).toLocaleString());
    if (e.summary) doc.fontSize(14).fillColor('#000').text(`“${e.summary}”`, { continued: false });
    doc.moveDown(0.2);
    doc.fontSize(12).fillColor('#333').text(e.content || '', { align: 'left' });
    doc.moveDown();
    doc.moveTo(48, doc.y).lineTo(564, doc.y).strokeColor('#ddd').stroke();
    doc.moveDown();
  }
  doc.end();

  const pdf = await done;
  return new NextResponse(pdf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="lifebook.pdf"',
    }
  });
}
