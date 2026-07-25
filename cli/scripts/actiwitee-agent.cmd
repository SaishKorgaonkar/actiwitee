@echo off
setlocal
cd /d "%~dp0.."
node dist\cli.js agent --once
