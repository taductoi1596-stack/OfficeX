$w = New-Object -ComObject WScript.Shell
$desktop = [System.Environment]::GetFolderPath("Desktop")
@('Workplace Word', 'Workplace Excel', 'Workplace PowerPoint', 'Workplace AI Assistant') | ForEach-Object {
    $lnkPath = Join-Path $desktop "$_.lnk"
    if (Test-Path $lnkPath) {
        $s = $w.CreateShortcut($lnkPath)
        Write-Host "=== $_ ===" -ForegroundColor Cyan
        Write-Host "Target: $($s.TargetPath)"
        Write-Host "Args:   $($s.Arguments)"
        Write-Host "Icon:   $($s.IconLocation)"
        Write-Host "File Exists: $(Test-Path $($s.Arguments.Trim('""')))"
    } else {
        Write-Host "NOT FOUND: $lnkPath" -ForegroundColor Red
    }
}
