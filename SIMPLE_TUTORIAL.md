# 🎓 Deploy Your Decompiler - SIMPLE TUTORIAL

## 📚 How This Works

```
Your Computer (Local)
        ↓
      GitHub (free code storage)
        ↓
   ↙─────────┴─────╲
  ↙                 ╲
Netlify           Replit
(Frontend)        (Backend)
```

---

## 🔥 SUPER QUICK (15 minutes)

### Step 1️⃣: Make GitHub Account (2 mins)
1. Go to **github.com**
2. Click **Sign up**
3. Fill in email, password, username
4. Verify email
5. Done! ✅

### Step 2️⃣: Upload Your Code to GitHub (3 mins)

Open **PowerShell** in your project folder:
```powershell
cd c:\Users\lukel\Downloads\XDMenu_ColorSize

git init
git add .
git commit -m "Upload decompiler"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/dylib-decompiler.git
git push -u origin main
```

**YOUR-USERNAME** = your GitHub username from Step 1

### Step 3️⃣: Deploy Frontend to Netlify (5 mins)

1. Go to **netlify.com**
2. Click **Sign up** (use GitHub login)
3. Click **"Add new site"** → **"Import an existing project"**
4. Click **GitHub** and authorize
5. Find your **dylib-decompiler** repo and click it
6. Leave settings as default
7. Click **"Deploy site"**
8. Wait 1-2 minutes...
9. Your frontend is now LIVE! 🎉
   - URL will be: `https://something-random.netlify.app`
   - Copy this URL (you'll need it later)

### Step 4️⃣: Deploy Backend to Replit (5 mins)

1. Go to **replit.com**
2. Click **Sign up** (use GitHub login)
3. Click **"Create"** → **"Import from GitHub"**
4. Paste: `https://github.com/YOUR-USERNAME/dylib-decompiler.git`
5. Select **Node.js** runtime
6. Click **"Import"**
7. Wait 30 seconds...
8. Click the big **▶️ RUN** button at the top
9. Wait 2 minutes for server to start
10. You'll see: `🚀 Decompiler Server running on http://localhost:5000`
11. In top right, copy your **Replit URL** (something like `https://dylib-decompiler.your-username.repl.co`)

### Step 5️⃣: Connect Frontend to Backend (2 mins)

1. Go to **GitHub** → your **dylib-decompiler** repo
2. Click **client** folder
3. Click **public**
4. Click **index.html**
5. Click the **pencil icon** (Edit)
6. Find this line (around line 470):
   ```javascript
   const API_URL = (() => {
   ```
7. Find the part that says:
   ```javascript
   return 'http://localhost:5000/api';
   ```
8. Change it to your Replit URL:
   ```javascript
   return 'https://YOUR-REPLIT-URL/api';
   ```
   (Replace YOUR-REPLIT-URL with the one from Step 4)

9. Scroll down, click **"Commit changes"**

### Step 6️⃣: Netlify Auto-Redeploys (1 min)

Netlify automatically redeploys when you change files on GitHub!

Wait 1-2 minutes, then visit your Netlify URL from Step 3.

**You're done! 🎉**

---

## 🧪 Test It Works

1. Visit your **Netlify URL** (from Step 3)
2. You should see the decompiler interface
3. Try uploading a small dylib file
4. You should get results! ✅

---

## 📝 Remember These URLs

**After deployment, you'll have:**

| What | URL | Where |
|------|-----|-------|
| Frontend | `https://something-random.netlify.app` | Netlify |
| Backend | `https://your-project.repl.co` | Replit |
| Code | `https://github.com/your-username/dylib-decompiler` | GitHub |

---

## ❌ Troubleshooting

### "Frontend says backend not found"
- Check you updated the API_URL correctly in index.html
- Wait 2 minutes for Netlify to redeploy
- Check your Replit URL is exactly right

### "Replit backend not starting"
- Click **Run** again
- Wait 3 minutes
- Check the output says "Server running on port 5000"

### "Still getting errors?"
- Is your Replit running? (Click ▶️ button)
- Is your backend URL in the frontend correct?
- Try refreshing the page (Ctrl+F5)

---

## 🚀 What Happens When You Deploy

**You:** Push code to GitHub
   ↓
**GitHub:** Stores your code
   ↓
**Netlify:** Sees your changes → auto rebuilds frontend
   ↓
**Replit:** Sees your changes → auto rebuilds backend
   ↓
**Everyone:** Can now use your app! 🌍

---

## 💡 Pro Tips

1. **Share your app:** Just share the Netlify URL!
2. **Update your app:** Just push to GitHub, Netlify auto-deploys
3. **Backend won't wake up?** Pay $7/mo for Replit+ (always-on)
4. **Want free domain?** Get `.ml` from Freenom, point to Netlify

---

## 🎯 That's It!

Your decompiler is now online for free. Share the Netlify URL with anyone!

**Next steps:**
- Try uploading real dylib files
- Test batch processing (1K files)
- Check the backend/link extraction works
- Share with friends!

---

## 📞 Quick Reference

```
Having issues? Check this:

1. Frontend blank?
   → Check Netlify deployment finished
   → Refresh page (Ctrl+F5)

2. "Cannot reach backend"?
   → Check Replit backend is running (▶️ button)
   → Check API_URL in index.html is correct
   → Check CORS in index.js

3. Upload failing?
   → Check backend is running
   → Check file size < 500MB
   → Check browser console for errors

4. Slow?
   → Replit might be waking up (first load slow)
   → Netlify CDN is fast
   → Wait 30 seconds for backend to respond
```

---

Good luck! 🚀
