@echo off
echo Starting the project...

:: Start the backend server
cd backend
echo Starting backend server...
start cmd /k "call venv\Scripts\activate && uvicorn main:app --host 0.0.0.0 --port 9090 --reload"

:: Start the frontend server
cd ../frontend
echo Starting frontend server...
start cmd /k "npm run dev"

echo Both servers are running!
pause