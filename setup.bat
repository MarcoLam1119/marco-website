:: filepath: c:\Git\新增資料夾\marco-website\setup.bat
@echo off
echo Setting up the project...

:: Navigate to backend and set up Python environment
cd backend
echo Setting up backend...
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
deactivate
cd ..

:: Navigate to frontend and install Node.js dependencies
cd frontend
echo Setting up frontend...
npm install
cd ..

echo Setup complete!
pause