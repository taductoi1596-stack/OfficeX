@echo off
echo Đang gỡ cài đặt Workplace Word...
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { & 'C:\Users\taduc\.gemini\antigravity-ide\scratch\OfficeX\apps\desktop\scripts\install-app.ps1' -Action uninstall -AppId 'word' }"
echo Workplace Word đã được gỡ bỏ khỏi Windows.
