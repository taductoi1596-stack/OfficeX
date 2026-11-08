# Trình cài đặt PowerShell cho Workplace PowerPoint
$Workspace = "C:\Users\taduc\.gemini\antigravity-ide\scratch\OfficeX\apps\desktop"
$ScriptPath = Join-Path $Workspace "scripts\install-app.ps1"
Write-Host "Dang cai dat Workplace PowerPoint..." -ForegroundColor Cyan
& $ScriptPath -Action install -AppId "powerpoint"
Write-Host "Cai dat thanh cong Workplace PowerPoint vao Windows Control Panel!" -ForegroundColor Green
