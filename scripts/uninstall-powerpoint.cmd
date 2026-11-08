@echo off
echo Dang go cai dat Workplace PowerPoint...
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { & 'C:\Users\taduc\.gemini\antigravity-ide\scratch\OfficeX\scripts\install-app.ps1' -Action uninstall -AppId 'powerpoint' }"
echo Da go cai dat Workplace PowerPoint.
pause