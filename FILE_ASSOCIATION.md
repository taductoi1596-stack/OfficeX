# FILE_ASSOCIATION.md

# OfficeX Windows File Association Architecture

Version: 1.0

Status: Enterprise Design Specification

---

# 1. Purpose

This document defines how OfficeX integrates with Microsoft Windows to register, manage, and maintain file associations.

File associations allow supported document types to open directly in the appropriate OfficeX application when users double-click files in Windows Explorer or invoke the **Open with** command.

This specification applies to:

* OfficeX Launcher
* OfficeX Word
* OfficeX Excel
* OfficeX PowerPoint
* OfficeX AI (where applicable)
* Windows Installer
* Auto Update System

---

# 2. Objectives

The file association subsystem must be:

* Reliable
* Secure
* Compatible with Windows 10 and Windows 11
* User-friendly
* Enterprise deployable
* Upgrade-safe
* Easy to repair

---

# 3. Supported Applications

OfficeX registers independent applications for document handling:

| Application        | Executable     |
| ------------------ | -------------- |
| OfficeX Launcher   | Launcher.exe   |
| OfficeX Word       | Word.exe       |
| OfficeX Excel      | Excel.exe      |
| OfficeX PowerPoint | PowerPoint.exe |

Each application owns its supported file types.

---

# 4. Supported File Types

## OfficeX Word

Supported extensions:

```text id="fa01"
.docx
.doc
.rtf
.txt
.odt
.html
.htm
.md
```

---

## OfficeX Excel

Supported extensions:

```text id="fa02"
.xlsx
.xls
.csv
.tsv
.ods
```

---

## OfficeX PowerPoint

Supported extensions:

```text id="fa03"
.pptx
.ppt
.odp
```

---

## Shared Formats

Optional associations:

```text id="fa04"
.pdf
.xml
```

PDF handling depends on installed OfficeX components and user preferences.

---

# 5. Windows Registration Model

OfficeX integrates using standard Windows application registration mechanisms.

Registration includes:

* Application Capabilities
* File Extensions
* ProgIDs
* Icons
* Open Commands
* Uninstall Information

The installer must avoid modifying unrelated system settings.

---

# 6. ProgID Definitions

Each application owns one or more ProgIDs.

Examples:

```text id="fa05"
OfficeX.Word.Document

OfficeX.Excel.Workbook

OfficeX.PowerPoint.Presentation
```

ProgIDs remain stable across application updates.

---

# 7. Open Command

Each registered file type launches the correct executable.

Examples:

```text id="fa06"
Word.exe "%1"

Excel.exe "%1"

PowerPoint.exe "%1"
```

The file path must be passed safely to avoid command injection.

---

# 8. Default Icons

Every supported document type has a dedicated icon.

Examples:

* DOCX icon
* XLSX icon
* PPTX icon
* CSV icon
* TXT icon

Icons should remain consistent with the OfficeX design system.

---

# 9. Explorer Integration

OfficeX integrates with Windows Explorer by providing:

* Double-click open
* Right-click **Open**
* **Open with**
* Recent Files
* Jump Lists
* File previews (future enhancement)
* File thumbnails (future enhancement)

---

# 10. Context Menu

Optional context menu entries include:

```text id="fa07"
Open

Open with OfficeX

Edit

Print

Share

Open Recent
```

Context menu extensions should remain lightweight and responsive.

---

# 11. Drag & Drop

Supported scenarios:

* Explorer → Word
* Explorer → Excel
* Explorer → PowerPoint
* Desktop → OfficeX
* OfficeX → Explorer
* Cross-application drag & drop

Applications should validate incoming files before opening them.

---

# 12. Recent Documents

OfficeX maintains recent document lists for each application.

Examples:

Word

* Recent DOCX
* Recent TXT

Excel

* Recent XLSX
* Recent CSV

PowerPoint

* Recent PPTX

Recent document entries integrate with Windows Jump Lists where supported.

---

# 13. Multiple Office Suites

OfficeX is designed to coexist with:

* Microsoft Office
* LibreOffice
* Apache OpenOffice
* WPS Office

The installer must not override existing default applications without explicit user consent.

---

# 14. User Choice

Users may choose:

* Register all supported formats
* Register only selected formats
* Keep current default applications
* Change associations later through OfficeX Settings or Windows Settings

---

# 15. Repair Associations

The installer and OfficeX Settings provide a repair option.

Repair restores:

* Missing registry entries
* Icons
* Open commands
* Application capabilities
* Shortcuts related to file handling

Repair does not modify unrelated user preferences.

---

# 16. Auto Update Compatibility

Updates must preserve:

* File associations
* ProgIDs
* Icons
* Open commands
* Application capabilities

Updates should not require users to reconfigure associations.

---

# 17. Portable Edition

Portable builds:

* Do not permanently register file associations by default.
* May offer temporary associations for the current session if supported.
* Avoid modifying system-wide registry settings unless explicitly requested.

---

# 18. Security

Security requirements:

* Validate file paths before opening.
* Prevent command injection.
* Reject unsupported or malformed files.
* Verify file extension and content where appropriate.
* Respect Windows security policies and user permissions.

---

# 19. Logging

Association-related events include:

* Registration
* Repair
* Removal
* Update
* Errors
* Validation failures

Logs assist troubleshooting while avoiding sensitive information.

---

# 20. Uninstall Behavior

During uninstall:

* Remove OfficeX-specific file associations if they are still owned by OfficeX.
* Remove ProgIDs created by OfficeX.
* Remove application capability registrations.
* Preserve user documents.
* Do not delete document files.

If another application becomes the default handler, OfficeX should not interfere.

---

# 21. Enterprise Deployment

Enterprise administrators may configure:

* Default associations
* Allowed applications
* Silent registration
* Repair operations
* Upgrade behavior

Deployment should support automation through standard Windows management tools.

---

# 22. Testing Strategy

Validation scenarios include:

* Fresh installation
* Upgrade
* Repair
* Uninstall
* Opening each supported file type
* Default application selection
* Explorer integration
* Context menu behavior
* Drag & drop
* Coexistence with other office suites

Automated tests should verify that every supported extension launches the correct OfficeX application.

---

# 23. Future Enhancements

Planned capabilities:

* Explorer preview handlers
* File thumbnails
* Search integration
* Windows Search indexing
* Cloud placeholder support
* Version history integration
* Custom shell extensions

---

# 24. Acceptance Criteria

The file association subsystem is considered production-ready when:

* All supported document types open in the correct OfficeX application.
* Windows Explorer integration functions reliably.
* File associations survive upgrades and repairs.
* Users can easily configure or restore associations.
* OfficeX coexists safely with other office suites.
* Security validation protects against malformed inputs.
* Enterprise deployment and automation requirements are satisfied.

End of FILE_ASSOCIATION.md
