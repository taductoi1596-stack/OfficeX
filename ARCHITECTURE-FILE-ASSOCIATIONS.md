# ARCHITECTURE.md

# File Associations (.docx, .xlsx, .pptx)

Version: 1.0

Status: Approved

---

# 1. Purpose

This document defines how OfficeX Desktop integrates with the Windows file association system.

The objective is to ensure that supported document types can be opened directly from Windows Explorer using the appropriate OfficeX application.

File association registration must be performed by the installer.

---

# 2. Goals

The File Association system must:

* Register supported OfficeX applications.
* Register supported document types.
* Display correct file icons.
* Support "Open With".
* Support drag-and-drop.
* Support double-click open.
* Support command-line opening.
* Support upgrade and uninstall.
* Respect the user's default application choice.

---

# 3. Architecture

```text
Windows Explorer

↓

Shell

↓

Registered File Type

↓

OfficeX Executable

↓

Shared Runtime

↓

Document Loader

↓

Editor
```

---

# 4. Supported File Types

## OfficeX Word

Primary:

* .docx

Supported:

* .doc
* .odt
* .rtf
* .txt
* .md

---

## OfficeX Excel

Primary:

* .xlsx

Supported:

* .xls
* .csv
* .ods

---

## OfficeX PowerPoint

Primary:

* .pptx

Supported:

* .ppt
* .odp

---

# 5. Application Mapping

```text
.docx

↓

OfficeX Word.exe


.xlsx

↓

OfficeX Excel.exe


.pptx

↓

OfficeX PowerPoint.exe
```

---

# 6. Startup Flow

When a user opens a document from Windows:

```text
Double Click

↓

Windows Shell

↓

Launch Executable

↓

Application Bootstrap

↓

Shared Runtime

↓

File Service

↓

Document Parser

↓

Editor Window
```

If the application is already running, the existing process should open the document rather than starting an unrelated second instance, subject to the application's window model.

---

# 7. Command-Line Arguments

Executables should accept document paths as command-line arguments.

Conceptually, each application supports:

* Open one document.
* Open multiple documents.
* Ignore unsupported file types with a user-friendly error.
* Resolve relative paths where applicable.

Applications should validate all supplied paths before attempting to open them.

---

# 8. Drag-and-Drop

Supported behaviors:

* Drop a supported file onto an application window.
* Drop multiple supported files.
* Reject unsupported formats with an informative message.

Drag-and-drop should use the same document loading pipeline as command-line opening.

---

# 9. File Icons

Each supported document type should have an identifiable icon associated with the corresponding OfficeX application.

Examples:

* Word document icon
* Excel spreadsheet icon
* PowerPoint presentation icon

Icons should remain consistent with the OfficeX visual identity.

---

# 10. Document Loading

Document loading follows a common pipeline:

```text
Validate Path

↓

Detect File Type

↓

Read File

↓

Parse Format

↓

Create Internal Model

↓

Open Editor
```

This pipeline should be shared across desktop applications where possible.

---

# 11. Validation

Before opening a file:

* Confirm the path exists.
* Confirm the file type is supported.
* Check read permissions.
* Detect zero-length or corrupted files where possible.
* Reject invalid input gracefully.

---

# 12. Recent Documents

Successfully opened documents should be added to the Recent Documents list with:

* Display name
* File path
* Last opened time
* Application
* Pin status (optional)

The list should avoid duplicate entries.

---

# 13. Error Handling

Typical scenarios:

* File not found
* Access denied
* Unsupported format
* Corrupted document
* File in use by another process

Errors should be presented clearly without terminating the application.

---

# 14. Security

The document-opening pipeline must:

* Treat all input paths as untrusted.
* Validate extensions and file contents where appropriate.
* Avoid executing embedded code or scripts from documents.
* Limit access to the requested file only.
* Prevent path traversal within internal file operations.

---

# 15. Performance

Targets:

* Launch application within 3 seconds.
* Open common documents with minimal perceived delay.
* Load very large documents progressively where practical.
* Avoid blocking the UI during parsing.

---

# 16. Upgrade Behavior

Application upgrades should:

* Preserve supported file registrations.
* Refresh icons when necessary.
* Update application metadata.
* Avoid unnecessary changes to user-selected defaults.

---

# 17. Uninstall Behavior

During uninstall:

* Remove OfficeX file association registrations created by the installer.
* Remove OfficeX-specific icons and metadata.
* Leave user documents unchanged.
* Allow Windows to fall back to another application or prompt the user to choose one.

---

# 18. Testing

Required tests:

* Double-click open.
* Open With.
* Drag-and-drop.
* Multiple document opening.
* Unsupported extension handling.
* Corrupted document handling.
* Upgrade.
* Repair installation.
* Uninstall.
* Recent documents.

---

# 19. Acceptance Criteria

The File Associations module is complete when:

* Supported document types launch the correct OfficeX application.
* Existing application instances handle document opening correctly.
* Drag-and-drop and command-line opening share the same loading pipeline.
* Validation and error handling are consistent.
* Installation, upgrade, repair, and uninstall preserve system integrity.
* The implementation follows Windows application registration guidelines and respects user default application settings.
