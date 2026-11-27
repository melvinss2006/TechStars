@echo off
echo ========================================================
echo   Launching Habitat Layout Creator API (FastAPI)
echo   Team TechStars ^| Problem SW-4
echo ========================================================
cd /d "%~dp0backend"
python -m uvicorn main:app --reload --port 8000 --host 0.0.0.0
pause
