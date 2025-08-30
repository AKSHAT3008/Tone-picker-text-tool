# Deployment Guide

## Option 1: Vercel + Railway (Recommended)

### Frontend (Vercel)
1. Push code to GitHub
2. Connect GitHub to Vercel
3. Deploy automatically on push
4. Update API URL in frontend to Railway backend URL

### Backend (Railway)
1. Connect GitHub repo to Railway
2. Set environment variables:
   - `MISTRAL_API_KEY=your_key`
   - `PORT=3001`
3. Deploy automatically

### Update Frontend API URL
```typescript
// src/services/mistralApi.ts
const BACKEND_API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-railway-app.railway.app/api/transform-text'
  : 'http://localhost:3001/api/transform-text';
```

## Option 2: Single VPS (DigitalOcean)

### Setup Script
```bash
#!/bin/bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs nginx

# Clone and build
git clone <your-repo>
cd tone-picker-text-tool

# Build frontend
cd tone-picker-text-tool
npm install && npm run build

# Setup backend
cd ../backend
npm install
npm install -g pm2

# Start backend
pm2 start server.js --name tone-picker-api

# Configure nginx
sudo tee /etc/nginx/sites-available/tone-picker << EOF
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /path/to/tone-picker-text-tool/build;
        try_files \$uri \$uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/tone-picker /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

## Environment Variables for Production

### Frontend (.env.production)
```
REACT_APP_API_URL=https://your-backend-url.com
```

### Backend (.env)
```
MISTRAL_API_KEY=your_mistral_key
PORT=3001
NODE_ENV=production
```

## Cost Comparison

| Option | Frontend | Backend | Total/month |
|--------|----------|---------|-------------|
| Vercel + Railway | Free | $5 | $5 |
| Netlify + Render | Free | $7 | $7 |
| DigitalOcean VPS | - | $6 | $6 |
| AWS/Heroku | $0-10 | $7-25 | $7-35 |

**Recommendation: Vercel + Railway** for simplicity and automatic deployments.