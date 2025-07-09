# AI Road Trip Storyteller - One-Click Deploy Helper
Write-Host ""
Write-Host "🚀 AI ROAD TRIP STORYTELLER - DEMO LAUNCHER" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Choose your deployment method:" -ForegroundColor Yellow
Write-Host ""
Write-Host "[1] 🎯 EASY: Drag & Drop Deploy (Recommended)" -ForegroundColor Green
Write-Host "[2] 🛠️  CLI: Command Line Deploy" -ForegroundColor Blue
Write-Host "[3] ❌ Exit" -ForegroundColor Red
Write-Host ""

$choice = Read-Host "Enter your choice (1, 2, or 3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🎯 Opening Netlify Drop and your dist folder..." -ForegroundColor Green
        Write-Host ""
        
        # Open Netlify Drop in browser
        Start-Process "https://app.netlify.com/drop"
        
        # Open the dist folder in File Explorer
        Start-Process "explorer.exe" -ArgumentList "$PWD\dist"
        
        Write-Host "📋 Instructions:" -ForegroundColor Yellow
        Write-Host "1. Your browser is opening to Netlify Drop" -ForegroundColor White
        Write-Host "2. File Explorer is opening to your 'dist' folder" -ForegroundColor White
        Write-Host "3. Drag the ENTIRE 'dist' folder into the browser" -ForegroundColor White
        Write-Host "4. Wait 30 seconds for upload" -ForegroundColor White
        Write-Host "5. Your app will be LIVE! 🎉" -ForegroundColor Green
        Write-Host ""
        Write-Host "Press any key when done..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
    "2" {
        Write-Host ""
        Write-Host "🛠️  Starting CLI deployment..." -ForegroundColor Blue
        Write-Host ""
        Write-Host "Step 1: Login to Netlify" -ForegroundColor Yellow
        netlify login
        
        Write-Host ""
        Write-Host "Step 2: Initialize site (if not done already)" -ForegroundColor Yellow
        Write-Host "Run: netlify init" -ForegroundColor White
        Write-Host ""
        Write-Host "Step 3: Deploy to Netlify" -ForegroundColor Yellow
        Write-Host "Run: netlify deploy --dir=dist --prod" -ForegroundColor White
        Write-Host ""
    }
    "3" {
        Write-Host "Exiting..." -ForegroundColor Red
        exit
    }
    default {
        Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎊 Thank you for using AI Road Trip Storyteller!" -ForegroundColor Magenta
Write-Host ""