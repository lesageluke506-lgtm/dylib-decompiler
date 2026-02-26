# 🚀 Deploy to Netlify + Replit (100% FREE)

## Part 1: Deploy Frontend to Netlify (FREE)

### Step 1: Prepare Frontend for Netlify
```bash
cd client
# Make sure package.json exists with proper structure
```

### Step 2: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit for Netlify"
git remote add origin https://github.com/YOUR-USERNAME/dylib-decompiler.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Netlify
1. Go to `netlify.com` and sign up (free)
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **GitHub** and authorize
4. Choose your repository
5. **Build Command:** `npm install` (or leave blank for static)
6. **Publish Directory:** `public`
7. Click **Deploy**

✅ **Your frontend is now live at:** `yourapp.netlify.app`

### Step 4: Update Frontend to Use Replit Backend
Edit `client/public/index.html` and find the API_URL section:

```javascript
const API_URL = (() => {
    const stored = localStorage.getItem('API_URL');
    if (stored) return stored;
    
    // For production: use Replit backend
    if (window.location.hostname === 'yourapp.netlify.app') {
        return 'https://your-replit-backend.replit.dev/api';
    }
    
    return 'http://localhost:5000/api';
})();
```

Then redeploy by pushing to GitHub:
```bash
git add .
git commit -m "Update API URL for Replit"
git push
```

---

## Part 2: Deploy Backend to Replit (FREE)

### Step 1: Create Replit Project
1. Go to `replit.com` and sign up (free)
2. Click **"Create"** → **"Import from GitHub"**
3. Paste your repo URL: `https://github.com/YOUR-USERNAME/dylib-decompiler.git`
4. Select **Node.js** runtime
5. Click **"Import"**

### Step 2: Configure Replit
1. Click the **"Secrets"** icon (lock) on the left sidebar
2. Add these secrets:
   ```
   PORT=5000
   NODE_ENV=production
   ```

### Step 3: Create .replit File (if needed)
Create file: `.replit`
```ini
run = "cd server && npm install && npm start"
entrypoint = "server/src/index.js"
```

### Step 4: Update package.json
In `server/package.json`, make sure `start` script exists:
```json
{
  "scripts": {
    "start": "node src/index.js"
  }
}
```

### Step 5: Click Run ▶️
- Replit will auto-start your server
- You'll get a URL like: `https://your-project-name.your-username.repl.co`
- For always-on (no sleeping): Subscribe to Replit+ ($7/month) OR keep browser tab open

### Step 6: Update server/src/index.js for CORS
Make sure CORS allows Netlify:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'https://yourapp.netlify.app',
  'https://your-project.replit.dev'
];
```

---

## Final URLs

| Component | URL | Provider |
|-----------|-----|----------|
| **Frontend** | `https://yourapp.netlify.app` | Netlify (FREE) |
| **Backend** | `https://your-project.replit.dev` | Replit (FREE) |
| **Domain** | `yourapp.replit.dev` | Replit (FREE) |

---

## Troubleshooting

### Backend won't start on Replit?
```bash
# Check logs in Replit console
# Make sure server/src/index.js exists
# Check port is 5000
```

### CORS errors?
Add Netlify URL to `server/src/index.js`:
```javascript
process.env.FRONTEND_URL = 'https://yourapp.netlify.app';
```

### Frontend can't reach backend?
Check the API_URL in `client/public/index.html` matches your Replit domain exactly.

---

## Alternative: Railway Backend (Better than Replit)

If Replit is too slow, use **Railway** instead:

1. Go to `railway.app` and sign up
2. Click **"New Project"** → **"Deploy from GitHub"**
3. Select your repo
4. Set **Root Directory:** `server`
5. Set **Start Command:** `npm start`
6. Add environment variable: `FRONTEND_URL=https://yourapp.netlify.app`
7. Deploy!

Your backend URL: `https://your-project-123456.railway.app`

---

## Summary

✅ **Frontend:** Netlify (FREE, static hosting)
✅ **Backend:** Replit (FREE, Node.js hosting)
✅ **Both have FREE domains included**
✅ **No credit card required**
✅ **Auto-deploy from GitHub**

**Total Cost:** $0/month (or $7/month for Replit always-on)
