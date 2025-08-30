# 🚀 Vercel Deployment

## Deploy Full Stack to Vercel

1. **Push to GitHub** (if not done already):
   ```bash
   git add .
   git commit -m "Vercel deployment setup"
   git push
   ```

2. **Deploy to Vercel**:
   - Go to https://vercel.com
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - **Important**: Use project root (not subdirectory)

3. **Environment Variables**:
   - Add: `MISTRAL_API_KEY` = `UtHGJSXpxaIX2KPZ3ecKGKunuKwypZo3`

4. **Deploy**:
   - Vercel will auto-build and deploy
   - Frontend + API routes on same domain

## ✅ Result:
- **Frontend**: Vercel CDN
- **Backend**: Vercel serverless functions at `/api/transform-text`
- **Single domain**: No CORS issues
- **Auto-deploy**: On every git push

## Local Development:
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend  
cd tone-picker-text-tool
npm start
```

**Total deployment time: 3 minutes**