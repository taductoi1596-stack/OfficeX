# ARCHITECTURE.md — Window Manager Architecture

Version: 1.0

Status: Approved

---

# 1. Purpose

The Window Manager is responsible for creating, managing, tracking, and destroying every application window in OfficeX Desktop.

No application may create Electron BrowserWindow instances directly.

All windows must be created through the Window Manager.

---

# 2. Goals

The Window Manager must provide:

* Unified window creation
* Multi-window support
* Workspace restoration
* Window persistence
* DPI awareness
* Multi-monitor support
* Native Windows integration
* Window state synchronization
* Memory optimization

---

# 3. Architecture Overview

```text id="9grj1m"
OfficeX Application

↓

Window Manager API

↓

Window Factory

↓

Window Registry

↓

BrowserWindow

↓

Windows Desktop
```

---

# 4. Responsibilities

The Window Manager owns:

Window creation

Window destruction

Window restoration

Window positioning

Window sizing

Focus management

Window events

Workspace persistence

Dialog creation

Modal management

Popup management

Fullscreen management

Multi-monitor placement

---

# 5. Repository Structure

```text id="h4v9qa"
packages/

window-manager/

    src/

        manager/

        registry/

        factory/

        layouts/

        dialogs/

        events/

        persistence/

        monitors/

        workspace/

        state/

        interfaces/

        models/

        services/

        tests/
```

---

# 6. Window Types

Supported window types:

Main Window

Document Window

Dialog

Modal Dialog

Tool Window

Settings Window

About Window

Help Window

Plugin Window

AI Chat Window

Print Preview

Update Window

Splash Screen

Each type has predefined behavior and configuration.

---

# 7. Window Factory

All windows are created through the Window Factory.

Responsibilities:

* Assign unique window IDs.
* Apply default configuration.
* Configure security settings.
* Register events.
* Attach preload scripts.
* Restore previous state if available.

Applications request windows by type rather than constructing them directly.

---

# 8. Window Registry

The Window Registry maintains the state of every active window.

Tracked information:

* Window ID
* Application
* Window type
* Current state
* Position
* Size
* Monitor
* Last focused time
* Associated document (if any)

The registry is the authoritative source of window state.

---

# 9. Window Lifecycle

```text id="4skgsv"
Requested

↓

Creating

↓

Initializing

↓

Visible

↓

Focused

↓

Background

↓

Hidden

↓

Closing

↓

Destroyed
```

Transitions are managed by the Window Manager.

---

# 10. Workspace Persistence

The Window Manager stores:

* Position
* Size
* Maximized state
* Fullscreen state
* Zoom level
* Last active monitor
* Open documents
* Active workspace

On startup, applications may restore the previous workspace if enabled.

---

# 11. Multi-Monitor Support

Features:

* Detect connected displays.
* Remember preferred monitor.
* Restore windows to valid positions.
* Prevent windows from opening off-screen.
* Handle monitor disconnects gracefully.

---

# 12. Dialog Management

All dialogs are created through the Window Manager.

Supported dialogs:

* Open File
* Save File
* Message Box
* Confirmation
* Error
* Warning
* Print
* Plugin Installation
* Update Available

Dialogs inherit the active application theme.

---

# 13. Focus Management

The Window Manager controls:

* Active window
* Focus restoration
* Window activation
* Keyboard focus
* Z-order

Opening a dialog should return focus to its parent window when closed.

---

# 14. Security

Each BrowserWindow is configured with:

* Context Isolation enabled
* Node Integration disabled
* Sandboxed renderer where possible
* Trusted preload script only
* Secure Content Security Policy

Applications cannot override these defaults without explicit approval.

---

# 15. Performance

The Window Manager should:

* Reuse window configuration.
* Lazy-create secondary windows.
* Destroy unused windows.
* Avoid hidden background windows unless required.
* Minimize startup overhead.

---

# 16. Event System

Supported events include:

* WindowCreated
* WindowShown
* WindowHidden
* WindowFocused
* WindowBlurred
* WindowMoved
* WindowResized
* WindowMaximized
* WindowMinimized
* WindowRestored
* WindowClosed

Events are published through the Shared Runtime Event Bus.

---

# 17. Document Windows

Document windows are associated with editable content.

Each document window stores:

* Document ID
* File path
* Dirty state (unsaved changes)
* Cursor position
* Zoom level
* Scroll position

Closing a document with unsaved changes must prompt the user.

---

# 18. AI Integration

The AI Chat window can operate:

* Docked to the main window
* Floating
* Side panel (where supported)

Its state is remembered between sessions.

---

# 19. Accessibility

Support:

* Keyboard navigation
* High-DPI scaling
* Screen readers
* Focus indicators
* Native window controls
* Windows accessibility APIs

---

# 20. Error Recovery

If a window fails to initialize:

* Log the error.
* Show a recovery dialog.
* Allow retry.
* Prevent the failure from crashing other windows.

---

# 21. Testing

The Window Manager requires:

* Unit tests for state transitions.
* Integration tests for window creation.
* Multi-monitor tests.
* Persistence tests.
* Dialog tests.
* Performance benchmarks.

---

# 22. Acceptance Criteria

The Window Manager architecture is complete when:

* All windows are created through the Window Factory.
* Window state is tracked in the Window Registry.
* Workspaces restore correctly.
* Multi-monitor behavior is reliable.
* Security defaults are enforced.
* Window events are published consistently.
* Applications never instantiate BrowserWindow directly.
* New window types can be added without modifying existing window management logic.

End of Window Manager Architecture
