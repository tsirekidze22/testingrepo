# Georgian Linguist Pro

A professional Georgian language editor powered by Google Gemini AI. This application helps users check and correct Georgian text for spelling, grammar, and punctuation errors.

## Features

- 🔍 **Intelligent Text Analysis**: Detects spelling, grammar, and punctuation errors
- ✨ **AI-Powered Corrections**: Uses Google Gemini AI for accurate suggestions
- 📝 **History Tracking**: Keeps track of your recent corrections
- 🌓 **Dark/Light Mode**: Comfortable viewing in any lighting condition
- 🔒 **Secure API**: API keys are safely stored on the server

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Vercel Serverless Functions
- **AI**: Google Gemini API
- **Deployment**: Vercel

## Local Development

### Prerequisites

- Node.js 18+ installed
- A Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd georgian-linguist-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

## Deployment to Vercel

### Step 1: Push to GitHub

1. Initialize git (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a new repository on GitHub and push:
   ```bash
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Sign up/Login to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up or log in with your GitHub account

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Vercel will automatically detect it's a Vite project

3. **Configure Environment Variables** (IMPORTANT!)
   - Before deploying, click "Environment Variables"
   - Add the following variable:
     - **Name**: `GEMINI_API_KEY`
     - **Value**: Your actual Gemini API key
     - **Environment**: Select all (Production, Preview, Development)
   - Click "Add"

4. **Deploy**
   - Click "Deploy"
   - Wait for the deployment to complete (usually 1-2 minutes)
   - Your app will be live at `https://your-project-name.vercel.app`

### Step 3: Update Environment Variables Later (if needed)

1. Go to your project dashboard on Vercel
2. Click "Settings" → "Environment Variables"
3. You can edit, add, or remove variables
4. After changing variables, redeploy by going to "Deployments" → click "..." → "Redeploy"

## Project Structure

```
georgian-linguist-pro/
├── api/                      # Vercel serverless functions
│   └── analyze.ts           # Gemini API endpoint (secure)
├── components/              # React components
│   ├── Header.tsx
│   └── ResultView.tsx
├── services/                # Frontend services
│   └── geminiService.ts    # API client (calls /api/analyze)
├── types.ts                 # TypeScript interfaces
├── App.tsx                  # Main app component
├── main.tsx                 # Entry point
├── index.html
├── vercel.json              # Vercel configuration
├── .env.local               # Local environment variables (not committed)
├── .env.example             # Example environment variables
└── package.json
```

## Security

- ✅ API keys are stored as environment variables on Vercel
- ✅ API keys are never exposed to the frontend
- ✅ All API calls go through the serverless function
- ✅ `.env.local` is excluded from git via `.gitignore`

## API Endpoint

### POST `/api/analyze`

Analyzes Georgian text and returns corrections.

**Request Body:**
```json
{
  "text": "ქართული ტექსტი"
}
```

**Response:**
```json
{
  "originalText": "ქართული ტექსტი",
  "correctedText": "ქართული ტექსტი",
  "explanation": "ტექსტი სწორია",
  "isCorrect": true
}
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## License

All rights reserved © 2026 Georgian Linguist Pro

## Support

For issues or questions, please open an issue on GitHub.
