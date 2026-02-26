# 🚀 Deployment Guide

Deploy the AI Dylib Decompiler to the internet with a public domain in minutes!

## Option 1: Replit (Easiest - FREE & Instant Domain)

### Steps:
1. **Push code to GitHub** (required for Replit)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/dylib-decompiler
   git push -u origin main
   ```

2. **Import to Replit**
   - Go to https://replit.com
   - Click "Import from GitHub"
   - Paste your repo URL
   - Click "Import"

3. **Configure Environment**
   - Replit auto-detects `.replit` file
   - Click the "Run" button
   - Your app starts automatically

4. **Get Public URL**
   - Replit gives you a domain like: `https://your-project.username.repl.co`
   - Share this link - it's publicly accessible!

### Using Custom Domain on Replit:
- Go to Replit → Your Project → Settings → Hosting
- Configure custom domain (requires domain ownership)

---

## Option 2: Railway (FREE Tier - Clean Deployment)

### Steps:
1. **Push to GitHub** (same as Replit)

2. **Deploy with Railway**
   - Visit https://railway.app
   - Click "Start New Project"
   - Select "Deploy from GitHub"
   - Choose your repository
   - Railway auto-detects `Procfile`

3. **Set Environment Variables**
   - Go to Variables in Railway dashboard
   - Add:
     ```
     NODE_ENV=production
     FRONTEND_URL=your-railway-domain.railway.app
     ```

4. **Custom Domain**
   - In Railway → Domains
   - Connect your custom domain (requires domain)
   - Or use Railway's provided subdomain

---

## Option 3: Render (FREE - Docker Support)

### Steps:
1. **Push to GitHub**

2. **Deploy with Render**
   - Visit https://render.com
   - Click "New +"
   - Select "Web Service"
   - Choose GitHub
   - Configure:
     - **Build Command:** `npm install --prefix server && npm install --prefix client`
     - **Start Command:** `node server/src/index.js`

3. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=your-render-domain.onrender.com
   ```

4. **Domain**
   - Render provides free subdomain
   - Upgrade to add custom domain

---

## Option 4: Docker + Cloud (AWS, DigitalOcean, Google Cloud)

### Build Docker Image:
```bash
docker build -t dylib-decompiler .
docker run -p 5000:5000 -p 3000:3000 dylib-decompiler
```

### Push to Docker Hub:
```bash
docker tag dylib-decompiler YOUR_DOCKER_USERNAME/dylib-decompiler
docker login
docker push YOUR_DOCKER_USERNAME/dylib-decompiler
```

### Deploy to Cloud:
- **AWS ECS:** Use ECR, create cluster
- **DigitalOcean:** App Platform supports Docker
- **Google Cloud:** Cloud Run or Compute Engine
- **AWS Lightsail:** Easiest for Docker containers

---

## Option 5: Quick Public Access with ngrok (5-minute setup)

### For Testing ONLY:
```bash
# Install ngrok
npm install -g ngrok

# Make sure servers running locally
# Terminal 1: cd server && npm start
# Terminal 2: cd client && node server.js

# Terminal 3: Create tunnel
ngrok http 3000

# You'll get: https://xxxxx.ngrok.io
# Share this URL - it's public!
```

**Note:** ngrok tunnels are temporary. Good for testing!

---

## Setting Up Custom Domain

### 1. Register Domain
- **Cheap options:** Namecheap, Hostinger, GoDaddy, Domain.com
- Cost: $1-15/year

### 2. Configure DNS
- Get your hosting provider's IP or CNAME
- Point domain DNS to hosting provider

### 3. Deploy
- Deploy app to cloud
- Configure domain in service
- Usually takes 5-30 minutes to propagate

### 4. HTTPS/SSL
- Most providers (Railway, Render, Replit) auto-enable HTTPS
- Free SSL certificates included

---

## Environment Variables for Production

Create `.env` file with:
```
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-domain.com
DOMAIN=your-domain.com
MAX_FILE_SIZE=500mb
```

---

## Verification

After deployment, verify:

```bash
# Check backend health
curl https://your-domain.com/api/health

# Test API endpoint
curl -X GET https://your-domain.com/api/health

# Frontend should load at
https://your-domain.com
```

---

## Monitoring & Maintenance

### Logs
- **Replit:** View in console
- **Railway:** Logs tab
- **Render:** Logs view
- **Docker:** `docker logs <container-id>`

### Updates
- Git push updates automatically (for most services)
- Docker rebuild for manual deployments
- Redeploy after code changes

### Backups
- Keep uploaded files in persistent volume
- Set up automated backups if important

---

## Troubleshooting

### "Port already in use"
```bash
# Kill process on port
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### "CORS errors"
- Check `FRONTEND_URL` env variable
- Verify domain matches in server CORS settings

### "Cannot find module"
- Run `npm install` in both server and client directories
- Clear node_modules and reinstall if needed

### "File upload fails"
- Check upload directory permissions
- Increase max file size limit if needed
- Verify disk space on server

---

## Performance Optimization

### For Large Dylib Files:
1. Increase timeout settings
2. Use load balancer
3. Scale horizontally (multiple instances)
4. Add caching layer (Redis)

### Recommended Production Setup:
```
User → CDN (CloudFlare)
     ↓
Load Balancer
     ↓
[Server 1] [Server 2] [Server 3]
     ↓
Persistent Storage (S3, NFS)
```

---

## Security Checklist

- [ ] HTTPS enabled
- [ ] CORS restrictions configured
- [ ] Rate limiting enabled
- [ ] File upload validation
- [ ] Environment variables not committed
- [ ] Regular updates of dependencies
- [ ] Monitor for malicious uploads
- [ ] Backup important data

---

## Next Steps

1. **Choose deployment option** (Replit recommended for start)
2. **Push code to GitHub**
3. **Deploy** (5-10 minutes)
4. **Get public URL**
5. **Share with others!**

---

Questions? Check your cloud provider's docs:
- Replit: https://docs.replit.com
- Railway: https://docs.railway.app
- Render: https://render.com/docs

