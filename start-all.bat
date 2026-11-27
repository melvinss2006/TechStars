@echo off
echo ========================================================
echo   Launching Habitat Layout Creator (TechStars SW-4)
echo ========================================================
start "Habitat API (FastAPI)" cmd /k "%~dp0start-backend.bat"
start "Habitat UI (React+Vite)" cmd /k "%~dp0start-frontend.bat"
echo Both servers initiated!
echo Frontend will be at: http://localhost:5173
echo Backend API docs at: http://localhost:8000/docs
