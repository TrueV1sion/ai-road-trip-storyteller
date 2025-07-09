# Quick Deploy Script for AI Road Trip Storyteller (Windows)
Write-Host "🚀 AI Road Trip Storyteller - Quick Deploy to Netlify" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# Check if in correct directory
if (!(Test-Path "package.json")) {
    Write-Host "❌ Error: Not in project directory. Please run from project root." -ForegroundColor Red
    exit 1
}

# Build the project
Write-Host "📦 Building project for web..." -ForegroundColor Yellow
npm run build:web

# Check if build was successful
if (!(Test-Path "dist")) {
    Write-Host "❌ Error: Build failed. Please check for errors above." -ForegroundColor Red
    exit 1
}

# Copy redirects file
Write-Host "📄 Copying _redirects file..." -ForegroundColor Yellow
Copy-Item "_redirects" "dist\" -Force

Write-Host ""
Write-Host "✅ Build complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Option 1 - Deploy with Netlify CLI:" -ForegroundColor Yellow
Write-Host "  1. Run: netlify login"
Write-Host "  2. Run: netlify init"
Write-Host "  3. Run: netlify deploy --dir=dist"
Write-Host "  4. For production: netlify deploy --dir=dist --prod"
Write-Host ""
Write-Host "Option 2 - Manual Deploy:" -ForegroundColor Yellow
Write-Host "  1. Go to https://app.netlify.com"
Write-Host "  2. Drag the 'dist' folder to the browser"
Write-Host "  3. Your app will be live instantly!"
Write-Host ""
Write-Host "📁 Your build is ready in: ./dist" -ForegroundColor Green
Write-Host "📊 Bundle size: ~3.22 MB" -ForegroundColor Green
Write-Host "📄 Total pages: 21" -ForegroundColor Green
Write-Host ""
Write-Host "Good luck with your deployment! 🎉" -ForegroundColor Magenta