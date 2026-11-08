# ARCHITECTURE.md

# Windows Installer (Setup.exe) Architecture

Version: 1.0

Status: Approved

---

# 1. Purpose

The OfficeX Installer is responsible for deploying, updating, repairing and removing the OfficeX Desktop Suite on Windows.

The installer must provide a professional installation experience while preserving user documents and respecting Windows installation standards.

---

# 2. Goals

The installer must support:

* Fresh installation
* Upgrade
* Repair
* Uninstall
* Silent installation
* Portable build (separate distribution)
* Per-user installation
* Per-machine installation (where permitted)
* Optional component selection
* Desktop shortcut creation
* Start Menu integration

---

# 3. Installer Overview

```text
User

↓

Setup.exe

↓

Prerequisite Check

↓

Installation Wizard

↓

Component Installer

↓

Registry Registration

↓

File Association Registration

↓

Shortcut Creation

↓

Configuration

↓

Installation Verification

↓

Launch OfficeX
```

---

# 4. Installed Applications

The installer deploys:

OfficeX Launcher

OfficeX Word

OfficeX Excel

OfficeX PowerPoint

OfficeX AI

OfficeX Settings

OfficeX Updater

Shared Runtime

Shared Libraries

Documentation

---

# 5. Installation Modes

### Standard

Recommended settings.

Installs all core applications.

Creates Start Menu shortcuts.

Optionally creates desktop shortcuts.

---

### Custom

Allows users to:

Choose installation location.

Select installed applications.

Choose shortcut options.

Enable or disable optional features.

Configure update channel.

---

### Silent

No user interaction.

Accepts command-line parameters.

Suitable for enterprise deployment.

---

# 6. Installation Layout

Example layout:

```text
C:\Program Files\OfficeX\

OfficeX Launcher.exe

OfficeX Word.exe

OfficeX Excel.exe

OfficeX PowerPoint.exe

OfficeX AI.exe

OfficeX Settings.exe

OfficeX Updater.exe

runtime\

packages\

plugins\

templates\

themes\

locales\

resources\

logs\
```

User-specific data should be stored in the user's profile rather than the installation directory.

---

# 7. Installation Phases

1. Verify package integrity.
2. Check operating system compatibility.
3. Check required runtime dependencies.
4. Request installation location.
5. Copy application files.
6. Register applications.
7. Register supported file associations.
8. Create shortcuts.
9. Write installer metadata.
10. Verify installation.
11. Optionally launch OfficeX Launcher.

---

# 8. Shared Runtime Deployment

The installer deploys one shared runtime used by all OfficeX applications.

Applications reference the shared runtime rather than shipping duplicate copies.

This reduces installation size and simplifies maintenance.

---

# 9. User Data Separation

Application binaries and user data are stored separately.

Examples of user data include:

* Preferences
* Recent files
* Templates
* Auto-recovery data
* Logs
* Custom themes
* Plugins installed by the user

Uninstall should never remove user data without explicit confirmation.

---

# 10. Shortcuts

The installer may create:

* Start Menu folder
* Desktop shortcuts (optional)
* Taskbar pinning is left to the user or operating system

Each application should have its own shortcut and icon.

---

# 11. File Associations

The installer registers supported document types for OfficeX applications.

The registration process should:

* Be reversible.
* Respect existing Windows behavior.
* Avoid overriding user choices without consent where required.

---

# 12. Upgrade Process

Upgrade flow:

```text
Detect Existing Installation

↓

Validate Compatibility

↓

Backup Installer Metadata

↓

Replace Application Files

↓

Migrate Configuration

↓

Refresh Registration

↓

Verify Installation
```

User documents and preferences should remain intact.

---

# 13. Repair Installation

Repair should:

* Restore missing files.
* Restore corrupted binaries.
* Recreate shortcuts.
* Re-register applications if needed.
* Verify installation integrity.

User content must not be modified.

---

# 14. Uninstall

Uninstall should:

* Remove application binaries.
* Remove installer-created shortcuts.
* Remove installer-created registrations.
* Leave user documents untouched.
* Offer to keep or remove user settings.

---

# 15. Update Integration

The installer registers OfficeX Updater.

Updates should:

* Verify package integrity.
* Preserve user settings.
* Support rollback where practical.
* Minimize downtime.

---

# 16. Logging

The installer records:

* Installation start and end.
* Selected options.
* Components installed.
* Upgrade actions.
* Errors.
* Repair actions.
* Uninstall actions.

Logs should assist troubleshooting without exposing sensitive information.

---

# 17. Security

Requirements:

* Verify package integrity before installation.
* Use signed installers when distributing production builds.
* Request elevated privileges only when required.
* Store no secrets in installer metadata.
* Fail safely if validation fails.

---

# 18. Performance Targets

Fresh installation: as efficient as practical for package size.

Upgrade: avoid reinstalling unchanged components.

Repair: verify and restore only affected components.

Installer startup should be responsive.

---

# 19. Enterprise Deployment

Support:

* Silent installation
* Command-line parameters
* Version detection
* Automated upgrades
* Repair through deployment tools where supported

Enterprise configuration should be documented separately.

---

# 20. Testing

Installer validation includes:

* Fresh installation
* Upgrade
* Downgrade handling
* Repair
* Uninstall
* Silent installation
* Shortcut verification
* File association verification
* Launch verification
* Rollback scenarios

---

# 21. Acceptance Criteria

The installer is complete when:

* OfficeX installs successfully.
* All selected applications launch correctly.
* Shared Runtime is deployed once.
* Shortcuts are created correctly.
* Supported file associations function.
* Upgrade preserves user data.
* Repair restores installation integrity.
* Uninstall removes installer-managed components cleanly.

End of Windows Installer Architecture
