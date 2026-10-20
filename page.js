import QRCode from 'qrcode';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { cleanup } from '@/lib/cleanup';
import { ceoLogin, logoutAction, toggleShop } from '../actions';
import Login from '@/components/Login';
import AddShop from '@/components/AddShop';
export const dynamic = 'force-dynamic';
export default async function Ceo({ searchParams }) {
  if (getSession()?.role !== 'ceo') return <Login title="CEO लॉगिन" action={ceoLogin} err={searchParams?.e} />;
  await cleanup();
  const d = db();
  const day = new Date(); day.setHours(0, 0, 0, 0);
  const { data: shops } = await d.from('shops').select('*').order('created_at', { ascending: false });
  const { data: jobs } = await d.from('jobs').select('shop_id').gte('created_at', day.toISOString());
  const cnt = {}; (jobs || []).forEach((j) => { cnt[j.shop_id] = (cnt[j.shop_id] || 0) + 1; });
  const list = await Promise.all((shops || []).map(async (s) => ({ ...s, qr: await QRCode.toDataURL(`${process.env.NEXT_PUBLIC_SITE_URL}/s/${s.code}`, { width: 300, margin: 1 }) })));
  return (
    <div className="w">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div><b style={{ color: 'var(--aqua)' }}>Kanhaiya QR Code</b><h2>CEO डॅशबोर्ड</h2></div>
        <form action={logoutAction}><button className="btn g">बाहेर पडा</button></form>
      </div>
      <div className="grid" style={{ marginBottom: 14 }}>
        <div className="card"><div className="mut">एकूण दुकाने</div><h1>{list.length}</h1></div>
        <div className="card"><div className="mut">चालू दुकाने</div><h1>{list.filter((s) => s.active).length}</h1></div>
        <div className="card"><div className="mut">आज एकूण जॉब</div><h1>{jobs?.length || 0}</h1></div>
      </div>
      <AddShop />
      <div className="card"><b>सर्व दुकाने</b>
        {list.map((s) => (
          <div key={s.id} className="row" style={{ borderTop: '1px solid var(--line)', paddingTop: 10, marginTop: 10 }}>
            <img src={s.qr} alt="QR" width="90" height="90" />
            <span style={{ flex: 1, minWidth: 180 }}><b>{s.name}</b> <span className={s.active ? 'tag' : 'mut'}>{s.active ? 'चालू' : 'बंद'}</span><br />
              <span className="mut">{s.city} · {s.owner} · {s.phone}<br />लॉगिन ID: {s.login_id} · आज जॉब: {cnt[s.id] || 0}</span></span>
            <a className="btn g" href={s.qr} download={`QR-${s.name}.png`}>QR डाउनलोड</a>
            <a className="btn g" href={`/s/${s.code}`} target="_blank">ग्राहक पेज</a>
            <form action={toggleShop.bind(null, s.id, !s.active)}><button className="btn g">{s.active ? 'बंद करा' : 'चालू करा'}</button></form>
          </div>
        ))}
      </div>
    </div>
  );
}
