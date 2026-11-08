@echo off
echo Đang gỡ cài đặt Workplace PowerPoint...
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { & 'C:\Users\taduc\.gemini\antigravity-ide\scratch\OfficeX\apps\desktop\scripts\install-app.ps1' -Action uninstall -AppId 'powerpoint' }"
echo Workplace PowerPoint đã được gỡ bỏ khỏi Windows.
