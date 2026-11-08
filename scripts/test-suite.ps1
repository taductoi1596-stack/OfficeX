Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  WORKPLACE SUITE - KIEM TRA TOAN DIEN    " -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan

$pass = 0
$fail = 0

function Test($name, $result, $expected = $true) {
    if ($result -eq $expected) {
        Write-Host "  [PASS] $name" -ForegroundColor Green
        $script:pass++
    } else {
        Write-Host "  [FAIL] $name" -ForegroundColor Red
        $script:fail++
    }
}

$BinDir = "C:\Users\taduc\.gemini\antigravity-ide\scratch\OfficeX\bin"
$ScriptsDir = "C:\Users\taduc\.gemini\antigravity-ide\scratch\OfficeX\scripts"

Write-Host ""
Write-Host "-- [1] KIEM TRA SAU KHI CAI DAT --" -ForegroundColor Yellow

# VBS launchers exist
Test "Workplace-Word.vbs ton tai"        (Test-Path "$BinDir\Workplace-Word.vbs")
Test "Workplace-Excel.vbs ton tai"       (Test-Path "$BinDir\Workplace-Excel.vbs")
Test "Workplace-PowerPoint.vbs ton tai"  (Test-Path "$BinDir\Workplace-PowerPoint.vbs")
Test "Workplace-AI.vbs ton tai"          (Test-Path "$BinDir\Workplace-AI.vbs")

# Desktop shortcuts exist on OneDrive Desktop
$desk = "C:\Users\taduc\OneDrive\Desktop"
Test "Shortcut Desktop: Word"        (Test-Path "$desk\Workplace Word.lnk")
Test "Shortcut Desktop: Excel"       (Test-Path "$desk\Workplace Excel.lnk")
Test "Shortcut Desktop: PowerPoint"  (Test-Path "$desk\Workplace PowerPoint.lnk")
Test "Shortcut Desktop: AI"          (Test-Path "$desk\Workplace AI Assistant.lnk")

# Start Menu shortcuts
$smDir = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Workplace Suite"
Test "Start Menu: Word"        (Test-Path "$smDir\Workplace Word.lnk")
Test "Start Menu: Excel"       (Test-Path "$smDir\Workplace Excel.lnk")
Test "Start Menu: PowerPoint"  (Test-Path "$smDir\Workplace PowerPoint.lnk")
Test "Start Menu: AI"          (Test-Path "$smDir\Workplace AI Assistant.lnk")

# Control Panel Registry
Test "Control Panel: Word"        ((Get-Item "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\Workplace_Word" -ErrorAction SilentlyContinue) -ne $null)
Test "Control Panel: Excel"       ((Get-Item "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\Workplace_Excel" -ErrorAction SilentlyContinue) -ne $null)
Test "Control Panel: PowerPoint"  ((Get-Item "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\Workplace_PowerPoint" -ErrorAction SilentlyContinue) -ne $null)
Test "Control Panel: AI"          ((Get-Item "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\Workplace_AI" -ErrorAction SilentlyContinue) -ne $null)

# File associations use wscript.exe + VBS (no black screen)
$wscript = "$env:SystemRoot\System32\wscript.exe"
$wordOpenCmd = (Get-ItemProperty "HKCU:\Software\Classes\Workplace.Word.Document\shell\open\command" -ErrorAction SilentlyContinue).'(default)'
$excelOpenCmd = (Get-ItemProperty "HKCU:\Software\Classes\Workplace.Excel.Sheet\shell\open\command" -ErrorAction SilentlyContinue).'(default)'
$pptOpenCmd = (Get-ItemProperty "HKCU:\Software\Classes\Workplace.PowerPoint.Presentation\shell\open\command" -ErrorAction SilentlyContinue).'(default)'

Test "File assoc DOCX -> wscript + VBS"  ($wordOpenCmd -like "*wscript.exe*" -and $wordOpenCmd -like "*Workplace-Word.vbs*")
Test "File assoc XLSX -> wscript + VBS"  ($excelOpenCmd -like "*wscript.exe*" -and $excelOpenCmd -like "*Workplace-Excel.vbs*")
Test "File assoc PPTX -> wscript + VBS"  ($pptOpenCmd -like "*wscript.exe*" -and $pptOpenCmd -like "*Workplace-PowerPoint.vbs*")

Write-Host ""
Write-Host "-- [2] KIEM TRA GO CAI DAT --" -ForegroundColor Yellow

# Uninstall Word as test
& powershell -NoProfile -ExecutionPolicy Bypass -File "$ScriptsDir\install-app.ps1" -Action uninstall -AppId word | Out-Null

Test "Sau go: Desktop Word da xoa"       (-not (Test-Path "$desk\Workplace Word.lnk"))
Test "Sau go: Start Menu Word da xoa"    (-not (Test-Path "$smDir\Workplace Word.lnk"))
Test "Sau go: Registry Word da xoa"      ((Get-Item "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\Workplace_Word" -ErrorAction SilentlyContinue) -eq $null)

# Reinstall Word
& powershell -NoProfile -ExecutionPolicy Bypass -File "$ScriptsDir\install-app.ps1" -Action install -AppId word | Out-Null
& powershell -NoProfile -ExecutionPolicy Bypass -File "$ScriptsDir\fix-file-assoc.ps1" | Out-Null

Test "Sau cai lai: Desktop Word co lai"       (Test-Path "$desk\Workplace Word.lnk")
Test "Sau cai lai: Start Menu Word co lai"    (Test-Path "$smDir\Workplace Word.lnk")
Test "Sau cai lai: Registry Word co lai"      ((Get-Item "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\Workplace_Word" -ErrorAction SilentlyContinue) -ne $null)

Write-Host ""
Write-Host "-- [3] KIEM TRA ELECTRON EXE --" -ForegroundColor Yellow
$electronExe = "C:\Users\taduc\.gemini\antigravity-ide\scratch\OfficeX\apps\desktop\node_modules\electron\dist\electron.exe"
Test "electron.exe ton tai"  (Test-Path $electronExe)

# VBS files trỏ đúng đến electron.exe
$wordVbs = Get-Content "$BinDir\Workplace-Word.vbs" -Raw
Test "Word VBS trỏ đến electron.exe"  ($wordVbs -like "*electron.exe*")
Test "Word VBS chạy với --app=word"   ($wordVbs -like "*--app=word*")

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
$total = $pass + $fail
Write-Host "  KET QUA: $pass/$total TESTS PASS" -ForegroundColor $(if ($fail -eq 0) { "Green" } else { "Yellow" })
if ($fail -gt 0) {
    Write-Host "  CO $fail LỖI CAN XU LY!" -ForegroundColor Red
} else {
    Write-Host "  TAT CA HOAN HAO!" -ForegroundColor Green
}
Write-Host "============================================" -ForegroundColor Cyan
