'use client';
import { useState } from 'react';
export default function Upload({ code }) {
  const [o, setO] = useState({ paper: 'A4', color: 'bw', sides: '1', copies: 1, customer: '' });
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [token, setToken] = useState(null);
  const opt = (k, v, t) => <button key={v} type="button" className={'btn' + (o[k] === v ? '' : ' g')} onClick={() => setO({ ...o, [k]: v })}>{t}</button>;
  async function send() {
    if (!file) { setMsg('आधी फाईल निवडा'); return; }
    setBusy(true); setMsg('');
    const fd = new FormData();
    fd.set('code', code); fd.set('file', file);
    Object.entries(o).forEach(([k, v]) => fd.set(k, v));
    try {
      const r = await fetch('/api/upload', { method: 'POST', body: fd });
      const j = await r.json();
      if (r.ok) setToken(j.token); else setMsg(j.err || 'काहीतरी चुकलं');
    } catch { setMsg('नेटवर्क चुकलं, पुन्हा प्रयत्न करा'); }
    setBusy(false);
  }
  if (token) return (
    <div className="card" style={{ textAlign: 'center' }}>
      <h2>पाठवलं गेलं!</h2>
      <div className="mut">तुमचा टोकन नंबर</div>
      <div style={{ fontSize: 56, fontWeight: 800, color: 'var(--aqua)' }}>#{token}</div>
      <p>दुकानदाराला हा नंबर सांगा. तुमची फाईल १ तासात डिलीट होईल.</p>
    </div>
  );
  return (
    <>
      <div className="card"><b>१. फाईल निवडा</b><p className="mut">PDF, JPG, PNG · जास्तीत जास्त ४ MB</p>
        <input type="file" accept="application/pdf,image/jpeg,image/png" onChange={(e) => setFile(e.target.files[0])} />
        <label>तुमचं नाव (ऐच्छिक)</label><input value={o.customer} maxLength={40} onChange={(e) => setO({ ...o, customer: e.target.value })} />
      </div>
      <div className="card"><b>२. प्रिंट सेटिंग्ज</b>
        <p className="row">{opt('paper', 'A4', 'A4')}{opt('paper', 'A3', 'A3')}{opt('paper', 'Legal', 'Legal')}</p>
        <p className="row">{opt('color', 'bw', 'काळा-पांढरा')}{opt('color', 'color', 'रंगीत')}</p>
        <p className="row">{opt('sides', '1', 'एका बाजूला')}{opt('sides', '2', 'दोन्ही बाजू')}</p>
        <label>प्रती</label><input type="number" min="1" max="100" value={o.copies} onChange={(e) => setO({ ...o, copies: e.target.value })} />
      </div>
      <button className="btn" style={{ width: '100%' }} disabled={busy} onClick={send}>{busy ? 'पाठवत आहे...' : '३. दुकानदाराकडे पाठवा'}</button>
      {msg && <p style={{ color: 'var(--warn)' }}>{msg}</p>}
      <p className="mut" style={{ textAlign: 'center' }}>प्रिंट झाल्यावर तुमची फाईल आपोआप डिलीट होते.</p>
    </>
  );
}
