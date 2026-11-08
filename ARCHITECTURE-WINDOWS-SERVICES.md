# ARCHITECTURE.md

# Windows Services Integration Architecture

Version: 1.0

Status: Approved

---

# 1. Purpose

The Windows Services Integration layer defines how OfficeX Desktop interacts with Windows operating system services through approved platform APIs.

This architecture provides a consistent abstraction over operating system capabilities while keeping application code independent of Windows-specific implementations.

OfficeX applications must never communicate directly with Windows services.

All operating system interactions must pass through the Shared Runtime Platform Services.

---

# 2. Design Goals

The Platform Services layer must be:

* Secure
* Modular
* Replaceable
* Testable
* Platform-aware
* Asynchronous
* Extensible

---

# 3. Architecture Overview

```text id="p2mk91"
OfficeX Application

↓

Application Services

↓

Platform Services API

↓

Platform Adapters

↓

Windows APIs

↓

Operating System Services
```

Applications communicate only with Platform Services.

Platform adapters isolate Windows-specific implementation details.

---

# 4. Supported Platform Services

The Shared Runtime provides access to:

* File System
* Printing
* Clipboard
* Notifications
* Native Dialogs
* Default Browser
* URL Handling
* File Associations
* Window Management
* Desktop Integration
* Power Events
* Network Status
* Storage Information
* Process Information
* Time Zone
* Localization

Each service exposes a stable interface.

---

# 5. Repository Structure

```text id="k4xa83"
packages/

platform/

    src/

        filesystem/

        printing/

        clipboard/

        dialogs/

        notifications/

        browser/

        shell/

        power/

        network/

        storage/

        localization/

        process/

        adapters/

        interfaces/

        services/

        models/

        tests/
```

---

# 6. File System Service

Responsibilities:

* Open files
* Save files
* Create folders
* Delete files
* Copy
* Move
* Watch directories
* Read metadata

The implementation uses the Shared File Service rather than exposing operating system APIs directly to applications.

---

# 7. Printing Service

Capabilities:

* Enumerate available printers.
* Print documents.
* Print preview.
* Configure print settings.
* Monitor print status where supported.

Printing requests are coordinated through the Shared Runtime.

---

# 8. Clipboard Service

Supported operations:

* Read text
* Write text
* Read images
* Write images
* Clear clipboard

Clipboard access follows the application's permission and security model.

---

# 9. Native Dialog Service

Supported dialogs:

* Open File
* Save File
* Select Folder
* Confirmation
* Warning
* Error
* Information

Applications should use the shared dialog service instead of creating platform dialogs directly.

---

# 10. Notification Service

Supported notifications:

* Update available
* Document saved
* Background task completed
* Recovery completed
* Sync completed

Notifications should follow Windows notification guidelines where applicable.

---

# 11. Browser and URL Service

Capabilities:

* Open web links using the user's default browser.
* Validate URLs before opening.
* Handle application-specific deep links where supported.

Applications should not embed assumptions about browser implementations.

---

# 12. Power Management

The Platform Services layer monitors:

* System suspend
* Resume
* Shutdown
* Lock
* Unlock

Applications may respond by pausing background tasks, saving transient state, or refreshing resources after resume.

---

# 13. Network Status

The runtime tracks:

* Online
* Offline
* Limited connectivity

Applications use these events to adjust cloud-related features while remaining functional offline.

---

# 14. Storage Information

Available information includes:

* Available disk space
* Read-only status
* Volume availability
* Removable media detection

Storage information is used for validation and user feedback.

---

# 15. Process Information

Applications may obtain:

* Process identifier
* Application version
* Runtime version
* Memory usage
* CPU usage

These metrics support diagnostics and performance monitoring.

---

# 16. Localization

Platform Services expose:

* System language
* Regional settings
* Time zone
* Date and time preferences

Applications may use these settings as defaults while allowing user overrides.

---

# 17. Security

Requirements:

* Validate all requests before invoking platform APIs.
* Expose only approved capabilities to renderer processes.
* Use least-privilege access.
* Avoid unnecessary operating system interactions.
* Log privileged operations where appropriate.

---

# 18. Error Handling

Platform services return structured results.

Errors should include:

* Error category
* Human-readable message
* Optional diagnostic information

Applications should recover gracefully whenever possible.

---

# 19. Performance

Targets:

* Asynchronous platform operations by default.
* Minimal blocking of the main thread.
* Efficient resource usage.
* Shared platform service instances across applications.

---

# 20. Testing

Required tests:

* File operations
* Clipboard operations
* Native dialogs
* Printing
* Notifications
* Browser launching
* Network changes
* Power event handling
* Error scenarios

---

# 21. Extensibility

Future platform integrations may include:

* Additional cloud storage providers
* Enterprise authentication
* Collaboration services
* Platform-specific enhancements

New integrations should implement existing interfaces without requiring changes to application code.

---

# 22. Acceptance Criteria

The Windows Services Integration architecture is complete when:

* Applications use only Platform Services for operating system interactions.
* Platform-specific code is isolated in adapters.
* Services expose stable interfaces.
* Security and validation are consistently enforced.
* Applications remain independent of Windows implementation details.
* New platform capabilities can be added without redesigning existing application modules.

---

# 23. OfficeX Recommendations

Đối với bộ OfficeX, nên chia Platform Services thành các package độc lập như:

* `platform-filesystem`
* `platform-printing`
* `platform-clipboard`
* `platform-notifications`
* `platform-dialogs`
* `platform-network`
* `platform-shell`
* `platform-power`

Cách tổ chức này giúp Word, Excel, PowerPoint, AI và các ứng dụng khác dùng chung hạ tầng nền tảng nhưng vẫn giữ các thành phần tách biệt, dễ kiểm thử và dễ mở rộng trong tương lai.
