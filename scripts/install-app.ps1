param(
    [string]$Action = "install",
    [string]$AppId = "word"
)

$WorkspaceRoot = Split-Path -Parent $PSScriptRoot
if (-not $WorkspaceRoot) {
    $WorkspaceRoot = (Get-Item -Path ".").FullName
}

$BinDir = Join-Path $WorkspaceRoot "bin"
if (-not (Test-Path $BinDir)) { 
    New-Item -ItemType Directory -Path $BinDir -Force | Out-Null 
}

$StartMenuDir = Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs\Workplace Suite"
if (-not (Test-Path $StartMenuDir)) { 
    New-Item -ItemType Directory -Path $StartMenuDir -Force | Out-Null 
}

# Define Application Metadata
switch ($AppId.ToLower()) {
    "word" {
        $DisplayName = "Workplace Word"
        $RegKey = "Workplace_Word"
        $Version = "1.0.0"
        $Publisher = "Workplace Suite Inc."
        $Description = "Soan thao van ban, bao cao va de an chuyen nghiep (.docx, .doc)"
        $Extensions = @(".docx", ".doc", ".dotx")
        $ProgId = "Workplace.Word.Document"
        $CliArg = "--app=word"
        $SizeKb = 135000
        $ExeName = "Workplace-Word"
    }
    "excel" {
        $DisplayName = "Workplace Excel"
        $RegKey = "Workplace_Excel"
        $Version = "1.0.0"
        $Publisher = "Workplace Suite Inc."
        $Description = "Bang tinh thong minh, cong thuc tu dong va bieu do du lieu (.xlsx, .xls, .csv)"
        $Extensions = @(".xlsx", ".xls", ".csv", ".xltx")
        $ProgId = "Workplace.Excel.Sheet"
        $CliArg = "--app=excel"
        $SizeKb = 148000
        $ExeName = "Workplace-Excel"
    }
    "powerpoint" {
        $DisplayName = "Workplace PowerPoint"
        $RegKey = "Workplace_PowerPoint"
        $Version = "1.0.0"
        $Publisher = "Workplace Suite Inc."
        $Description = "Thiet ke slide trinh chieu, hieu ung va AI Generator (.pptx, .ppt)"
        $Extensions = @(".pptx", ".ppt", ".potx")
        $ProgId = "Workplace.PowerPoint.Presentation"
        $CliArg = "--app=powerpoint"
        $SizeKb = 142000
        $ExeName = "Workplace-PowerPoint"
    }
    "ai" {
        $DisplayName = "Workplace AI Assistant"
        $RegKey = "Workplace_AI"
        $Version = "1.0.0"
        $Publisher = "Workplace Suite Inc."
        $Description = "Tro ly AI sang tao, phan tich tai lieu va viet noi dung"
        $Extensions = @()
        $ProgId = "Workplace.AI.Bot"
        $CliArg = "--app=ai"
        $SizeKb = 98000
        $ExeName = "Workplace-AI"
    }
    "suite" {
        $DisplayName = "Workplace Suite Hub"
        $RegKey = "Workplace_Suite"
        $Version = "1.0.0"
        $Publisher = "Workplace Suite Inc."
        $Description = "Bo ung dung van phong Workplace tron bo"
        $Extensions = @()
        $ProgId = "Workplace.Suite.Hub"
        $CliArg = ""
        $SizeKb = 523000
        $ExeName = "Workplace-Suite"
    }
    Default {
        Write-Host "Khong tim thay ung dung voi ID: $AppId" -ForegroundColor Red
        exit 1
    }
}

$DesktopPath = Join-Path ([System.Environment]::GetFolderPath("Desktop")) "$DisplayName.lnk"
$StartMenuPath = Join-Path $StartMenuDir "$DisplayName.lnk"
$LauncherCmd = Join-Path $BinDir "$ExeName.cmd"
$UninstallerCmd = Join-Path $WorkspaceRoot "scripts\uninstall-$AppId.cmd"

if ($Action -eq "install") {
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host " Dang cai dat $DisplayName vao Windows & Control Panel...  " -ForegroundColor Yellow
    Write-Host "==========================================================" -ForegroundColor Cyan

    # 1. Tao VBS launcher (khong hien console den)
    # 1. Tim electron executable / packaged exe
    $PackagedExeCandidates = @(
        (Join-Path (Split-Path -Parent $WorkspaceRoot) "Workplace Launcher.exe"),
        (Join-Path (Split-Path -Parent $WorkspaceRoot) "OfficeX.exe"),
        (Join-Path $WorkspaceRoot "Workplace Launcher.exe"),
        (Join-Path $WorkspaceRoot "OfficeX.exe")
    )
    $PackagedExe = $null
    foreach ($cand in $PackagedExeCandidates) {
        if (Test-Path $cand) {
            $PackagedExe = $cand
            break
        }
    }

    $VbsLauncher = Join-Path $BinDir "$ExeName.vbs"

    if ($PackagedExe) {
        $ElectronExe = $PackagedExe
        $AppEntry = ""
        $ShortcutArgs = "$CliArg"

        $VbsContent  = "Dim wsRoot" + "`r`n"
        $VbsContent += 'wsRoot = "' + $WorkspaceRoot + '"' + "`r`n"
        $VbsContent += 'Dim exePath' + "`r`n"
        $VbsContent += 'exePath = "' + $ElectronExe + '"' + "`r`n"
        $VbsContent += "Dim oShell" + "`r`n"
        $VbsContent += 'Set oShell = CreateObject("WScript.Shell")' + "`r`n"
        $VbsContent += "oShell.CurrentDirectory = wsRoot" + "`r`n"
        $VbsContent += "Dim cmd" + "`r`n"
        $VbsContent += "If WScript.Arguments.Count > 0 Then" + "`r`n"
        $VbsContent += '    cmd = Chr(34) & exePath & Chr(34) & " ' + $CliArg + ' " & Chr(34) & WScript.Arguments(0) & Chr(34)' + "`r`n"
        $VbsContent += "Else" + "`r`n"
        $VbsContent += '    cmd = Chr(34) & exePath & Chr(34) & " ' + $CliArg + '"' + "`r`n"
        $VbsContent += "End If" + "`r`n"
        $VbsContent += "oShell.Run cmd, 1, False" + "`r`n"
    } else {
        $ElectronExe = Join-Path $WorkspaceRoot "apps\desktop\node_modules\electron\dist\electron.exe"
        if (-not (Test-Path $ElectronExe)) {
            $ElectronExe = Join-Path $WorkspaceRoot "node_modules\electron\dist\electron.exe"
        }
        $AppEntry    = Join-Path $WorkspaceRoot "apps\desktop"
        $ShortcutArgs = "`"$AppEntry`" $CliArg"

        $VbsContent  = "Dim wsRoot" + "`r`n"
        $VbsContent += 'wsRoot = "' + $WorkspaceRoot + '"' + "`r`n"
        $VbsContent += 'Dim electronExe' + "`r`n"
        $VbsContent += 'electronExe = "' + $ElectronExe + '"' + "`r`n"
        $VbsContent += 'Dim appEntry' + "`r`n"
        $VbsContent += 'appEntry = "' + $AppEntry + '"' + "`r`n"
        $VbsContent += "Dim oShell" + "`r`n"
        $VbsContent += 'Set oShell = CreateObject("WScript.Shell")' + "`r`n"
        $VbsContent += "oShell.CurrentDirectory = wsRoot" + "`r`n"
        $VbsContent += "Dim cmd" + "`r`n"
        $VbsContent += "If WScript.Arguments.Count > 0 Then" + "`r`n"
        $VbsContent += '    cmd = Chr(34) & electronExe & Chr(34) & " " & Chr(34) & appEntry & Chr(34) & " ' + $CliArg + ' " & Chr(34) & WScript.Arguments(0) & Chr(34)' + "`r`n"
        $VbsContent += "Else" + "`r`n"
        $VbsContent += '    cmd = Chr(34) & electronExe & Chr(34) & " " & Chr(34) & appEntry & Chr(34) & " ' + $CliArg + '"' + "`r`n"
        $VbsContent += "End If" + "`r`n"
        $VbsContent += "oShell.Run cmd, 1, False" + "`r`n"
    }

    $asciiWriter = New-Object System.IO.StreamWriter($VbsLauncher, $false, [System.Text.Encoding]::ASCII)
    $asciiWriter.Write($VbsContent)
    $asciiWriter.Close()

    # Tao CMD launcher khong hien man den (goi wscript VBS roi thoat ngay)
    $CmdScript = "@echo off`r`nstart `"`" `"$env:SystemRoot\System32\wscript.exe`" `"$VbsLauncher`" %*`r`nexit"
    [System.IO.File]::WriteAllText($LauncherCmd, $CmdScript, [System.Text.Encoding]::ASCII)

    # 2. Tao uninstaller script
    $UninstScript = "@echo off`r`necho Dang go cai dat $DisplayName...`r`npowershell -NoProfile -ExecutionPolicy Bypass -Command `"& { & '$WorkspaceRoot\scripts\install-app.ps1' -Action uninstall -AppId '$AppId' }`"`r`necho Da go cai dat $DisplayName.`r`npause"
    [System.IO.File]::WriteAllText($UninstallerCmd, $UninstScript, [System.Text.Encoding]::ASCII)

    $IconPath = Join-Path $WorkspaceRoot "resources\icons\$AppId.ico"
    if (-not (Test-Path $IconPath)) {
        $IconPath = $ElectronExe
    }

    # 3. Tao Shortcuts tro truc tiep vao executable (chuan GUI native Windows, 0% man den, 100% toc do)
    $WshShell = New-Object -comObject WScript.Shell

    $PossibleDesktops = @(
        [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Desktop),
        "$env:USERPROFILE\Desktop",
        "$env:USERPROFILE\OneDrive\Desktop"
    ) | Select-Object -Unique

    foreach ($d in $PossibleDesktops) {
        if (Test-Path $d) {
            $p = Join-Path $d "$DisplayName.lnk"
            $Shortcut = $WshShell.CreateShortcut($p)
            $Shortcut.TargetPath       = $ElectronExe
            $Shortcut.Arguments        = $ShortcutArgs
            $Shortcut.WorkingDirectory = $WorkspaceRoot
            $Shortcut.Description      = $Description
            $Shortcut.IconLocation     = "$IconPath,0"
            $Shortcut.Save()
        }
    }

    $Shortcut2 = $WshShell.CreateShortcut($StartMenuPath)
    $Shortcut2.TargetPath       = $ElectronExe
    $Shortcut2.Arguments        = $ShortcutArgs
    $Shortcut2.WorkingDirectory = $WorkspaceRoot
    $Shortcut2.Description      = $Description
    $Shortcut2.IconLocation     = "$IconPath,0"
    $Shortcut2.Save()

    # 4. Dang ky File Associations truc tiep vao Windows Native Application (0% man den, 100% Native)
    foreach ($Ext in $Extensions) {
        $regBase = "HKCU:\Software\Classes"
        
        # Ext -> ProgId mapping
        if (-not (Test-Path "$regBase\$Ext")) { New-Item -Path "$regBase\$Ext" -Force | Out-Null }
        Set-ItemProperty -Path "$regBase\$Ext" -Name '(default)' -Value $ProgId -Type String
        
        # OpenWithProgids & OpenWithList
        if (-not (Test-Path "$regBase\$Ext\OpenWithProgids")) { New-Item -Path "$regBase\$Ext\OpenWithProgids" -Force | Out-Null }
        Set-ItemProperty -Path "$regBase\$Ext\OpenWithProgids" -Name $ProgId -Value "" -Type String
        
        if (-not (Test-Path "$regBase\$Ext\OpenWithList\Workplace Launcher.exe")) { New-Item -Path "$regBase\$Ext\OpenWithList\Workplace Launcher.exe" -Force | Out-Null }

        # ProgId Class Definition
        if (-not (Test-Path "$regBase\$ProgId")) { New-Item -Path "$regBase\$ProgId" -Force | Out-Null }
        Set-ItemProperty -Path "$regBase\$ProgId" -Name '(default)' -Value "$DisplayName Document" -Type String
        Set-ItemProperty -Path "$regBase\$ProgId" -Name 'FriendlyTypeName' -Value "$DisplayName Document" -Type String

        # Icon
        if (-not (Test-Path "$regBase\$ProgId\DefaultIcon")) { New-Item -Path "$regBase\$ProgId\DefaultIcon" -Force | Out-Null }
        Set-ItemProperty -Path "$regBase\$ProgId\DefaultIcon" -Name '(default)' -Value "$IconPath,0" -Type String

        # Shell Open Command (Direct Native GUI Execution — 0% black console, 100% visible GUI window)
        $OpenCmd = if ($PackagedExe) {
            '"' + $ElectronExe + '" ' + $CliArg + ' "%1"'
        } else {
            '"' + $ElectronExe + '" "' + $AppEntry + '" ' + $CliArg + ' "%1"'
        }


        cmd /c "reg add `"HKCU\Software\Classes\$ProgId\shell\open\command`" /ve /t REG_SZ /d `"$OpenCmd`" /f" | Out-Null
        
        $openShellPath = "$regBase\$ProgId\shell\open"
        Set-ItemProperty -Path $openShellPath -Name 'FriendlyAppName' -Value $DisplayName -Type String
    }

    # Register Application in Windows Shell
    $AppRegPath = "HKCU:\Software\Classes\Applications\Workplace Launcher.exe"
    if (-not (Test-Path $AppRegPath)) { New-Item -Path $AppRegPath -Force | Out-Null }
    Set-ItemProperty -Path $AppRegPath -Name 'FriendlyAppName' -Value 'Workplace Suite' -Type String
    if (-not (Test-Path "$AppRegPath\DefaultIcon")) { New-Item -Path "$AppRegPath\DefaultIcon" -Force | Out-Null }
    Set-ItemProperty -Path "$AppRegPath\DefaultIcon" -Name '(default)' -Value "$IconPath,0" -Type String
    if (-not (Test-Path "$AppRegPath\SupportedTypes")) { New-Item -Path "$AppRegPath\SupportedTypes" -Force | Out-Null }
    foreach ($Ext in $Extensions) {
        Set-ItemProperty -Path "$AppRegPath\SupportedTypes" -Name $Ext -Value "" -Type String
    }

    # Register Capabilities & RegisteredApplications
    $CapPath = "HKCU:\Software\Workplace Suite\Capabilities"
    if (-not (Test-Path "$CapPath\FileAssociations")) { New-Item -Path "$CapPath\FileAssociations" -Force | Out-Null }
    Set-ItemProperty -Path $CapPath -Name 'ApplicationName' -Value 'Workplace Suite' -Type String
    Set-ItemProperty -Path $CapPath -Name 'ApplicationDescription' -Value 'Workplace Suite Office' -Type String
    foreach ($Ext in $Extensions) {
        Set-ItemProperty -Path "$CapPath\FileAssociations" -Name $Ext -Value $ProgId -Type String
    }
    if (-not (Test-Path "HKCU:\Software\RegisteredApplications")) { New-Item -Path "HKCU:\Software\RegisteredApplications" -Force | Out-Null }
    Set-ItemProperty -Path "HKCU:\Software\RegisteredApplications" -Name 'Workplace Suite' -Value "Software\Workplace Suite\Capabilities" -Type String

    # 5. Dang ky vao Control Panel (HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall)
    $UninstallRegKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\$RegKey"
    if (-not (Test-Path $UninstallRegKey)) {
        New-Item -Path $UninstallRegKey -Force | Out-Null
    }

    $Today = (Get-Date).ToString("yyyyMMdd")

    Set-ItemProperty -Path $UninstallRegKey -Name "DisplayName" -Value $DisplayName
    Set-ItemProperty -Path $UninstallRegKey -Name "DisplayVersion" -Value $Version
    Set-ItemProperty -Path $UninstallRegKey -Name "Publisher" -Value $Publisher
    Set-ItemProperty -Path $UninstallRegKey -Name "InstallLocation" -Value $WorkspaceRoot
    Set-ItemProperty -Path $UninstallRegKey -Name "DisplayIcon" -Value "$IconPath,0"
    Set-ItemProperty -Path $UninstallRegKey -Name "UninstallString" -Value "`"$UninstallerCmd`""
    Set-ItemProperty -Path $UninstallRegKey -Name "QuietUninstallString" -Value "`"$UninstallerCmd`""
    Set-ItemProperty -Path $UninstallRegKey -Name "EstimatedSize" -Type DWord -Value $SizeKb
    Set-ItemProperty -Path $UninstallRegKey -Name "InstallDate" -Value $Today
    Set-ItemProperty -Path $UninstallRegKey -Name "Comments" -Value $Description
    Set-ItemProperty -Path $UninstallRegKey -Name "URLInfoAbout" -Value "https://officex.local"
    Set-ItemProperty -Path $UninstallRegKey -Name "NoModify" -Type DWord -Value 1
    Set-ItemProperty -Path $UninstallRegKey -Name "NoRepair" -Type DWord -Value 1

    Write-Host "[OK] Da cai dat $DisplayName voi icon chuan!" -ForegroundColor Green
    Write-Host "[OK] Da dang ky vao Windows Control Panel -> Programs and Features!" -ForegroundColor Green
    Write-Host "[OK] Da tao Desktop Shortcut tai: $DesktopPath" -ForegroundColor Green
    Write-Host "[OK] Da tao Start Menu Shortcut tai: $StartMenuPath" -ForegroundColor Green

    # 6. Dang ky menu chuot phai > New (Shell New)
    $ShellNewScript = Join-Path $WorkspaceRoot "scripts\register-shell-new.ps1"
    if (Test-Path $ShellNewScript) {
        & powershell -NoProfile -ExecutionPolicy Bypass -File "$ShellNewScript" -Action register
    }

} elseif ($Action -eq "uninstall") {
    Write-Host "Dang go cai dat $DisplayName khoi Windows..." -ForegroundColor Yellow

    # 1. Xoa Registry trong Control Panel
    $UninstallRegKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\$RegKey"
    if (Test-Path $UninstallRegKey) {
        Remove-Item -Path $UninstallRegKey -Recurse -Force | Out-Null
    }

    # 2. Xoa Shortcuts khoi tat ca vi tri Desktop va Start Menu
    $PossibleDesktops = @(
        [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Desktop),
        "$env:USERPROFILE\Desktop",
        "$env:USERPROFILE\OneDrive\Desktop",
        "$env:PUBLIC\Desktop"
    )
    foreach ($d in $PossibleDesktops) {
        $p = Join-Path $d "$DisplayName.lnk"
        if (Test-Path $p) { Remove-Item -Path $p -Force -ErrorAction SilentlyContinue | Out-Null }
    }
    if (Test-Path $StartMenuPath) { Remove-Item -Path $StartMenuPath -Force -ErrorAction SilentlyContinue | Out-Null }

    # 3. Xoa File Associations va ShellNew
    foreach ($Ext in $Extensions) {
        cmd /c reg delete "HKCU\Software\Classes\$ProgId" /f 2>$null | Out-Null
        cmd /c reg delete "HKCU\Software\Classes\$Ext\ShellNew" /f 2>$null | Out-Null
    }

    Write-Host "[OK] Da go cai dat $DisplayName khoi Windows Control Panel va he thong!" -ForegroundColor Green

    # Refresh Shell
    $code = @"
using System;
using System.Runtime.InteropServices;
public class ShellRefresh {
    [DllImport("shell32.dll")]
    public static extern void SHChangeNotify(int wEventId, int uFlags, IntPtr dwItem1, IntPtr dwItem2);
}
"@
    Add-Type -TypeDefinition $code -ErrorAction SilentlyContinue
    [ShellRefresh]::SHChangeNotify(0x08000000, 0x0000, [IntPtr]::Zero, [IntPtr]::Zero)
}
