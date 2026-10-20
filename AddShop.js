'use client';
import { useFormState } from 'react-dom';
import { addShop } from '@/app/actions';
export default function AddShop() {
  const [st, fa] = useFormState(addShop, null);
  return (
    <form action={fa} className="card">
      <h2>नवीन दुकान जोडा</h2>
      <div className="grid">
        <div><label>दुकानाचं नाव *</label><input name="name" required /></div>
        <div><label>दुकानदाराचं नाव</label><input name="owner" /></div>
        <div><label>मोबाईल (WhatsApp)</label><input name="phone" /></div>
        <div><label>शहर / पत्ता</label><input name="city" /></div>
        <div><label>प्रिंटर</label><select name="printer"><option>काळा-पांढरा</option><option>रंगीत</option><option>दोन्ही</option></select></div>
        <div><label>काळं-पांढरं ₹ / पान</label><input name="price_bw" type="number" step="0.5" /></div>
        <div><label>रंगीत ₹ / पान</label><input name="price_color" type="number" step="0.5" /></div>
      </div>
      <button className="btn">ID आणि QR तयार करा</button>
      {st?.err && <p style={{ color: 'var(--warn)' }}>{st.err}</p>}
      {st?.login_id && (
        <div className="card" style={{ borderColor: 'var(--ok)', marginTop: 12 }}>
          <b>दुकान तयार! हे आत्ताच दुकानदाराला द्या (पासवर्ड पुन्हा दिसणार नाही):</b>
          <p>लॉगिन ID: <b>{st.login_id}</b><br />पासवर्ड: <b>{st.password}</b><br />ग्राहक लिंक: {st.link}</p>
        </div>
      )}
    </form>
  );
}
