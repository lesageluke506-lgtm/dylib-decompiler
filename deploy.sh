#!/bin/bash
# Quick deployment helper script

echo "🚀 AI Dylib Decompiler - Deployment Helper"
echo ""
echo "Choose deployment option:"
echo "1) Replit (Easiest - FREE)"
echo "2) Railway (Free tier)"
echo "3) Render (Free tier)"
echo "4) Docker locally"
echo "5) ngrok tunnel (Testing only)"
echo ""
read -p "Enter choice (1-5): " choice

case $choice in
  1)
    echo "📦 Preparing for Replit..."
    echo ""
    echo "1. Push code to GitHub:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/dylib-decompiler"
    echo "   git push -u origin main"
    echo ""
    echo "2. Go to https://replit.com"
    echo "3. Click 'Import from GitHub'"
    echo "4. Paste repo URL and click Import"
    echo "5. Click Run button"
    echo ""
    echo "You'll get a public URL instantly! ✨"
    ;;
  
  2)
    echo "🚂 Preparing for Railway deployment..."
    echo ""
    echo "1. Push to GitHub (same steps as Replit)"
    echo "2. Go to https://railway.app"
    echo "3. Create new project from GitHub"
    echo "4. Set environment variables:"
    echo "   - NODE_ENV=production"
    echo "   - FRONTEND_URL=your-railway-domain.railway.app"
    echo ""
    echo "Railway will auto-detect Procfile and deploy! 🎉"
    ;;
  
  3)
    echo "🎨 Preparing for Render deployment..."
    echo ""
    echo "1. Push to GitHub"
    echo "2. Go to https://render.com"
    echo "3. Click 'New +' → 'Web Service'"
    echo "4. Connect GitHub repo"
    echo "5. Configure:"
    echo "   Start Command: node server/src/index.js"
    echo "   Environment: NODE_ENV=production"
    echo ""
    echo "Done! Public domain will be generated 🚀"
    ;;
  
  4)
    echo "🐳 Building Docker image..."
    echo ""
    docker build -t dylib-decompiler .
    echo ""
    echo "✅ Image built! Run with:"
    echo "docker run -p 5000:5000 -p 3000:3000 dylib-decompiler"
    ;;
  
  5)
    echo "🌐 Setting up ngrok tunnel..."
    echo ""
    echo "Make sure servers are running first:"
    echo "  Terminal 1: cd server && npm start"
    echo "  Terminal 2: cd client && node server.js"
    echo ""
    echo "Then run:"
    echo "  ngrok http 3000"
    echo ""
    echo "You'll get a public HTTPS URL for testing! 🔗"
    ;;
  
  *)
    echo "❌ Invalid choice"
    ;;
esac

echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
