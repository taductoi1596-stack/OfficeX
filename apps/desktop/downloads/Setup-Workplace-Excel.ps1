# Trình cài đặt PowerShell cho Workplace Excel
$Workspace = "C:\Users\taduc\.gemini\antigravity-ide\scratch\OfficeX\apps\desktop"
$ScriptPath = Join-Path $Workspace "scripts\install-app.ps1"
Write-Host "Dang cai dat Workplace Excel..." -ForegroundColor Cyan
& $ScriptPath -Action install -AppId "excel"
Write-Host "Cai dat thanh cong Workplace Excel vao Windows Control Panel!" -ForegroundColor Green
