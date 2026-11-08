Dim wsRoot
wsRoot = "C:\Users\taduc\.gemini\antigravity-ide\scratch\OfficeX"
Dim electronExe
electronExe = "C:\Users\taduc\.gemini\antigravity-ide\scratch\OfficeX\apps\desktop\node_modules\electron\dist\electron.exe"
Dim appEntry
appEntry = "C:\Users\taduc\.gemini\antigravity-ide\scratch\OfficeX\apps\desktop"
Dim oShell
Set oShell = CreateObject("WScript.Shell")
oShell.CurrentDirectory = wsRoot
Dim cmd
If WScript.Arguments.Count > 0 Then
    cmd = Chr(34) & electronExe & Chr(34) & " " & Chr(34) & appEntry & Chr(34) & " --app=excel " & Chr(34) & WScript.Arguments(0) & Chr(34)
Else
    cmd = Chr(34) & electronExe & Chr(34) & " " & Chr(34) & appEntry & Chr(34) & " --app=excel"
End If
oShell.Run cmd, 1, False
