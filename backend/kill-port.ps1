# PowerShell script to kill processes using port 5000
Write-Host "Checking for processes using port 5000..." -ForegroundColor Yellow

$processes = netstat -ano | findstr :5000 | ForEach-Object {
    if ($_ -match '\s+(\d+)\s*$') {
        $matches[1]
    }
} | Select-Object -Unique

if ($processes) {
    Write-Host "Found processes using port 5000: $($processes -join ', ')" -ForegroundColor Red
    foreach ($pid in $processes) {
        if ($pid -ne 0) {
            try {
                Stop-Process -Id $pid -Force -ErrorAction Stop
                Write-Host "[OK] Killed process $pid" -ForegroundColor Green
            } catch {
                Write-Host "[ERROR] Could not kill process $pid: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    }
    Write-Host ""
    Write-Host "Port 5000 should now be free!" -ForegroundColor Green
} else {
    Write-Host "No processes found using port 5000" -ForegroundColor Green
}

Write-Host ""
Write-Host "You can now start the server with: npm run dev" -ForegroundColor Cyan

