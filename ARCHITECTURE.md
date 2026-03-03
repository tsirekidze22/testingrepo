# 🏗️ Architecture Overview

## System Architecture

### Before Migration (Insecure)

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          React App (Frontend)                        │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │  geminiService.ts                           │    │  │
│  │  │                                              │    │  │
│  │  │  const ai = new GoogleGenAI({               │    │  │
│  │  │    apiKey: "AIza..." ← EXPOSED! ❌         │    │  │
│  │  │  })                                          │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                        │                              │  │
│  │                        │ Direct API call              │  │
│  │                        ▼                              │  │
│  └────────────────────────────────────────────────────────┘
│                          │                                  │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           │ HTTPS (but API key visible)
                           ▼
                  ┌─────────────────┐
                  │  Google Gemini  │
                  │      API        │
                  └─────────────────┘
```

**Problems:**
- 🚨 API key visible in browser DevTools
- 🚨 Anyone can steal and use your key
- 🚨 No rate limiting or validation
- 🚨 Direct billing to your account

---

### After Migration (Secure)

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          React App (Frontend)                        │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │  geminiService.ts                           │    │  │
│  │  │                                              │    │  │
│  │  │  fetch('/api/analyze', {                    │    │  │
│  │  │    method: 'POST',                          │    │  │
│  │  │    body: JSON.stringify({ text })           │    │  │
│  │  │  })                                          │    │  │
│  │  │                                              │    │  │
│  │  │  No API key here! ✅                        │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                        │                              │  │
│  │                        │ POST /api/analyze            │  │
│  │                        ▼                              │  │
│  └────────────────────────────────────────────────────────┘
│                          │                                  │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Platform                           │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │      Serverless Function (api/analyze.ts)            │  │
│  │                                                       │  │
│  │  1. Validate input                                   │  │
│  │  2. Check text length                                │  │
│  │  3. Get API key from environment:                    │  │
│  │     process.env.GEMINI_API_KEY ✅                   │  │
│  │  4. Call Gemini API                                  │  │
│  │  5. Return sanitized response                        │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │      Environment Variables (Secure Storage)          │  │
│  │                                                       │  │
│  │  GEMINI_API_KEY=AIza... (encrypted) 🔒              │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                  │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           │ HTTPS (with server API key)
                           ▼
                  ┌─────────────────┐
                  │  Google Gemini  │
                  │      API        │
                  └─────────────────┘
```

**Benefits:**
- ✅ API key never leaves the server
- ✅ Input validation before API call
- ✅ Can add rate limiting
- ✅ Can add authentication
- ✅ Centralized error handling
- ✅ Secure and scalable

---

## Request Flow

### Step-by-Step Request Lifecycle

```
1. User Input
   │
   ├─ User types Georgian text
   └─ Clicks "ტექსტის შემოწმება" button
      │
      ▼

2. Frontend Processing (App.tsx)
   │
   ├─ handleProcess() called
   ├─ setLoading(true)
   └─ Calls processGeorgianText(inputText)
      │
      ▼

3. API Client (services/geminiService.ts)
   │
   ├─ Prepares POST request
   ├─ URL: /api/analyze
   ├─ Body: { text: "..." }
   └─ Sends to serverless function
      │
      ▼

4. Vercel Routing
   │
   ├─ Receives request at /api/analyze
   ├─ Routes to api/analyze.ts
   └─ Spins up serverless function (if cold)
      │
      ▼

5. Serverless Function (api/analyze.ts)
   │
   ├─ Validates HTTP method (POST only)
   ├─ Validates request body
   ├─ Checks text length (max 10,000 chars)
   ├─ Gets GEMINI_API_KEY from environment
   ├─ Initializes GoogleGenAI client
   ├─ Calls Gemini API with system instructions
   └─ Waits for AI response
      │
      ▼

6. Google Gemini API
   │
   ├─ Processes Georgian text
   ├─ Analyzes grammar, spelling, punctuation
   ├─ Generates corrections
   └─ Returns JSON response
      │
      ▼

7. Serverless Function Response
   │
   ├─ Parses Gemini response
   ├─ Formats as CorrectionResult
   ├─ Returns 200 OK with JSON
   └─ Or returns error (400/500)
      │
      ▼

8. Frontend Processing
   │
   ├─ Receives response
   ├─ Updates state: setResult()
   ├─ Adds to history
   ├─ Saves to localStorage
   └─ Displays results to user
      │
      ▼

9. User Sees Results
   │
   ├─ Corrected text displayed
   ├─ Explanation shown
   └─ Can copy or clear results
```

---

## File Responsibilities

### Frontend Files

| File | Responsibility | Security |
|------|---------------|----------|
| `App.tsx` | Main UI, state management | No secrets |
| `services/geminiService.ts` | API client (calls /api/analyze) | No secrets |
| `components/Header.tsx` | Header UI, theme toggle | No secrets |
| `components/ResultView.tsx` | Display corrections | No secrets |
| `types.ts` | TypeScript interfaces | No secrets |

### Backend Files

| File | Responsibility | Security |
|------|---------------|----------|
| `api/analyze.ts` | Serverless function, Gemini API calls | Has API key access |
| `vercel.json` | Routing configuration | No secrets |

### Configuration Files

| File | Responsibility | Security |
|------|---------------|----------|
| `.env.local` | Local development API key | **Never commit!** |
| `.env.example` | Template for environment variables | Safe to commit |
| `.gitignore` | Excludes sensitive files | Includes `*.local` |
| `.vercelignore` | Excludes files from deployment | Optimization |

---

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1: Git Security                                  │
│  ─────────────────────                                  │
│  • .gitignore excludes .env.local                       │
│  • API keys never committed to repository               │
│  • .env.example provides template only                  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 2: Frontend Security                             │
│  ────────────────────────                               │
│  • No API keys in browser code                          │
│  • No direct API calls to Gemini                        │
│  • Only calls internal /api/analyze endpoint            │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 3: Vercel Platform Security                      │
│  ───────────────────────────────                        │
│  • Environment variables encrypted at rest              │
│  • HTTPS enforced for all requests                      │
│  • Automatic DDoS protection                            │
│  • Serverless functions isolated                        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 4: API Validation                                │
│  ─────────────────────                                  │
│  • Method validation (POST only)                        │
│  • Input type validation                                │
│  • Length limits (max 10,000 chars)                     │
│  • Error handling without exposing internals            │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 5: Gemini API Security                           │
│  ──────────────────────────                             │
│  • API key sent via secure headers                      │
│  • HTTPS encryption                                      │
│  • Google's authentication & authorization              │
└─────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Developer                             │
│                                                          │
│  git push origin main                                   │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    GitHub                                │
│                                                          │
│  • Stores source code                                   │
│  • Triggers Vercel webhook on push                      │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Vercel Build System                         │
│                                                          │
│  1. Clone repository                                    │
│  2. npm install                                          │
│  3. npm run build (Vite)                                │
│  4. Deploy static files to CDN                          │
│  5. Deploy serverless functions                         │
│  6. Inject environment variables                        │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│            Vercel Global Network                         │
│                                                          │
│  ┌──────────────────┐    ┌──────────────────┐          │
│  │   CDN (Static)   │    │   Serverless     │          │
│  │                  │    │   Functions      │          │
│  │  • HTML          │    │                  │          │
│  │  • CSS           │    │  • api/analyze   │          │
│  │  • JavaScript    │    │  • Auto-scaling  │          │
│  │  • Images        │    │  • 0-cold start  │          │
│  └──────────────────┘    └──────────────────┘          │
│                                                          │
│  Deployed to 100+ edge locations worldwide              │
└─────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                     Users                                │
│                                                          │
│  Access via: https://your-app.vercel.app                │
└─────────────────────────────────────────────────────────┘
```

---

## Environment Variables Flow

```
Development (Local)
───────────────────
.env.local (your machine)
    │
    ├─ GEMINI_API_KEY=AIza...
    │
    └─ Read by: process.env.GEMINI_API_KEY


Production (Vercel)
───────────────────
Vercel Dashboard → Settings → Environment Variables
    │
    ├─ GEMINI_API_KEY=AIza... (encrypted)
    │
    ├─ Injected at build time
    │
    └─ Available to serverless functions only
        (NOT available to frontend)
```

---

## Scaling Characteristics

### Frontend (Static Files)
- **Hosting**: Vercel CDN (100+ locations)
- **Scaling**: Automatic, unlimited
- **Cost**: Free tier: 100 GB bandwidth/month

### Backend (Serverless Functions)
- **Hosting**: Vercel serverless infrastructure
- **Scaling**: Automatic (0 to millions of requests)
- **Cold Start**: ~100-500ms (first request)
- **Warm Start**: ~10-50ms (subsequent requests)
- **Timeout**: 10 seconds (Hobby plan), 60s (Pro)
- **Cost**: Free tier: Unlimited invocations

### Database (None)
- **History**: Stored in browser localStorage
- **No server-side persistence**
- **Privacy**: User data never leaves their browser

---

## Performance Optimization

### Frontend
- ✅ Vite for fast builds and HMR
- ✅ React 19 for optimal rendering
- ✅ Code splitting (automatic)
- ✅ Asset optimization (images, CSS)

### Backend
- ✅ Serverless functions (auto-scaling)
- ✅ Edge network (low latency)
- ✅ HTTP/2 and HTTP/3 support
- ✅ Automatic compression (gzip, brotli)

### Future Optimizations
- 🔄 Add caching for common corrections
- 🔄 Implement request deduplication
- 🔄 Add rate limiting per IP
- 🔄 Compress API responses

---

## Cost Analysis

### Vercel (Free Tier)
- Bandwidth: 100 GB/month
- Serverless executions: Unlimited
- Build minutes: 6,000 minutes/month
- **Estimated cost for 10,000 users/month**: $0

### Google Gemini API
- Check current pricing: https://ai.google.dev/pricing
- Free tier available (as of 2026)
- Pay-as-you-go after free tier
- **Estimated cost**: Depends on usage

### Total Monthly Cost (Estimate)
- Small app (<1,000 users): **$0-10**
- Medium app (1,000-10,000 users): **$10-100**
- Large app (10,000+ users): **$100+**

---

## Monitoring & Observability

### Vercel Analytics
- Page views
- Unique visitors
- Performance metrics (Web Vitals)
- Geographic distribution

### Function Logs
- Request/response logs
- Error tracking
- Execution time
- Memory usage

### Gemini API Usage
- Track at: https://aistudio.google.com
- Requests per day
- Quota usage
- Error rates

---

**This architecture ensures your app is secure, scalable, and cost-effective! 🚀**
