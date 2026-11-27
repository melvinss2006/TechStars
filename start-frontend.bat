@echo off
echo ========================================================
echo   Launching Habitat Layout Creator (Frontend)
echo   Team TechStars ^| Problem SW-4
echo ========================================================
cd /d "%~dp0frontend"
npm run dev -- --host
pause
