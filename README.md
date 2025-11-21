# ESP32 Academy

Interactive learning platform for ESP32 hardware programming.

## Live Site

**https://studio.axiometa.io**

## Features

- 🎓 Step-by-step guided lessons
- 💻 Monaco code editor
- ⚡ Direct ESP32 upload
- 📊 Live serial monitor
- 🏆 XP and leveling system

## Local Development

### Setup
```bash
npm install
cd backend && pip install -r requirements.txt
```

### Run
```bash
# Terminal 1 - Backend
cd backend
python main.py

# Terminal 2 - Frontend
npm run dev
```

## Deployment

- **Frontend:** Vercel (auto-deploy from main branch)
- **Backend:** Railway (auto-deploy from main branch)

## Tech Stack

React + Vite, FastAPI, Arduino CLI, Web Serial API
