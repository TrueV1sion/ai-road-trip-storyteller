# Quick start script for the backend
Write-Host "🚀 Starting AI Road Trip Storyteller Backend" -ForegroundColor Cyan
Write-Host ""

# Activate virtual environment
Write-Host "📦 Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

# Start the server
Write-Host "🎯 Starting FastAPI server..." -ForegroundColor Green
Write-Host "   API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host "   Health: http://localhost:8000/health" -ForegroundColor White
Write-Host ""

py -m app.main