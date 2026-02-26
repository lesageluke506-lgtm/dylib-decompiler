#!/bin/bash

# Website Decompiler - Startup Script

echo "🚀 Starting Website Decompiler..."
echo ""

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install
if [ $? -eq 0 ]; then
    echo "✓ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd ../client
npm install
if [ $? -eq 0 ]; then
    echo "✓ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

echo ""
echo "✅ Installation complete!"
echo ""
echo "To start the application:"
echo "  1. Terminal 1: cd server && npm start"
echo "  2. Terminal 2: cd client && npm start"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
