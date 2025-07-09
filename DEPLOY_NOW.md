# 🚀 Netlify Deployment Guide for AI Road Trip Storyteller

Your app is built and ready! Follow these steps:

## Option 1: Quick Manual Deploy (Easiest - 2 minutes)

1. Open your browser and go to: https://app.netlify.com/drop
2. Open File Explorer to: C:\Users\jared\OneDrive\Desktop\Bolt Roadtrip\dist
3. Drag the entire 'dist' folder into the browser window
4. Wait for upload (about 30 seconds)
5. Your app will be LIVE instantly! 🎉

## Option 2: Netlify CLI Deploy (5 minutes)

### Step 1: Login to Netlify
```powershell
netlify login
```
- This will open a browser window
- Click "Authorize" to connect your Netlify account

### Step 2: Initialize the site
```powershell
cd "C:\Users\jared\OneDrive\Desktop\Bolt Roadtrip"
netlify init
```
- Choose: "Create & configure a new site"
- Team: Select your team (or personal account)
- Site name: "ai-roadtrip-storyteller" (or leave blank for random)

### Step 3: Deploy
```powershell
# Test deployment (preview URL)
netlify deploy --dir=dist

# Production deployment (your main URL)
netlify deploy --dir=dist --prod
```

## 🎯 After Deployment

Your app will be available at:
- https://[your-site-name].netlify.app

### Set Environment Variables (Optional)
1. Go to Netlify Dashboard > Site Settings > Environment Variables
2. Add:
   - EXPO_PUBLIC_ENVIRONMENT = production
   - EXPO_PUBLIC_USE_MOCK_API = true

### Custom Domain (Optional)
1. Go to Domain Settings in Netlify
2. Add your custom domain
3. Follow DNS configuration steps

## 🎉 That's it! Your app is live!

Share your URL and get feedback!