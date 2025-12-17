Write-Host "🚀 Starting development servers..." -ForegroundColor Green

# Start backend
Start-Process powershell -ArgumentList @"
cd ..\backend
npm run dev
"@ -WindowStyle Normal

# Start frontend
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList @"
cd ..\frontend-react
npm start
"@ -WindowStyle Normal

Write-Host "✅ Servers starting..." -ForegroundColor Green
Write-Host "   Backend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3001" -ForegroundColor Cyan