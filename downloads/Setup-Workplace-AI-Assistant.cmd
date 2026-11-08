@echo off
title Cai dat Workplace AI Assistant
echo ========================================================
echo   TRINH CAI DAT UNG DUNG: Workplace AI Assistant
echo   He thong: Windows 10/11 x64
echo ========================================================
echo.
echo Dang tien hanh cai dat Workplace AI Assistant vao PC...
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { & 'C:\Users\taduc\.gemini\antigravity-ide\scratch\OfficeX\scripts\install-app.ps1' -Action install -AppId 'ai' }"
echo.
echo ========================================================
echo   CAI DAT HOAN TAT!
echo   Workplace AI Assistant da san sang su dung va hien trong Control Panel.
echo ========================================================
echo Nhan phim bat ky de thoat...
pause >nul