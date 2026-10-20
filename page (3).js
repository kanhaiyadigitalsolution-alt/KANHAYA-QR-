import Link from 'next/link';
const steps = ['दुकानात QR कोड लावलेला असतो', 'ग्राहक स्कॅन करून फाईल अपलोड करतो', 'दुकानदार स्क्रीनवर बघून प्रिंट करतो', '१ तासात फाईल आपोआप डिलीट होते'];
export default function Home() {
  return (
    <div className="w">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div><b style={{ color: 'var(--aqua)', fontSize: 22 }}>Kanhaiya QR Code</b><div className="mut">by Kanhaiya Digital Solutions (KDS)</div></div>
        <div className="row"><Link className="btn g" href="/ceo">CEO लॉगिन</Link><Link className="btn" href="/shop">दुकानदार लॉगिन</Link></div>
      </div>
      <h1 style={{ fontSize: 40, marginTop: 50 }}>रांग नाही, फक्त स्कॅन आणि प्रिंट.</h1>
      <p className="mut" style={{ fontSize: 16 }}>झेरॉक्स आणि प्रिंट दुकानांसाठी: ग्राहक QR स्कॅन करतो, फाईल अपलोड करतो आणि प्रिंट सेटिंग्ज निवडतो. दुकानदाराला सगळं एका क्यूमध्ये दिसतं. WhatsApp वर फाईल्स शोधायची गरज नाही.</p>
      <div className="grid" style={{ marginTop: 30 }}>
        {steps.map((s, i) => <div className="card" key={i}><b style={{ color: 'var(--aqua)', fontSize: 24 }}>{i + 1}</b><p>{s}</p></div>)}
      </div>
      <p className="mut">तुमच्या दुकानासाठी हवं असल्यास संपर्क: Kanhaiya Digital Solutions</p>
    </div>
  );
}
