@echo off
echo Đang gỡ cài đặt Workplace Excel...
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { & 'C:\Users\taduc\.gemini\antigravity-ide\scratch\OfficeX\apps\desktop\scripts\install-app.ps1' -Action uninstall -AppId 'excel' }"
echo Workplace Excel đã được gỡ bỏ khỏi Windows.
