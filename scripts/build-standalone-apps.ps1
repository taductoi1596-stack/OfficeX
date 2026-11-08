$WorkspaceRoot = Split-Path -Parent $PSScriptRoot
if (-not $WorkspaceRoot) {
    $WorkspaceRoot = (Get-Item -Path ".").FullName
}

$DownloadsDir = Join-Path $WorkspaceRoot "downloads"
if (-not (Test-Path $DownloadsDir)) {
    New-Item -ItemType Directory -Path $DownloadsDir -Force | Out-Null
}

$Apps = @("word", "excel", "powerpoint", "ai", "suite")

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  DANG TAO GOI TRINH CAI DAT STANDALONE CHO TUNG APP      " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

foreach ($App in $Apps) {
    $InstallScript = Join-Path $WorkspaceRoot "scripts\install-app.ps1"
    $ExeName = switch ($App) {
        "word" { "Workplace-Word" }
        "excel" { "Workplace-Excel" }
        "powerpoint" { "Workplace-PowerPoint" }
        "ai" { "Workplace-AI-Assistant" }
        "suite" { "Workplace-Suite-Full" }
    }
    $DisplayName = switch ($App) {
        "word" { "Workplace Word" }
        "excel" { "Workplace Excel" }
        "powerpoint" { "Workplace PowerPoint" }
        "ai" { "Workplace AI Assistant" }
        "suite" { "Workplace Suite Hub" }
    }

    $BatPath = Join-Path $DownloadsDir "Setup-$ExeName.cmd"
    $BatContent = @"
@echo off
title Cai dat $DisplayName
echo ========================================================
echo   TRINH CAI DAT UNG DUNG: $DisplayName
echo   He thong: Windows 10/11 x64
echo ========================================================
echo.
echo Dang tien hanh cai dat $DisplayName vao PC...
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { & '$InstallScript' -Action install -AppId '$App' }"
echo.
echo ========================================================
echo   CAI DAT HOAN TAT!
echo   $DisplayName da san sang su dung va hien trong Control Panel.
echo ========================================================
echo Nhan phim bat ky de thoat...
pause >nul
"@

    [System.IO.File]::WriteAllText($BatPath, $BatContent)
    Write-Host "[OK] Da tao trinh cai dat: $BatPath" -ForegroundColor Green
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  TAT CA GOI CAI DAT DA DUOC TAO TRONG: downloads/         " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
