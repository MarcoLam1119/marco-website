#!/usr/bin/env bash
set -euo pipefail

# Run from repo root (script location)
cd "$(dirname "$0")"

echo "================================"
echo "Project setup script (unix)"
echo "================================"

# --- Python / backend setup ---
echo
echo "Checking for Python..."
PYBIN=""
if command -v python3 >/dev/null 2>&1; then
  PYBIN=python3
elif command -v python >/dev/null 2>&1; then
  PYBIN=python
else
  echo "Python not found. Install Python 3.10+ and re-run this script."
  exit 1
fi
echo "Using: $($PYBIN --version 2>&1)"

# create venv if missing
if [ ! -x "backend/venv/bin/python" ]; then
  echo "Creating Python virtual environment in backend/venv..."
  "$PYBIN" -m venv backend/venv
else
  echo "Python virtual environment already exists."
fi

# activate venv for this script
# shellcheck source=/dev/null
source backend/venv/bin/activate

echo "Upgrading pip, setuptools, wheel..."
python -m pip install --upgrade pip setuptools wheel

if [ -f "backend/requirements.txt" ]; then
  echo "Installing backend requirements..."
  pip install -r backend/requirements.txt
fi

if [ -f "backend/app/requirements.txt" ]; then
  echo "Installing backend/app requirements..."
  pip install -r backend/app/requirements.txt
fi

if [ -f "dev-requirements.txt" ]; then
  echo "Installing dev-requirements..."
  pip install -r dev-requirements.txt
fi

# deactivate venv for remainder
deactivate || true

# --- Frontend / node setup ---
echo
echo "Checking for Node.js and npm..."
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found on PATH. Install Node.js (recommended LTS) and re-run this script."
else
  if [ -d "frontend" ]; then
    pushd frontend >/dev/null
    if [ -f package-lock.json ]; then
      echo "Using npm ci to install frontend dependencies..."
      npm ci
    else
      echo "Running npm install for frontend..."
      npm install
    fi
    popd >/dev/null
  else
    echo "frontend directory not found, skipping frontend install."
  fi
fi

# --- Ensure upload folder exists for frontend ---
echo
if [ ! -d "frontend/upload" ]; then
  echo "Creating frontend/upload directory..."
  mkdir -p frontend/upload
else
  echo "frontend/upload already exists."
fi

echo
echo "Setup finished."
echo "To run backend (unix):"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  uvicorn app.main:app --reload"
echo
echo "To run frontend (unix):"
echo "  cd frontend"
echo "  npm run dev"
echo
echo "Make script executable (once): chmod +x setup.sh"
```# filepath: c:\Git\marco-website\setup.sh
#!/usr/bin/env bash
set -euo pipefail

# Run from repo root (script location)
cd "$(dirname "$0")"

echo "================================"
echo "Project setup script (unix)"
echo "================================"

# --- Python / backend setup ---
echo
echo "Checking for Python..."
PYBIN=""
if command -v python3 >/dev/null 2>&1; then
  PYBIN=python3
elif command -v python >/dev/null 2>&1; then
  PYBIN=python
else
  echo "Python not found. Install Python 3.10+ and re-run this script."
  exit 1
fi
echo "Using: $($PYBIN --version 2>&1)"

# create venv if missing
if [ ! -x "backend/venv/bin/python" ]; then
  echo "Creating Python virtual environment in backend/venv..."
  "$PYBIN" -m venv backend/venv
else
  echo "Python virtual environment already exists."
fi

# activate venv for this script
# shellcheck source=/dev/null
source backend/venv/bin/activate

echo "Upgrading pip, setuptools, wheel..."
python -m pip install --upgrade pip setuptools wheel

if [ -f "backend/requirements.txt" ]; then
  echo "Installing backend requirements..."
  pip install -r backend/requirements.txt
fi

if [ -f "backend/app/requirements.txt" ]; then
  echo "Installing backend/app requirements..."
  pip install -r backend/app/requirements.txt
fi

if [ -f "dev-requirements.txt" ]; then
  echo "Installing dev-requirements..."
  pip install -r dev-requirements.txt
fi

# deactivate venv for remainder
deactivate || true

# --- Frontend / node setup ---
echo
echo "Checking for Node.js and npm..."
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found on PATH. Install Node.js (recommended LTS) and re-run this script."
else
  if [ -d "frontend" ]; then
    pushd frontend >/dev/null
    if [ -f package-lock.json ]; then
      echo "Using npm ci to install frontend dependencies..."
      npm ci
    else
      echo "Running npm install for frontend..."
      npm install
    fi
    popd >/dev/null
  else
    echo "frontend directory not found, skipping frontend install."
  fi
fi

# --- Ensure upload folder exists for frontend ---
echo
if [ ! -d "frontend/upload" ]; then
  echo "Creating frontend/upload directory..."
  mkdir -p frontend/upload
else
  echo "frontend/upload already exists."
fi

echo
echo "Setup finished."
echo "To run backend (unix):"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  uvicorn app.main:app --reload"
echo
echo "To run frontend (unix):"
echo "  cd frontend"
echo "  npm run dev"
echo
echo "Make script executable