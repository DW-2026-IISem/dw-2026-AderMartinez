@echo off
chcp 65001 >nul
title Iniciar ParqueoAgil
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\iniciar.ps1"
echo.
pause
