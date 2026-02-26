@echo off
REM Website Decompiler - Windows Startup Script

echo.
echo 🚀 Starting Website Decompiler...
echo.

REM Check Node.js installation
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v14 or higher.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js version: %NODE_VERSION%
echo.

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✓ Backend dependencies installed
echo.

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd ..\client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✓ Frontend dependencies installed
echo.

cd ..

echo ✅ Installation complete!
echo.
echo To start the application:
echo   1. Terminal 1: cd server ^&^& npm start
echo   2. Terminal 2: cd client ^&^& npm start
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
pause
