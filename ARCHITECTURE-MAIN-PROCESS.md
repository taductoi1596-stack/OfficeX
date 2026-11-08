# ARCHITECTURE.md — Main Process Architecture

## 1. Purpose

The Electron Main Process is the operating system integration layer for OfficeX Desktop.

It is responsible for:

* Application lifecycle
* Window management
* Native operating system APIs
* IPC routing
* Native dialogs
* Printing
* Auto updates
* File association handling
* Security enforcement

Business logic must never be implemented inside the Main Process.

---

# 2. Responsibilities

The Main Process owns the following responsibilities:

Application startup

Application shutdown

Window creation

IPC registration

Menu creation

Tray icon

Native dialogs

Native printing

File associations

Deep links

Crash recovery

Logging

Updater

Single-instance lock

Protocol registration

Plugin loading

Configuration loading

---

# 3. Architecture

```text
Windows

↓

Electron Main Process

↓

Core Services

↓

IPC Layer

↓

Renderer Processes

↓

React Applications
```

The Main Process never communicates directly with React components.

Communication always occurs through IPC.

---

# 4. Project Structure

```text
apps/
    desktop/

        src/

            main/

                index.ts

                bootstrap.ts

                lifecycle/

                windows/

                ipc/

                menu/

                tray/

                updater/

                dialogs/

                protocols/

                services/

                security/

                registry/

                logging/

                config/

                crash/

                plugins/
```

Each folder has a single responsibility.

---

# 5. Bootstrap Sequence

Application startup order:

1. Initialize logger.
2. Load configuration.
3. Acquire single-instance lock.
4. Register global error handlers.
5. Register custom protocols.
6. Initialize updater.
7. Initialize plugin manager.
8. Initialize IPC.
9. Build application menu.
10. Create main window.
11. Restore previous session.
12. Signal renderer that initialization is complete.

If any critical step fails, the application enters Recovery Mode.

---

# 6. Single Instance

Only one instance of each application may run.

Example:

OfficeX Word.exe

Allowed:

One instance managing multiple document windows.

Not allowed:

Multiple unrelated OfficeX Word processes.

If a second launch occurs:

* Pass the file path (if any) to the existing process.
* Focus the existing window.
* Open the requested document.

---

# 7. Window Manager

The Main Process owns every BrowserWindow.

Responsibilities:

Create

Destroy

Restore

Maximize

Minimize

Fullscreen

Remember window position

Remember window size

Remember workspace

Remember zoom level

The Renderer cannot create windows directly.

---

# 8. Application Lifecycle

Supported events:

Ready

Activate

Open File

Second Instance

Window Closed

Before Quit

Will Quit

Quit

Suspend

Resume

Every event must be logged.

---

# 9. IPC Registration

All IPC channels are registered during startup.

Channels are grouped by domain:

File

Window

Print

Settings

Theme

Plugins

Updater

AI

Clipboard

Dialogs

Notifications

Each channel validates its input before execution.

---

# 10. Native Dialog Service

The Main Process owns:

Open File

Save File

Select Folder

Print Dialog

Message Box

Error Dialog

Certificate Dialog

No Renderer may access native dialogs directly.

---

# 11. Native Printing

Printing pipeline:

Renderer

↓

IPC

↓

Print Service

↓

Windows Printer API

↓

Printer

The Main Process validates print requests before dispatching them.

---

# 12. File Opening

Startup scenarios:

Launch without file.

Launch with one file.

Launch with multiple files.

Drag-and-drop from Explorer.

Double-click associated file.

Open With…

All scenarios must be handled consistently.

---

# 13. Configuration

Configuration loads in this order:

Built-in defaults

↓

System configuration

↓

User configuration

↓

Workspace configuration

↓

Session overrides

User settings always override defaults.

---

# 14. Logging

Main Process logging must include:

Startup

Shutdown

Errors

IPC requests

Window events

Updates

Plugin loading

Printing

Security events

Logs should be structured (JSON recommended) and rotated to prevent unlimited growth.

---

# 15. Crash Recovery

If the Main Process crashes:

* Save diagnostic information if possible.
* Preserve recovery data.
* Show a recovery dialog on next launch.
* Offer to reopen previously open documents.

---

# 16. Security

The Main Process enforces:

* Context Isolation enabled.
* Sandbox enabled where practical.
* Node.js integration disabled in renderers unless explicitly required.
* Trusted preload scripts only.
* Strict IPC allow-list.
* Input validation on every IPC handler.
* Least-privilege access to the operating system.

---

# 17. Performance

Targets:

Startup < 3 seconds.

Window creation < 500 ms.

IPC overhead minimal.

No blocking operations on the main event loop.

Long-running tasks should execute in worker threads or background processes.

---

# 18. Extensibility

New services should be added as independent modules.

The Main Process must not evolve into a monolithic file.

Every new feature should integrate through:

* Service interface.
* IPC registration.
* Dependency injection.
* Configuration.

---

# 19. Acceptance Criteria

The Main Process architecture is complete when:

* The application starts reliably.
* Windows are managed consistently.
* IPC is centralized and validated.
* Native dialogs function correctly.
* File associations are handled.
* Single-instance behavior works.
* Logging and crash recovery are operational.
* No business logic exists in the Main Process.

End of Main Process Architecture
