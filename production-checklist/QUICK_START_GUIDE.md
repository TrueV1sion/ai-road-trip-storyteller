# 🚀 Quick Start Guide - First 48 Hours

## Immediate Action Items for Netlify Web Deployment

### Hour 1-4: Project Setup
```bash
# 1. Fix package.json for web build
npm install --save-dev @expo/webpack-config

# 2. Update package.json scripts
"scripts": {
  ...existing scripts,
  "build:web": "expo export:web",
  "build:netlify": "expo export:web && cp netlify.toml web-build/",
  "serve:web": "npx serve web-build"
}

# 3. Create netlify.toml in project root
[build]
  command = "npm run build:netlify"
  publish = "web-build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# 4. Create _redirects file
echo "/* /index.html 200" > public/_redirects
```

### Hour 4-8: Critical Fixes for Web
```typescript
// 1. Fix platform-specific imports in services/api.ts
import { Platform } from 'react-native';

// Add web-specific handling
const getBaseURL = () => {
  if (Platform.OS === 'web') {
    return process.env.EXPO_PUBLIC_API_URL || '/api';
  }
  return process.env.EXPO_PUBLIC_API_URL || 'https://api.ai-roadtrip.com';
};
// 2. Create web-specific storage adapter
const storage = Platform.select({
  web: {
    getItem: (key) => localStorage.getItem(key),
    setItem: (key, value) => localStorage.setItem(key, value),
    removeItem: (key) => localStorage.removeItem(key),
  },
  default: AsyncStorage,
});

// 3. Fix navigation for web in app/(tabs)/_layout.tsx
// Add web-specific tab bar styling
```

### Hour 8-16: Mock Backend Setup
```javascript
// Create services/mockApi.ts for development
export const mockApi = {
  login: async (email, password) => ({
    success: true,
    data: {
      access_token: 'mock-token-12345',
      user: { id: '1', email, username: email.split('@')[0] }
    }
  }),
  
  generateStory: async (request) => ({
    success: true,
    data: {
      id: Date.now().toString(),
      title: 'Mock Story Title',
      content: 'This is a mock story for development...',
      narrator: request.personality || 'Default',
      duration: 180,
    }
  }),
  
  // Add more mock endpoints as needed
};
```

### Hour 16-24: Deploy to Netlify
```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Build and test locally
npm run build:web
npx serve web-build
# 3. Login and deploy to Netlify
netlify login
netlify init
netlify deploy --build

# 4. Go to production
netlify deploy --build --prod
```

### Hour 24-48: Essential Features
```typescript
// 1. Add loading states to all screens
import { LoadingSpinner } from '../components/LoadingSpinner';

// 2. Add error boundaries to each route
import { ErrorBoundary } from '../components/ErrorBoundary';

// 3. Implement basic offline detection
const [isOnline, setIsOnline] = useState(true);

useEffect(() => {
  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}, []);
```

## 🎯 Week 1 Priorities

### Backend Development (Parallel Track)
1. Set up FastAPI backend
2. Create authentication endpoints
3. Mock AI story generation
4. Deploy to Heroku/Railway for quick testing

### Frontend Improvements
1. Fix all web compatibility issues
2. Add proper loading states
3. Implement error handling
4. Create landing page

### Quick Wins for Demo
1. Use mock data for all features
2. Focus on UI/UX polish
3. Create compelling demo video
4. Set up analytics to track usage

## 📋 Simplified MVP Checklist (2 Weeks)

### Week 1
- [ ] Deploy static web app to Netlify
- [ ] Fix all web compatibility issues
- [ ] Implement mock API for demo
- [ ] Polish UI for web screens
- [ ] Add basic error handling
- [ ] Create landing page

### Week 2
- [ ] Set up basic backend (auth + stories)
- [ ] Connect frontend to real API
- [ ] Add payment integration (Stripe)
- [ ] Implement one AI feature (story generation)
- [ ] Basic testing and bug fixes
- [ ] Deploy MVP

## 🚨 Common Issues & Solutions

### Issue: "Module not found" errors on build
```bash
# Clear cache and reinstall
rm -rf node_modules
npm cache clean --force
npm install
expo doctor
```

### Issue: Web build fails
```bash
# Use specific webpack config
npm install --save-dev @expo/webpack-config@latest
npx expo customize:web
```

### Issue: API calls fail on Netlify
```javascript
// Use relative paths for same-domain API
const apiUrl = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:8000';
```

## 🎉 You're Ready!

With this guide, you can have a working demo on Netlify within 48 hours. Focus on:
1. **Visual Polish** - Make it look amazing
2. **Mock Data** - Show what it could do
3. **User Flow** - Smooth experience
4. **Landing Page** - Compelling story

Remember: Ship early, iterate often! 🚀