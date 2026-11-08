@echo off
echo Đang gỡ cài đặt Workplace AI Assistant...
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { & 'C:\Users\taduc\.gemini\antigravity-ide\scratch\OfficeX\apps\desktop\scripts\install-app.ps1' -Action uninstall -AppId 'ai' }"
echo Workplace AI Assistant đã được gỡ bỏ khỏi Windows.
