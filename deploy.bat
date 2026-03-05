@echo off
chcp 65001 >nul
echo ==========================================
echo   WW3 Tracker - Deployment Script
echo ==========================================
echo.

cd /d "%~dp0"

echo [1/4] Checking Railway CLI...
railway --version >nul 2>&1
if errorlevel 1 (
    echo Installing Railway CLI...
    npm install -g @railway/cli
)

echo.
echo [2/4] Logging in to Railway...
echo (A browser window will open - please login)
railway login

echo.
echo [3/4] Linking project...
railway link

echo.
echo [4/4] Deploying...
railway up

echo.
echo ==========================================
echo   Deployment Complete!
echo ==========================================
echo.
pause
