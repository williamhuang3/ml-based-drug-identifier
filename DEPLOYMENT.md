# 🚀 DrugPredict Deployment Guide

## Overview
Your app has two parts that need to be deployed separately:
- **Frontend (Next.js)** → Deploy to Vercel
- **Backend (Flask + Python ML)** → Deploy to Render/Railway/Fly.io

## 📱 Frontend Deployment (Vercel)

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel auto-detects Next.js
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend.onrender.com/api`

### 3. Your frontend will be live at:
`https://your-project.vercel.app`

## 🐍 Backend Deployment (Render.com)

### 1. Create Render Account
- Go to [render.com](https://render.com)
- Connect your GitHub account

### 2. Create Web Service
- Click "New" → "Web Service"
- Connect your repository
- Configure:
  - **Name**: `drugpredict-backend`
  - **Environment**: `Python 3.9+`
  - **Build Command**: `pip install -r requirements.txt`
  - **Start Command**: `python flask_app.py`

### 3. Add Environment Variables
- `FLASK_ENV` = `production`
- `ALLOWED_ORIGINS` = `https://your-project.vercel.app`

### 4. Your backend will be live at:
`https://drugpredict-backend.onrender.com`

## 🔄 Update Frontend with Backend URL

Once your backend is deployed, update your Vercel environment:
1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_API_URL` to your Render backend URL
3. Redeploy frontend

## 🎯 Final Result
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://drugpredict-backend.onrender.com`
- **Both communicate via HTTPS**

## Alternative Backend Platforms

### Railway.app
- Auto-detects Python
- Uses `railway.yaml` config
- Similar process to Render

### Fly.io
- Great for global edge deployment
- Requires Docker setup
- More complex but very fast

### AWS/Google Cloud
- More expensive but enterprise-grade
- Requires more configuration
- Best for large-scale applications

## 🛠 Local Development
```bash
# Terminal 1: Start Flask backend
python flask_app.py

# Terminal 2: Start Next.js frontend  
npm run dev
```

## 🔧 Troubleshooting

### CORS Errors
- Make sure `ALLOWED_ORIGINS` includes your Vercel domain
- Check that both HTTP and HTTPS are configured

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend health endpoint: `https://your-backend.com/api/health`

### Python Dependencies
- Ensure `requirements.txt` includes all ML libraries
- Check build logs in Render/Railway dashboard
