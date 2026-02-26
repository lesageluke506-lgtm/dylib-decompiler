# Quick deployment helper script for Windows

Write-Host "🚀 AI Dylib Decompiler - Deployment Helper" -ForegroundColor Cyan
Write-Host ""
Write-Host "Choose deployment option:" -ForegroundColor White
Write-Host "1) Replit (Easiest - FREE)" -ForegroundColor Green
Write-Host "2) Railway (Free tier)" -ForegroundColor Green
Write-Host "3) Render (Free tier)" -ForegroundColor Green
Write-Host "4) Docker locally" -ForegroundColor Yellow
Write-Host "5) ngrok tunnel (Testing only)" -ForegroundColor Yellow
Write-Host ""
$choice = Read-Host "Enter choice (1-5)"

switch ($choice) {
  "1" {
    Write-Host ""
    Write-Host "📦 Preparing for Replit..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Push code to GitHub:" -ForegroundColor White
    Write-Host "   git init"
    Write-Host "   git add ."
    Write-Host '   git commit -m "Initial commit"'
    Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/dylib-decompiler"
    Write-Host "   git push -u origin main"
    Write-Host ""
    Write-Host "2. Go to https://replit.com" -ForegroundColor White
    Write-Host "3. Click 'Import from GitHub'"
    Write-Host "4. Paste repo URL and click Import"
    Write-Host "5. Click Run button"
    Write-Host ""
    Write-Host "✨ You'll get a public URL instantly!" -ForegroundColor Green
  }
  
  "2" {
    Write-Host ""
    Write-Host "🚂 Preparing for Railway deployment..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Push to GitHub (same steps as Replit)" -ForegroundColor White
    Write-Host "2. Go to https://railway.app"
    Write-Host "3. Create new project from GitHub"
    Write-Host "4. Set environment variables:"
    Write-Host "   - NODE_ENV=production"
    Write-Host "   - FRONTEND_URL=your-railway-domain.railway.app"
    Write-Host ""
    Write-Host "🎉 Railway will auto-detect Procfile and deploy!" -ForegroundColor Green
  }
  
  "3" {
    Write-Host ""
    Write-Host "🎨 Preparing for Render deployment..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Push to GitHub" -ForegroundColor White
    Write-Host "2. Go to https://render.com"
    Write-Host "3. Click 'New +' → 'Web Service'"
    Write-Host "4. Connect GitHub repo"
    Write-Host "5. Configure:"
    Write-Host "   Start Command: node server/src/index.js"
    Write-Host "   Environment: NODE_ENV=production"
    Write-Host ""
    Write-Host "🚀 Public domain will be generated!" -ForegroundColor Green
  }
  
  "4" {
    Write-Host ""
    Write-Host "🐳 Building Docker image..." -ForegroundColor Cyan
    Write-Host ""
    docker build -t dylib-decompiler .
    Write-Host ""
    Write-Host "✅ Image built! Run with:" -ForegroundColor Green
    Write-Host "docker run -p 5000:5000 -p 3000:3000 dylib-decompiler"
  }
  
  "5" {
    Write-Host ""
    Write-Host "🌐 Setting up ngrok tunnel..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Make sure servers are running first:" -ForegroundColor White
    Write-Host "  Terminal 1: cd server; npm start"
    Write-Host "  Terminal 2: cd client; node server.js"
    Write-Host ""
    Write-Host "Then run:" -ForegroundColor White
    Write-Host "  ngrok http 3000"
    Write-Host ""
    Write-Host "🔗 You'll get a public HTTPS URL for testing!" -ForegroundColor Green
  }
  
  default {
    Write-Host "❌ Invalid choice" -ForegroundColor Red
  }
}

Write-Host ""
Write-Host "📖 For detailed instructions, see DEPLOYMENT.md" -ForegroundColor Cyan
