# 🚀 GitHub → Railway Deployment Steps

## ✅ STEP 1 COMPLETE: Pushed to GitHub

**GitHub Repository:** https://github.com/jimmymoni/ww3tracker  
**Latest Commit:** `4f15f67` - SEO & AEO: Add prerendering, 3 new keyword pages, image optimization, structured data

---

## 📋 STEP 2: Connect Railway to GitHub

### Option A: Railway Dashboard (Easiest)

1. **Go to Railway Dashboard:**
   ```
   https://railway.app/dashboard
   ```

2. **Select your project:** `ww3tracker`

3. **Go to Settings → Source:**
   - Click "Connect GitHub Repo"
   - Select: `jimmymoni/ww3tracker`
   - Branch: `master`
   - Auto-deploy: ✅ Enable

4. **Deploy will start automatically**

---

### Option B: Railway CLI

Run these commands in your terminal:

```bash
# 1. Login to Railway
railway login

# 2. Link to your project
railway link
# Select: ww3tracker

# 3. Trigger deploy
railway up
```

---

## 📋 STEP 3: Verify Deployment

After deployment completes (2-3 minutes), verify:

### Check these URLs:
```
✅ https://ww3tracker.live/
✅ https://ww3tracker.live/is-ww3-happening
✅ https://ww3tracker.live/world-war-3-news
✅ https://ww3tracker.live/iran-nuclear-deal
✅ https://ww3tracker.live/sitemap.xml
```

### Check Build Logs:
1. Go to: https://railway.app/project/[your-project-id]
2. Click on the "Deploy" tab
3. Look for:
   - "Build successful"
   - "19 static pages prerendered"
   - "Images optimized"

---

## ⚙️ Railway Configuration (Already Set)

Your project already has these files:

### `railway.json`
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "node server/server.js",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### Build Process:
1. `npm install` - Install dependencies
2. `npm run build` - Build Vite app
3. `npm run postbuild` - Prerender + Sitemap
4. `node server/server.js` - Start server

---

## 🔧 Environment Variables (If Needed)

In Railway Dashboard → Variables, ensure these are set:

```
REPLICATE_API_TOKEN=your_token_here
GIPHY_API_KEY=your_key_here
NASA_FIRMS_KEY=your_key_here
PORT=3001
```

---

## 🚨 Troubleshooting

### If Build Fails:

1. **Check Build Logs in Railway Dashboard**
   - Look for red error messages
   - Common issues: missing env vars, dependency conflicts

2. **Clear Build Cache:**
   - Railway Dashboard → Deployments → ⋮ → "Clear Cache & Redeploy"

3. **Check Node Version:**
   - Railway uses Node 18+ by default
   - Should work with current config

### If 404 Errors on New Pages:

The `public/_redirects` file handles SPA routing. If not working:

1. Check `_redirects` is in the `dist/` folder after build
2. In Railway Dashboard, ensure static files are served

### If Images Don't Load:

1. Check images exist in `dist/images/`
2. Verify paths in HTML are `/images/...` not relative

---

## ✅ Post-Deploy Checklist

After successful deploy, do these:

### 1. Google Search Console (CRITICAL)
```
☐ Go to: https://search.google.com/search-console
☐ Submit sitemap: https://ww3tracker.live/sitemap.xml
☐ Request indexing for:
   - https://ww3tracker.live/is-ww3-happening
   - https://ww3tracker.live/world-war-3-news
   - https://ww3tracker.live/iran-nuclear-deal
```

### 2. Verify Pages Work
```
☐ Homepage loads
☐ All 3 new pages load
☐ Blog pages load
☐ Images load correctly
☐ Mobile responsive
```

### 3. Test SEO
```
☐ View page source shows static HTML
☐ Meta tags present
☐ Sitemap accessible
☐ Robots.txt accessible
```

---

## 📊 Expected Deploy Time

- **Build:** 2-3 minutes
- **Deploy:** 1 minute
- **DNS Propagation:** Instant (if already configured)

---

## 🎯 After Deploy Success

**Traffic Growth Expected:**
- Week 1: New pages indexed
- Week 2-4: 50-100% traffic increase
- Month 2-3: 10,000-30,000 monthly visitors

---

## 📞 Need Help?

If deployment fails:
1. Check Railway build logs for errors
2. Verify environment variables are set
3. Try redeploying with "Clear Cache"

---

**🚀 GitHub is ready! Now connect Railway to GitHub and deploy.**
