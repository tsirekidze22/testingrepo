# ⚡ Quick Start Guide

Get your Georgian Linguist Pro app deployed in 5 minutes!

## 🎯 Prerequisites

- [ ] GitHub account
- [ ] Vercel account (free) - https://vercel.com
- [ ] Gemini API key - https://aistudio.google.com/app/apikey

---

## 🚀 Deploy in 3 Steps

### 1️⃣ Push to GitHub

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/georgian-linguist-pro.git
git push -u origin main
```

### 2️⃣ Deploy on Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. **IMPORTANT**: Add environment variable:
   - Name: `GEMINI_API_KEY`
   - Value: Your Gemini API key
   - Environments: Check all boxes
4. Click **Deploy**

### 3️⃣ Done! 🎉

Visit your app at: `https://your-project.vercel.app`

---

## 🧪 Test Locally

```bash
# Install dependencies
npm install

# Add your API key to .env.local
echo "GEMINI_API_KEY=your_key_here" > .env.local

# Run dev server
npm run dev
```

Visit: http://localhost:5173

---

## 📁 Project Structure

```
georgian-linguist-pro/
├── api/
│   └── analyze.ts          ← Serverless function (secure)
├── components/
│   ├── Header.tsx
│   └── ResultView.tsx
├── services/
│   └── geminiService.ts    ← Frontend API client
├── App.tsx                 ← Main app
├── types.ts                ← TypeScript types
├── vercel.json             ← Vercel config
└── .env.local              ← Your API key (local only)
```

---

## 🔒 Security

✅ API key stored on server (Vercel)  
✅ Never exposed to frontend  
✅ `.env.local` excluded from git  

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Server configuration error" | Add `GEMINI_API_KEY` in Vercel → Settings → Environment Variables |
| API returns 404 | Ensure `api/analyze.ts` is in your repo, then redeploy |
| Build fails | Run `npm run build` locally to check for errors |

---

## 📚 Full Documentation

- **Setup Guide**: `VERCEL_SETUP_GUIDE.md` (step-by-step with screenshots)
- **Security Details**: `SECURITY_MIGRATION.md` (what changed and why)
- **Full Docs**: `README.md` (complete documentation)
- **Deployment**: `DEPLOYMENT.md` (advanced topics)

---

## 🎓 What You Built

**Before**: Frontend → Gemini API (insecure ❌)

**After**: Frontend → Vercel Serverless → Gemini API (secure ✅)

Your API key is now safe! 🔐

---

**Need help?** Read the full guides above or visit https://vercel.com/docs
