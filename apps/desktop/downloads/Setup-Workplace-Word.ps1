# Trình cài đặt PowerShell cho Workplace Word
$Workspace = "C:\Users\taduc\.gemini\antigravity-ide\scratch\OfficeX\apps\desktop"
$ScriptPath = Join-Path $Workspace "scripts\install-app.ps1"
Write-Host "Dang cai dat Workplace Word..." -ForegroundColor Cyan
& $ScriptPath -Action install -AppId "word"
Write-Host "Cai dat thanh cong Workplace Word vao Windows Control Panel!" -ForegroundColor Green
