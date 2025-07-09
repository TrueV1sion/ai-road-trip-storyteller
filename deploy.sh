#!/bin/bash
# Quick Deploy Script for AI Road Trip Storyteller

echo "🚀 AI Road Trip Storyteller - Quick Deploy to Netlify"
echo "===================================================="

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project directory. Please run from project root."
    exit 1
fi

# Build the project
echo "📦 Building project for web..."
npm run build:web

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed. Please check for errors above."
    exit 1
fi

# Copy redirects file
echo "📄 Copying _redirects file..."
if [ -f "_redirects" ]; then
    cp _redirects dist/
else
    echo "⚠️  Warning: _redirects file not found, skipping..."
fi

echo ""
echo "✅ Build complete!"
echo ""
echo "🎯 Deployment Options:"
echo ""
echo "Option 1 - Manual Deploy (Recommended for first-time users):"
echo "  1. Go to https://app.netlify.com/drop"
echo "  2. Drag the 'dist' folder to the browser"
echo "  3. Your app will be live instantly!"
echo ""
echo "Option 2 - CLI Deploy (Advanced users):"
echo "  Prerequisites: Run these commands first in a separate terminal:"
echo "    netlify login"
echo "    netlify init"
echo ""
echo "  Then run: netlify deploy --dir=dist --prod"
echo ""
echo "Option 3 - Automated CLI Deploy:"
echo "  Run: netlify deploy --dir=dist --prod --auth=YOUR_AUTH_TOKEN"
echo "  (Get auth token from: https://app.netlify.com/user/applications)"
echo ""
echo "📁 Your build is ready in: ./dist"
echo "📊 Bundle size: ~3.22 MB"
echo "📄 Total pages: 21"
echo ""
echo "🔧 Troubleshooting:"
echo "  • If you get 'Interactive prompt was cancelled', use Option 1 (Manual Deploy)"
echo "  • For CLI issues, make sure you're logged in: netlify status"
echo "  • For automated deployments, use the --auth flag with your token"
echo ""
echo "Good luck with your deployment! 🎉"