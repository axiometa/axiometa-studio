# Deployment Guide - studio.axiometa.io

## Step 1: Push to GitHub

```bash
cd esp32-academy

# Initialize repo
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo (on github.com)
# Then connect:
git remote add origin https://github.com/axiometa/esp32-academy.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Railway

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your `esp32-academy` repo
4. Railway auto-detects Python
5. No environment variables needed (for now)
6. Deploy!

**Railway gives you a URL like:** `https://esp32-academy-production.up.railway.app`

---

## Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Click "New Project" → Import from GitHub
3. Select `esp32-academy` repo
4. Framework: **Vite**
5. **Add Environment Variable:**
   - Name: `VITE_API_URL`
   - Value: `https://esp32-academy-production.up.railway.app` (your Railway URL)
6. Deploy!

**Vercel gives you:** `https://esp32-academy.vercel.app`

---

## Step 4: Set Custom Domain (studio.axiometa.io)

### In Vercel:
1. Go to Project Settings → Domains
2. Add `studio.axiometa.io`
3. Vercel shows DNS records needed

### In Your DNS Provider (e.g., Cloudflare):
1. Add CNAME record:
   ```
   studio → cname.vercel-dns.com
   ```
2. Wait 5-10 minutes for DNS propagation
3. Done! ✅

---

## Step 5: Test Everything

1. Visit `https://studio.axiometa.io`
2. Click "Start Learning"
3. Connect ESP32
4. Upload code
5. Check serial monitor

---

## Environment Variables Summary

### Frontend (Vercel):
```
VITE_API_URL=https://your-backend.railway.app
```

### Backend (Railway):
None needed (uses default port from Railway)

---

## Continuous Deployment

✅ **Auto-deploys on every push to `main` branch**

1. Make changes locally
2. `git add .`
3. `git commit -m "Update lesson"`
4. `git push`
5. Vercel + Railway auto-deploy! 🚀

---

## Troubleshooting

**Frontend can't connect to backend:**
- Check VITE_API_URL is correct
- Check CORS in backend/main.py allows your domain

**Upload fails:**
- Arduino CLI might not be available on Railway
- Backend upload only works if server has USB access
- For production, consider browser-only upload

**Domain not working:**
- Check DNS propagation: https://dnschecker.org
- Verify CNAME points to `cname.vercel-dns.com`
- Wait 5-30 minutes

---

## Next Steps

- [ ] Add user authentication (Firebase/Supabase)
- [ ] Add database for progress tracking
- [ ] Create lessons 2-20
- [ ] Add analytics (Vercel Analytics)
- [ ] Add error monitoring (Sentry)
