# ESP32 Academy - Cloud Deployment

## Architecture

**Backend (Railway):** Compiles Arduino code, returns .bin files  
**Frontend (Vercel):** React app, flashes ESP32 via browser using esptool-js  
**No USB needed on server!** All flashing happens in the user's browser via Web Serial API.

---

## Deploy to Railway (Backend)

1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select `axiometa/axiometa-studio`
4. Railway auto-detects Python
5. Click **Deploy**
6. Copy your backend URL (e.g., `https://axiometa-studio-production.up.railway.app`)

**Environment Variables:** None needed!

---

## Deploy to Vercel (Frontend)

1. Go to https://vercel.com/new
2. Import `axiometa/axiometa-studio`
3. Framework: **Vite**
4. **Add Environment Variable:**
   - Name: `VITE_API_URL`
   - Value: `<your Railway URL from above>`
5. Click **Deploy**

---

## Custom Domain (studio.axiometa.io)

### In Vercel:
1. Go to Project Settings → Domains
2. Add `studio.axiometa.io`
3. Vercel shows DNS records

### In Your DNS Provider:
1. Add CNAME record:
   ```
   studio → cname.vercel-dns.com
   ```
2. Wait 5-10 minutes for DNS propagation

---

## How It Works

1. User writes code in browser
2. Frontend sends code to Railway backend
3. Backend compiles with Arduino CLI → returns .bin files (base64)
4. Frontend uses esptool-js to flash ESP32 via Web Serial API
5. All done in browser! No server USB needed! 🎉

---

## Local Development

### Backend:
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Runs at http://localhost:8000

### Frontend:
```bash
npm install
npm run dev
```
Runs at http://localhost:3000

Set `VITE_API_URL=http://localhost:8000` in `.env.local`

---

## Browser Requirements

✅ **Chrome/Edge** (Web Serial API support)  
❌ Firefox/Safari (no Web Serial support yet)
