@echo off
title Cài đặt Workplace Excel
echo ========================================================
echo   TRÌNH CÀI ĐẶT ĐỘC LẬP: Workplace Excel
echo   Nhà phát hành: Workplace Suite Inc. (v1.0.0)
echo ========================================================
echo.
echo Dang tien hanh cai dat vao Windows va Control Panel...
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { & 'C:\Users\taduc\.gemini\antigravity-ide\scratch\OfficeX\apps\desktop\scripts\install-app.ps1' -Action install -AppId 'excel' }"
echo.
echo ========================================================
echo   HOAN TAT CAI DAT Workplace Excel!
echo   Ung dung da duoc dang ky vao Windows Control Panel.
echo ========================================================
pause
