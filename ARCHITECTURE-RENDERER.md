# ARCHITECTURE.md — Renderer Process Architecture

Version: 1.0

Status: Approved

---

# 1. Purpose

The Renderer Process is responsible for rendering the graphical user interface of OfficeX Desktop applications.

Each desktop application (Word, Excel, PowerPoint, Launcher, AI, Settings) owns one or more Renderer Processes.

The Renderer is responsible only for presentation and user interaction.

Business logic must remain inside shared domain packages.

Operating system functionality must be accessed only through IPC.

---

# 2. Responsibilities

Renderer responsibilities:

* Render UI
* Handle user interaction
* Display dialogs
* Navigation
* State management
* Theme rendering
* Localization
* Keyboard shortcuts
* Clipboard requests (through IPC)
* File editing
* Undo / Redo
* Auto Save scheduling
* View rendering
* Animation
* Accessibility

Renderer must never:

* Access Windows Registry
* Access Node.js directly
* Read arbitrary local files
* Execute shell commands
* Spawn child processes
* Manage application lifecycle

---

# 3. Architecture

```text
User

↓

React Components

↓

Feature Modules

↓

Application Services

↓

Shared Packages

↓

IPC Client

↓

Electron Main Process

↓

Windows API
```

---

# 4. Renderer Folder Structure

```text
src/

app/
pages/
features/
components/
layouts/
hooks/
contexts/
stores/
services/
routes/
assets/
styles/
theme/
icons/
i18n/
utils/
types/
validators/
```

Each folder has a single responsibility.

---

# 5. UI Layers

The Renderer is divided into five logical layers.

Presentation Layer

Contains:

* React Components
* Pages
* Dialogs
* Ribbon
* Toolbar
* Sidebar
* Status Bar

Application Layer

Contains:

* Commands
* View Models
* Navigation
* User Workflows

State Layer

Contains:

* Zustand Stores
* Query Cache
* Session State
* UI Preferences

Service Layer

Contains:

* API Client
* IPC Client
* Storage Client

Shared Layer

Contains reusable packages shared by all OfficeX applications.

---

# 6. React Component Rules

Components must be:

Small

Reusable

Independent

Composable

Pure where possible

Avoid components larger than 300 lines.

Business logic belongs in hooks or services.

---

# 7. State Management

Use Zustand.

Separate stores by responsibility.

Examples:

ThemeStore

WorkspaceStore

DocumentStore

SpreadsheetStore

PresentationStore

ClipboardStore

SettingsStore

PluginStore

NotificationStore

RecentFilesStore

WindowStore

Each store owns only its own state.

---

# 8. Routing

Each application has its own router.

Example:

OfficeX Word

/

Editor

Print Preview

Settings

About

Help

OfficeX Launcher

Home

Templates

Recent

Cloud

Settings

No application may import routes from another application.

---

# 9. Feature Modules

Each feature is isolated.

Example:

features/

editor/

tables/

images/

comments/

history/

review/

spellcheck/

export/

Each feature contains:

UI

Hooks

Services

Types

Tests

Styles (if required)

---

# 10. IPC Client

Renderer never uses Electron APIs directly.

Instead:

Renderer

↓

IPC Client

↓

Preload Bridge

↓

Main Process

All requests are asynchronous.

Each IPC request returns:

Success

Failure

Validation Error

Permission Error

Unexpected Error

---

# 11. Theme System

Support:

Light

Dark

System

Custom Themes

Theme changes should update without restarting the application.

---

# 12. Localization

Support unlimited languages.

Language files are loaded dynamically.

All UI strings must be localized.

Never hard-code user-facing text.

---

# 13. Performance

Use:

Lazy Loading

Code Splitting

Memoization

Virtual Lists

Incremental Rendering

Avoid unnecessary re-renders.

Target:

60 FPS scrolling

<100 ms command response

---

# 14. Error Handling

Every page must have:

Error Boundary

Loading State

Empty State

Offline State

Retry Action

Unexpected errors should be logged through the shared logging service.

---

# 15. Accessibility

Support:

Keyboard navigation

Screen readers

High contrast

Scalable fonts

Visible focus indicators

ARIA labels

Accessible dialogs

---

# 16. Security

Renderer must run with:

Context Isolation enabled

Node Integration disabled

Sandbox enabled where possible

All external input validated

Escape user-generated HTML

Protect against XSS

Only trusted IPC channels may be used.

---

# 17. Window Communication

Renderer communicates with:

Main Process

Shared Services

Background Workers

Never communicate directly with another application's Renderer Process.

Cross-application communication must go through approved services.

---

# 18. Background Tasks

Long-running work should execute in:

* Web Workers
* Worker Threads (through Main Process)
* Background services

Examples:

Large document indexing

Spell checking

Formula calculation

PDF generation

AI inference

Renderer must remain responsive.

---

# 19. Testing

Each feature must include:

Unit tests

Component tests

Integration tests

Keyboard shortcut tests

Accessibility checks

Performance benchmarks where applicable.

---

# 20. Acceptance Criteria

The Renderer architecture is complete when:

* UI renders correctly.
* Business logic is separated from presentation.
* IPC communication is secure.
* State is modular.
* Themes switch dynamically.
* Localization works.
* Performance targets are met.
* Accessibility requirements are satisfied.
* No Renderer accesses privileged operating system APIs directly.

End of Renderer Process Architecture
