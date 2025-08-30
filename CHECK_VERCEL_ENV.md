# 🔧 Fix Vercel Environment Variable

The 500 error is likely because the `MISTRAL_API_KEY` environment variable is not set in Vercel.

## Steps to Fix:

1. **Go to Vercel Dashboard**:
   - Visit https://vercel.com/dashboard
   - Click on your `tone-picker-text-tool` project

2. **Add Environment Variable**:
   - Go to Settings tab
   - Click "Environment Variables" 
   - Add new variable:
     - **Name**: `MISTRAL_API_KEY`
     - **Value**: `UtHGJSXpxaIX2KPZ3ecKGKunuKwypZo3`
     - **Environment**: Production (and Preview if you want)

3. **Redeploy**:
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

## Alternative: Check Current Environment

You can also check what environment variables are available by temporarily adding this to your API function:

```javascript
console.log('Available env vars:', Object.keys(process.env));
console.log('MISTRAL_API_KEY exists:', !!process.env.MISTRAL_API_KEY);
```

The API should work once the environment variable is properly set in Vercel.