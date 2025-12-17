Write-Host "🚀 Setting up Msingi Gym..." -ForegroundColor Green

# Check Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js not found. Please install Node.js v16+" -ForegroundColor Red
    exit 1
}

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location "..\frontend-react"
npm install

# Install backend dependencies
Write-Host "⚙️  Installing backend dependencies..." -ForegroundColor Yellow
Set-Location "..\backend"
npm install

Write-Host "✅ Setup completed!" -ForegroundColor Green
Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Update .env files with your credentials" -ForegroundColor Yellow
Write-Host "2. Start backend: cd backend && npm run dev" -ForegroundColor Yellow
Write-Host "3. Start frontend: cd frontend-react && npm start" -ForegroundColor Yellow