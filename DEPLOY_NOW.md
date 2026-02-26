# 🚀 Deploy AI Dylib Decompiler to the Internet

Your application is ready to deploy! Let others access it via a **public domain**.

## ⚡ Quick Start (5 minutes)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "AI Dylib Decompiler"
git remote add origin https://github.com/YOUR_USERNAME/dylib-decompiler
git push -u origin main
```

### Step 2: Deploy (Choose One)

#### 🟦 **REPLIT (Recommended - Easiest)**
1. Go to https://replit.com
2. Click "Import from GitHub"
3. Paste your repo URL
4. Click Import
5. Click Run
6. ✨ Get instant public URL!

```
Your app at: https://your-project.username.repl.co
```

#### 🚂 **RAILWAY (Better Performance)**
1. Go to https://railway.app
2. "New Project" → "Deploy from GitHub"
3. Select your repo
4. Click Deploy
5. Railway auto-detects Procfile

```
Your app at: https://your-project-name.railway.app
```

#### 🎨 **RENDER (Simple Docker)**
1. Go to https://render.com
2. "New +" → "Web Service"
3. Connect GitHub
4. Deploy
5. Render provides subdomain

```
Your app at: https://dylib-decompiler.onrender.com
```

---

## 🔧 Local Testing Before Deploy

```bash
# Terminal 1: Start backend
cd server
npm start

# Terminal 2: Start frontend
cd client
node server.js

# Terminal 3: Test health
curl http://localhost:5000/api/health
```

---

## 📊 Production Deployment Checklist

- [ ] Push code to GitHub
- [ ] Choose hosting (Replit/Railway/Render)
- [ ] Deploy application
- [ ] Get public URL
- [ ] Test at public URL
- [ ] Share with others!

---

## 🌍 Using with Custom Domain

After deployment, add your own domain:

### 1. **Buy Domain** ($1-15/year)
- Namecheap
- GoDaddy
- Hostinger
- Domain.com

### 2. **Configure DNS**
Provider will show you where to point domain:
```
Type: CNAME or A Record
Value: your-hosting-provider-domain
TTL: 3600 (or default)
```

### 3. **Update Hosting**
- **Replit:** Settings → Hosting → Add Domain
- **Railway:** Domains → Add custom domain
- **Render:** Settings → Custom Domain

Takes 5-30 minutes to activate.

---

## 🔌 API Endpoints

Once deployed, your API is available at:

```
GET  /api/health              # Health check
POST /api/upload              # Upload file
POST /api/decompile/dylib     # Decompile dylib
POST /api/decompile/apk       # Decompile APK
POST /api/decompile/jar       # Decompile JAR
POST /api/decompile/analyze   # Analyze file
POST /api/decompile/beautify  # Format code
POST /api/decompile/dylib/download  # Download project ZIP
```

### Example Request:

```bash
curl -X POST https://your-domain.com/api/health
```

---

## 🔒 Security Notes

✅ **Already configured:**
- CORS for cross-origin access
- HTTPS auto-enabled (most providers)
- File upload validation
- Error handling

⚠️ **Monitor:**
- Suspicious uploads
- Rate limiting (add if needed)
- Disk space usage
- Error logs

---

## 📈 Scaling Tips

If you get lots of users:

1. **Increase Timeout**
   ```javascript
   // server/src/index.js
   app.use(express.json({ limit: '1gb' })); // Up from 500mb
   ```

2. **Add Caching**
   - Cache analysis results
   - Reduce redundant processing

3. **Use CDN**
   - Front with Cloudflare
   - Cache static assets
   - Reduce latency

4. **Horizontal Scaling**
   - Railway/Render support multiple instances
   - Auto-scale on demand

---

## 🐛 Troubleshooting

### "CORS Error"
- Check `FRONTEND_URL` environment variable
- Verify domain in CORS settings

### "Upload Fails"
- Check max file size limit
- Verify upload directory exists
- Check disk space

### "Slow Performance"
- Check server logs
- Monitor resource usage
- Upgrade hosting tier
- Use CDN

### "Cannot Connect"
- Verify domain DNS propagated
- Check SSL certificate
- Ensure service is running

---

## 📝 Environment Variables

For production, set:

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-domain.com
DOMAIN=your-domain.com
MAX_FILE_SIZE=500mb
```

Most hosting auto-detects `.env` file or use dashboard.

---

## 💻 Docker Deployment (Advanced)

```bash
# Build image
docker build -t dylib-decompiler .

# Run locally
docker run -p 5000:5000 -p 3000:3000 dylib-decompiler

# Push to Docker Hub
docker tag dylib-decompiler YOUR_USERNAME/dylib-decompiler
docker login
docker push YOUR_USERNAME/dylib-decompiler
```

Then deploy Docker image to any cloud:
- AWS ECS
- Google Cloud Run
- DigitalOcean App Platform
- Kubernetes

---

## 📊 Monitoring

Track your deployed app:

### **Replit**
- Console logs visible in browser

### **Railway**
- Logs tab in dashboard
- Metrics overview
- Deployment history

### **Render**
- Live logs view
- Service metrics
- Build logs

---

## 🎯 Share & Distribute

Once live, share your URL:

```
✨ Try the AI Dylib Decompiler:
👉 https://your-domain.com

Features:
🔓 Smart dylib decompilation
🤖 AI-powered analysis
📦 Generate Objective-C source code
⬇️ Download buildable projects
```

---

## 🚀 Advanced: CI/CD Pipeline

Auto-deploy on every GitHub push:

### Railway (Auto-Deploy)
```yaml
# Railway auto-deploys on push
🚀 Code → Push → Deploy (automatic)
```

### Manual Webhook
Set GitHub webhook to trigger deployments

### GitHub Actions
```yaml
name: Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: railway up
```

---

## ❓ FAQ

**Q: How much does it cost?**
A: Free! Replit, Railway, and Render all have free tiers.

**Q: Is it secure?**
A: Yes. HTTPS auto-enabled, CORS configured, file validation.

**Q: Can I use my domain?**
A: Yes. Most services support custom domains (may need premium).

**Q: How many users can it handle?**
A: Free tier handles ~100 concurrent. Scale up as needed.

**Q: How long until public?**
A: 5 minutes for Replit, ~5-30 minutes for DNS.

---

## 🎉 You're Ready!

1. **Run:** `.\deploy.ps1` (Windows) or `./deploy.sh` (Mac/Linux)
2. **Choose:** Replit for fastest start
3. **Deploy:** Few clicks
4. **Share:** Send URL to friends

---

## 📚 Learn More

- [Replit Docs](https://docs.replit.com)
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Docker Guide](https://docs.docker.com)

---

**Status:** ✅ Ready to deploy!

Your AI Dylib Decompiler will soon be live on the internet. 🚀
