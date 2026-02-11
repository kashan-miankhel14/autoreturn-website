# ✅ Vercel Deployment Checklist

## Pre-Deployment
- [ ] All code committed to Git and pushed to GitHub
- [ ] `vercel.json` file exists in project root
- [ ] `.vercelignore` file exists in project root
- [ ] `package.json` scripts are correct:
  - [ ] `npm run build` works locally
  - [ ] `npm run dev` works locally
  - [ ] `npm start` works locally
- [ ] No hardcoded localhost URLs (except in dev mode)

## Vercel Project Setup
- [ ] Project connected to GitHub repository
- [ ] Environment variables set in Vercel Dashboard:
  - [ ] `NODE_ENV=production`
  - [ ] `DATABASE_URL` (if using database)
  - [ ] Any API keys needed
- [ ] Redeploy triggered or auto-deploy from Git is enabled

## During Deployment
- [ ] Monitor Vercel build logs for errors
- [ ] Check that build command completes: `npm run build`
- [ ] Check that server starts successfully
- [ ] Deployment shows as "Ready"

## Post-Deployment Testing
- [ ] Visit your Vercel URL in browser
- [ ] Website loads (not a file download!)
- [ ] Check browser console for errors (F12)
- [ ] Test main features:
  - [ ] Navigation works
  - [ ] API calls work
  - [ ] Forms submit successfully
- [ ] Check mobile responsiveness

## If Something Goes Wrong
1. Check Vercel deployment logs:
   - Click on your deployment
   - Look for red errors
   - Search for "error" or "failed"

2. Common issues:
   - ❌ File downloads → Missing `vercel.json`
   - ❌ Build fails → Check `npm run build` locally first
   - ❌ Database errors → Set `DATABASE_URL` env var
   - ❌ API calls fail → Check CORS settings, API routes

3. Quick fixes:
   - Clear browser cache (Ctrl+Shift+Delete)
   - Hard refresh page (Ctrl+Shift+R)
   - Trigger new deployment from Vercel dashboard
   - Check all env variables are set

## Important Commands

### Local Testing
```bash
# Install dependencies
npm install

# Development mode (port 5000)
npm run dev

# Production build test
npm run build
npm start
```

### Git Workflow
```bash
# Add new config files
git add vercel.json .vercelignore

# Commit and push
git commit -m "Add Vercel configuration"
git push origin main
```

## Key Takeaways

✅ **You have a full-stack app** (Express backend + React frontend)
✅ **Port configuration is correct** (respects Vercel's PORT env var)
✅ **Build process is correct** (compiles both client and server)
✅ **Just needed Vercel config** (which is now in place!)

**No localhost changes needed** - your code already handles it correctly!

## Resources

- Vercel Docs: https://vercel.com/docs
- Express on Vercel: https://vercel.com/docs/frameworks/express
- Environment Variables: https://vercel.com/docs/projects/environment-variables