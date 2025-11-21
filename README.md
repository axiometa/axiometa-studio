# Axiometa Studio

Interactive learning platform for ESP32 hardware programming.

🌐 **Live:** https://studio.axiometa.io

## Project Structure

```
axiometa-studio/
├── frontend/          # React + Vite app (Vercel)
├── backend/           # FastAPI compiler service (Railway)
└── README.md
```

## Architecture

- **Frontend (Vercel):** React app with code editor, lessons, and browser-based ESP32 flashing
- **Backend (Railway):** Compiles Arduino code and returns .bin files
- **Flashing:** Happens in browser via Web Serial API (esptool-js)

## Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs at http://localhost:3000

Set `VITE_API_URL=http://localhost:8000` in `.env.local`

### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Runs at http://localhost:8000

Requires Arduino CLI with ESP32 support installed.

## Deployment

- **Backend:** Auto-deploys to Railway from `backend/` folder
- **Frontend:** Auto-deploys to Vercel from `frontend/` folder
- **Domain:** studio.axiometa.io points to Vercel

## Tech Stack

- React 18 + Vite
- FastAPI (Python)
- Monaco Editor
- Web Serial API
- esptool-js
- Arduino CLI

## Browser Support

✅ Chrome/Edge (Web Serial API required)  
❌ Firefox/Safari (no Web Serial support)

