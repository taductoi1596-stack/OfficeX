# ARCHITECTURE.md — Windows Registry Integration

Version: 1.0

Status: Approved

---

# 1. Purpose

The Windows Registry Integration module provides the official Windows registration required for OfficeX Desktop applications.

It enables:

* Application registration
* File associations
* Default application support
* Shell integration
* Installer integration
* Uninstaller registration
* Auto-start (optional)
* Update registration

All registry operations must be performed by the installer or elevated maintenance components where required.

Applications should not modify registry keys during normal operation unless explicitly required for user settings.

---

# 2. Design Goals

The Registry Integration layer must be:

* Safe
* Predictable
* Reversible
* Installer-driven
* Version-aware
* Windows compliant

---

# 3. Architecture

```text
OfficeX Installer

↓

Registry Service

↓

Registry Adapter

↓

Windows Registry
```

Applications communicate with the Registry Service rather than accessing the registry directly.

---

# 4. Responsibilities

The Registry Service manages:

* Application registration
* File type registration
* Icon registration
* Open command registration
* Uninstall information
* Installer metadata
* Update metadata
* Optional startup registration

---

# 5. Repository Structure

```text
packages/

registry/

    src/

        services/

        adapters/

        registration/

        filetypes/

        uninstall/

        startup/

        validation/

        interfaces/

        models/

        tests/
```

---

# 6. Registered Applications

The installer registers:

* OfficeX Launcher
* OfficeX Word
* OfficeX Excel
* OfficeX PowerPoint
* OfficeX AI
* OfficeX Settings
* OfficeX Updater

Each application includes:

* Display name
* Display icon
* Executable path
* Version
* Publisher
* Install location

---

# 7. File Associations

OfficeX Word

Supported extensions:

* .docx
* .doc
* .odt
* .rtf

OfficeX Excel

Supported extensions:

* .xlsx
* .xls
* .csv
* .ods

OfficeX PowerPoint

Supported extensions:

* .pptx
* .ppt
* .odp

The installer registers the appropriate file type information and open commands so Windows can launch the correct application.

Users should always be able to change their default application through Windows settings.

---

# 8. Application Registration

Applications should appear in:

* Start Menu
* Installed applications list
* Default Apps (where applicable)

Registration should include application metadata so Windows can identify each application correctly.

---

# 9. Installer Integration

The installer is responsible for:

* Creating Start Menu shortcuts
* Creating optional desktop shortcuts
* Registering uninstall information
* Registering supported file types (with user consent where appropriate)
* Writing version information for upgrade detection

---

# 10. Uninstaller

The uninstaller must:

* Remove application shortcuts.
* Remove OfficeX-specific registry entries created by the installer.
* Leave user documents untouched.
* Preserve user settings only if the user chooses to keep them.

No unrelated registry entries should be modified.

---

# 11. Update Registration

The updater stores:

* Installed version
* Installation path
* Update channel
* Last update timestamp

This information is used only by the OfficeX update mechanism.

---

# 12. Startup Registration

Optional components may register for startup if the user enables the feature.

Examples:

* Update checker
* Background synchronization

Startup behavior must always be user-configurable.

---

# 13. Validation

Before writing registry entries:

* Verify installation paths.
* Validate executable existence.
* Prevent duplicate registrations.
* Verify permissions.

All operations should report meaningful errors if validation fails.

---

# 14. Security

Registry integration must:

* Modify only OfficeX-owned entries.
* Respect Windows permissions and UAC.
* Avoid storing secrets in the registry.
* Minimize writes during normal application use.

Administrative privileges should only be requested when required by installation or maintenance tasks.

---

# 15. Upgrade Behavior

During upgrades:

* Preserve user preferences.
* Update application metadata.
* Update file associations only when requested or appropriate.
* Replace outdated installer registration cleanly.

---

# 16. Rollback

If installation fails:

* Remove partially created OfficeX registry entries.
* Restore the previous installation state where possible.
* Report the failure to the installer log.

---

# 17. Testing

Registry integration must be verified through:

* Fresh installation tests.
* Upgrade tests.
* Repair installation tests.
* Uninstall tests.
* File association tests.
* Startup option tests.
* Rollback tests.

---

# 18. Acceptance Criteria

The Windows Registry Integration module is complete when:

* OfficeX applications appear correctly in Windows.
* Supported file types open the correct application.
* Installation and uninstallation are clean.
* Updates preserve registration.
* Registry changes are limited to OfficeX-owned entries.
* All operations are reversible through uninstall or repair.

End of Windows Registry Integration
