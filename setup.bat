@echo off
echo ================================
echo ESP32 Academy - Quick Start
echo ================================
echo.

REM Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo X Node.js not found. Please install Node.js v18+ first.
    pause
    exit /b 1
)

REM Check Python
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo X Python not found. Please install Python 3.8+ first.
    pause
    exit /b 1
)

REM Check Arduino CLI
where arduino-cli >nul 2>&1
if %errorlevel% neq 0 (
    echo X Arduino CLI not found.
    echo Install from: https://arduino.github.io/arduino-cli/
    pause
    exit /b 1
)

echo [OK] Prerequisites checked
echo.

echo Installing frontend dependencies...
call npm install

echo Setting up backend...
cd backend

if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

echo Installing backend dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt
call deactivate

cd ..

echo.
echo [OK] Setup complete!
echo.
echo Next steps:
echo   1. Start backend:  cd backend ^&^& venv\Scripts\activate ^&^& python main.py
echo   2. Start frontend: npm run dev (in another terminal)
echo   3. Open browser:   http://localhost:3000
echo.
echo Make sure Arduino CLI has ESP32 board support:
echo    arduino-cli core install esp32:esp32
echo.
pause
