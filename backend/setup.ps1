# Backend Environment Setup Script
Write-Host "🚀 Setting up AI Road Trip Storyteller Backend" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
try {
    $pythonVersion = py --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
    } else {
        throw "Python check failed"
    }
} catch {
    # Try python command as fallback
    try {
        $pythonVersion = python --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
        } else {
            throw "Python not found"
        }
    } catch {
        Write-Host "❌ Python is not installed. Please install Python 3.9+" -ForegroundColor Red
        Write-Host "Download from: https://www.python.org/downloads/" -ForegroundColor Yellow
        exit 1
    }
}

# Create virtual environment
Write-Host ""
Write-Host "📦 Creating virtual environment..." -ForegroundColor Yellow
py -m venv venv

# Activate virtual environment
Write-Host "🔧 Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

# Install dependencies
Write-Host ""
Write-Host "📚 Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Create .env file
Write-Host ""
Write-Host "🔐 Creating .env file..." -ForegroundColor Yellow
@"
# Database
DATABASE_URL=postgresql://postgres:password@localhost/roadtrip

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production

# Redis
REDIS_URL=redis://localhost:6379

# Google Cloud (get these from Google Cloud Console)
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json

# Stripe (get from Stripe dashboard)
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# Email (optional for now)
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# External APIs
OPENWEATHER_API_KEY=your-api-key
TICKETMASTER_API_KEY=your-api-key
OPENTABLE_API_KEY=your-api-key
"@ | Out-File -FilePath .env -Encoding utf8

Write-Host "✅ .env file created (update with your actual keys)" -ForegroundColor Green

# Create database
Write-Host ""
Write-Host "🗄️  Setting up database..." -ForegroundColor Yellow
Write-Host "Please ensure PostgreSQL is installed and running" -ForegroundColor White
Write-Host "Run: createdb roadtrip" -ForegroundColor White

Write-Host ""
Write-Host "✅ Backend setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Update .env with your actual API keys" -ForegroundColor White
Write-Host "2. Create PostgreSQL database: createdb roadtrip" -ForegroundColor White
Write-Host "3. Run migrations: alembic upgrade head" -ForegroundColor White
Write-Host "4. Start the server: py -m app.main" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Happy coding!" -ForegroundColor Magenta