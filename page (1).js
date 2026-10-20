import QRCode from 'qrcode';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { cleanup } from '@/lib/cleanup';
import { shopLogin, logoutAction, setJobStatus } from '../actions';
import Login from '@/components/Login';
import Refresh from '@/components/Refresh';
export const dynamic = 'force-dynamic';
export default async function Shop({ searchParams }) {
  const s = getSession();
  if (s?.role !== 'shop') return <Login title="दुकानदार लॉगिन" action={shopLogin} err={searchParams?.e} />;
  await cleanup();
  const d = db();
  const { data: shop } = await d.from('shops').select('*').eq('id', s.id).single();
  const { data: jobs } = await d.from('jobs').select('*').eq('shop_id', s.id).in('status', ['new', 'ready']).order('created_at');
  for (const j of jobs || []) if (j.file_path) j.url = (await d.storage.from('files').createSignedUrl(j.file_path, 600)).data?.signedUrl;
  const qr = await QRCode.toDataURL(`${process.env.NEXT_PUBLIC_SITE_URL}/s/${shop.code}`, { width: 300, margin: 1 });
  return (
    <div className="w">
      <Refresh />
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div><b style={{ color: 'var(--aqua)' }}>Kanhaiya QR Code</b><h2>{shop.name}</h2></div>
        <form action={logoutAction}><button className="btn g">बाहेर पडा</button></form>
      </div>
      <div className="card">
        <b>लाईव्ह क्यू</b> <span className="mut">(५ सेकंदांनी आपोआप अपडेट)</span>
        {!jobs?.length && <p className="mut">सध्या कोणतंही काम नाही.</p>}
        {jobs?.map((j) => (
          <div key={j.id} className="row" style={{ borderTop: '1px solid var(--line)', paddingTop: 10, marginTop: 10 }}>
            <b style={{ color: 'var(--aqua)', fontSize: 22 }}>#{j.token}</b>
            <span style={{ flex: 1, minWidth: 180 }}>{j.customer || 'ग्राहक'} · {j.file_name}<br />
              <span className="mut">{j.paper} · {j.color === 'color' ? 'रंगीत' : 'काळं-पांढरं'} · {j.sides === '2' ? '२ बाजू' : '१ बाजू'} · {j.copies} प्रती</span></span>
            {j.status === 'new' && <>
              {j.url && <a className="btn" href={j.url} target="_blank" rel="noreferrer">पाहा / प्रिंट</a>}
              <form action={setJobStatus.bind(null, j.id, 'ready')}><button className="btn g">तयार झाले</button></form>
              <form action={setJobStatus.bind(null, j.id, 'rejected')}><button className="btn g">नकार</button></form>
            </>}
            {j.status === 'ready' && <><span className="tag">तयार</span><form action={setJobStatus.bind(null, j.id, 'done')}><button className="btn g">ग्राहकाला दिलं</button></form></>}
          </div>
        ))}
      </div>
      <div className="card"><b>माझा QR</b><p className="mut">हा प्रिंट करून काउंटरवर लावा.</p>
        <img src={qr} alt="दुकानाचा QR" width="200" height="200" /><br />
        <a className="btn g" href={qr} download={`QR-${shop.name}.png`}>QR डाउनलोड करा</a></div>
    </div>
  );
}
