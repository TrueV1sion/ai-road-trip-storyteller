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
try {
    py -m venv venv
    if ($LASTEXITCODE -ne 0) {
        throw "Virtual environment creation failed"
    }
    Write-Host "✅ Virtual environment created successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create virtual environment" -ForegroundColor Red
    Write-Host "Please ensure Python is properly installed and try again" -ForegroundColor Yellow
    exit 1
}

# Activate virtual environment
Write-Host ""
Write-Host "🔧 Activating virtual environment..." -ForegroundColor Yellow
try {
    & ".\venv\Scripts\Activate.ps1"
    Write-Host "✅ Virtual environment activated" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to activate virtual environment" -ForegroundColor Red
    Write-Host "Please run: .\venv\Scripts\Activate.ps1" -ForegroundColor Yellow
}

# Install dependencies
Write-Host ""
Write-Host "📚 Installing dependencies..." -ForegroundColor Yellow
try {
    pip install --upgrade pip --quiet
    pip install -r requirements.txt --quiet
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    Write-Host "Please check requirements.txt and try running:" -ForegroundColor Yellow
    Write-Host "  pip install -r requirements.txt" -ForegroundColor White
    Write-Host ""
    Write-Host "Or try the simple requirements:" -ForegroundColor Yellow
    Write-Host "  pip install -r requirements-simple.txt" -ForegroundColor White
}

# Create .env file
Write-Host ""
Write-Host "🔐 Creating .env file..." -ForegroundColor Yellow
$envContent = @"
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
"@

try {
    $envContent | Out-File -FilePath .env -Encoding utf8 -Force
    Write-Host "✅ .env file created (update with your actual keys)" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create .env file" -ForegroundColor Red
    Write-Host "Please create it manually with the required environment variables" -ForegroundColor Yellow
}

# Database setup instructions
Write-Host ""
Write-Host "🗄️  Database Setup Instructions:" -ForegroundColor Yellow
Write-Host "1. Install PostgreSQL if not already installed" -ForegroundColor White
Write-Host "2. Start PostgreSQL service" -ForegroundColor White
Write-Host "3. Create database: createdb roadtrip" -ForegroundColor White
Write-Host "4. Run migrations: alembic upgrade head" -ForegroundColor White
Write-Host ""
Write-Host "💡 Alternative: Use SQLite for development:" -ForegroundColor Cyan
Write-Host "  Change DATABASE_URL in .env to: sqlite:///./app.db" -ForegroundColor White

Write-Host ""
Write-Host "✅ Backend setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Update .env with your actual API keys" -ForegroundColor White
Write-Host "2. Set up your database (PostgreSQL or SQLite)" -ForegroundColor White
Write-Host "3. Run migrations: alembic upgrade head" -ForegroundColor White
Write-Host "4. Start the server: py -m app.main" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Troubleshooting:" -ForegroundColor Cyan
Write-Host "• If pip install fails, try: pip install --user -r requirements.txt" -ForegroundColor White
Write-Host "• If virtual environment issues, try: python -m venv venv" -ForegroundColor White
Write-Host "• For permission errors, run PowerShell as Administrator" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Happy coding!" -ForegroundColor Magenta