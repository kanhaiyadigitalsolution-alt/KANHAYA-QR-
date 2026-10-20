# Kanhaiya QR Code
by Kanhaiya Digital Solutions (KDS) · *रांग नाही, फक्त स्कॅन आणि प्रिंट.*

एकच वेबसाईट: मुख्य पान + **CEO लॉगिन** (`/ceo`) + **दुकानदार लॉगिन** (`/shop`) + ग्राहकाचं अपलोड पेज (`/s/<कोड>`, लॉगिन नाही).
सध्या पेमेंट नाही (मोफत टप्पा).

## सुरू करायच्या पायऱ्या
1. **Supabase** वर मोफत प्रोजेक्ट बनवा → SQL Editor मध्ये `supabase.sql` ची सगळी फाईल चालवा (टेबल्स आणि private `files` बकेट तयार होईल).
2. `.env.example` ची कॉपी `.env.local` नावाने बनवा आणि भरा:
   - `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` (Supabase → Settings → API; **service key कोणाला देऊ नका**)
   - `NEXT_PUBLIC_SITE_URL` (स्थानिक: `http://localhost:3000`, Vercel वर: तुमचं डोमेन)
   - `CEO_ID` आणि `CEO_PASSWORD`: **तुम्ही स्वतः ठरवा** (किमान १२ अक्षरं, अंक आणि चिन्हांसह)
   - `SESSION_SECRET`: कोणतीही लांब रँडम ओळ (३२+ अक्षरं)
3. `npm install` → `npm run dev` → http://localhost:3000
4. `/ceo` ला लॉगिन करा → "नवीन दुकान जोडा" → ID, पासवर्ड आणि QR मिळेल.

## GitHub आणि Vercel
```
git init && git add . && git commit -m "Kanhaiya QR Code"
git remote add origin <तुमच्या PRIVATE रेपोची लिंक>   # रेपोचं नाव: kanhaiya-qr-code
git push -u origin main
```
`.env.local` GitHub वर जात नाही (`.gitignore` मध्ये आहे). Vercel मध्ये रेपो इम्पोर्ट करून वरचे ६ environment variables तिथे टाका.

## माहीत असलेल्या मर्यादा (आता)
- फाईल मर्यादा ४ MB (Vercel ची request मर्यादा). मोठ्या फाईल्ससाठी नंतर थेट Supabase अपलोड जोडू.
- १ तासाची डिलीट: कोणी साईट वापरली की चालते. कडक हमीसाठी नंतर Supabase `pg_cron` जोडा. प्रिंट/नकार केल्यावर फाईल लगेच डिलीट होते.
- लॉगिन प्रयत्नांवर मर्यादा नाही, अपलोडवर rate limit नाही. दुकानं वाढण्याआधी जोडा.
- दुकानदाराच्या पासवर्ड रीसेटसाठी सध्या नवीन दुकान बनवावं लागतं; रीसेट बटन पुढच्या आवृत्तीत.
