#!/bin/bash

echo "Starting the project..."

# Start the backend server
cd backend || exit
echo "Starting backend server..."
source venv/bin/activate
uvicorn main:app --host 127.0.0.1 --port 9090 --reload &
cd ..

# Start the frontend server
cd frontend || exit
echo "Starting frontend server..."
npm run dev &
cd ..

echo "Both servers are running!"