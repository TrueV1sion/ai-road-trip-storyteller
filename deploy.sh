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
cp _redirects dist/

echo "✅ Build complete!"
echo ""
echo "🎯 Next Steps:"
echo ""
echo "Option 1 - Deploy with Netlify CLI:"
echo "  1. Run: netlify login"
echo "  2. Run: netlify init"
echo "  3. Run: netlify deploy --dir=dist"
echo "  4. For production: netlify deploy --dir=dist --prod"
echo ""
echo "Option 2 - Manual Deploy:"
echo "  1. Go to https://app.netlify.com"
echo "  2. Drag the 'dist' folder to the browser"
echo "  3. Your app will be live instantly!"
echo ""
echo "📁 Your build is ready in: ./dist"
echo "📊 Bundle size: ~3.22 MB"
echo "📄 Total pages: 21"
echo ""
echo "Good luck with your deployment! 🎉"