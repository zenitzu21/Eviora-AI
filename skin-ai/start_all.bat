@echo off
echo Starting Backend Server on port 8001...
start cmd /k "cd backend && .\venv\Scripts\python -m uvicorn app.main:app --reload --port 8001"

echo Starting Frontend Server...
start cmd /k "cd frontend && npm run dev"

echo All services are starting up in new windows.
pause
