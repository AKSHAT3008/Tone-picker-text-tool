# Deployment Instructions

## Step 1: Deploy Backend to Railway

1. **Go to Railway.app and sign up/login**
2. **Create new project from GitHub repo**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Choose the `backend` folder as root directory

3. **Set environment variables in Railway:**
   ```
   MISTRAL_API_KEY=UtHGJSXpxaIX2KPZ3ecKGKunuKwypZo3
   PORT=3001
   NODE_ENV=production
   ```

4. **Deploy and get URL**
   - Railway will auto-deploy
   - Copy the generated URL (e.g., `https://your-app.railway.app`)

## Step 2: Deploy Frontend to Vercel

1. **Go to Vercel.com and sign up/login**
2. **Import project from GitHub**
   - Click "New Project" → Import from GitHub
   - Select your repository
   - Set root directory to `tone-picker-text-tool`

3. **Set environment variables in Vercel:**
   ```
   REACT_APP_API_URL=https://your-railway-app.railway.app
   ```
   (Replace with your actual Railway URL from Step 1)

4. **Deploy**
   - Vercel will auto-build and deploy
   - Get your live URL

## Step 3: Test Deployment

1. Visit your Vercel URL
2. Enter text and try changing tone
3. Check browser console for any errors

## Manual Deployment (Alternative)

If you prefer CLI deployment:

### Backend (Railway CLI)
```bash
npm install -g @railway/cli
railway login
railway new
railway add
railway deploy
```

### Frontend (Vercel CLI)
```bash
npm install -g vercel
cd tone-picker-text-tool
vercel --prod
```

## Project is now live! 🚀

- **Frontend**: Your Vercel URL
- **Backend**: Your Railway URL
- **Auto-deployments**: Enabled on both platforms