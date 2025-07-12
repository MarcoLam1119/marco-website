Write-Host "Starting the project..."

# Start the backend server
Set-Location backend
Write-Host "Starting backend server..."
& venv\Scripts\Activate.ps1
Start-Process -NoNewWindow -FilePath "python" -ArgumentList "-m uvicorn main:app --host 127.0.0.1 --port 9090 --reload"
Set-Location ..

# Start the frontend server
Set-Location frontend
Write-Host "Starting frontend server..."
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run dev"
Set-Location ..

Write-Host "Both servers are running!"
