# Deployment Guide - ESP32 Academy

## Option 1: Deploy to Production (Recommended)

### Frontend: Vercel (Free Tier)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/esp32-academy.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repo
   - Framework: Vite
   - Root Directory: `./` (keep default)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Click "Deploy"

3. **Set Environment Variables**
   - In Vercel dashboard → Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com`

Your frontend will be live at: `https://esp32-academy.vercel.app`

### Backend: Railway (Free Tier)

1. **Create `railway.json`** (already included in project)

2. **Deploy to Railway**
   - Go to https://railway.app
   - Click "New Project" → "Deploy from GitHub"
   - Select your repo
   - Select `/backend` as root directory
   - Railway will auto-detect Python and install dependencies

3. **Set Port**
   - Railway auto-assigns port via `PORT` environment variable
   - Update `backend/main.py` if needed:
   ```python
   if __name__ == "__main__":
       import uvicorn
       port = int(os.environ.get("PORT", 8000))
       uvicorn.run(app, host="0.0.0.0", port=port)
   ```

4. **Generate Domain**
   - Railway will give you: `https://your-app.railway.app`

### Alternative Backend: Render (Free Tier)

1. **Create `render.yaml`** (included)

2. **Deploy to Render**
   - Go to https://render.com
   - New → Web Service
   - Connect GitHub repo
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python main.py`

## Option 2: Run Locally for Development

### Terminal 1 - Backend
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python main.py
```

Backend runs at: http://localhost:8000

### Terminal 2 - Frontend
```bash
npm run dev
```

Frontend runs at: http://localhost:3000

## Option 3: Docker (Advanced)

### Create Dockerfile for Backend
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install Arduino CLI
RUN curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh

# Install ESP32 board support
RUN arduino-cli config init && \
    arduino-cli config add board_manager.additional_urls https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json && \
    arduino-cli core update-index && \
    arduino-cli core install esp32:esp32

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "main.py"]
```

### Run with Docker Compose
```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:8000

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend/builds:/app/builds
```

## Shopify Integration

### Step 1: Add Custom HTML Section

1. In Shopify Admin → Online Store → Themes → Customize
2. Add Custom Liquid section
3. Paste contents from `shopify-button.html`
4. Update URL to your deployed frontend URL

### Step 2: Add to Product Page (Recommended)

Place button on ESP32 kit product pages:

```liquid
{% if product.title contains "ESP32" or product.title contains "GENESIS" %}
  <div class="esp32-learn-container">
    <h3>🎓 Ready to Start Learning?</h3>
    <p>Get hands-on with your ESP32 kit through interactive lessons</p>
    <a href="https://learn.yourdomain.com" class="esp32-learn-button">
      Start Learning Now →
    </a>
  </div>
{% endif %}
```

### Step 3: Future - Pass Customer ID

When you add authentication:

```liquid
{% if customer %}
  <a href="https://learn.yourdomain.com?customer={{ customer.id }}">
{% else %}
  <a href="https://learn.yourdomain.com">
{% endif %}
```

## Custom Domain Setup

### For Vercel Frontend

1. Go to Vercel project → Settings → Domains
2. Add your domain: `learn.yourdomain.com`
3. Add DNS records (Vercel provides instructions)

### For Railway Backend

1. Go to Railway project → Settings → Domains
2. Add custom domain: `api.yourdomain.com`
3. Add DNS CNAME record pointing to Railway

## SSL/HTTPS

Both Vercel and Railway provide automatic HTTPS certificates.

## Monitoring

### Vercel Analytics (Free)
- Automatic page views and performance tracking
- Enable in Vercel dashboard

### Railway Metrics (Free)
- CPU/Memory usage
- Request logs
- Available in Railway dashboard

## Troubleshooting

### Frontend can't connect to backend
- Check CORS settings in `backend/main.py`
- Verify `VITE_API_URL` environment variable
- Check browser console for errors

### Compilation fails
- Ensure Arduino CLI is installed on backend server
- Check ESP32 board support: `arduino-cli core list`
- Verify build directory permissions

### Upload fails
- Web Serial API requires HTTPS (except localhost)
- User must manually grant USB port access
- Backend esptool only works on local/server with USB access

## Performance Tips

### Frontend
- Vite automatically optimizes builds
- Monaco Editor loads lazily
- Consider code splitting for future lessons

### Backend
- Use Redis for caching compiled builds
- Clean up old build folders periodically
- Rate limit API endpoints

## Security

### Current MVP (No Auth)
- No sensitive data stored
- Public access OK for beta

### Future (With Auth)
- Add JWT tokens
- Implement rate limiting
- Add CSRF protection
- Validate user input strictly

## Next Steps After Deployment

1. ✅ Test full flow: Dashboard → Lesson → Upload → Serial Monitor
2. ✅ Share beta link with Shopify customers
3. ✅ Collect feedback
4. 🚀 Add more lessons
5. 🚀 Implement user authentication
6. 🚀 Add database for progress persistence
