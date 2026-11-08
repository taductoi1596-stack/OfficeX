# ARCHITECTURE.md — IPC Communication Architecture

Version: 1.0

Status: Approved

---

# 1. Purpose

The IPC (Inter-Process Communication) layer provides secure, typed, and asynchronous communication between the Electron Main Process and Renderer Processes.

All communication between the UI and privileged operating system services must pass through the IPC layer.

Direct access to Electron APIs from React components is strictly prohibited.

---

# 2. Design Goals

The IPC system must be:

* Secure
* Typed
* Asynchronous
* Versioned
* Modular
* Testable
* Extensible
* Observable

---

# 3. Communication Model

```text
React Component
        │
        ▼
Application Service
        │
        ▼
IPC Client
        │
        ▼
Preload Bridge
        │
        ▼
Electron Main Process
        │
        ▼
Platform Service
        │
        ▼
Windows API / Filesystem / Printer / Network
```

---

# 4. IPC Layers

The IPC framework consists of:

1. IPC Client (Renderer)
2. Preload Bridge
3. IPC Router
4. IPC Controller
5. Domain Service
6. Platform Adapter

Business logic never exists inside the IPC Router.

---

# 5. Channel Naming Convention

Every channel must follow:

```
<domain>:<action>
```

Examples:

```
file:open
file:save
file:saveAs
file:delete

window:minimize
window:maximize
window:close

print:start

theme:set

theme:get

clipboard:read

clipboard:write

settings:get

settings:set

plugins:list

plugins:install

ai:chat

ai:summarize
```

Channel names are lowercase.

No spaces.

No abbreviations.

---

# 6. Request Lifecycle

Every request follows the same flow.

```text
Renderer

↓

Validate Request

↓

IPC Client

↓

Preload Bridge

↓

IPC Router

↓

Controller

↓

Service

↓

Platform Adapter

↓

Response

↓

Renderer
```

---

# 7. IPC Request Structure

Every request contains:

```
channel

payload

requestId

timestamp

application

version
```

Example:

```json
{
  "channel": "file:open",
  "payload": {
    "path": "C:\\Documents\\Report.docx"
  },
  "requestId": "c8f4d6...",
  "timestamp": 1760000000,
  "application": "word",
  "version": "1.0.0"
}
```

---

# 8. IPC Response Structure

Every response contains:

```
success

requestId

result

error

duration
```

Example:

```json
{
  "success": true,
  "requestId": "c8f4d6...",
  "result": {
    "documentId": "12345"
  },
  "duration": 12
}
```

---

# 9. Error Model

Every error includes:

* Code
* Message
* Details (optional)

Example:

```json
{
  "success": false,
  "error": {
    "code": "FILE_NOT_FOUND",
    "message": "The requested document could not be located."
  }
}
```

No internal stack traces are returned to the Renderer.

---

# 10. IPC Domains

Core domains include:

File

Window

Settings

Theme

Printing

Clipboard

Notification

Authentication

Plugins

AI

Cloud

Updater

Logging

Localization

Each domain owns its own controller and service.

---

# 11. File IPC

Supported operations:

Open

Save

Save As

Rename

Delete

Move

Copy

Recover

Export

Import

Recent Files

Favorites

Trash

All file operations are validated before execution.

---

# 12. Window IPC

Operations:

Create

Close

Focus

Minimize

Maximize

Restore

Fullscreen

Set Title

Remember Position

Remember Size

---

# 13. Settings IPC

Operations:

Read

Update

Reset

Import

Export

Settings are persisted through a dedicated configuration service.

---

# 14. Theme IPC

Operations:

Get Current Theme

Set Theme

Watch Theme Changes

Reload Theme

Support:

Light

Dark

System

Custom

---

# 15. Printing IPC

Operations:

Print

Preview

List Printers

Default Printer

Printer Settings

Cancel Print Job

Printing requests are queued and validated.

---

# 16. Clipboard IPC

Operations:

Read Text

Write Text

Read Image

Write Image

Clear Clipboard

Clipboard access is permission-controlled.

---

# 17. Plugin IPC

Operations:

List Plugins

Enable

Disable

Install

Uninstall

Update

Reload

Plugins cannot execute privileged IPC channels unless explicitly granted permission.

---

# 18. AI IPC

Operations:

Chat

Translate

Summarize

Generate Formula

Generate Slide

Generate Table

OCR

Speech Recognition

Responses may be streamed for long-running tasks.

---

# 19. Security

Rules:

* Renderer cannot register IPC handlers.
* Only the Main Process registers handlers.
* Every payload is validated.
* Unknown channels are rejected.
* Sensitive operations require authorization.
* IPC permissions are least-privilege.
* Preload exposes only approved APIs.

---

# 20. Performance

Targets:

Simple request latency: < 5 ms

File dialog request: < 50 ms

Settings read: < 2 ms (cached)

Long-running tasks should return progress events rather than blocking.

---

# 21. Logging

Each IPC request records:

* Request ID
* Timestamp
* Channel
* Calling application
* Duration
* Result (success/failure)

Sensitive payload data must be redacted from logs.

---

# 22. Versioning

IPC contracts are versioned.

Breaking changes require a new contract version.

Older renderers should receive a compatibility error rather than undefined behavior.

---

# 23. Testing

Every IPC domain requires:

* Unit tests
* Integration tests
* Validation tests
* Permission tests
* Failure-path tests
* Performance tests

---

# 24. Acceptance Criteria

The IPC layer is complete when:

* All communication uses approved channels.
* Renderer has no direct access to privileged APIs.
* Requests and responses follow the standard contract.
* Payload validation is enforced.
* Logging is operational.
* Unauthorized access is denied.
* Performance targets are achieved.
* New domains can be added without modifying existing IPC infrastructure.

End of IPC Communication Architecture
