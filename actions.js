'use server';
import crypto from 'crypto';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { getSession, setSession, logout, hash, check } from '@/lib/auth';

const eq = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };

export async function ceoLogin(fd) {
  if (process.env.CEO_ID && eq(fd.get('id'), process.env.CEO_ID) && eq(fd.get('password'), process.env.CEO_PASSWORD)) { setSession('ceo', 'ceo'); redirect('/ceo'); }
  redirect('/ceo?e=1');
}
export async function shopLogin(fd) {
  const { data: s } = await db().from('shops').select('id,pass_hash,active').eq('login_id', String(fd.get('id')).trim()).maybeSingle();
  if (s && s.active && check(String(fd.get('password')), s.pass_hash)) { setSession('shop', s.id); redirect('/shop'); }
  redirect('/shop?e=1');
}
export async function logoutAction() { logout(); redirect('/'); }

export async function addShop(_, fd) {
  if (getSession()?.role !== 'ceo') return { err: 'परवानगी नाही' };
  const g = (k) => String(fd.get(k) || '').trim();
  if (!g('name')) return { err: 'दुकानाचं नाव लिहा' };
  const code = crypto.randomBytes(6).toString('base64url');
  const login_id = 'shop' + crypto.randomInt(1000, 9999);
  const password = crypto.randomBytes(5).toString('base64url');
  const { error } = await db().from('shops').insert({
    code, login_id, pass_hash: hash(password), name: g('name'), owner: g('owner'), phone: g('phone'), city: g('city'),
    printer: g('printer'), price_bw: +g('price_bw') || null, price_color: +g('price_color') || null,
  });
  if (error) return { err: 'सेव्ह झालं नाही, पुन्हा दाबा' };
  revalidatePath('/ceo');
  return { login_id, password, link: `${process.env.NEXT_PUBLIC_SITE_URL}/s/${code}` };
}
export async function toggleShop(id, active) {
  if (getSession()?.role !== 'ceo') return;
  await db().from('shops').update({ active }).eq('id', id);
  revalidatePath('/ceo');
}
export async function setJobStatus(id, status) {
  const s = getSession();
  if (s?.role !== 'shop' || !['ready', 'done', 'rejected'].includes(status)) return;
  const d = db();
  const { data: j } = await d.from('jobs').select('file_path').eq('id', id).eq('shop_id', s.id).maybeSingle();
  if (!j) return;
  if (j.file_path) await d.storage.from('files').remove([j.file_path]); // फाईल लगेच डिलीट
  await d.from('jobs').update({ status, file_path: null }).eq('id', id).eq('shop_id', s.id);
  revalidatePath('/shop');
}
