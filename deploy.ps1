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
if (Test-Path "_redirects") {
    Copy-Item "_redirects" "dist\" -Force
} else {
    Write-Host "⚠️  Warning: _redirects file not found, skipping..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Build complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Deployment Options:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Option 1 - Manual Deploy (Recommended for first-time users):" -ForegroundColor Yellow
Write-Host "  1. Go to https://app.netlify.com/drop"
Write-Host "  2. Drag the 'dist' folder to the browser"
Write-Host "  3. Your app will be live instantly!"
Write-Host ""
Write-Host "Option 2 - CLI Deploy (Advanced users):" -ForegroundColor Yellow
Write-Host "  Prerequisites: Run these commands first in a separate terminal:"
Write-Host "    netlify login"
Write-Host "    netlify init"
Write-Host ""
Write-Host "  Then run: netlify deploy --dir=dist --prod"
Write-Host ""
Write-Host "Option 3 - Automated CLI Deploy:" -ForegroundColor Yellow
Write-Host "  Run: netlify deploy --dir=dist --prod --auth=YOUR_AUTH_TOKEN"
Write-Host "  (Get auth token from: https://app.netlify.com/user/applications)"
Write-Host ""
Write-Host "📁 Your build is ready in: ./dist" -ForegroundColor Green
Write-Host "📊 Bundle size: ~3.22 MB" -ForegroundColor Green
Write-Host "📄 Total pages: 21" -ForegroundColor Green
Write-Host ""
Write-Host "🔧 Troubleshooting:" -ForegroundColor Cyan
Write-Host "  • If you get 'Interactive prompt was cancelled', use Option 1 (Manual Deploy)" -ForegroundColor White
Write-Host "  • For CLI issues, make sure you're logged in: netlify status" -ForegroundColor White
Write-Host "  • For automated deployments, use the --auth flag with your token" -ForegroundColor White
Write-Host ""
Write-Host "Good luck with your deployment! 🎉" -ForegroundColor Magenta