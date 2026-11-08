!macro customInstall
  DetailPrint "Dang khoi tao Workplace Suite Apps & Shortcuts vao Windows..."

  # Create Desktop Shortcuts for all standalone apps
  CreateShortCut "$DESKTOP\Workplace Word.lnk" "$INSTDIR\Workplace Launcher.exe" "--app=word" "$INSTDIR\resources\icons\word.ico" 0 "" "" "Workplace Word Document (.docx)"
  CreateShortCut "$DESKTOP\Workplace Excel.lnk" "$INSTDIR\Workplace Launcher.exe" "--app=excel" "$INSTDIR\resources\icons\excel.ico" 0 "" "" "Workplace Excel Spreadsheet (.xlsx)"
  CreateShortCut "$DESKTOP\Workplace PowerPoint.lnk" "$INSTDIR\Workplace Launcher.exe" "--app=powerpoint" "$INSTDIR\resources\icons\powerpoint.ico" 0 "" "" "Workplace PowerPoint Presentation (.pptx)"
  CreateShortCut "$DESKTOP\Workplace AI Assistant.lnk" "$INSTDIR\Workplace Launcher.exe" "--app=ai" "$INSTDIR\resources\icons\ai.ico" 0 "" "" "Workplace AI Assistant"

  # Create Start Menu Folder & Shortcuts
  CreateDirectory "$SMPROGRAMS\Workplace Suite"
  CreateShortCut "$SMPROGRAMS\Workplace Suite\Workplace Launcher.lnk" "$INSTDIR\Workplace Launcher.exe" "" "$INSTDIR\resources\icons\suite.ico" 0 "" "" "Workplace Suite Hub"
  CreateShortCut "$SMPROGRAMS\Workplace Suite\Workplace Word.lnk" "$INSTDIR\Workplace Launcher.exe" "--app=word" "$INSTDIR\resources\icons\word.ico" 0 "" "" "Workplace Word Document (.docx)"
  CreateShortCut "$SMPROGRAMS\Workplace Suite\Workplace Excel.lnk" "$INSTDIR\Workplace Launcher.exe" "--app=excel" "$INSTDIR\resources\icons\excel.ico" 0 "" "" "Workplace Excel Spreadsheet (.xlsx)"
  CreateShortCut "$SMPROGRAMS\Workplace Suite\Workplace PowerPoint.lnk" "$INSTDIR\Workplace Launcher.exe" "--app=powerpoint" "$INSTDIR\resources\icons\powerpoint.ico" 0 "" "" "Workplace PowerPoint Presentation (.pptx)"
  CreateShortCut "$SMPROGRAMS\Workplace Suite\Workplace AI Assistant.lnk" "$INSTDIR\Workplace Launcher.exe" "--app=ai" "$INSTDIR\resources\icons\ai.ico" 0 "" "" "Workplace AI Assistant"

  # Run PowerShell script to register File Associations (.docx, .xlsx, .pptx), Control Panel entries, and Right-Click Shell New
  nsExec::Exec 'powershell -NoProfile -ExecutionPolicy Bypass -File "$INSTDIR\resources\scripts\install-app.ps1" -Action install -AppId word'
  nsExec::Exec 'powershell -NoProfile -ExecutionPolicy Bypass -File "$INSTDIR\resources\scripts\install-app.ps1" -Action install -AppId excel'
  nsExec::Exec 'powershell -NoProfile -ExecutionPolicy Bypass -File "$INSTDIR\resources\scripts\install-app.ps1" -Action install -AppId powerpoint'
  nsExec::Exec 'powershell -NoProfile -ExecutionPolicy Bypass -File "$INSTDIR\resources\scripts\install-app.ps1" -Action install -AppId ai'
!macroend

!macro customUnInstall
  # Delete Desktop Shortcuts
  Delete "$DESKTOP\Workplace Word.lnk"
  Delete "$DESKTOP\Workplace Excel.lnk"
  Delete "$DESKTOP\Workplace PowerPoint.lnk"
  Delete "$DESKTOP\Workplace AI Assistant.lnk"
  Delete "$DESKTOP\Workplace Launcher.lnk"

  # Delete Start Menu Shortcuts
  RMDir /r "$SMPROGRAMS\Workplace Suite"

  # Run PowerShell uninstaller for clean Windows registry removal
  nsExec::Exec 'powershell -NoProfile -ExecutionPolicy Bypass -File "$INSTDIR\resources\scripts\install-app.ps1" -Action uninstall -AppId word'
  nsExec::Exec 'powershell -NoProfile -ExecutionPolicy Bypass -File "$INSTDIR\resources\scripts\install-app.ps1" -Action uninstall -AppId excel'
  nsExec::Exec 'powershell -NoProfile -ExecutionPolicy Bypass -File "$INSTDIR\resources\scripts\install-app.ps1" -Action uninstall -AppId powerpoint'
  nsExec::Exec 'powershell -NoProfile -ExecutionPolicy Bypass -File "$INSTDIR\resources\scripts\install-app.ps1" -Action uninstall -AppId ai'
!macroend
