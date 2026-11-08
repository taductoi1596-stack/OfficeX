@echo off
echo Dang go cai dat Workplace Word...
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { & 'C:\Users\taduc\.gemini\antigravity-ide\scratch\OfficeX\scripts\install-app.ps1' -Action uninstall -AppId 'word' }"
echo Da go cai dat Workplace Word.
pause