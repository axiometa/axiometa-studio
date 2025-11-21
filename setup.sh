#!/bin/bash

echo "🚀 ESP32 Academy - Quick Start"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js v18+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python not found. Please install Python 3.8+ first."
    exit 1
fi

# Check if Arduino CLI is installed
if ! command -v arduino-cli &> /dev/null; then
    echo "❌ Arduino CLI not found."
    echo "📥 Install from: https://arduino.github.io/arduino-cli/"
    echo ""
    echo "Quick install (macOS/Linux):"
    echo "curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh"
    exit 1
fi

echo "✅ Prerequisites checked"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Setup backend
echo "📦 Setting up backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "🔧 Creating Python virtual environment..."
    python3 -m venv venv
fi

echo "📦 Installing backend dependencies..."
source venv/bin/activate
pip install -r requirements.txt
deactivate

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "  1. Start backend:  cd backend && source venv/bin/activate && python main.py"
echo "  2. Start frontend: npm run dev (in another terminal)"
echo "  3. Open browser:   http://localhost:3000"
echo ""
echo "💡 Make sure Arduino CLI has ESP32 board support installed:"
echo "   arduino-cli core install esp32:esp32"
