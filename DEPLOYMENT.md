# Vercel Deployment Guide

## Quick Setup for Vercel

### 1. Prepare Your API Key

Before deploying, make sure you have your Google Gemini API key ready:
- Get it from: https://aistudio.google.com/app/apikey

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. When prompted, add environment variable:
   ```bash
   vercel env add GEMINI_API_KEY
   ```
   - Paste your API key when prompted
   - Select all environments (production, preview, development)

5. Deploy to production:
   ```bash
   vercel --prod
   ```

#### Option B: Using Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel auto-detects Vite configuration

3. **Add Environment Variable**
   - In the import screen, expand "Environment Variables"
   - Add:
     - **Name**: `GEMINI_API_KEY`
     - **Value**: `your_actual_gemini_api_key`
     - **Environments**: Check all (Production, Preview, Development)

4. **Click Deploy**

### 3. Verify Deployment

After deployment:

1. Visit your deployed URL (e.g., `https://your-app.vercel.app`)
2. Try analyzing some Georgian text
3. Check the browser console for any errors

### 4. Environment Variables Management

To update environment variables after deployment:

1. Go to your project on Vercel dashboard
2. Navigate to: **Settings** → **Environment Variables**
3. Add/Edit/Delete variables as needed
4. **Important**: After changing environment variables, you must redeploy:
   - Go to **Deployments** tab
   - Click the "..." menu on the latest deployment
   - Select **Redeploy**

## Troubleshooting

### API Key Not Working

**Symptom**: "Server configuration error" message

**Solution**:
1. Check that `GEMINI_API_KEY` is set in Vercel environment variables
2. Ensure the key is valid (test it at https://aistudio.google.com)
3. Redeploy after adding the key

### API Route Not Found (404)

**Symptom**: `/api/analyze` returns 404

**Solution**:
1. Ensure `api/analyze.ts` exists in your repository
2. Check that `vercel.json` is present
3. Redeploy the project

### Build Fails

**Symptom**: Deployment fails during build

**Solution**:
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Run `npm run build` locally to test

### CORS Errors

**Symptom**: CORS errors in browser console

**Solution**:
- This shouldn't happen since the API is on the same domain
- If it does, check that you're using `/api/analyze` (relative URL)
- Don't use `http://localhost:3000/api/analyze` in production

## Custom Domain (Optional)

To add a custom domain:

1. Go to your project in Vercel dashboard
2. Click **Settings** → **Domains**
3. Add your domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (can take up to 48 hours)

## Monitoring

Monitor your app:

1. **Analytics**: Vercel dashboard → Analytics tab
2. **Logs**: Vercel dashboard → Deployments → Click deployment → Functions tab
3. **Usage**: Check API usage at https://aistudio.google.com

## Security Best Practices

✅ **Do's:**
- Keep your API key in Vercel environment variables
- Use `.env.local` for local development only
- Never commit `.env.local` to git
- Rotate your API key if exposed

❌ **Don'ts:**
- Don't hardcode API keys in source code
- Don't share your `.env.local` file
- Don't commit sensitive data to git
- Don't expose API keys in client-side code

## Cost Considerations

- **Vercel**: Free tier includes:
  - 100 GB bandwidth/month
  - Unlimited serverless function executions (with time limits)
  
- **Google Gemini API**: Check current pricing at:
  - https://ai.google.dev/pricing

## Need Help?

- Vercel Documentation: https://vercel.com/docs
- Gemini API Documentation: https://ai.google.dev/docs
- Project Issues: Open an issue on GitHub
