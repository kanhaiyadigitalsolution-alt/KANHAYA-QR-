import { db } from '@/lib/db';
import Upload from '@/components/Upload';
export const dynamic = 'force-dynamic';
export default async function Customer({ params }) {
  const { data: s } = await db().from('shops').select('name,city,active,price_bw,price_color').eq('code', params.code).maybeSingle();
  if (!s || !s.active) return <div className="w"><h2>हा QR सध्या चालू नाही</h2></div>;
  return (
    <div className="w" style={{ maxWidth: 480 }}>
      <b style={{ color: 'var(--aqua)', fontSize: 20 }}>Kanhaiya QR Code</b>
      <h2>{s.name}</h2><div className="mut">{s.city}</div>
      {(s.price_bw || s.price_color) && <p className="mut">दर प्रति पान: {s.price_bw ? `काळं-पांढरं ₹${s.price_bw}` : ''} {s.price_color ? `· रंगीत ₹${s.price_color}` : ''}</p>}
      <Upload code={params.code} />
    </div>
  );
}
