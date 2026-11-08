@echo off
setlocal
cd /d "C:\Users\taduc\.gemini\antigravity-ide\scratch\OfficeX\apps\desktop"
if "%~1"=="" (
    start "" pnpm start -- --app=word
) else (
    start "" pnpm start -- --app=word "%~1"
)
