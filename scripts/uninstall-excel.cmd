@echo off
echo Dang go cai dat Workplace Excel...
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { & 'C:\Users\taduc\.gemini\antigravity-ide\scratch\OfficeX\scripts\install-app.ps1' -Action uninstall -AppId 'excel' }"
echo Da go cai dat Workplace Excel.
pause