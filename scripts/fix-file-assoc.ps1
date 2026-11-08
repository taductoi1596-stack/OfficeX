$wscript = "$env:SystemRoot\System32\wscript.exe"
$binDir = 'C:\Users\taduc\.gemini\antigravity-ide\scratch\OfficeX\bin'

$apps = @(
    @{ VbsFile = 'Workplace-Word.vbs';        ProgId = 'Workplace.Word.Document' },
    @{ VbsFile = 'Workplace-Excel.vbs';       ProgId = 'Workplace.Excel.Sheet' },
    @{ VbsFile = 'Workplace-PowerPoint.vbs';  ProgId = 'Workplace.PowerPoint.Presentation' }
)

foreach ($app in $apps) {
    $vbs = Join-Path $binDir $app.VbsFile
    $progId = $app.ProgId
    # Full quoted command: "C:\WINDOWS\System32\wscript.exe" "C:\path\to.vbs" "%1"
    $cmd = '"' + $wscript + '" "' + $vbs + '" "%1"'
    $regPath = "HKCU:\Software\Classes\$progId\shell\open\command"
    if (-not (Test-Path $regPath)) { New-Item -Path $regPath -Force | Out-Null }
    Set-ItemProperty -Path $regPath -Name '(default)' -Value $cmd -Type String
    Write-Host "[OK] $progId" -ForegroundColor Green
    Write-Host "     -> $cmd" -ForegroundColor DarkGray
}

# Refresh Windows Shell
$code = @"
using System;
using System.Runtime.InteropServices;
public class ShellNotify {
    [DllImport("shell32.dll")]
    public static extern void SHChangeNotify(int wEventId, int uFlags, IntPtr dwItem1, IntPtr dwItem2);
}
"@
Add-Type -TypeDefinition $code -ErrorAction SilentlyContinue
[ShellNotify]::SHChangeNotify(0x08000000, 0x0000, [IntPtr]::Zero, [IntPtr]::Zero)
Write-Host "`n[OK] Shell refreshed - file associations updated!" -ForegroundColor Cyan
