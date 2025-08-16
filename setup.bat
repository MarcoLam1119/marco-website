@echo off
setlocal enabledelayedexpansion

echo ================================
echo Project setup script
echo ================================

:: ensure we run from the script directory (repo root)
cd /d "%~dp0"

:: --- Python / backend setup ---
echo.
echo Checking for Python...
where python >nul 2>&1
if errorlevel 1 (
    echo Python not found on PATH. Install Python 3.10+ and re-run this script.
    pause
    exit /b 1
)

:: Create venv if missing
if not exist "backend\venv\Scripts\python.exe" (
    echo Creating Python virtual environment in backend\venv...
    python -m venv backend\venv
) else (
    echo Python virtual environment already exists.
)

echo Activating backend virtual environment...
call backend\venv\Scripts\activate

echo Upgrading pip, setuptools, wheel...
python -m pip install --upgrade pip setuptools wheel

if exist "backend\requirements.txt" (
    echo Installing backend requirements...
    pip install -r backend\requirements.txt
)

if exist "backend\app\requirements.txt" (
    echo Installing app/requirements.txt...
    pip install -r backend\app\requirements.txt
)

if exist "dev-requirements.txt" (
    echo Installing dev-requirements.txt...
    pip install -r dev-requirements.txt
)

echo Deactivating virtual environment...
deactivate

:: --- Frontend / node setup ---
echo.
echo Checking for Node.js and npm...
where node >nul 2>&1
if errorlevel 1 (
    echo Node.js not found on PATH. Install Node.js (recommended LTS) and re-run this script.
) else (
    cd frontend
    if exist package-lock.json (
        echo Using npm ci to install frontend dependencies...
        npm ci
    ) else (
        echo Running npm install for frontend...
        npm install
    )
    cd ..
)

:: --- Ensure upload folder exists for frontend ---
echo.
if not exist "frontend\upload" (
    echo Creating frontend\upload directory...
    mkdir "frontend\upload"
) else (
    echo frontend\upload already exists.
)

echo.
echo Setup finished.
echo To run backend: 
echo    cd backend && call venv\Scripts\activate && uvicorn app.main:app --reload
echo To run frontend:
echo    cd frontend && npm run