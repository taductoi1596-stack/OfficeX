$bytes = [System.IO.File]::ReadAllBytes('.\bin\Workplace-Word.vbs')
$first3 = $bytes[0..2]
Write-Host "First 3 bytes: $($first3[0]) $($first3[1]) $($first3[2])"
if ($first3[0] -eq 0xEF -and $first3[1] -eq 0xBB -and $first3[2] -eq 0xBF) {
    Write-Host "WARNING: BOM detected (UTF-8 with BOM)!" -ForegroundColor Red
} else {
    Write-Host "OK: No BOM detected (ASCII/ANSI)" -ForegroundColor Green
}
Write-Host "--- Content ---"
Get-Content '.\bin\Workplace-Word.vbs'
