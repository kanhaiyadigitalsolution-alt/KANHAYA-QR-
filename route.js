import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { cleanup } from '@/lib/cleanup';
const OK = { 'application/pdf': 'pdf', 'image/jpeg': 'jpg', 'image/png': 'png' };
const err = (m, s = 400) => NextResponse.json({ err: m }, { status: s });
export async function POST(req) {
  const fd = await req.formData();
  const f = fd.get('file');
  const d = db();
  const { data: shop } = await d.from('shops').select('id,active').eq('code', String(fd.get('code'))).maybeSingle();
  if (!shop || !shop.active) return err('दुकान सापडलं नाही', 404);
  if (!f || typeof f === 'string' || !OK[f.type]) return err('फक्त PDF, JPG, PNG चालतील');
  if (f.size > 4 * 1024 * 1024) return err('फाईल ४ MB पेक्षा मोठी आहे');
  const path = `${shop.id}/${crypto.randomUUID()}.${OK[f.type]}`;
  const up = await d.storage.from('files').upload(path, Buffer.from(await f.arrayBuffer()), { contentType: f.type });
  if (up.error) return err('अपलोड झालं नाही', 500);
  const day = new Date(); day.setHours(0, 0, 0, 0);
  const { count } = await d.from('jobs').select('id', { count: 'exact', head: true }).eq('shop_id', shop.id).gte('created_at', day.toISOString());
  const token = (count || 0) + 1;
  const pick = (k, a, def) => (a.includes(fd.get(k)) ? fd.get(k) : def);
  await d.from('jobs').insert({
    shop_id: shop.id, token, file_path: path, file_name: String(f.name).slice(0, 80),
    customer: String(fd.get('customer') || '').slice(0, 40),
    paper: pick('paper', ['A4', 'A3', 'Legal'], 'A4'), color: pick('color', ['bw', 'color'], 'bw'), sides: pick('sides', ['1', '2'], '1'),
    copies: Math.min(Math.max(+fd.get('copies') || 1, 1), 100),
  });
  cleanup().catch(() => {});
  return NextResponse.json({ token });
}
