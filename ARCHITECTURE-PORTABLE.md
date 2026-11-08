# ARCHITECTURE.md

# Portable Build Architecture

Version: 1.0

Status: Approved

---

# 1. Purpose

The OfficeX Portable Edition provides a self-contained deployment that can run without a traditional installation.

The portable build is intended for users who want to carry OfficeX on removable media or use it in environments where installation is not desired.

The Portable Edition shares the same codebase as the installed edition.

---

# 2. Design Goals

The Portable Edition must be:

* Self-contained
* Offline-first
* Easy to move
* Easy to update
* Isolated from system configuration where practical
* Compatible with removable storage
* Functionally consistent with the installed edition

---

# 3. Architecture Overview

```text id="jlwmfe"
OfficeX Portable

↓

Launcher

↓

Shared Runtime

↓

Applications

↓

Portable Data

↓

Portable Storage
```

Unlike the installed edition, configuration and user data reside within the portable directory structure unless the user explicitly chooses otherwise.

---

# 4. Folder Structure

Example:

```text id="z5cjlwm"
OfficeX-Portable/

OfficeX Launcher.exe
OfficeX Word.exe
OfficeX Excel.exe
OfficeX PowerPoint.exe
OfficeX AI.exe
OfficeX Settings.exe
OfficeX Updater.exe

runtime/
packages/
plugins/
templates/
themes/
locales/
resources/

data/
    config/
    cache/
    recovery/
    logs/
    recent/
    workspace/

documents/
```

The portable root can be copied to another drive without requiring reinstallation.

---

# 5. Startup

Portable startup sequence:

1. Detect portable mode.
2. Locate portable root.
3. Initialize Shared Runtime.
4. Load configuration from the `data` directory.
5. Initialize services.
6. Launch the requested application.

No installer metadata is required.

---

# 6. Portable Configuration

Configuration is stored under:

```text id="qkvn2j"
data/config/
```

Typical configuration includes:

* Preferences
* Theme
* Language
* Window layout
* Recent files
* Keyboard shortcuts
* Plugin configuration

The configuration remains with the portable directory.

---

# 7. User Data

User-generated content is stored separately from application binaries.

Examples:

* Auto-recovery data
* Temporary files
* Logs
* Templates
* Local cache
* Workspace state

Applications should avoid writing to system-wide locations unless the user explicitly requests it.

---

# 8. Applications

The portable package includes:

* OfficeX Launcher
* OfficeX Word
* OfficeX Excel
* OfficeX PowerPoint
* OfficeX AI
* OfficeX Settings
* OfficeX Updater (optional, depending on distribution policy)

Each executable runs directly from the portable folder.

---

# 9. Shared Runtime

A single Shared Runtime is bundled inside the portable package.

All applications use the same runtime.

No duplicate runtime copies should exist.

---

# 10. File Handling

The Portable Edition can:

* Open local files.
* Save to any user-accessible location.
* Open removable media.
* Access network locations when available.

Applications should not assume a fixed drive letter.

---

# 11. Recent Files

Recent document lists should:

* Store portable-friendly paths where possible.
* Gracefully handle missing drives.
* Remove invalid entries automatically.
* Avoid blocking startup if referenced media is unavailable.

---

# 12. Updates

Portable updates should:

* Preserve user data.
* Replace application files.
* Preserve configuration.
* Verify package integrity.

Users may also update manually by replacing application files while retaining the `data` directory.

---

# 13. Security

The Portable Edition should:

* Validate application integrity.
* Protect temporary files.
* Avoid unnecessary writes to system directories.
* Respect operating system permissions.

Portable mode should not require administrative privileges for normal operation.

---

# 14. Logging

Logs are written to:

```text id="6w2fuv"
data/logs/
```

Log files include:

* Startup
* Shutdown
* Errors
* Updates
* Crash reports (if enabled)

Logs should rotate automatically to prevent uncontrolled growth.

---

# 15. Performance

Targets:

* Detect portable mode quickly.
* Startup performance comparable to the installed edition.
* Minimize unnecessary disk writes to removable media.
* Avoid blocking operations during initialization.

---

# 16. Limitations

The Portable Edition does not rely on system registration.

Therefore:

* File associations are not automatically registered.
* Applications do not appear in the Windows installed applications list.
* Start Menu shortcuts are not created automatically.
* Desktop shortcuts are optional and user-managed.

These behaviors are intentional to preserve portability.

---

# 17. Enterprise Usage

Portable builds may be distributed:

* On USB drives.
* Through internal software repositories.
* As compressed archives.
* Through managed deployment systems.

Configuration can be pre-populated before distribution.

---

# 18. Testing

Required tests:

* Run from USB drive.
* Run from external SSD.
* Run from network share (where supported).
* Move the portable folder to another path.
* Preserve configuration across moves.
* Update while preserving user data.
* Recovery after unexpected shutdown.

---

# 19. Acceptance Criteria

The Portable Build is complete when:

* Applications run without installation.
* Configuration remains inside the portable directory.
* Shared Runtime is reused by all applications.
* User data is preserved across updates.
* The portable folder can be moved without reinstallation.
* Functionality remains substantially equivalent to the installed edition, except for installer-specific Windows integration.

End of Portable Build Architecture

---

# 20. Codebase Strategy

To reduce maintenance costs, OfficeX uses a single codebase for both the Installed Edition and the Portable Edition. Both versions share the same Shared Runtime, Document Engine, and UI. The only difference is at the bootstrap layer and the data storage mechanism (storing in %APPDATA% for Installed vs data/ for Portable). This prevents code duplication and ensures feature parity.
