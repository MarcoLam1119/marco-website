#!/bin/bash

echo "Setting up the project..."

# Navigate to backend and set up Python environment
cd backend || exit
echo "Setting up backend..."
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate
cd ..

# Navigate to frontend and install Node.js dependencies
cd frontend || exit
echo "Setting up frontend..."
npm install
cd ..

echo "Setup complete!"