# Trình cài đặt PowerShell cho Workplace AI Assistant
$Workspace = "C:\Users\taduc\.gemini\antigravity-ide\scratch\OfficeX\apps\desktop"
$ScriptPath = Join-Path $Workspace "scripts\install-app.ps1"
Write-Host "Dang cai dat Workplace AI Assistant..." -ForegroundColor Cyan
& $ScriptPath -Action install -AppId "ai"
Write-Host "Cai dat thanh cong Workplace AI Assistant vao Windows Control Panel!" -ForegroundColor Green
