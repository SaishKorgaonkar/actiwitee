@echo off
setlocal
cd /d "%~dp0.."

set "R2_BUCKET=%ACTIWITEE_R2_BUCKET%"
if "%R2_BUCKET%"=="" set "R2_BUCKET=portfolio-images"
set "R2_KEY=%ACTIWITEE_R2_KEY%"
if "%R2_KEY%"=="" set "R2_KEY=actiwitee/activity.json"

node dist\cli.js collect
node dist\cli.js show > data\activity.json

where npx >nul 2>&1
if %ERRORLEVEL%==0 (
  cd deploy\worker
  npx wrangler r2 object put "%R2_BUCKET%/%R2_KEY%" --file "..\data\activity.json" --content-type application/json --remote
)
