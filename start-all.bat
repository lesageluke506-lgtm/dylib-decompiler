@echo off
REM Website Decompiler - Complete Windows Launcher
REM This script starts both backend and frontend servers simultaneously

cls
color 0A
title Website Decompiler - Server Launcher

echo.
echo ========================================
echo   🔓 Website Decompiler Launcher
echo ========================================
echo.

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js version: %NODE_VERSION%
echo.

REM Start backend in new window
echo Starting Backend Server...
start "Backend Server (5000)" cmd /k "cd server && npm start"

REM Wait a bit for backend to start
timeout /t 3 /nobreak

REM Start frontend in new window
echo Starting Frontend Application...
start "Frontend (3000)" cmd /k "cd client && npm start"

timeout /t 2 /nobreak

cls
echo.
echo ========================================
echo   ✅ Servers are starting!
echo ========================================
echo.
echo 🌐 Frontend:  http://localhost:3000
echo 🔌 Backend:   http://localhost:5000
echo.
echo 📝 Two console windows have opened:
echo    - Backend Server Console (5000)
echo    - Frontend App Console (3000)
echo.
echo ⚠️  Close either window to stop that service
echo ⚠️  Close this window when you're done
echo.
pause
