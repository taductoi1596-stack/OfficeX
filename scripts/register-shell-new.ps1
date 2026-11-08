param(
    [string]$Action = "register"  # register | unregister
)

$WorkspaceRoot = Split-Path -Parent $PSScriptRoot
if (-not $WorkspaceRoot) {
    $WorkspaceRoot = (Get-Item -Path ".").FullName
}

$IconDir     = Join-Path $WorkspaceRoot "resources\icons"
$TemplateDir = Join-Path $WorkspaceRoot "resources\templates"
$BinDir      = Join-Path $WorkspaceRoot "bin"

$Apps = @(
    @{
        Ext          = ".docx"
        ProgId       = "Workplace.Word.Document"
        DisplayName  = "Workplace Word Document"
        MenuText     = "Workplace Word Document (.docx)"
        ExeName      = "Workplace-Word"
        CliArg       = "--app=word"
        Icon         = Join-Path $IconDir "word.ico"
        Template     = Join-Path $TemplateDir "Workplace Word Document.docx"
    },
    @{
        Ext          = ".xlsx"
        ProgId       = "Workplace.Excel.Sheet"
        DisplayName  = "Workplace Excel Spreadsheet"
        MenuText     = "Workplace Excel Spreadsheet (.xlsx)"
        ExeName      = "Workplace-Excel"
        CliArg       = "--app=excel"
        Icon         = Join-Path $IconDir "excel.ico"
        Template     = Join-Path $TemplateDir "Workplace Excel Spreadsheet.xlsx"
    },
    @{
        Ext          = ".pptx"
        ProgId       = "Workplace.PowerPoint.Presentation"
        DisplayName  = "Workplace PowerPoint Presentation"
        MenuText     = "Workplace PowerPoint Presentation (.pptx)"
        ExeName      = "Workplace-PowerPoint"
        CliArg       = "--app=powerpoint"
        Icon         = Join-Path $IconDir "powerpoint.ico"
        Template     = Join-Path $TemplateDir "Workplace PowerPoint Presentation.pptx"
    }
)

if ($Action -eq "register") {
    Write-Host "=====================================================" -ForegroundColor Cyan
    Write-Host "  Dang ky Workplace vao menu Chuot Phai > New...     " -ForegroundColor Yellow
    Write-Host "=====================================================" -ForegroundColor Cyan

    foreach ($App in $Apps) {
        $Ext      = $App.Ext
        $ProgId   = $App.ProgId
        $MenuText = $App.MenuText
        $Icon     = $App.Icon
        $Template = $App.Template
        $VbsLauncher = Join-Path $BinDir "$($App.ExeName).vbs"
        $OpenCmd = '"' + "$env:SystemRoot\System32\wscript.exe" + '" "' + $VbsLauncher + '" "%1"'

        # 1. Dang ky ProgId neu chua co
        $ProgIdKey = "HKCU:\Software\Classes\$ProgId"
        if (-not (Test-Path $ProgIdKey)) {
            New-Item -Path $ProgIdKey -Force | Out-Null
        }
        Set-ItemProperty -Path $ProgIdKey -Name "(default)" -Value $App.DisplayName

        # DefaultIcon
        $IconKey = "$ProgIdKey\DefaultIcon"
        if (-not (Test-Path $IconKey)) { New-Item -Path $IconKey -Force | Out-Null }
        Set-ItemProperty -Path $IconKey -Name "(default)" -Value "$Icon,0"

        # Shell Open Command (0% black console screen)
        $CmdKey = "$ProgIdKey\shell\open\command"
        if (-not (Test-Path $CmdKey)) { New-Item -Path $CmdKey -Force | Out-Null }
        Set-ItemProperty -Path $CmdKey -Name "(default)" -Value $OpenCmd

        # 2. Map Extension -> ProgId
        $ExtKey = "HKCU:\Software\Classes\$Ext"
        if (-not (Test-Path $ExtKey)) { New-Item -Path $ExtKey -Force | Out-Null }
        Set-ItemProperty -Path $ExtKey -Name "(default)" -Value $ProgId

        # 3. Dang ky Shell\New -> hien trong menu chuot phai New
        $NewKey = "HKCU:\Software\Classes\$Ext\ShellNew"
        if (-not (Test-Path $NewKey)) { New-Item -Path $NewKey -Force | Out-Null }

        # NullFile = tao file rong; hoac FileName = dung template co san
        if (Test-Path $Template) {
            Set-ItemProperty -Path $NewKey -Name "FileName" -Value $Template
        } else {
            # Fallback: tao file rong
            if (Get-ItemProperty -Path $NewKey -Name "FileName" -ErrorAction SilentlyContinue) {
                Remove-ItemProperty -Path $NewKey -Name "FileName" -ErrorAction SilentlyContinue
            }
            Set-ItemProperty -Path $NewKey -Name "NullFile" -Value ""
        }

        # 4. Dat ten hien thi trong menu New voi icon tuong ung
        # Windows lay ten tu ProgId's default value va icon tu DefaultIcon
        # Them vao danh sach New Items Order (tuy chon)
        $OrderKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Discardable\PostSetup\ShellNew"
        if (Test-Path $OrderKey) {
            $CurrentClasses = (Get-ItemProperty -Path $OrderKey -Name "Classes" -ErrorAction SilentlyContinue).Classes
            if ($CurrentClasses -and ($CurrentClasses -notcontains $Ext)) {
                Set-ItemProperty -Path $OrderKey -Name "Classes" -Value ($CurrentClasses + $Ext)
            }
        }

        Write-Host "[OK] $MenuText da duoc them vao menu New!" -ForegroundColor Green
    }

    # Refresh Shell de cap nhat menu
    Write-Host ""
    Write-Host "Dang lam moi Windows Shell..." -ForegroundColor Cyan
    $code = @"
using System;
using System.Runtime.InteropServices;
public class NativeMethods {
    [DllImport("shell32.dll")]
    public static extern void SHChangeNotify(int wEventId, int uFlags, IntPtr dwItem1, IntPtr dwItem2);
}
"@
    Add-Type -TypeDefinition $code
    [NativeMethods]::SHChangeNotify(0x08000000, 0x0000, [IntPtr]::Zero, [IntPtr]::Zero)

    Write-Host ""
    Write-Host "=====================================================" -ForegroundColor Green
    Write-Host " XONG! Kiem tra bang cach chuot phai -> New tren Desktop" -ForegroundColor Green
    Write-Host " (Co the can dong/mo lai File Explorer de cap nhat)   " -ForegroundColor Yellow
    Write-Host "=====================================================" -ForegroundColor Green

} elseif ($Action -eq "unregister") {
    Write-Host "Dang go dang ky khoi menu New..." -ForegroundColor Yellow

    foreach ($App in $Apps) {
        $Ext    = $App.Ext
        $NewKey = "HKCU:\Software\Classes\$Ext\ShellNew"
        if (Test-Path $NewKey) {
            Remove-Item -Path $NewKey -Recurse -Force | Out-Null
            Write-Host "[OK] Da xoa: $($App.MenuText)" -ForegroundColor Green
        }
    }

    # Refresh Shell
    $code = @"
using System;
using System.Runtime.InteropServices;
public class NativeMethods2 {
    [DllImport("shell32.dll")]
    public static extern void SHChangeNotify(int wEventId, int uFlags, IntPtr dwItem1, IntPtr dwItem2);
}
"@
    Add-Type -TypeDefinition $code
    [NativeMethods2]::SHChangeNotify(0x08000000, 0x0000, [IntPtr]::Zero, [IntPtr]::Zero)

    Write-Host "Da go dang ky khoi menu chuot phai New!" -ForegroundColor Green
}
