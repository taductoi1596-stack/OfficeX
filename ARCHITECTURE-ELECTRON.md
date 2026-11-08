# ARCHITECTURE.md - Electron Multi-Application Architecture

---

# 1. Overview

OfficeX Desktop is a Windows application suite composed of multiple independent executable applications that share a common runtime, shared libraries, and a unified installer.

The suite must behave like a native Windows productivity suite.

After installation, Windows users should see independent applications:

* OfficeX Launcher
* OfficeX Word
* OfficeX Excel
* OfficeX PowerPoint
* OfficeX AI
* OfficeX Settings
* OfficeX Updater

Each application launches independently, maintains its own window lifecycle, and communicates through shared services where necessary.

---

# 2. Architecture Goals

The desktop architecture must:

* Launch each application independently.
* Share common code to reduce duplication.
* Support offline-first operation.
* Minimize memory usage.
* Allow independent updates when applicable.
* Support future expansion with additional applications.
* Integrate cleanly with Windows.

---

# 3. High-Level Desktop Architecture

```text
                    OfficeX Installer
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
 Shared Runtime & Libraries           Desktop Applications
        │                                     │
        ├──────────────┬──────────────┬───────┤
        │              │              │
 OfficeX Word   OfficeX Excel   OfficeX PowerPoint
        │              │              │
        └──────────────┴──────────────┘
                     │
             Shared Services
                     │
      Logging • Settings • Printing • Plugins
                     │
                Windows APIs
```

---

# 4. Repository Layout

```text
apps/
    launcher/
    word/
    excel/
    powerpoint/
    ai/
    settings/
    updater/

packages/
    desktop-runtime/
    electron-core/
    ipc/
    window-manager/
    file-system/
    printing/
    updater/
    auth/
    settings/
    theme/
    plugins/
    common/
```

Each application owns only its UI entry point and application-specific logic.

Shared functionality belongs in `packages/`.

---

# 5. Executable Applications

The installer must generate the following executables:

```text
OfficeX Launcher.exe
OfficeX Word.exe
OfficeX Excel.exe
OfficeX PowerPoint.exe
OfficeX AI.exe
OfficeX Settings.exe
OfficeX Updater.exe
```

Each executable must:

* Have its own application icon.
* Have its own product name.
* Have its own version information.
* Support command-line arguments.
* Register its own file associations where applicable.
* Be launchable directly without opening another application first.

---

# 6. Shared Runtime

Every executable loads the same shared runtime before loading its own UI.

Responsibilities include:

* Dependency injection.
* Logging.
* Configuration.
* Theme loading.
* Localization.
* Plugin discovery.
* Window creation.
* Error handling.
* Auto-update integration.
* Telemetry (if enabled).

The runtime must not contain application-specific business logic.

---

# 7. Application Boot Sequence

Startup flow:

1. Process starts.
2. Load configuration.
3. Initialize logging.
4. Initialize dependency container.
5. Initialize settings.
6. Load theme.
7. Discover plugins.
8. Restore previous session if enabled.
9. Create Electron window.
10. Mount React application.
11. Load application-specific module (Word, Excel, etc.).
12. Show main window.

If any critical step fails, display a recovery screen and write diagnostic logs.

---

# 8. Shared Services

The following services must be reusable across all applications:

* Settings Service.
* Theme Service.
* Logging Service.
* Plugin Service.
* File Service.
* Clipboard Service.
* Printing Service.
* Notification Service.
* Localization Service.
* Update Service.

Applications consume these services through interfaces rather than directly accessing platform APIs.

---

# 9. Window Model

Each application owns exactly one primary window.

Additional windows may include:

* Preferences.
* About.
* Print Preview.
* File Picker.
* Plugin Manager.
* AI Assistant.
* Help.

Only the main window represents the running application in the taskbar.

---

# 10. Native Windows Integration

Desktop applications should integrate with Windows by supporting:

* Native Open/Save dialogs.
* Native print dialogs.
* Clipboard.
* Drag and Drop.
* Taskbar jump lists (optional).
* Notifications.
* High-DPI scaling.
* Dark mode integration.
* File Explorer integration.

Platform-specific code should be isolated behind adapter interfaces.

---

# 11. File Associations

The installer should register supported file types:

OfficeX Word

* .docx
* .doc
* .odt
* .rtf

OfficeX Excel

* .xlsx
* .xls
* .csv
* .ods

OfficeX PowerPoint

* .pptx
* .ppt
* .odp

Double-clicking an associated file should launch the correct executable with the file path passed as an argument.

---

# 12. Memory Strategy

To reduce memory usage:

* Load only required modules at startup.
* Lazy-load heavy features (AI, templates, import/export).
* Share assets where possible.
* Dispose of unused windows and resources promptly.
* Cache only frequently accessed data.

---

# 13. Error Handling

Critical failures should:

* Record structured logs.
* Show a recovery dialog.
* Preserve unsaved work when possible.
* Allow the user to restart the application.

Application crashes should not corrupt shared configuration or user documents.

---

# 14. Extensibility

The architecture must allow adding future desktop applications (for example, OfficeX PDF or OfficeX Whiteboard) without changing the existing shared runtime.

New applications should reuse shared packages and register themselves with the installer and launcher through configuration rather than code duplication.

---

# 15. Acceptance Criteria

This architecture is considered complete when:

* All desktop applications build successfully.
* Each executable launches independently.
* Shared runtime initializes correctly.
* Shared services are reusable.
* Applications do not contain duplicated infrastructure code.
* File associations open the correct application.
* Windows integration functions correctly.
* The architecture supports future expansion without restructuring the repository.

End of Section: Electron Multi-Application Architecture
