export default function Login({ title, action, err }) {
  return (
    <div className="w" style={{ maxWidth: 420 }}>
      <a href="/">← मुख्य पान</a>
      <div className="card" style={{ marginTop: 12 }}>
        <h2>{title}</h2>
        {err && <p style={{ color: 'var(--warn)' }}>ID किंवा पासवर्ड चुकीचा आहे</p>}
        <form action={action}>
          <label>ID</label><input name="id" required autoComplete="username" />
          <label>पासवर्ड</label><input name="password" type="password" required autoComplete="current-password" />
          <button className="btn">लॉगिन</button>
        </form>
      </div>
    </div>
  );
}
