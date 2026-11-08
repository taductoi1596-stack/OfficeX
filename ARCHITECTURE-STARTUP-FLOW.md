# ARCHITECTURE.md

# Startup Flow Architecture

Version: 1.0

Status: Approved

---

# 1. Purpose

The Startup Flow defines the complete initialization sequence for every OfficeX Desktop application.

Its objectives are:

* Ensure deterministic startup behavior.
* Initialize shared infrastructure before application modules.
* Minimize startup time.
* Support crash recovery.
* Restore the previous workspace where applicable.
* Guarantee that applications reach a fully operational state consistently.

All OfficeX executables must follow the same startup lifecycle.

---

# 2. Design Goals

The startup process must be:

* Deterministic
* Fast
* Modular
* Observable
* Fault-tolerant
* Recoverable
* Secure
* Extensible

---

# 3. High-Level Startup Flow

```text id="1b0kza"
User Starts OfficeX

↓

Executable Bootstrap

↓

Environment Detection

↓

Shared Runtime Initialization

↓

Configuration Loading

↓

Dependency Injection

↓

Core Services Initialization

↓

Platform Services Initialization

↓

Window Manager Initialization

↓

Plugin Manager Initialization

↓

Crash Recovery Check

↓

Workspace Restoration

↓

Application Module Loading

↓

Main Window Creation

↓

Ready State
```

---

# 4. Startup Phases

The startup lifecycle consists of the following phases:

1. Bootstrap
2. Environment Detection
3. Runtime Initialization
4. Service Initialization
5. Application Initialization
6. User Interface Initialization
7. Ready State

Each phase completes before the next begins unless explicitly marked as asynchronous.

---

# 5. Bootstrap

Responsibilities:

* Launch executable.
* Initialize process.
* Load startup configuration.
* Verify executable integrity.
* Initialize logging.
* Register global exception handlers.

Bootstrap must complete before any application-specific code executes.

---

# 6. Environment Detection

Detect:

* Operating system version.
* Application edition (Installed / Portable).
* Runtime mode (Development / Production).
* Language.
* DPI scaling.
* Available monitors.
* Network availability.
* User profile location.

Environment information is cached for the current session.

---

# 7. Shared Runtime Initialization

Initialize:

* Dependency Injection Container.
* Configuration Service.
* Logging Service.
* Event Bus.
* IPC Framework.
* Platform Services.
* Theme Service.
* Localization Service.
* Diagnostics Service.

Applications must not initialize duplicate instances of shared services.

---

# 8. Configuration Loading

Load configuration in the following order:

1. Built-in defaults.
2. System configuration.
3. User configuration.
4. Workspace configuration.
5. Runtime overrides.

Configuration validation occurs before values become available to applications.

---

# 9. Dependency Injection

The Shared Runtime creates the Dependency Injection container.

Register:

* Shared services.
* Platform services.
* Application services.
* Extension points.

Applications resolve dependencies through interfaces only.

---

# 10. Core Service Initialization

Initialize:

* File Service.
* Clipboard Service.
* Printing Service.
* Notification Service.
* Theme Service.
* Localization Service.
* Window Manager.
* Plugin Manager.
* Update Service.

Critical services complete before the UI is displayed.

---

# 11. Platform Service Initialization

Initialize platform adapters for:

* File system.
* Native dialogs.
* Notifications.
* Printing.
* Browser integration.
* Network monitoring.
* Power events.

Initialization failures should be isolated and reported without terminating unrelated services where possible.

---

# 12. Window Manager Initialization

Initialize:

* Window Registry.
* Window Factory.
* Workspace Manager.
* Display detection.
* Saved window layouts.

No application windows are created until the Window Manager is ready.

---

# 13. Plugin Manager Initialization

Responsibilities:

* Discover installed plugins.
* Validate compatibility.
* Register extension points.
* Enable approved plugins.
* Disable incompatible plugins.

Plugin failures should not prevent application startup.

---

# 14. Crash Recovery Check

The Recovery Manager:

* Detects abnormal termination.
* Scans recovery records.
* Validates recoverable data.
* Prepares recovery options.

Recovery processing completes before document restoration begins.

---

# 15. Workspace Restoration

If enabled:

Restore:

* Open documents.
* Window layout.
* Active document.
* Cursor position.
* Zoom level.
* Split views.
* Panels.
* Session state.

Users may cancel workspace restoration.

---

# 16. Application Module Loading

Each application loads its own modules.

Examples:

OfficeX Word

* Editor
* Ribbon
* Spell Checker
* Review
* Export

OfficeX Excel

* Grid Engine
* Formula Engine
* Charts
* Pivot Tables

OfficeX PowerPoint

* Slide Engine
* Presenter View
* Animation Engine

Application modules remain independent of the Shared Runtime implementation.

---

# 17. Main Window Creation

The Window Manager creates:

* Main application window.
* Splash screen (optional).
* Secondary windows if required.

Window state is restored from the previous session when enabled.

---

# 18. Ready State

The application enters the Ready state when:

* Runtime initialized.
* Core services operational.
* Main window visible.
* UI responsive.
* Startup tasks completed or safely deferred.

The application is now ready to receive user input.

---

# 19. Deferred Initialization

Non-critical tasks may continue after Ready:

* Update checks.
* Plugin updates.
* Template indexing.
* AI model preparation.
* Cloud synchronization.
* Telemetry upload (if enabled).

Deferred tasks must not reduce UI responsiveness.

---

# 20. Error Recovery

If initialization fails:

* Record diagnostic information.
* Display an appropriate error or recovery interface.
* Allow retry where applicable.
* Continue with reduced functionality if safe.

Critical failures should terminate startup gracefully rather than leaving the application in an undefined state.

---

# 21. Performance Targets

Target startup metrics:

* Runtime bootstrap: < 300 ms
* Configuration loading: < 100 ms
* Core service initialization: < 500 ms
* Main window display: < 2 seconds
* Interactive Ready state: < 3 seconds

Actual targets may vary depending on hardware and document restoration.

---

# 22. Startup Sequence Diagram

```text id="g3v9pn"
Executable

↓

Bootstrap

↓

Environment Detection

↓

Shared Runtime

↓

Configuration

↓

Dependency Injection

↓

Core Services

↓

Platform Services

↓

Window Manager

↓

Plugin Manager

↓

Crash Recovery

↓

Workspace Restore

↓

Application Modules

↓

Main Window

↓

Ready
```

---

# 23. Testing

Required tests:

* Cold startup.
* Warm startup.
* Startup after update.
* Startup after crash.
* Portable edition startup.
* Installed edition startup.
* Missing configuration.
* Corrupted configuration.
* Plugin failures.
* Recovery workflow.
* Multi-monitor restoration.

---

# 24. Acceptance Criteria

The Startup Flow architecture is complete when:

* Every OfficeX application follows the same initialization lifecycle.
* Shared Runtime initializes before application modules.
* Startup is deterministic and reproducible.
* Recovery and workspace restoration occur before user interaction.
* Deferred tasks do not block the UI.
* Startup failures are handled gracefully.
* Performance targets are consistently met on supported systems.

---

# 25. OfficeX Recommendations

Để tối ưu trải nghiệm người dùng, OfficeX nên áp dụng **Progressive Startup**:

* Hiển thị cửa sổ chính càng sớm càng tốt.
* Đưa ứng dụng vào trạng thái Ready ngay khi các dịch vụ cốt lõi hoàn tất.
* Thực hiện các tác vụ không thiết yếu (kiểm tra cập nhật, đồng bộ đám mây, lập chỉ mục mẫu, chuẩn bị AI...) ở chế độ nền.

Cách tiếp cận này giúp ứng dụng phản hồi nhanh hơn ngay cả khi còn nhiều thành phần đang khởi tạo, đồng thời vẫn giữ kiến trúc rõ ràng và dễ mở rộng.
