# 🚀 Vercel Setup Guide - Step by Step

This is a visual, step-by-step guide to deploy your Georgian Linguist Pro app to Vercel.

## Prerequisites

- [ ] GitHub account
- [ ] Vercel account (free)
- [ ] Google Gemini API key

---

## Part 1: Get Your Gemini API Key

### Step 1: Visit Google AI Studio

1. Go to: **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API Key"**
4. Copy the API key (starts with `AIza...`)
5. **Save it somewhere safe** - you'll need it in Part 3

---

## Part 2: Push Your Code to GitHub

### Step 1: Initialize Git (if not done)

Open terminal in your project folder:

```bash
git init
```

### Step 2: Add Your Files

```bash
git add .
```

### Step 3: Commit

```bash
git commit -m "Initial commit - Secure Gemini implementation"
```

### Step 4: Create GitHub Repository

1. Go to **https://github.com/new**
2. Repository name: `georgian-linguist-pro` (or your choice)
3. Keep it **Public** or **Private** (your choice)
4. **Do NOT** initialize with README (we already have one)
5. Click **"Create repository"**

### Step 5: Push to GitHub

Copy the commands from GitHub (they look like this):

```bash
git remote add origin https://github.com/YOUR_USERNAME/georgian-linguist-pro.git
git branch -M main
git push -u origin main
```

✅ Your code is now on GitHub!

---

## Part 3: Deploy to Vercel

### Step 1: Sign Up / Login to Vercel

1. Go to **https://vercel.com**
2. Click **"Sign Up"** (or **"Login"** if you have an account)
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub

### Step 2: Import Your Project

1. On Vercel dashboard, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find **"georgian-linguist-pro"** and click **"Import"**

### Step 3: Configure Project (IMPORTANT!)

You'll see a configuration screen:

#### Framework Preset
- Vercel should auto-detect: **"Vite"** ✅
- If not, select it from the dropdown

#### Root Directory
- Leave as: **"./"** (root)

#### Build Settings
- Build Command: `npm run build` (auto-filled)
- Output Directory: `dist` (auto-filled)

#### Environment Variables (CRITICAL!)

**Before clicking Deploy**, expand **"Environment Variables"**:

1. Click **"Add Environment Variable"**
2. Fill in:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Paste your Gemini API key (from Part 1)
3. **Environment**: Make sure ALL are checked:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. Click **"Add"**

### Step 4: Deploy!

1. Click the big **"Deploy"** button
2. Wait 1-2 minutes while Vercel:
   - Installs dependencies
   - Builds your app
   - Deploys to their global CDN

### Step 5: Success! 🎉

You'll see:
- ✅ Build completed
- ✅ Deployment successful
- A URL like: `https://georgian-linguist-pro.vercel.app`

Click **"Visit"** to see your live app!

---

## Part 4: Test Your Deployment

### Step 1: Open Your App

Visit your Vercel URL (e.g., `https://georgian-linguist-pro.vercel.app`)

### Step 2: Test the Functionality

1. Enter some Georgian text in the input box
2. Click **"ტექსტის შემოწმება"** (Check Text)
3. Wait for the AI to analyze
4. You should see results!

### Step 3: Check for Errors

If something goes wrong:

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for error messages

Common issues:
- **"Server configuration error"** → API key not set (see troubleshooting below)
- **404 on /api/analyze** → Redeploy the project
- **Network error** → Check your internet connection

---

## Part 5: Verify Environment Variable

### Check if API Key is Set

1. Go to your Vercel dashboard
2. Click on your project **"georgian-linguist-pro"**
3. Go to **Settings** tab
4. Click **"Environment Variables"** in the left sidebar
5. You should see: `GEMINI_API_KEY` with value hidden (••••••)

If it's missing:

1. Click **"Add New"**
2. Name: `GEMINI_API_KEY`
3. Value: Your API key
4. Environments: Check all
5. Click **"Save"**
6. Go to **"Deployments"** tab
7. Click **"..."** on the latest deployment
8. Click **"Redeploy"**

---

## Part 6: Custom Domain (Optional)

Want to use your own domain like `linguist.yourdomain.com`?

### Step 1: Add Domain in Vercel

1. In your project dashboard, go to **Settings**
2. Click **"Domains"**
3. Enter your domain name
4. Click **"Add"**

### Step 2: Configure DNS

Vercel will show you DNS records to add:

**If using subdomain (e.g., linguist.yourdomain.com):**
- Type: `CNAME`
- Name: `linguist`
- Value: `cname.vercel-dns.com`

**If using root domain (e.g., yourdomain.com):**
- Type: `A`
- Name: `@`
- Value: `76.76.21.21`

### Step 3: Wait for DNS Propagation

- Can take 5 minutes to 48 hours
- Vercel will show a checkmark when ready

---

## Troubleshooting

### Problem: "Server configuration error"

**Solution:**
1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Check if `GEMINI_API_KEY` exists
3. If missing, add it
4. Redeploy: Deployments → ... → Redeploy

### Problem: Build fails

**Solution:**
1. Check build logs in Vercel dashboard
2. Make sure all files are pushed to GitHub
3. Try running `npm run build` locally to test

### Problem: API returns 404

**Solution:**
1. Make sure `api/analyze.ts` exists in your GitHub repo
2. Make sure `vercel.json` exists
3. Redeploy the project

### Problem: CORS errors

**Solution:**
- Make sure your frontend is calling `/api/analyze` (relative URL)
- NOT `http://localhost:3000/api/analyze`
- The API must be on the same domain

---

## Monitoring & Maintenance

### View Deployment Logs

1. Vercel dashboard → Your project
2. Click **"Deployments"** tab
3. Click on any deployment
4. Click **"Functions"** tab to see serverless function logs

### Check API Usage

Monitor your Gemini API usage:
- Go to: https://aistudio.google.com
- Check your quota and usage

### Set Up Billing Alerts (Recommended)

1. Go to Google Cloud Console
2. Set up billing alerts to avoid surprise charges
3. Set a monthly budget cap

---

## Next Steps

✅ Your app is now live and secure!

**Optional enhancements:**
- Add rate limiting to prevent abuse
- Add user authentication
- Add caching to reduce API costs
- Add analytics to track usage
- Add more AI features

---

## Need Help?

- 📖 Read: `README.md` - Full documentation
- 🔒 Read: `SECURITY_MIGRATION.md` - What changed and why
- 🚀 Read: `DEPLOYMENT.md` - Advanced deployment topics
- 💬 Vercel Support: https://vercel.com/support
- 📚 Vercel Docs: https://vercel.com/docs

---

**Congratulations! Your Georgian Linguist Pro is now deployed securely! 🎉**
