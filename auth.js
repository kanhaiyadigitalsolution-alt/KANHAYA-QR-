import crypto from 'crypto';
import { cookies } from 'next/headers';
const sign = (v) => v + '.' + crypto.createHmac('sha256', process.env.SESSION_SECRET).update(v).digest('hex');
export function setSession(role, id) {
  cookies().set('kqr', sign(role + ':' + id), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 43200, path: '/' });
}
export function getSession() {
  const c = cookies().get('kqr')?.value;
  if (!c) return null;
  const v = c.slice(0, c.lastIndexOf('.'));
  const a = Buffer.from(sign(v)), b = Buffer.from(c);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  const [role, id] = v.split(':');
  return { role, id };
}
export const logout = () => cookies().delete('kqr');
export const hash = (p, s = crypto.randomBytes(8).toString('hex')) => s + ':' + crypto.scryptSync(p, s, 32).toString('hex');
export const check = (p, h) => {
  const a = Buffer.from(hash(p, h.split(':')[0])), b = Buffer.from(h);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};
