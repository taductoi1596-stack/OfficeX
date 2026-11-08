Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\\Users\\taduc\\.gemini\\antigravity-ide\\scratch\\OfficeX\\apps\\desktop"
WshShell.Run """C:\\Users\\taduc\\.gemini\\antigravity-ide\\scratch\\OfficeX\\apps\\desktop\\bin\\Workplace-Excel.cmd"" " & WScript.Arguments(0), 0, False
