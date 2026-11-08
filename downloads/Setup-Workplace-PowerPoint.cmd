@echo off
title Cai dat Workplace PowerPoint
echo ========================================================
echo   TRINH CAI DAT UNG DUNG: Workplace PowerPoint
echo   He thong: Windows 10/11 x64
echo ========================================================
echo.
echo Dang tien hanh cai dat Workplace PowerPoint vao PC...
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { & 'C:\Users\taduc\.gemini\antigravity-ide\scratch\OfficeX\scripts\install-app.ps1' -Action install -AppId 'powerpoint' }"
echo.
echo ========================================================
echo   CAI DAT HOAN TAT!
echo   Workplace PowerPoint da san sang su dung va hien trong Control Panel.
echo ========================================================
echo Nhan phim bat ky de thoat...
pause >nul