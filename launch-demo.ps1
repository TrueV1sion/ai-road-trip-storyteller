# AI Road Trip Storyteller - One-Click Deploy Helper
Write-Host ""
Write-Host "🚀 AI ROAD TRIP STORYTELLER - DEMO LAUNCHER" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if build exists
if (!(Test-Path "dist")) {
    Write-Host "❌ Error: Build not found. Please run 'npm run build:web' first." -ForegroundColor Red
    exit 1
}

Write-Host "Choose your deployment method:" -ForegroundColor Yellow
Write-Host ""
Write-Host "[1] 🎯 EASY: Drag & Drop Deploy (Recommended)" -ForegroundColor Green
Write-Host "[2] 🛠️  CLI: Command Line Deploy (Advanced)" -ForegroundColor Blue
Write-Host "[3] 🔧 Build Project First" -ForegroundColor Yellow
Write-Host "[4] ❌ Exit" -ForegroundColor Red
Write-Host ""

$choice = Read-Host "Enter your choice (1, 2, 3, or 4)"

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
        Write-Host "🛠️  CLI Deployment Setup..." -ForegroundColor Blue
        Write-Host ""
        
        # Check if Netlify CLI is installed
        try {
            $netlifyVersion = netlify --version 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Netlify CLI found: $netlifyVersion" -ForegroundColor Green
            } else {
                throw "Netlify CLI not found"
            }
        } catch {
            Write-Host "❌ Netlify CLI not installed. Installing now..." -ForegroundColor Red
            npm install -g netlify-cli
        }
        
        # Check authentication status
        Write-Host ""
        Write-Host "🔐 Checking authentication status..." -ForegroundColor Yellow
        try {
            $authStatus = netlify status 2>&1
            if ($authStatus -match "Not logged in") {
                Write-Host "❌ Not logged in to Netlify" -ForegroundColor Red
                Write-Host ""
                Write-Host "Please run the following commands in a separate terminal:" -ForegroundColor Yellow
                Write-Host "  1. netlify login" -ForegroundColor White
                Write-Host "  2. netlify init" -ForegroundColor White
                Write-Host "  3. netlify deploy --dir=dist --prod" -ForegroundColor White
                Write-Host ""
                Write-Host "Or use Option 1 (Drag & Drop) for easier deployment!" -ForegroundColor Green
            } else {
                Write-Host "✅ Already logged in to Netlify" -ForegroundColor Green
                Write-Host ""
                Write-Host "You can now run:" -ForegroundColor Yellow
                Write-Host "  netlify deploy --dir=dist --prod" -ForegroundColor White
            }
        } catch {
            Write-Host "⚠️  Could not check auth status. Please run 'netlify login' first." -ForegroundColor Yellow
        }
        
        Write-Host ""
        Write-Host "💡 Tip: For automated deployments, use:" -ForegroundColor Cyan
        Write-Host "  netlify deploy --dir=dist --prod --auth=YOUR_AUTH_TOKEN" -ForegroundColor White
        Write-Host "  (Get token from: https://app.netlify.com/user/applications)" -ForegroundColor White
        Write-Host ""
    }
    "3" {
        Write-Host ""
        Write-Host "🔧 Building project..." -ForegroundColor Yellow
        npm run build:web
        
        if (Test-Path "dist") {
            Write-Host "✅ Build complete! You can now deploy." -ForegroundColor Green
            Write-Host "Run this script again to deploy." -ForegroundColor White
        } else {
            Write-Host "❌ Build failed. Please check the errors above." -ForegroundColor Red
        }
        Write-Host ""
    }
    "4" {
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