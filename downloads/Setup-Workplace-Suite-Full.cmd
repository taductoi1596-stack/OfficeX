@echo off
title Cai dat Workplace Suite Hub
echo ========================================================
echo   TRINH CAI DAT UNG DUNG: Workplace Suite Hub
echo   He thong: Windows 10/11 x64
echo ========================================================
echo.
echo Dang tien hanh cai dat Workplace Suite Hub vao PC...
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { & 'C:\Users\taduc\.gemini\antigravity-ide\scratch\OfficeX\scripts\install-app.ps1' -Action install -AppId 'suite' }"
echo.
echo ========================================================
echo   CAI DAT HOAN TAT!
echo   Workplace Suite Hub da san sang su dung va hien trong Control Panel.
echo ========================================================
echo Nhan phim bat ky de thoat...
pause >nul