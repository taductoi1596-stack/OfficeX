$w = New-Object -ComObject WScript.Shell
$s = $w.CreateShortcut('C:\Users\taduc\OneDrive\Desktop\Workplace Word.lnk')
Write-Host "Target: $($s.TargetPath)"
Write-Host "Args: $($s.Arguments)"
Write-Host "Icon: $($s.IconLocation)"
