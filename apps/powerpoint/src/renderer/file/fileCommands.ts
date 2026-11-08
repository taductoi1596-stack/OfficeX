/**
 * fileCommands.ts
 *
 * Complete File Command Registry for OfficeX PPT.
 * ~126 commands covering all file operations.
 * All commands route through CommandDispatcher → FileEngine.
 */

import { CommandDefinition } from '../CommandDispatcher';
import { FileEngine } from './FileEngine';
import { FileStorageEngine } from './FileStorageEngine';
import { FileRecoveryEngine } from './FileRecoveryEngine';
import { OneDriveEngine } from './onedrive/OneDriveEngine';
import { OneDriveAuthEngine } from './onedrive/OneDriveAuthEngine';
import { MicrosoftGraphEngine } from './onedrive/MicrosoftGraphEngine';
import { OneDriveSyncEngine } from './onedrive/OneDriveSyncEngine';

function cmd(
  id: string,
  name: string,
  handler: (api: any, payload?: any) => void,
  shortcut?: string
): CommandDefinition {
  return { id, name, shortcut, handler };
}

const FileCommands: CommandDefinition[] = [

  // ══ NEW Presentation ════════════════════════════════════════════════════════
  cmd('PPT.FILE.NEW',                   'New Presentation',            () => FileEngine.newPresentation(),                'Ctrl+N'),
  cmd('PPT.FILE.NEW.BLANK',             'New Blank Presentation',      () => FileEngine.newPresentation()),
  cmd('PPT.FILE.NEW.DEFAULT',           'New Default Presentation',    () => FileEngine.newPresentation('default')),
  cmd('PPT.FILE.NEW.WELCOME',           'Open Welcome Screen',     () => FileEngine.openWelcomeScreen()),
  cmd('PPT.FILE.NEW.RECENT_TEMPLATE',   'New from Recent Template', () => { /* FileMenu UI */ }),
  cmd('PPT.FILE.NEW.FROM_TEMPLATE',     'New from Template',       () => { /* FileMenu UI */ }),
  cmd('PPT.FILE.NEW.CUSTOM_TEMPLATE',   'New from Custom Template', () => { /* FileMenu template gallery */ }),
  cmd('PPT.FILE.NEW.EMPTY',             'New Empty Presentation',      () => FileEngine.newPresentation('empty')),

  // ══ OPEN ════════════════════════════════════════════════════════════════
  cmd('PPT.FILE.OPEN',                  'Open File',               () => FileEngine.openLocal(),                  'Ctrl+O'),
  cmd('PPT.FILE.OPEN.LOCAL',            'Open Local File',         () => FileEngine.openLocal()),
  cmd('PPT.FILE.OPEN.BROWSE',           'Browse File System',      () => FileEngine.openLocal()),
  cmd('PPT.FILE.OPEN.DRAG_DROP',        'Open By Drag And Drop',   (_, p) => p?.path && FileEngine.openFromPath(p.path)),
  cmd('PPT.FILE.OPEN.CONTEXT_MENU',     'Open From Explorer',      (_, p) => p?.path && FileEngine.openFromPath(p.path)),
  cmd('PPT.FILE.OPEN.DOUBLE_CLICK',     'Open By Double Click',    (_, p) => p?.path && FileEngine.openFromPath(p.path)),
  
  // ── OPEN RECENT
  cmd('PPT.FILE.OPEN.RECENT',           'Open Recent File',        (_, p) => p?.path ? FileEngine.openFromPath(p.path) : /* Open UI */ null, 'Ctrl+Shift+O'),
  cmd('PPT.FILE.OPEN.RECENT.CLEAR',     'Clear Recent Files',      () => FileStorageEngine.clearRecent()),
  cmd('PPT.FILE.OPEN.RECENT.PIN',       'Pin Recent File',         (_, p) => p?.id && FileStorageEngine.pinFile(p.id)),
  cmd('PPT.FILE.OPEN.RECENT.UNPIN',     'Unpin Recent File',       (_, p) => p?.id && FileStorageEngine.unpinFile(p.id)),
  cmd('PPT.FILE.OPEN.RECENT.REMOVE',    'Remove Recent File',      (_, p) => p?.id && FileStorageEngine.removeFromRecent(p.id)),
  cmd('PPT.FILE.OPEN.RECENT.RESTORE',   'Restore Recent File',     (_, p) => p?.id && FileEngine.restoreRecoveryPoint(p.id)),
  cmd('PPT.FILE.OPEN.RECENT.SEARCH',    'Search Recent Files',     () => { /* UI Action */ }),

  // ── OPEN PINNED
  cmd('PPT.FILE.OPEN.PINNED',           'Open Pinned Presentation',    (_, p) => p?.path && FileEngine.openFromPath(p.path)),
  cmd('PPT.FILE.OPEN.PINNED.ALL',       'Open All Pinned',         () => { /* Loop and open */ }),
  cmd('PPT.FILE.OPEN.PINNED.REMOVE',    'Remove Pinned',           (_, p) => p?.id && FileStorageEngine.unpinFile(p.id)),

  // ── OPEN CLOUD
  cmd('PPT.FILE.OPEN.CLOUD',            'Open Cloud Presentation',     () => { /* UI Action */ }),
  cmd('PPT.FILE.OPEN.ONEDRIVE',         'Open OneDrive Presentation',  () => { /* Auth and Pick */ }),
  cmd('PPT.FILE.OPEN.GOOGLE_DRIVE',     'Open Google Drive Presentation', () => { /* Auth and Pick */ }),
  cmd('PPT.FILE.OPEN.DROPBOX',          'Open Dropbox Presentation',   () => { /* Auth and Pick */ }),
  cmd('PPT.FILE.OPEN.SHAREPOINT',       'Open SharePoint Presentation',() => { /* Auth and Pick */ }),
  cmd('PPT.FILE.OPEN.CLOUD.SEARCH',     'Search Cloud Presentations',  () => { /* UI Action */ }),
  cmd('PPT.FILE.OPEN.CLOUD.OFFLINE',    'Open Cached Cloud File',  (_, p) => p?.path && FileEngine.openFromPath(p.path)),

  // ── OPEN READ ONLY
  cmd('PPT.FILE.OPEN.READONLY',         'Open Read Only',          (_, p) => p?.path && FileEngine.openReadOnly(p.path)),
  cmd('PPT.FILE.OPEN.READONLY.ALWAYS',  'Always Open Read Only',   () => { /* Preferences */ }),
  cmd('PPT.FILE.OPEN.READONLY.TEMP',    'Temporary Read Only',     (_, p) => p?.path && FileEngine.openReadOnly(p.path)),

  // ── OPEN PROTECTED
  cmd('PPT.FILE.OPEN.PROTECTED',        'Protected View',          (_, p) => p?.path && FileEngine.openReadOnly(p.path)),
  cmd('PPT.FILE.OPEN.PROTECTED.ENABLE', 'Enable Protected View',   () => FileEngine.setProtected(true)),
  cmd('PPT.FILE.OPEN.PROTECTED.DISABLE','Disable Protected View',  () => FileEngine.setProtected(false)),
  cmd('PPT.FILE.OPEN.PROTECTED.WARNING','Show Protected Warning',  () => { /* UI Action */ }),

  // ── OPEN SAFE MODE
  cmd('PPT.FILE.OPEN.SAFE',             'Open Safe Mode',          (_, p) => p?.path && FileEngine.openSafe(p.path)),
  cmd('PPT.FILE.OPEN.SAFE.NO_ADDINS',   'Disable Add-ins',         () => { /* Startup arg */ }),
  cmd('PPT.FILE.OPEN.SAFE.RECOVERY',    'Safe Recovery',           () => { /* Startup arg */ }),
  cmd('PPT.FILE.OPEN.SAFE.XML',         'Safe XML Loading',        () => { /* Parser arg */ }),

  // ── OPEN REPAIR
  cmd('PPT.FILE.OPEN.REPAIR',           'Open and Repair',         () => FileEngine.openAndRepair()),
  cmd('PPT.FILE.OPEN.REPAIR.XML',       'Repair OpenXML',          () => FileEngine.openAndRepair()),
  cmd('PPT.FILE.OPEN.REPAIR.MEDIA',     'Repair Media',            () => FileEngine.openAndRepair()),
  cmd('PPT.FILE.OPEN.REPAIR.FONTS',     'Repair Fonts',            () => FileEngine.openAndRepair()),
  cmd('PPT.FILE.OPEN.REPAIR.TABLES',    'Repair Tables',           () => FileEngine.openAndRepair()),
  cmd('PPT.FILE.OPEN.REPAIR.STYLES',    'Repair Styles',           () => FileEngine.openAndRepair()),

  // ── OPEN URL
  cmd('PPT.FILE.OPEN.URL',              'Open URL',                (_, p) => p?.url && FileEngine.openFromPath(p.url)),
  cmd('PPT.FILE.OPEN.HTTP',             'Open HTTP',               (_, p) => p?.url && FileEngine.openFromPath(p.url)),
  cmd('PPT.FILE.OPEN.HTTPS',            'Open HTTPS',              (_, p) => p?.url && FileEngine.openFromPath(p.url)),
  cmd('PPT.FILE.OPEN.WEBDAV',           'Open WebDAV',             (_, p) => p?.url && FileEngine.openFromPath(p.url)),

  // ── WORKSPACE
  cmd('PPT.FILE.OPEN.WORKSPACE',        'Open Workspace',          () => FileEngine.openWorkspace(), 'Alt+Ctrl+O'),
  cmd('PPT.FILE.OPEN.WORKSPACE.RECENT', 'Recent Workspace',        () => { /* UI Action */ }),
  cmd('PPT.FILE.OPEN.WORKSPACE.CLOUD',  'Cloud Workspace',         () => { /* UI Action */ }),
  cmd('PPT.FILE.OPEN.WORKSPACE.RESTORE','Restore Workspace',       () => FileEngine.restoreWorkspace()),

  // ── MULTIPLE
  cmd('PPT.FILE.OPEN.MULTIPLE',         'Open Multiple Presentations', (_, p) => p?.paths?.forEach((path: string) => FileEngine.openFromPath(path))),
  cmd('PPT.FILE.OPEN.MULTIPLE.FOLDER',  'Open Folder',             () => FileEngine.openFolder()),
  cmd('PPT.FILE.OPEN.MULTIPLE.PROJECT', 'Open Project',            () => FileEngine.openProject()),
  cmd('PPT.FILE.OPEN.MULTIPLE.RECENT',  'Open Recent Group',       () => { /* UI Action */ }),

  // ── RECOVERY
  cmd('PPT.FILE.OPEN.RECOVERY',         'Recover File',            (_, p) => p?.id && FileEngine.restoreRecoveryPoint(p.id)),
  cmd('PPT.FILE.OPEN.RECOVERY.AUTO',    'Auto Recovery',           () => FileEngine.restoreAutoRecovery()),
  cmd('PPT.FILE.OPEN.RECOVERY.SEARCH',  'Search Recovery Files',   () => { /* UI Action */ }),
  cmd('PPT.FILE.OPEN.RECOVERY.RESTORE', 'Restore Recovery',        (_, p) => p?.id && FileEngine.restoreRecoveryPoint(p.id)),

  // ── SPECIAL
  cmd('PPT.FILE.OPEN.TEMPLATE',         'Open Template',           () => { /* UI Action */ }),
  cmd('PPT.FILE.OPEN.EXAMPLE',          'Open Sample Presentation',    () => FileEngine.openExample()),
  cmd('PPT.FILE.OPEN.LAST',             'Open Last Presentation',      () => FileEngine.openLastPresentation()),
  cmd('PPT.FILE.OPEN.STARTUP',          'Open Startup Presentation',   () => FileEngine.openStartupPresentation()),

  // ══ CLOSE ═══════════════════════════════════════════════════════════════
  cmd('PPT.FILE.CLOSE',                 'Close',                   () => FileEngine.close(),                      'Ctrl+W'),
  cmd('PPT.FILE.CLOSE.ACTIVE',          'Close Active Presentation',   () => FileEngine.close()),
  cmd('PPT.FILE.CLOSE.ALL',             'Close All Presentations',     () => FileEngine.closeAll()),
  cmd('PPT.FILE.CLOSE.OTHERS',          'Close Other Presentations',   () => { /* Multi-Presentation */ }),
  cmd('PPT.FILE.CLOSE.WITHOUT_SAVE',    'Close Without Saving',    () => FileEngine.closeWithoutSave()),
  cmd('PPT.FILE.CLOSE.SAVE_AND_CLOSE',  'Save and Close',          () => FileEngine.saveAndClose()),

  // ══ SAVE ════════════════════════════════════════════════════════════════
  cmd('PPT.FILE.SAVE',                  'Save',                    () => FileEngine.save(),                       'Ctrl+S'),
  cmd('PPT.FILE.SAVE.ACTIVE',           'Save Active Presentation',    () => FileEngine.save()),
  cmd('PPT.FILE.SAVE.ALL',              'Save All Open Presentations', () => FileEngine.saveAll(),                    'Ctrl+Shift+S'),
  cmd('PPT.FILE.SAVE.SELECTED',         'Save Selected Presentation',  () => FileEngine.save()),
  cmd('PPT.FILE.SAVE.IF_DIRTY',         'Save Only If Modified',   () => FileEngine.saveIfDirty()),
  cmd('PPT.FILE.SAVE.FORCE',            'Force Save',              () => FileEngine.save()),
  cmd('PPT.FILE.SAVE.SILENT',           'Silent Save',             () => FileEngine.saveBackground()),
  cmd('PPT.FILE.SAVE.QUICK',            'Quick Save',              () => FileEngine.save()),

  // ── SAVE AS (format-specific) ════════════════════════════════════════════
  cmd('PPT.FILE.SAVE_AS',              'Save As',                 () => FileEngine.saveAs(),                     'F12'),
  cmd('PPT.FILE.SAVE_AS.PPTX',         'Save As PPTX',            () => FileEngine.saveAsFormat('pptx')),
  cmd('PPT.FILE.SAVE_AS.PPT',          'Save As PPT',             () => FileEngine.saveAsFormat('ppt')),
  cmd('PPT.FILE.SAVE_AS.ODP',          'Save As ODP',             () => FileEngine.saveAsFormat('odp')),
  cmd('PPT.FILE.SAVE_AS.POTX',         'Save As POTX',            () => FileEngine.saveAsFormat('potx')),
  cmd('PPT.FILE.SAVE_AS.PDF',          'Save As PDF',             () => FileEngine.saveAsFormat('pdf')),
  cmd('PPT.FILE.SAVE_AS.HTML',         'Save As HTML',            () => FileEngine.saveAsFormat('html')),
  cmd('PPT.FILE.SAVE_AS.MARKDOWN',     'Save As Markdown',        () => FileEngine.saveAsFormat('markdown')),
  cmd('PPT.FILE.SAVE_AS.TEXT',         'Save As TXT',             () => FileEngine.saveAsFormat('txt')),
  cmd('PPT.FILE.SAVE_AS.XML',          'Save As XML',             () => FileEngine.saveAsFormat('xml')),
  cmd('PPT.FILE.SAVE_AS.JSON',         'Save As JSON',            () => FileEngine.saveAsFormat('json')),

  // ── SAVE COPY ════════════════════════════════════════════════════════════
  cmd('PPT.FILE.SAVE_COPY',             'Save Copy',               () => FileEngine.saveCopy()),
  cmd('PPT.FILE.SAVE_COPY.LOCAL',       'Save Copy Local',         () => FileEngine.saveCopy()),
  cmd('PPT.FILE.SAVE_COPY.CLOUD',       'Save Copy Cloud',         () => { /* Cloud picker */ }),
  cmd('PPT.FILE.SAVE_COPY.PDF',         'Save Copy As PDF',        () => FileEngine.saveAsFormat('pdf')),
  cmd('PPT.FILE.SAVE_COPY.BACKUP',      'Save Backup Copy',        () => FileEngine.saveCopy()),

  // ── AUTO SAVE ════════════════════════════════════════════════════════════
  cmd('PPT.FILE.AUTOSAVE.ENABLE',       'Enable Auto Save',        () => FileEngine.enableAutoSave()),
  cmd('PPT.FILE.AUTOSAVE.DISABLE',      'Disable Auto Save',       () => FileEngine.disableAutoSave()),
  cmd('PPT.FILE.AUTOSAVE.START',        'Start Auto Save',         () => FileEngine.enableAutoSave()),
  cmd('PPT.FILE.AUTOSAVE.STOP',         'Stop Auto Save',          () => FileEngine.disableAutoSave()),
  cmd('PPT.FILE.AUTOSAVE.INTERVAL',     'Set Auto Save Interval',  (_, p) => p?.ms && FileEngine.setAutoSaveInterval(p.ms)),
  cmd('PPT.FILE.AUTOSAVE.STATUS',       'Get Auto Save Status',    () => { /* Get status */ }),
  cmd('PPT.FILE.AUTOSAVE.RESTORE',      'Restore Auto Save File',  () => FileEngine.restoreAutoRecovery()),
  cmd('PPT.FILE.AUTOSAVE.FLUSH',        'Force Auto Save',         () => FileEngine.saveBackground()),

  // ── SAVE VERSION ═════════════════════════════════════════════════════════
  cmd('PPT.FILE.VERSION.SAVE',          'Save Version',            (_, p) => FileEngine.saveVersion(p?.label, p?.comment)),
  cmd('PPT.FILE.VERSION.CREATE',        'Create Version',          (_, p) => FileEngine.saveVersion(p?.label, p?.comment)),
  cmd('PPT.FILE.VERSION.LABEL',         'Label Version',           (_, p) => p?.id && p?.label && FileStorageEngine.labelVersion(p.id, p.label)),
  cmd('PPT.FILE.VERSION.SNAPSHOT',      'Create Snapshot',         () => FileEngine.saveVersion('Snapshot', 'Auto-generated snapshot')),
  cmd('PPT.FILE.VERSION.MILESTONE',     'Create Milestone',        () => FileEngine.saveVersion('Milestone', 'Project Milestone')),

  // ── SAVE CLOUD ═══════════════════════════════════════════════════════════
  cmd('PPT.FILE.SAVE.CLOUD',            'Save To Cloud',           () => { /* UI Action */ }),
  cmd('PPT.FILE.SAVE.ONEDRIVE',         'Save To OneDrive',        () => { /* OneDrive Sync */ }),
  cmd('PPT.FILE.SAVE.SHAREPOINT',       'Save To SharePoint',      () => { /* SharePoint Sync */ }),
  cmd('PPT.FILE.SAVE.GOOGLE_DRIVE',     'Save To Google Drive',    () => { /* GDrive Sync */ }),
  cmd('PPT.FILE.SAVE.DROPBOX',          'Save To Dropbox',         () => { /* Dropbox Sync */ }),
  cmd('PPT.FILE.SAVE.ICLOUD',           'Save To iCloud',          () => { /* iCloud Sync */ }),
  cmd('PPT.FILE.SAVE.CLOUD.SYNC',       'Sync Cloud',              () => { /* Sync All */ }),
  cmd('PPT.FILE.SAVE.CLOUD.BACKGROUND','Background Cloud Sync',   () => { /* Background Sync */ }),

  // ── SAVE LOCAL ═══════════════════════════════════════════════════════════
  cmd('PPT.FILE.SAVE.LOCAL',            'Save Local',              () => FileEngine.save()),
  cmd('PPT.FILE.SAVE.LOCAL.NEWNAME',    'Save Local With New Name',() => FileEngine.saveAs()),
  cmd('PPT.FILE.SAVE.LOCAL.REPLACE',    'Replace Existing File',   () => FileEngine.save()),
  cmd('PPT.FILE.SAVE.LOCAL.READONLY',   'Save Read Only Copy',     () => FileEngine.saveCopy()),

  // ── BACKGROUND SAVE ══════════════════════════════════════════════════════
  cmd('PPT.FILE.SAVE.BACKGROUND',       'Background Save',         () => FileEngine.saveBackground()),
  cmd('PPT.FILE.SAVE.BACKGROUND.ALL',   'Background Save All',     () => FileEngine.saveBackground()),
  cmd('PPT.FILE.SAVE.BACKGROUND.CLOUD', 'Background Cloud Save',   () => { /* Cloud Save */ }),
  cmd('PPT.FILE.SAVE.BACKGROUND.LOCAL', 'Background Local Save',   () => FileEngine.saveBackground()),

  // ── RECOVERY SAVE ════════════════════════════════════════════════════════
  cmd('PPT.FILE.SAVE.RECOVERY',         'Recovery Save',           () => FileEngine.saveBackground()),
  cmd('PPT.FILE.SAVE.CRASH',            'Crash Recovery Save',     () => FileEngine.saveBackground()),
  cmd('PPT.FILE.SAVE.EMERGENCY',        'Emergency Save',          () => FileEngine.save()),
  cmd('PPT.FILE.SAVE.RESTORE_POINT',    'Create Restore Point',    () => FileEngine.saveVersion('Restore Point', 'Manual restore point')),

  // ── CONFLICT ═════════════════════════════════════════════════════════════
  cmd('PPT.FILE.SAVE.CONFLICT.DETECT',  'Detect Save Conflict',    () => { /* Logic */ }),
  cmd('PPT.FILE.SAVE.CONFLICT.RESOLVE', 'Resolve Conflict',        () => { /* UI Action */ }),
  cmd('PPT.FILE.SAVE.CONFLICT.KEEP_LOCAL', 'Keep Local Version',   () => { /* Logic */ }),
  cmd('PPT.FILE.SAVE.CONFLICT.KEEP_REMOTE','Keep Remote Version',  () => { /* Logic */ }),
  cmd('PPT.FILE.SAVE.CONFLICT.MERGE',   'Merge Changes',           () => { /* Merge Engine */ }),

  // ── VALIDATION ═══════════════════════════════════════════════════════════
  cmd('PPT.FILE.SAVE.VALIDATE',         'Validate Before Save',    () => { /* Logic */ }),
  cmd('PPT.FILE.SAVE.CHECK.PERMISSION', 'Check Write Permission',  () => { /* Logic */ }),
  cmd('PPT.FILE.SAVE.CHECK.LOCK',       'Check File Lock',         () => { /* Logic */ }),
  cmd('PPT.FILE.SAVE.CHECK.DISK',       'Check Disk Space',        () => { /* Logic */ }),
  cmd('PPT.FILE.SAVE.CHECK.PATH',       'Check Save Path',         () => { /* Logic */ }),

  // ══ EXIT ════════════════════════════════════════════════════════════════
  cmd('PPT.FILE.EXIT',                  'Exit OfficeX',            () => FileEngine.exit(),                       'Alt+F4'),
  cmd('PPT.FILE.EXIT.FORCE',            'Force Exit',              () => FileEngine.forceExit()),
  cmd('PPT.FILE.EXIT.SAVE_ALL',         'Save All and Exit',       () => FileEngine.saveAllAndExit()),
  cmd('PPT.FILE.EXIT.CANCEL',           'Cancel Exit',             () => { /* Cancel pending exit */ }),

  // ══ IMPORT ══════════════════════════════════════════════════════════════
  // ── DOC IMPORT
  cmd('PPT.FILE.IMPORT.DOC',            'Import Microsoft PPT DOC',() => FileEngine.importFrom('doc')),
  cmd('PPT.FILE.IMPORT.DOC.REPAIR',     'Import DOC With Repair',  () => FileEngine.importFrom('doc')),
  cmd('PPT.FILE.IMPORT.DOC.READONLY',   'Import DOC Read Only',    () => FileEngine.importFrom('doc')),
  cmd('PPT.FILE.IMPORT.DOC.CONVERT',    'Convert DOC To DOCX',     () => FileEngine.importFrom('doc')),

  // ── DOCX IMPORT
  cmd('PPT.FILE.IMPORT.pptx',           'Import DOCX',             () => FileEngine.importFrom('docx')),
  cmd('PPT.FILE.IMPORT.pptx.REPAIR',    'Repair DOCX',             () => FileEngine.importFrom('docx')),
  cmd('PPT.FILE.IMPORT.pptx.STRICT',    'Strict OpenXML',          () => FileEngine.importFrom('docx')),
  cmd('PPT.FILE.IMPORT.pptx.MERGE',     'Merge DOCX',              () => FileEngine.importFrom('docx')),
  cmd('PPT.FILE.IMPORT.pptx.READONLY',  'Read Only',               () => FileEngine.importFrom('docx')),

  // ── ODT IMPORT
  cmd('PPT.FILE.IMPORT.ODT',            'Import OpenPresentation Text',() => FileEngine.importFrom('odt')),
  cmd('PPT.FILE.IMPORT.ODT.CONVERT',    'Convert ODT',             () => FileEngine.importFrom('odt')),
  cmd('PPT.FILE.IMPORT.ODT.REPAIR',     'Repair ODT',              () => FileEngine.importFrom('odt')),

  // ── HTML IMPORT
  cmd('PPT.FILE.IMPORT.HTML',           'Import HTML',             () => FileEngine.importFrom('html')),
  cmd('PPT.FILE.IMPORT.HTML.CSS',       'Import CSS',              () => { /* UI Action */ }),
  cmd('PPT.FILE.IMPORT.HTML.IMAGES',    'Import Images',           () => { /* UI Action */ }),
  cmd('PPT.FILE.IMPORT.HTML.TABLES',    'Import Tables',           () => { /* UI Action */ }),
  cmd('PPT.FILE.IMPORT.HTML.CLEAN',     'Clean HTML',              () => { /* UI Action */ }),

  // ── TXT IMPORT
  cmd('PPT.FILE.IMPORT.TXT',            'Import Plain Text',       () => FileEngine.importFrom('txt')),
  cmd('PPT.FILE.IMPORT.TXT.UTF8',       'UTF-8',                   () => FileEngine.importFrom('txt')),
  cmd('PPT.FILE.IMPORT.TXT.UTF16',      'UTF-16',                  () => FileEngine.importFrom('txt')),
  cmd('PPT.FILE.IMPORT.TXT.ASCII',      'ASCII',                   () => FileEngine.importFrom('txt')),
  cmd('PPT.FILE.IMPORT.TXT.AUTO_DETECT','Auto Detect Encoding',    () => FileEngine.importFrom('txt')),

  // ── PDF IMPORT
  cmd('PPT.FILE.IMPORT.PDF',            'Import PDF',              () => FileEngine.importFrom('pdf')),
  cmd('PPT.FILE.IMPORT.PDF.OCR',        'OCR PDF',                 () => FileEngine.importFrom('pdf')),
  cmd('PPT.FILE.IMPORT.PDF.TEXT',       'Extract Text',            () => FileEngine.importFrom('pdf')),
  cmd('PPT.FILE.IMPORT.PDF.LAYOUT',     'Preserve Layout',         () => FileEngine.importFrom('pdf')),
  cmd('PPT.FILE.IMPORT.PDF.IMAGES',     'Extract Images',          () => FileEngine.importFrom('pdf')),
  cmd('PPT.FILE.IMPORT.PDF.TABLES',     'Extract Tables',          () => FileEngine.importFrom('pdf')),

  // ── XML IMPORT
  cmd('PPT.FILE.IMPORT.XML',            'Import XML',              () => FileEngine.importFrom('xml')),
  cmd('PPT.FILE.IMPORT.XML.OPENXML',    'OpenXML',                 () => FileEngine.importFrom('xml')),
  cmd('PPT.FILE.IMPORT.XML.CUSTOM',     'Custom XML',              () => FileEngine.importFrom('xml')),
  cmd('PPT.FILE.IMPORT.XML.MAPPING',    'Import XML Mapping',      () => { /* Logic */ }),

  // ── JSON IMPORT
  cmd('PPT.FILE.IMPORT.JSON',           'Import JSON',             () => FileEngine.importFrom('json')),
  cmd('PPT.FILE.IMPORT.JSON.CONTENT',   'Content',                 () => FileEngine.importFrom('json')),
  cmd('PPT.FILE.IMPORT.JSON.STYLES',    'Styles',                  () => FileEngine.importFrom('json')),
  cmd('PPT.FILE.IMPORT.JSON.METADATA',  'Metadata',                () => FileEngine.importFrom('json')),

  // ── MARKDOWN IMPORT
  cmd('PPT.FILE.IMPORT.MARKDOWN',       'Import Markdown',         () => FileEngine.importFrom('markdown')),
  cmd('PPT.FILE.IMPORT.MARKDOWN.GITHUB','GitHub Markdown',         () => FileEngine.importFrom('markdown')),
  cmd('PPT.FILE.IMPORT.MARKDOWN.COMMONMARK', 'CommonMark',         () => FileEngine.importFrom('markdown')),
  cmd('PPT.FILE.IMPORT.MARKDOWN.TABLES','Tables',                  () => { /* UI Action */ }),
  cmd('PPT.FILE.IMPORT.MARKDOWN.FOOTNOTES','Footnotes',            () => { /* UI Action */ }),

  // ── BATCH IMPORT
  cmd('PPT.FILE.IMPORT.BATCH',          'Batch Import',            () => { /* Logic */ }),
  cmd('PPT.FILE.IMPORT.BATCH.FOLDER',   'Import Folder',           () => { /* Logic */ }),
  cmd('PPT.FILE.IMPORT.BATCH.ZIP',      'Import Archive',          () => { /* Logic */ }),
  cmd('PPT.FILE.IMPORT.BATCH.WORKSPACE','Import Workspace',        () => { /* Logic */ }),

  // ── BACKGROUND IMPORT
  cmd('PPT.FILE.IMPORT.BACKGROUND',     'Background Import',       () => { /* Logic */ }),
  cmd('PPT.FILE.IMPORT.CANCEL',         'Cancel Import',           () => { /* Logic */ }),
  cmd('PPT.FILE.IMPORT.RETRY',          'Retry Import',            () => { /* Logic */ }),
  cmd('PPT.FILE.IMPORT.PROGRESS',       'Import Progress',         () => { /* Logic */ }),

  // ── MERGE
  cmd('PPT.FILE.IMPORT.MERGE',          'Merge Imported Presentation', () => { /* Logic */ }),
  cmd('PPT.FILE.IMPORT.APPEND',         'Append To Current Presentation', () => { /* Logic */ }),
  cmd('PPT.FILE.IMPORT.REPLACE',        'Replace Current Presentation',() => { /* Logic */ }),

  // ── VALIDATION
  cmd('PPT.FILE.IMPORT.VALIDATE',       'Validate File',           () => { /* Logic */ }),
  cmd('PPT.FILE.IMPORT.CHECK.FORMAT',   'Check Format',            () => { /* Logic */ }),
  cmd('PPT.FILE.IMPORT.CHECK.VERSION',  'Check Version',           () => { /* Logic */ }),
  cmd('PPT.FILE.IMPORT.CHECK.SECURITY', 'Check Security',          () => { /* Logic */ }),

  // ── RECOVERY
  cmd('PPT.FILE.IMPORT.RECOVER',        'Recover Corrupted File',  () => { /* Logic */ }),
  cmd('PPT.FILE.IMPORT.REPAIR',         'Repair Before Import',    () => { /* Logic */ }),
  cmd('PPT.FILE.IMPORT.SKIP_ERRORS',    'Skip Invalid Content',    () => { /* Logic */ }),

  // ══ EXPORT ══════════════════════════════════════════════════════════════
  // ── PDF EXPORT
  cmd('PPT.FILE.EXPORT.PDF',            'Export PDF',              () => FileEngine.exportAs('pdf')),
  cmd('PPT.FILE.EXPORT.PDF.STANDARD',   'Standard PDF',            () => FileEngine.exportAs('pdf')),
  cmd('PPT.FILE.EXPORT.PDF.PRINT',      'High Quality Print',      () => FileEngine.exportAs('pdf')),
  cmd('PPT.FILE.EXPORT.PDF.MINIMUM',    'Minimum Size',            () => FileEngine.exportAs('pdf')),
  cmd('PPT.FILE.EXPORT.PDF.PASSPPT',   'PassPPT Protected PDF',  () => FileEngine.exportAs('pdf')),
  cmd('PPT.FILE.EXPORT.PDF.PDFA',       'Export PDF/A',            () => FileEngine.exportAs('pdf')),
  cmd('PPT.FILE.EXPORT.PDF.BOOKMARKS',  'Include Bookmarks',       () => { /* UI Action */ }),
  cmd('PPT.FILE.EXPORT.PDF.HYPERLINKS', 'Include Hyperlinks',      () => { /* UI Action */ }),
  cmd('PPT.FILE.EXPORT.PDF.ACCESSIBILITY','Accessible PDF',        () => FileEngine.exportAs('pdf')),
  cmd('PPT.FILE.EXPORT.PDF.COMMENTS',   'Include Comments',        () => { /* UI Action */ }),
  cmd('PPT.FILE.EXPORT.PDF.TRACK_CHANGES','Include Track Changes', () => { /* UI Action */ }),
  cmd('PPT.FILE.EXPORT.PDF.EMBED_FONTS','Embed Fonts',             () => { /* UI Action */ }),
  cmd('PPT.FILE.EXPORT.PDF.COMPRESS',   'Compress Images',         () => { /* UI Action */ }),

  // ── HTML EXPORT
  cmd('PPT.FILE.EXPORT.HTML',           'Export HTML',             () => FileEngine.exportAs('html')),
  cmd('PPT.FILE.EXPORT.HTML.EMBED_IMAGES', 'Embed Images',         () => { /* UI Action */ }),
  cmd('PPT.FILE.EXPORT.HTML.EXTERNAL_IMAGES', 'External Images',   () => { /* UI Action */ }),
  cmd('PPT.FILE.EXPORT.HTML.CSS_INLINE','Inline CSS',              () => { /* UI Action */ }),
  cmd('PPT.FILE.EXPORT.HTML.CSS_FILE',  'External CSS',            () => { /* UI Action */ }),
  cmd('PPT.FILE.EXPORT.HTML.RESPONSIVE','Responsive HTML',         () => { /* UI Action */ }),
  cmd('PPT.FILE.EXPORT.HTML.MINIFY',    'Minify HTML',             () => { /* UI Action */ }),

  // ── DOCX EXPORT
  cmd('PPT.FILE.EXPORT.pptx',           'Export DOCX',             () => FileEngine.exportAs('docx')),
  cmd('PPT.FILE.EXPORT.pptx.STRICT',    'Strict Open XML',         () => FileEngine.exportAs('docx')),
  cmd('PPT.FILE.EXPORT.pptx.COMPATIBLE','Compatibility Mode',      () => FileEngine.exportAs('docx')),
  cmd('PPT.FILE.EXPORT.pptx.FLATTEN',   'Flatten Presentation',        () => FileEngine.exportAs('docx')),

  // ── ODT EXPORT
  cmd('PPT.FILE.EXPORT.ODT',            'Export ODT',              () => FileEngine.exportAs('odt')),
  cmd('PPT.FILE.EXPORT.ODT.COMPATIBLE', 'Compatibility Mode',      () => FileEngine.exportAs('odt')),
  cmd('PPT.FILE.EXPORT.ODT.STRICT',     'Strict ODF',              () => FileEngine.exportAs('odt')),

  // ── MARKDOWN EXPORT
  cmd('PPT.FILE.EXPORT.MARKDOWN',       'Export Markdown',         () => FileEngine.exportAs('markdown')),
  cmd('PPT.FILE.EXPORT.MARKDOWN.GITHUB','GitHub Markdown',         () => FileEngine.exportAs('markdown')),
  cmd('PPT.FILE.EXPORT.MARKDOWN.COMMONMARK', 'CommonMark',         () => FileEngine.exportAs('markdown')),
  cmd('PPT.FILE.EXPORT.MARKDOWN.WIKI',  'Wiki Markdown',           () => FileEngine.exportAs('markdown')),
  cmd('PPT.FILE.EXPORT.MARKDOWN.TABLES','Enable Tables',           () => { /* UI Action */ }),
  cmd('PPT.FILE.EXPORT.MARKDOWN.FOOTNOTES','Include Footnotes',    () => { /* UI Action */ }),

  // ── TEXT EXPORT
  cmd('PPT.FILE.EXPORT.TEXT',           'Export TXT',              () => FileEngine.exportAs('txt')),
  cmd('PPT.FILE.EXPORT.TEXT.UTF8',      'UTF-8',                   () => FileEngine.exportAs('txt')),
  cmd('PPT.FILE.EXPORT.TEXT.UTF16',     'UTF-16',                  () => FileEngine.exportAs('txt')),
  cmd('PPT.FILE.EXPORT.TEXT.ASCII',     'ASCII',                   () => FileEngine.exportAs('txt')),
  cmd('PPT.FILE.EXPORT.TEXT.UNICODE',   'Unicode',                 () => FileEngine.exportAs('txt')),

  // ── XML EXPORT
  cmd('PPT.FILE.EXPORT.XML',            'Export XML',              () => FileEngine.exportAs('xml')),
  cmd('PPT.FILE.EXPORT.XML.OPENXML',    'Open XML',                () => FileEngine.exportAs('xml')),
  cmd('PPT.FILE.EXPORT.XML.CUSTOM',     'Custom XML',              () => FileEngine.exportAs('xml')),
  cmd('PPT.FILE.EXPORT.XML.PACKAGE',    'Package XML',             () => FileEngine.exportAs('xml')),

  // ── JSON EXPORT
  cmd('PPT.FILE.EXPORT.JSON',           'Export JSON',             () => FileEngine.exportAs('json')),
  cmd('PPT.FILE.EXPORT.JSON.Presentation',  'Presentation Structure',      () => FileEngine.exportAs('json')),
  cmd('PPT.FILE.EXPORT.JSON.STYLES',    'Styles',                  () => FileEngine.exportAs('json')),
  cmd('PPT.FILE.EXPORT.JSON.METADATA',  'Metadata',                () => FileEngine.exportAs('json')),
  cmd('PPT.FILE.EXPORT.JSON.CONTENT',   'Content Only',            () => FileEngine.exportAs('json')),

  // ── EPUB EXPORT
  cmd('PPT.FILE.EXPORT.EPUB',           'Export EPUB',             () => FileEngine.exportAs('epub')),
  cmd('PPT.FILE.EXPORT.EPUB.VERSION2',  'EPUB2',                   () => FileEngine.exportAs('epub')),
  cmd('PPT.FILE.EXPORT.EPUB.VERSION3',  'EPUB3',                   () => FileEngine.exportAs('epub')),
  cmd('PPT.FILE.EXPORT.EPUB.TOC',       'Include TOC',             () => { /* UI Action */ }),
  cmd('PPT.FILE.EXPORT.EPUB.EMBED_FONTS','Embed Fonts',            () => { /* UI Action */ }),

  // ── IMAGE EXPORT
  cmd('PPT.FILE.EXPORT.IMAGE',          'Export Images',           () => FileEngine.exportAs('png')),
  cmd('PPT.FILE.EXPORT.PNG',            'PNG',                     () => FileEngine.exportAs('png')),
  cmd('PPT.FILE.EXPORT.JPG',            'JPEG',                    () => FileEngine.exportAs('jpg')),
  cmd('PPT.FILE.EXPORT.WEBP',           'WEBP',                    () => FileEngine.exportAs('webp')),
  cmd('PPT.FILE.EXPORT.TIFF',           'TIFF',                    () => FileEngine.exportAs('tiff')),
  cmd('PPT.FILE.EXPORT.BMP',            'BMP',                     () => FileEngine.exportAs('bmp')),
  cmd('PPT.FILE.EXPORT.SVG',            'SVG',                     () => FileEngine.exportAs('svg')),
  cmd('PPT.FILE.EXPORT.PAGE_IMAGE',     'Current Page',            () => FileEngine.exportAs('png')),
  cmd('PPT.FILE.EXPORT.ALL_PAGES',      'All Pages',               () => FileEngine.exportAs('png')),

  // ── BATCH EXPORT
  cmd('PPT.FILE.EXPORT.BATCH',          'Batch Export',            () => { /* Logic */ }),
  cmd('PPT.FILE.EXPORT.BATCH.PDF',      'Batch Export PDF',        () => { /* Logic */ }),
  cmd('PPT.FILE.EXPORT.BATCH.HTML',     'Batch Export HTML',       () => { /* Logic */ }),
  cmd('PPT.FILE.EXPORT.BATCH.MARKDOWN', 'Batch Export Markdown',   () => { /* Logic */ }),
  cmd('PPT.FILE.EXPORT.BATCH.IMAGE',    'Batch Export Image',      () => { /* Logic */ }),

  // ── BACKGROUND EXPORT
  cmd('PPT.FILE.EXPORT.BACKGROUND',     'Background Export',       () => { /* Logic */ }),
  cmd('PPT.FILE.EXPORT.CANCEL',         'Cancel Export',           () => { /* Logic */ }),
  cmd('PPT.FILE.EXPORT.RETRY',          'Retry Export',            () => { /* Logic */ }),
  cmd('PPT.FILE.EXPORT.PROGRESS',       'Export Progress',         () => { /* Logic */ }),

  // ══ PRINT ═══════════════════════════════════════════════════════════════
  cmd('PPT.FILE.PRINT',                 'Print',               () => FileEngine.print(),                                  'Ctrl+P'),
  cmd('PPT.FILE.PRINT.QUICK',           'Quick Print',         () => FileEngine.print()),
  cmd('PPT.FILE.PRINT.PREVIEW',         'Print Preview',       () => { /* Opens print preview dialog */ }),
  cmd('PPT.FILE.PRINT.SETTINGS',        'Print Settings',      () => { /* Opens print settings */ }),
  cmd('PPT.FILE.PRINT.DUPLEX',          'Duplex',              () => { /* Opens print settings for duplex */ }),
  cmd('PPT.FILE.PRINT.PAGERANGE',       'Page Range',          () => { /* Opens print settings for page range */ }),
  cmd('PPT.FILE.PRINT.COPIES',          'Copies',              () => { /* Opens print settings for copies */ }),
  cmd('PPT.FILE.PRINT.PAPERSIZE',       'Paper Size',          () => { /* Opens print settings for paper size */ }),

  // ══ SHARE ═══════════════════════════════════════════════════════════════
  cmd('PPT.FILE.SHARE',                 'Share Presentation',      () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.QUICK',           'Quick Share',         () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.AS_COPY',         'Share Copy',          () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.READONLY',        'Share Read Only',     () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.EDITABLE',        'Share Editable',      () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.PUBLIC',          'Public Share',        () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.PRIVATE',         'Private Share',       () => { /* UI Action */ }),

  // ── EMAIL
  cmd('PPT.FILE.SHARE.EMAIL',           'Share By Email',      () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.EMAIL.ATTACHMENT','Email Attachment',    () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.EMAIL.PDF',       'Email PDF',           () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.EMAIL.LINK',      'Email Link',          () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.EMAIL.ZIP',       'Email ZIP',           () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.EMAIL.ENCRYPTED', 'Encrypted Email',     () => { /* UI Action */ }),

  // ── ONEDRIVE
  cmd('PPT.FILE.SHARE.ONEDRIVE',        'Share OneDrive',      () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.ONEDRIVE.UPLOAD', 'Upload',              () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.ONEDRIVE.LINK',   'Generate Link',       () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.ONEDRIVE.PERMISSION', 'Manage Permission',() => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.ONEDRIVE.SYNC',   'Sync',                () => { /* UI Action */ }),

  // ── DROPBOX
  cmd('PPT.FILE.SHARE.DROPBOX',         'Share Dropbox',       () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.DROPBOX.UPLOAD',  'Upload',              () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.DROPBOX.LINK',    'Create Link',         () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.DROPBOX.PERMISSION', 'Permission',       () => { /* UI Action */ }),

  // ── GOOGLE DRIVE
  cmd('PPT.FILE.SHARE.GDRIVE',          'Share Google Drive',  () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.GDRIVE.UPLOAD',   'Upload',              () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.GDRIVE.LINK',     'Generate Link',       () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.GDRIVE.PERMISSION','Permission',         () => { /* UI Action */ }),

  // ── SHAREPOINT
  cmd('PPT.FILE.SHARE.SHAREPOINT',      'Share SharePoint',    () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.SHAREPOINT.SITE', 'Site Upload',         () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.SHAREPOINT.LIBRARY','Presentation Library',  () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.SHAREPOINT.PERMISSION','Permission',     () => { /* UI Action */ }),

  // ── BOX
  cmd('PPT.FILE.SHARE.BOX',             'Share Box',           () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.BOX.UPLOAD',      'Upload',              () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.BOX.LINK',        'Generate Link',       () => { /* UI Action */ }),

  // ── NEXTCLOUD
  cmd('PPT.FILE.SHARE.NEXTCLOUD',       'Share Nextcloud',     () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.NEXTCLOUD.UPLOAD','Upload',              () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.NEXTCLOUD.LINK',  'Generate Link',       () => { /* UI Action */ }),

  // ── INTERNAL SHARE
  cmd('PPT.FILE.SHARE.INTERNAL',        'Internal Share',      () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.INTERNAL.USER',   'Share To User',       () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.INTERNAL.GROUP',  'Share To Group',      () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.INTERNAL.DEPARTMENT','Share To Department',() => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.INTERNAL.ORGANIZATION','Organization Share',() => { /* UI Action */ }),

  // ── TEAM
  cmd('PPT.FILE.SHARE.TEAMS',           'Microsoft Teams',     () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.SLACK',           'Slack',               () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.DISCORD',         'Discord',             () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.ZOOM',            'Zoom',                () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.WEBEX',           'Cisco Webex',         () => { /* UI Action */ }),

  // ── LINK
  cmd('PPT.FILE.SHARE.LINK',            'Generate Link',       () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.LINK.READONLY',   'Read Only Link',      () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.LINK.EDIT',       'Editable Link',       () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.LINK.EXPIRE',     'Expiration Date',     () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.LINK.PASSPPT',   'PassPPT Protected',  () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.LINK.REVOKE',     'Revoke Link',         () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.LINK.SHORTEN',    'Short URL',           () => { /* UI Action */ }),

  // ── QR CODE
  cmd('PPT.FILE.SHARE.QR',              'Generate QR Code',    () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.QR.DOWNLOAD',     'Download QR',         () => { /* UI Action */ }),

  // ── PERMISSIONS
  cmd('PPT.FILE.SHARE.PERMISSION.READ', 'Read Permission',     () => { /* Logic */ }),
  cmd('PPT.FILE.SHARE.PERMISSION.WRITE','Write Permission',    () => { /* Logic */ }),
  cmd('PPT.FILE.SHARE.PERMISSION.COMMENT','Comment Permission',() => { /* Logic */ }),
  cmd('PPT.FILE.SHARE.PERMISSION.OWNER','Owner Permission',    () => { /* Logic */ }),
  cmd('PPT.FILE.SHARE.PERMISSION.REMOVE','Remove Permission',  () => { /* Logic */ }),

  // ── INVITATION
  cmd('PPT.FILE.SHARE.INVITE.USER',     'Invite User',         () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.INVITE.GROUP',    'Invite Group',        () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.INVITE.EMAIL',    'Invite Email',        () => { /* UI Action */ }),
  cmd('PPT.FILE.SHARE.INVITE.RESEND',   'Resend Invitation',   () => { /* UI Action */ }),

  // ── COLLABORATION
  cmd('PPT.FILE.SHARE.COLLAB.START',    'Start Collaboration', () => { /* Logic */ }),
  cmd('PPT.FILE.SHARE.COLLAB.STOP',     'Stop Collaboration',  () => { /* Logic */ }),
  cmd('PPT.FILE.SHARE.COLLAB.STATUS',   'Status',              () => { /* Logic */ }),
  cmd('PPT.FILE.SHARE.COLLAB.USERS',    'Connected Users',     () => { /* Logic */ }),

  // ── NOTIFICATION
  cmd('PPT.FILE.SHARE.NOTIFY',          'Notify Users',        () => { /* Logic */ }),
  cmd('PPT.FILE.SHARE.NOTIFY.EMAIL',    'Email Notification',  () => { /* Logic */ }),
  cmd('PPT.FILE.SHARE.NOTIFY.PUSH',     'Push Notification',   () => { /* Logic */ }),

  // ══ CLOUD ════════════════════════════════════════════════════════════════
  // ── LOGIN
  cmd('PPT.CLOUD.LOGIN',                'Login',               () => { /* UI Action */ }),
  cmd('PPT.CLOUD.LOGIN.ONEDRIVE',       'Login OneDrive',      () => { /* UI Action */ }),
  cmd('PPT.CLOUD.LOGIN.GOOGLE_DRIVE',   'Login Google Drive',  () => { /* UI Action */ }),
  cmd('PPT.CLOUD.LOGIN.DROPBOX',        'Login Dropbox',       () => { /* UI Action */ }),
  cmd('PPT.CLOUD.LOGIN.SHAREPOINT',     'Login SharePoint',    () => { /* UI Action */ }),
  cmd('PPT.CLOUD.LOGIN.BOX',            'Login Box',           () => { /* UI Action */ }),
  cmd('PPT.CLOUD.LOGIN.NEXTCLOUD',      'Login Nextcloud',     () => { /* UI Action */ }),
  cmd('PPT.CLOUD.LOGIN.S3',             'Login Amazon S3',     () => { /* UI Action */ }),
  cmd('PPT.CLOUD.LOGIN.AZURE',          'Login Azure Blob',    () => { /* UI Action */ }),
  cmd('PPT.CLOUD.LOGIN.WEBDAV',         'Login WebDAV',        () => { /* UI Action */ }),
  cmd('PPT.CLOUD.LOGIN.SMB',            'Login SMB',           () => { /* UI Action */ }),

  // ── LOGOUT
  cmd('PPT.CLOUD.LOGOUT',               'Logout',              () => { /* UI Action */ }),
  cmd('PPT.CLOUD.LOGOUT.ALL',           'Logout All Providers',() => { /* UI Action */ }),
  cmd('PPT.CLOUD.LOGOUT.ONEDRIVE',      'Logout OneDrive',     () => { /* UI Action */ }),
  cmd('PPT.CLOUD.LOGOUT.GOOGLE',        'Logout Google Drive', () => { /* UI Action */ }),
  cmd('PPT.CLOUD.LOGOUT.DROPBOX',       'Logout Dropbox',      () => { /* UI Action */ }),

  // ── ACCOUNT
  cmd('PPT.CLOUD.ACCOUNT.INFO',         'Account Information', () => { /* UI Action */ }),
  cmd('PPT.CLOUD.ACCOUNT.SWITCH',       'Switch Account',      () => { /* UI Action */ }),
  cmd('PPT.CLOUD.ACCOUNT.REMOVE',       'Remove Account',      () => { /* UI Action */ }),
  cmd('PPT.CLOUD.ACCOUNT.DEFAULT',      'Default Account',     () => { /* UI Action */ }),

  // ── UPLOAD
  cmd('PPT.CLOUD.UPLOAD',               'Upload',              () => { /* Logic */ }),
  cmd('PPT.CLOUD.UPLOAD.ACTIVE',        'Upload Active Presentation',() => { /* Logic */ }),
  cmd('PPT.CLOUD.UPLOAD.ALL',           'Upload All Presentations',() => { /* Logic */ }),
  cmd('PPT.CLOUD.UPLOAD.FOLDER',        'Upload Folder',       () => { /* Logic */ }),
  cmd('PPT.CLOUD.UPLOAD.BACKGROUND',    'Background Upload',   () => { /* Logic */ }),
  cmd('PPT.CLOUD.UPLOAD.RETRY',         'Retry Upload',        () => { /* Logic */ }),
  cmd('PPT.CLOUD.UPLOAD.CANCEL',        'Cancel Upload',       () => { /* Logic */ }),
  cmd('PPT.CLOUD.UPLOAD.PROGRESS',      'Upload Progress',     () => { /* Logic */ }),

  // ── DOWNLOAD
  cmd('PPT.CLOUD.DOWNLOAD',             'Download',            () => { /* Logic */ }),
  cmd('PPT.CLOUD.DOWNLOAD.LATEST',      'Download Latest Version',() => { /* Logic */ }),
  cmd('PPT.CLOUD.DOWNLOAD.SELECTED',    'Download Selected Version',() => { /* Logic */ }),
  cmd('PPT.CLOUD.DOWNLOAD.FOLDER',      'Download Folder',     () => { /* Logic */ }),
  cmd('PPT.CLOUD.DOWNLOAD.BACKGROUND',  'Background Download', () => { /* Logic */ }),
  cmd('PPT.CLOUD.DOWNLOAD.CANCEL',      'Cancel Download',     () => { /* Logic */ }),
  cmd('PPT.CLOUD.DOWNLOAD.PROGRESS',    'Progress',            () => { /* Logic */ }),

  // ── SYNC
  cmd('PPT.CLOUD.SYNC',                 'Sync',                () => { /* Logic */ }),
  cmd('PPT.CLOUD.SYNC.START',           'Start Sync',          () => { /* Logic */ }),
  cmd('PPT.CLOUD.SYNC.STOP',            'Stop Sync',           () => { /* Logic */ }),
  cmd('PPT.CLOUD.SYNC.ALL',             'Sync All',            () => { /* Logic */ }),
  cmd('PPT.CLOUD.SYNC.ACTIVE',          'Sync Active Presentation',() => { /* Logic */ }),
  cmd('PPT.CLOUD.SYNC.BACKGROUND',      'Background Sync',     () => { /* Logic */ }),
  cmd('PPT.CLOUD.SYNC.MANUAL',          'Manual Sync',         () => { /* Logic */ }),
  cmd('PPT.CLOUD.SYNC.AUTO',            'Auto Sync',           () => { /* Logic */ }),
  cmd('PPT.CLOUD.SYNC.STATUS',          'Sync Status',         () => FileStorageEngine.getAllCloudStatuses()),
  cmd('PPT.CLOUD.SYNC.RETRY',           'Retry Sync',          () => { /* Logic */ }),

  // ── OFFLINE CACHE
  cmd('PPT.CLOUD.CACHE.ENABLE',         'Enable Offline Cache',() => { /* Logic */ }),
  cmd('PPT.CLOUD.CACHE.DISABLE',        'Disable Offline Cache',() => { /* Logic */ }),
  cmd('PPT.CLOUD.CACHE.OPEN',           'Open Offline Copy',   () => { /* Logic */ }),
  cmd('PPT.CLOUD.CACHE.CLEAR',          'Clear Cache',         () => { /* Logic */ }),
  cmd('PPT.CLOUD.CACHE.REBUILD',        'Rebuild Cache',       () => { /* Logic */ }),
  cmd('PPT.CLOUD.CACHE.SIZE',           'Cache Size',          () => { /* Logic */ }),
  cmd('PPT.CLOUD.CACHE.STATUS',         'Cache Status',        () => { /* Logic */ }),
  cmd('PPT.CLOUD.CACHE.LOCATION',       'Cache Location',      () => { /* Logic */ }),

  // ── CLOUD VERSION
  cmd('PPT.CLOUD.VERSION.OPEN',         'Open Cloud Version',  () => { /* Logic */ }),
  cmd('PPT.CLOUD.VERSION.LATEST',       'Latest Version',      () => { /* Logic */ }),
  cmd('PPT.CLOUD.VERSION.RESTORE',      'Restore Version',     () => { /* Logic */ }),
  cmd('PPT.CLOUD.VERSION.DELETE',       'Delete Version',      () => { /* Logic */ }),
  cmd('PPT.CLOUD.VERSION.COMPARE',      'Compare Versions',    () => { /* Logic */ }),
  cmd('PPT.CLOUD.VERSION.HISTORY',      'Version History',     () => { /* Logic */ }),

  // ── CONFLICT
  cmd('PPT.CLOUD.CONFLICT.DETECT',      'Detect Conflict',     () => { /* Logic */ }),
  cmd('PPT.CLOUD.CONFLICT.RESOLVE',     'Resolve Conflict',    () => { /* Logic */ }),
  cmd('PPT.CLOUD.CONFLICT.KEEP_LOCAL',  'Keep Local Version',  () => { /* Logic */ }),
  cmd('PPT.CLOUD.CONFLICT.KEEP_REMOTE', 'Keep Cloud Version',  () => { /* Logic */ }),
  cmd('PPT.CLOUD.CONFLICT.MERGE',       'Merge Changes',       () => { /* Logic */ }),

  // ── PERMISSION
  cmd('PPT.CLOUD.PERMISSION.READ',      'Read Permission',     () => { /* Logic */ }),
  cmd('PPT.CLOUD.PERMISSION.WRITE',     'Write Permission',    () => { /* Logic */ }),
  cmd('PPT.CLOUD.PERMISSION.ADMIN',     'Administrator',       () => { /* Logic */ }),
  cmd('PPT.CLOUD.PERMISSION.REMOVE',    'Remove Permission',   () => { /* Logic */ }),

  // ── PROVIDER
  cmd('PPT.CLOUD.PROVIDER.ADD',         'Add Provider',        () => { /* Logic */ }),
  cmd('PPT.CLOUD.PROVIDER.REMOVE',      'Remove Provider',     () => { /* Logic */ }),
  cmd('PPT.CLOUD.PROVIDER.ENABLE',      'Enable Provider',     () => { /* Logic */ }),
  cmd('PPT.CLOUD.PROVIDER.DISABLE',     'Disable Provider',    () => { /* Logic */ }),
  cmd('PPT.CLOUD.PROVIDER.REFRESH',     'Refresh Provider',    () => { /* Logic */ }),

  // ── NOTIFICATION
  cmd('PPT.CLOUD.NOTIFY.ENABLE',        'Enable Notifications',() => { /* Logic */ }),
  cmd('PPT.CLOUD.NOTIFY.DISABLE',       'Disable Notifications',() => { /* Logic */ }),
  cmd('PPT.CLOUD.NOTIFY.SYNC',          'Sync Notification',   () => { /* Logic */ }),
  cmd('PPT.CLOUD.NOTIFY.CONFLICT',      'Conflict Notification',() => { /* Logic */ }),

  // ══ BACKUP ═══════════════════════════════════════════════════════════════
  cmd('PPT.FILE.BACKUP',                'Create Backup',       () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.NOW',            'Backup Now',          () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.ACTIVE',         'Backup Active Presentation',() => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.ALL',            'Backup All Presentations',() => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.FOLDER',         'Backup Folder',       () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.WORKSPACE',      'Backup Workspace',    () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.SNAPSHOT',       'Create Snapshot',     () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.FULL',           'Full Backup',         () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.INCREMENTAL',    'Incremental Backup',  () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.DIFFERENTIAL',   'Differential Backup', () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.CLOUD',          'Cloud Backup',        () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.LOCAL',          'Local Backup',        () => { /* Logic */ }),

  // ── AUTO BACKUP
  cmd('PPT.FILE.BACKUP.AUTO.ENABLE',    'Enable Auto Backup',  () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.AUTO.DISABLE',   'Disable Auto Backup', () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.AUTO.START',     'Start Auto Backup',   () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.AUTO.STOP',      'Stop Auto Backup',    () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.AUTO.STATUS',    'Auto Backup Status',  () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.AUTO.INTERVAL',  'Set Backup Interval', () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.AUTO.ON_SAVE',   'Backup On Save',      () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.AUTO.ON_CLOSE',  'Backup On Close',     () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.AUTO.ON_EXIT',   'Backup Before Exit',  () => { /* Logic */ }),

  // ── RESTORE
  cmd('PPT.FILE.BACKUP.RESTORE',        'Restore Backup',      () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.RESTORE.LATEST', 'Restore Latest Backup',() => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.RESTORE.SELECTED','Restore Selected Backup',() => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.RESTORE.VERSION','Restore Specific Version',() => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.RESTORE.PARTIAL','Partial Restore',     () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.RESTORE.ALL',    'Restore Entire Workspace',() => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.RESTORE.PREVIEW','Preview Backup',      () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.RESTORE.VERIFY', 'Verify Restore',      () => { /* Logic */ }),

  // ── DELETE BACKUP
  cmd('PPT.FILE.BACKUP.DELETE',         'Delete Backup',       () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.DELETE.SELECTED','Delete Selected Backup',() => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.DELETE.ALL',     'Delete All Backups',  () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.DELETE.EXPIRED', 'Delete Expired Backups',() => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.DELETE.LOCAL',   'Delete Local Backup', () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.DELETE.CLOUD',   'Delete Cloud Backup', () => { /* Logic */ }),

  // ── BACKUP SCHEDULE
  cmd('PPT.FILE.BACKUP.SCHEDULE',       'Backup Schedule',     () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.SCHEDULE.CREATE','Create Schedule',     () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.SCHEDULE.EDIT',  'Edit Schedule',       () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.SCHEDULE.DELETE','Delete Schedule',     () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.SCHEDULE.ENABLE','Enable Schedule',     () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.SCHEDULE.DISABLE','Disable Schedule',    () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.SCHEDULE.DAILY', 'Daily Backup',        () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.SCHEDULE.WEEKLY','Weekly Backup',       () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.SCHEDULE.MONTHLY','Monthly Backup',      () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.SCHEDULE.CUSTOM','Custom Schedule',     () => { /* Logic */ }),

  // ── ENCRYPTION
  cmd('PPT.FILE.BACKUP.ENCRYPT',        'Encrypt Backup',      () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.DECRYPT',        'Decrypt Backup',      () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.PASSPPT',       'Backup PassPPT',     () => { /* Logic */ }),

  // ── COMPRESSION
  cmd('PPT.FILE.BACKUP.COMPRESS',       'Compress Backup',     () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.COMPRESS.HIGH',  'High Compression',    () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.COMPRESS.FAST',  'Fast Compression',    () => { /* Logic */ }),

  // ── VALIDATION
  cmd('PPT.FILE.BACKUP.VERIFY',         'Verify Backup',       () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.CHECKSUM',       'Generate Checksum',   () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.INTEGRITY',      'Integrity Check',     () => { /* Logic */ }),

  // ── STORAGE
  cmd('PPT.FILE.BACKUP.LOCATION',       'Backup Location',     () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.MOVE',           'Move Backup',         () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.COPY',           'Copy Backup',         () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.SIZE',           'Backup Size',         () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.STATISTICS',     'Backup Statistics',   () => { /* Logic */ }),

  // ── HISTORY
  cmd('PPT.FILE.BACKUP.HISTORY',        'Backup History',      () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.HISTORY.OPEN',   'Open History',        () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.HISTORY.CLEAR',  'Clear History',       () => { /* Logic */ }),
  cmd('PPT.FILE.BACKUP.HISTORY.EXPORT', 'Export History',      () => { /* Logic */ }),

  // ══ RECENT FILES ═════════════════════════════════════════════════════════
  cmd('PPT.FILE.RECENT.OPEN',           'Open Recent File',    (_, p) => p?.path && FileEngine.openFromPath(p.path)),
  cmd('PPT.FILE.RECENT.CLEAR',          'Clear Recent Files',  () => FileStorageEngine.clearRecent()),
  cmd('PPT.FILE.RECENT.PIN',            'Pin File',            (_, p) => p?.id && FileStorageEngine.pinFile(p.id)),
  cmd('PPT.FILE.RECENT.UNPIN',          'Unpin File',          (_, p) => p?.id && FileStorageEngine.unpinFile(p.id)),
  cmd('PPT.FILE.RECENT.REMOVE',         'Remove from Recent',  (_, p) => p?.id && FileStorageEngine.removeFromRecent(p.id)),

  // ══ FILE PROPERTIES ══════════════════════════════════════════════════════
  cmd('PPT.FILE.PROPERTIES.OPEN',       'File Properties',     () => { /* Opens FileMenu on Info tab — handled by UI */ }),
  cmd('PPT.FILE.PROPERTIES.TITLE',      'Set Title',           (_, p) => p?.value && FileEngine.updateProperties({ title: p.value })),
  cmd('PPT.FILE.PROPERTIES.AUTHOR',     'Set Author',          (_, p) => p?.value && FileEngine.updateProperties({ author: p.value })),
  cmd('PPT.FILE.PROPERTIES.KEYPPTS',   'Set KeyPPTs',        (_, p) => p?.value && FileEngine.updateProperties({ keyPPTs: p.value })),
  cmd('PPT.FILE.PROPERTIES.SUBJECT',    'Set Subject',         (_, p) => p?.value && FileEngine.updateProperties({ subject: p.value })),
  cmd('PPT.FILE.PROPERTIES.CATEGORY',   'Set Category',        (_, p) => p?.value && FileEngine.updateProperties({ category: p.value })),
  cmd('PPT.FILE.PROPERTIES.COMPANY',    'Set Company',         (_, p) => p?.value && FileEngine.updateProperties({ company: p.value })),
  cmd('PPT.FILE.PROPERTIES.TAGS',       'Set Tags',            (_, p) => p?.tags && FileEngine.updateProperties({ tags: p.tags })),
  cmd('PPT.FILE.PROPERTIES.SECURITY',   'Security Info',       () => { /* Opens security panel */ }),

  // ══ VERSION HISTORY ═══════════════════════════════════════════════════════
  cmd('PPT.FILE.VERSION.HISTORY',       'Open Version History',() => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.HISTORY.OPEN',  'Open History Window', () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.HISTORY.CLOSE', 'Close History',       () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.HISTORY.REFRESH','Refresh History',    () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.HISTORY.SEARCH','Search Version',      () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.HISTORY.FILTER','Filter Version',      () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.HISTORY.PIN',   'Pin Version',         () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.HISTORY.UNPIN', 'Unpin Version',       () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.HISTORY.SORT',  'Sort History',        () => { /* Logic */ }),

  // ── CREATE VERSION
  cmd('PPT.FILE.VERSION.CREATE',        'Create Version',      (_, p) => FileEngine.saveVersion(p?.label, p?.comment)),
  cmd('PPT.FILE.VERSION.CREATE.MANUAL', 'Manual Version',      () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.CREATE.AUTO',   'Automatic Version',   () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.CREATE.SNAPSHOT','Snapshot',           () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.CREATE.MILESTONE','Milestone',         () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.CREATE.TAG',    'Tagged Version',      () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.CREATE.CLOUD',  'Cloud Version',       () => { /* Logic */ }),

  // ── COMPARE VERSION
  cmd('PPT.FILE.VERSION.COMPARE',       'Compare Versions',    () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.COMPARE.LATEST','Compare Latest',      () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.COMPARE.SELECTED','Compare Selected',  () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.COMPARE.CLOUD', 'Compare Cloud Version',() => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.COMPARE.LOCAL', 'Compare Local Version',() => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.COMPARE.CONTENT','Compare Content',    () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.COMPARE.STYLES','Compare Styles',      () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.COMPARE.FORMATTING','Compare Formatting',() => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.COMPARE.COMMENTS','Compare Comments',  () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.COMPARE.TRACKCHANGES','Compare Track Changes',() => { /* Logic */ }),

  // ── RESTORE
  cmd('PPT.FILE.VERSION.RESTORE',       'Restore Version',     (_, p) => p?.id && FileEngine.restoreVersion(p.id)),
  cmd('PPT.FILE.VERSION.RESTORE.LATEST','Restore Latest',      () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.RESTORE.SELECTED','Restore Selected',  () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.RESTORE.CLOUD', 'Restore Cloud Version',() => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.RESTORE.LOCAL', 'Restore Local Version',() => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.RESTORE.SNAPSHOT','Restore Snapshot',  () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.RESTORE.PREVIEW','Preview Before Restore',() => { /* Logic */ }),

  // ── DELETE
  cmd('PPT.FILE.VERSION.DELETE',        'Delete Version',      (_, p) => p?.id && FileRecoveryEngine.deleteVersion(p.id)),
  cmd('PPT.FILE.VERSION.DELETE.SELECTED','Delete Selected',    () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.DELETE.ALL',    'Delete All Versions', () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.DELETE.EXPIRED','Delete Expired Versions',() => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.DELETE.LOCAL',  'Delete Local Versions',() => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.DELETE.CLOUD',  'Delete Cloud Versions',() => { /* Logic */ }),

  // ── EXPORT VERSION
  cmd('PPT.FILE.VERSION.EXPORT',        'Export Version',      () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.EXPORT.PDF',    'Export As PDF',       () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.EXPORT.pptx',   'Export DOCX',         () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.EXPORT.HTML',   'Export HTML',         () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.EXPORT.MARKDOWN','Export Markdown',    () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.EXPORT.JSON',   'Export JSON',         () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.EXPORT.XML',    'Export XML',          () => { /* Logic */ }),

  // ── IMPORT VERSION
  cmd('PPT.FILE.VERSION.IMPORT',        'Import Version',      () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.IMPORT.LOCAL',  'Import Local Version',() => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.IMPORT.CLOUD',  'Import Cloud Version',() => { /* Logic */ }),

  // ── SNAPSHOT
  cmd('PPT.FILE.VERSION.SNAPSHOT.CREATE','Create Snapshot',    () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.SNAPSHOT.RESTORE','Restore Snapshot',  () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.SNAPSHOT.DELETE','Delete Snapshot',    () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.SNAPSHOT.EXPORT','Export Snapshot',    () => { /* Logic */ }),

  // ── CLOUD VERSION
  cmd('PPT.FILE.VERSION.CLOUD.OPEN',    'Open Cloud Version',  () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.CLOUD.SYNC',    'Sync Versions',       () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.CLOUD.DOWNLOAD','Download Version',    () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.CLOUD.UPLOAD',  'Upload Version',      () => { /* Logic */ }),

  // ── LABEL
  cmd('PPT.FILE.VERSION.LABEL.ADD',     'Add Label',           () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.LABEL.EDIT',    'Edit Label',          () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.LABEL.DELETE',  'Delete Label',        () => { /* Logic */ }),

  // ── NOTES
  cmd('PPT.FILE.VERSION.NOTES.ADD',     'Add Version Notes',   () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.NOTES.EDIT',    'Edit Notes',          () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.NOTES.DELETE',  'Delete Notes',        () => { /* Logic */ }),

  // ── AUDIT
  cmd('PPT.FILE.VERSION.AUDIT.OPEN',    'Audit History',       () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.AUDIT.EXPORT',  'Export Audit',        () => { /* Logic */ }),
  cmd('PPT.FILE.VERSION.AUDIT.CLEAR',   'Clear Audit',         () => { /* Logic */ }),

  // ══ RECOVERY ══════════════════════════════════════════════════════════════
  // ── AUTO RECOVERY
  cmd('PPT.FILE.RECOVERY.AUTO',         'Enable Auto Recovery',() => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.AUTO.START',   'Start Auto Recovery', () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.AUTO.STOP',    'Stop Auto Recovery',  () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.AUTO.STATUS',  'Recovery Status',     () => FileEngine.getRecoveryPoints()),
  cmd('PPT.FILE.RECOVERY.AUTO.INTERVAL','Recovery Interval',   () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.AUTO.SAVE',    'Create Recovery Snapshot',() => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.AUTO.DELETE',  'Delete Recovery Snapshot',() => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.AUTO.CLEAN',   'Clean Recovery Cache',() => { /* Logic */ }),

  // ── RECOVERY SEARCH
  cmd('PPT.FILE.RECOVERY.SEARCH',       'Search Recovery Files',() => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.SEARCH.LOCAL', 'Search Local Recovery',() => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.SEARCH.CLOUD', 'Search Cloud Recovery',() => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.SEARCH.BACKUP','Search Backup Files', () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.SEARCH.TEMP',  'Search Temporary Files',() => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.SEARCH.AUTOSAVE','Search AutoSave Files',() => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.SEARCH.ALL',   'Search All Sources',  () => { /* Logic */ }),

  // ── REPAIR
  cmd('PPT.FILE.RECOVERY.REPAIR',       'Repair Presentation',     () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.REPAIR.OPENXML','Repair OpenXML Package',() => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.REPAIR.XML',   'Repair XML',          () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.REPAIR.MEDIA', 'Repair Images',       () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.REPAIR.TABLES','Repair Tables',       () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.REPAIR.STYLES','Repair Styles',       () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.REPAIR.FONTS', 'Repair Fonts',        () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.REPAIR.HEADERS','Repair Headers',     () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.REPAIR.FOOTERS','Repair Footers',     () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.REPAIR.HYPERLINKS','Repair Hyperlinks',() => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.REPAIR.COMMENTS','Repair Comments',   () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.REPAIR.TRACKCHANGES','Repair Track Changes',() => { /* Logic */ }),

  // ── RESTORE
  cmd('PPT.FILE.RECOVERY.RESTORE',      'Restore Presentation',    (_, p) => p?.id && FileEngine.restoreRecoveryPoint(p.id)),
  cmd('PPT.FILE.RECOVERY.RESTORE.LATEST','Restore Latest',     () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.RESTORE.SELECTED','Restore Selected Recovery',() => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.RESTORE.VERSION','Restore Version',   () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.RESTORE.CLOUD','Restore Cloud Version',() => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.RESTORE.BACKUP','Restore Backup',     () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.RESTORE.TEMP', 'Restore Temporary File',() => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.RESTORE.SNAPSHOT','Restore Snapshot', () => { /* Logic */ }),

  // ── SCAN
  cmd('PPT.FILE.RECOVERY.SCAN',         'Scan Presentation',       () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.SCAN.FULL',    'Full Scan',           () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.SCAN.QUICK',   'Quick Scan',          () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.SCAN.OPENXML', 'OpenXML Scan',        () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.SCAN.MEDIA',   'Media Scan',          () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.SCAN.TABLES',  'Table Scan',          () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.SCAN.STYLES',  'Style Scan',          () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.SCAN.SECURITY','Security Scan',       () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.SCAN.INTEGRITY','Integrity Scan',     () => { /* Logic */ }),

  // ── REBUILD
  cmd('PPT.FILE.RECOVERY.REBUILD',      'Rebuild Presentation',    () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.REBUILD.OPENXML','Rebuild OpenXML Package',() => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.REBUILD.XML',  'Rebuild XML',         () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.REBUILD.MEDIA','Rebuild Media',       () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.REBUILD.TABLES','Rebuild Tables',     () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.REBUILD.STYLES','Rebuild Styles',     () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.REBUILD.FONTS','Rebuild Fonts',       () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.REBUILD.INDEX','Rebuild Index',       () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.REBUILD.METADATA','Rebuild Metadata', () => { /* Logic */ }),

  // ── VALIDATION
  cmd('PPT.FILE.RECOVERY.VALIDATE',     'Validate Presentation',   () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.VALIDATE.XML', 'Validate XML',        () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.VALIDATE.OPENXML','Validate Package', () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.VALIDATE.SIGNATURE','Validate Signature',() => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.VALIDATE.CHECKSUM','Checksum Validation',() => { /* Logic */ }),

  // ── HISTORY
  cmd('PPT.FILE.RECOVERY.HISTORY',      'Recovery History',    () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.HISTORY.OPEN', 'Open History',        () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.HISTORY.DELETE','Delete History',     (_, p) => p?.id && FileRecoveryEngine.deleteRecoveryPoint(p.id)),
  cmd('PPT.FILE.RECOVERY.HISTORY.CLEAR','Clear History',       () => { /* Logic */ }),

  // ── CACHE
  cmd('PPT.FILE.RECOVERY.CACHE.OPEN',   'Open Cache',          () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.CACHE.CLEAR',  'Clear Cache',         () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.CACHE.REBUILD','Rebuild Cache',       () => { /* Logic */ }),

  // ── EMERGENCY
  cmd('PPT.FILE.RECOVERY.EMERGENCY',    'Emergency Recovery',  () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.CRASH',        'Crash Recovery',      () => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.POWERFAILURE', 'Power Failure Recovery',() => { /* Logic */ }),
  cmd('PPT.FILE.RECOVERY.FORCE',        'Force Recovery',      () => { /* Logic */ }),

  // ══ SECURITY ══════════════════════════════════════════════════════════════
  // ── ENCRYPTION
  cmd('PPT.FILE.SECURITY.ENCRYPT',      'Encrypt Presentation',    () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.ENCRYPT.AES128','AES-128 Encryption', () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.ENCRYPT.AES256','AES-256 Encryption', () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.ENCRYPT.CUSTOM','Custom Encryption',  () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.ENCRYPT.OPEN', 'Encrypt On Open',     () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.ENCRYPT.SAVE', 'Encrypt On Save',     () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.ENCRYPT.REMOVE','Remove Encryption',  () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.ENCRYPT.CHANGE_KEY','Change Encryption Key',() => { /* Logic */ }),

  // ── PASSPPT
  cmd('PPT.FILE.SECURITY.PASSPPT.SET', 'Set PassPPT',        () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.PASSPPT.CHANGE','Change PassPPT',   () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.PASSPPT.REMOVE','Remove PassPPT',   () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.PASSPPT.OPEN','PassPPT To Open',    () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.PASSPPT.MODIFY','PassPPT To Modify',() => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.PASSPPT.VERIFY','Verify PassPPT',   () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.PASSPPT.EXPIRE','PassPPT Expiration',() => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.PASSPPT.POLICY','PassPPT Policy',   () => { /* Logic */ }),

  // ── Presentation PROTECTION
  cmd('PPT.FILE.SECURITY.PROTECT',      'Protect Presentation',    () => FileEngine.setProtected(true)),
  cmd('PPT.FILE.SECURITY.PROTECT.EDITING','Restrict Editing',  () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.PROTECT.FORMATTING','Restrict Formatting',() => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.PROTECT.COMMENTS','Comments Only',    () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.PROTECT.FORMS','Forms Only',          () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.PROTECT.TRACKCHANGES','Track Changes Only',() => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.PROTECT.CONTENT','Protect Content',   () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.PROTECT.METADATA','Protect Metadata', () => { /* Logic */ }),

  // ── READ ONLY
  cmd('PPT.FILE.SECURITY.READONLY',     'Read Only',           () => FileEngine.setReadOnly(!FileEngine.getCurrentFile()?.isReadOnly)),
  cmd('PPT.FILE.SECURITY.READONLY.RECOMMENDED','Recommend Read Only',() => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.READONLY.FORCE','Force Read Only',    () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.READONLY.TEMPORARY','Temporary Read Only',() => { /* Logic */ }),

  // ── REMOVE PROTECTION
  cmd('PPT.FILE.SECURITY.UNPROTECT',    'Remove Protection',   () => FileEngine.setProtected(false)),
  cmd('PPT.FILE.SECURITY.UNPROTECT.EDITING','Remove Editing Restriction',() => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.UNPROTECT.FORMATTING','Remove Formatting Restriction',() => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.UNPROTECT.READONLY','Remove Read Only',() => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.UNPROTECT.ALL','Remove All Protection',() => { /* Logic */ }),

  // ── RIGHTS MANAGEMENT (RMS)
  cmd('PPT.FILE.SECURITY.RMS.ENABLE',   'Enable RMS',          () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.RMS.DISABLE',  'Disable RMS',         () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.RMS.APPLY',    'Apply Rights Policy', () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.RMS.REMOVE',   'Remove Rights Policy',() => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.RMS.READ',     'Read Permission',     () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.RMS.EDIT',     'Edit Permission',     () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.RMS.PRINT',    'Print Permission',    () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.RMS.COPY',     'Copy Permission',     () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.RMS.EXPORT',   'Export Permission',   () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.RMS.EXPIRE',   'Expiration Policy',   () => { /* Logic */ }),

  // ── DIGITAL RIGHTS MANAGEMENT (DRM)
  cmd('PPT.FILE.SECURITY.DRM.ENABLE',   'Enable DRM',          () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.DRM.DISABLE',  'Disable DRM',         () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.DRM.ACTIVATE', 'Activate License',    () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.DRM.DEACTIVATE','Deactivate License', () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.DRM.VALIDATE', 'Validate License',    () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.DRM.REVOKE',   'Revoke License',      () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.DRM.OFFLINE',  'Offline License',     () => { /* Logic */ }),

  // ══ PERMISSIONS & ACL ═══════════════════════════════════════════════════
  // ── GRANT
  cmd('PPT.FILE.PERMISSION.GRANT',      'Grant Permission',    () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.GRANT.USER', 'Grant To User',       () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.GRANT.GROUP','Grant To Group',      () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.GRANT.ROLE', 'Grant Role',          () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.GRANT.DOMAIN','Grant Domain',       () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.GRANT.PUBLIC','Grant Public Access',() => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.GRANT.GUEST','Grant Guest Access',  () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.GRANT.LINK', 'Grant Via Share Link',() => { /* Logic */ }),

  // ── REVOKE
  cmd('PPT.FILE.PERMISSION.REVOKE',     'Revoke Permission',   () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.REVOKE.USER','Remove User Permission',() => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.REVOKE.GROUP','Remove Group Permission',() => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.REVOKE.PUBLIC','Remove Public Access',() => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.REVOKE.GUEST','Remove Guest Access',() => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.REVOKE.ALL', 'Remove All Permissions',() => { /* Logic */ }),

  // ── READ
  cmd('PPT.FILE.PERMISSION.READ',       'Read Permission',     () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.READ.GRANT', 'Grant Read',          () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.READ.REMOVE','Remove Read',         () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.READ.VERIFY','Verify Read Access',  () => { /* Logic */ }),

  // ── WRITE
  cmd('PPT.FILE.PERMISSION.WRITE',      'Write Permission',    () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.WRITE.GRANT','Grant Write',         () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.WRITE.REMOVE','Remove Write',       () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.WRITE.VERIFY','Verify Write Access',() => { /* Logic */ }),

  // ── OWNER
  cmd('PPT.FILE.PERMISSION.OWNER',      'Owner Permission',    () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.OWNER.SET',  'Set Owner',           () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.OWNER.CHANGE','Transfer Ownership', () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.OWNER.REMOVE','Remove Owner',       () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.OWNER.VERIFY','Verify Ownership',   () => { /* Logic */ }),

  // ── ADMINISTRATOR
  cmd('PPT.FILE.PERMISSION.ADMIN',      'Administrator Permission',() => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.ADMIN.GRANT','Grant Administrator', () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.ADMIN.REMOVE','Remove Administrator',() => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.ADMIN.VERIFY','Verify Administrator',() => { /* Logic */ }),

  // ── ROLES
  cmd('PPT.FILE.PERMISSION.ROLE.CREATE','Create Role',         () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.ROLE.DELETE','Delete Role',         () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.ROLE.EDIT',  'Edit Role',           () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.ROLE.CLONE', 'Clone Role',          () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.ROLE.DEFAULT','Default Role',       () => { /* Logic */ }),

  // ── ACCESS CONTROL
  cmd('PPT.FILE.PERMISSION.ACL.OPEN',   'Open ACL',            () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.ACL.ADD',    'Add ACL Entry',       () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.ACL.REMOVE', 'Remove ACL Entry',    () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.ACL.RESET',  'Reset ACL',           () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.ACL.INHERIT','Enable Inheritance',  () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.ACL.BREAK',  'Break Inheritance',   () => { /* Logic */ }),

  // ── PERMISSION TEMPLATES
  cmd('PPT.FILE.PERMISSION.TEMPLATE.OPEN','Open Templates',    () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.TEMPLATE.APPLY','Apply Template',   () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.TEMPLATE.CREATE','Create Template', () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.TEMPLATE.DELETE','Delete Template', () => { /* Logic */ }),

  // ── POLICY
  cmd('PPT.FILE.PERMISSION.POLICY.APPLY','Apply Policy',       () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.POLICY.REMOVE','Remove Policy',     () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.POLICY.VALIDATE','Validate Policy', () => { /* Logic */ }),

  // ── VALIDATION
  cmd('PPT.FILE.PERMISSION.VALIDATE',   'Validate Permission', () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.CHECK.ACCESS','Check Access',       () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.CHECK.USER', 'Check User',          () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.CHECK.GROUP','Check Group',         () => { /* Logic */ }),

  // ── AUDIT
  cmd('PPT.FILE.PERMISSION.AUDIT.OPEN', 'Open Audit',          () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.AUDIT.EXPORT','Export Audit',       () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.AUDIT.CLEAR','Clear Audit',         () => { /* Logic */ }),
  cmd('PPT.FILE.PERMISSION.AUDIT.HISTORY','Permission History',() => { /* Logic */ }),

  // ── CERTIFICATES
  cmd('PPT.FILE.SECURITY.CERTIFICATE.ADD','Add Certificate',   () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.CERTIFICATE.REMOVE','Remove Certificate',() => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.CERTIFICATE.VERIFY','Verify Certificate',() => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.CERTIFICATE.EXPORT','Export Certificate',() => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.CERTIFICATE.IMPORT','Import Certificate',() => { /* Logic */ }),

  // ── WATERMARK
  cmd('PPT.FILE.SECURITY.WATERMARK.ADD','Add Watermark',       () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.WATERMARK.REMOVE','Remove Watermark', () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.WATERMARK.CONFIDENTIAL','Confidential',() => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.WATERMARK.SECRET','Secret',           () => { /* Logic */ }),

  // ── AUDIT
  cmd('PPT.FILE.SECURITY.AUDIT.OPEN',   'Open Audit Log',      () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.AUDIT.EXPORT', 'Export Audit',        () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.AUDIT.CLEAR',  'Clear Audit',         () => { /* Logic */ }),
  cmd('PPT.FILE.SECURITY.AUDIT.VIEW',   'View Security Events',() => { /* Logic */ }),

  // ══ DIGITAL SIGNATURE ═══════════════════════════════════════════════════
  // ── DIGITAL SIGNATURE
  cmd('PPT.FILE.SIGNATURE.CREATE',      'Create Digital Signature',() => { /* Logic */ }),
  cmd('PPT.FILE.SIGNATURE.APPLY',       'Apply Signature',     () => { /* Logic */ }),
  cmd('PPT.FILE.SIGNATURE.ADD',         'Add Signature',       () => { /* Logic */ }),
  cmd('PPT.FILE.SIGNATURE.MULTIPLE',    'Multiple Signatures', () => { /* Logic */ }),
  cmd('PPT.FILE.SIGNATURE.TIMESTAMP',   'Timestamp Signature', () => { /* Logic */ }),
  cmd('PPT.FILE.SIGNATURE.VISIBLE',     'Visible Signature',   () => { /* Logic */ }),
  cmd('PPT.FILE.SIGNATURE.INVISIBLE',   'Invisible Signature', () => { /* Logic */ }),
  cmd('PPT.FILE.SIGNATURE.SMARTCARD',   'Smart Card Signature',() => { /* Logic */ }),
  cmd('PPT.FILE.SIGNATURE.HSM',         'Hardware Security Module',() => { /* Logic */ }),
  cmd('PPT.FILE.SIGNATURE.TOKEN',       'USB Token',           () => { /* Logic */ }),

  // ── CERTIFICATE
  cmd('PPT.FILE.CERTIFICATE.OPEN',      'Open Certificate',    () => { /* Logic */ }),
  cmd('PPT.FILE.CERTIFICATE.SELECT',    'Select Certificate',  () => { /* Logic */ }),
  cmd('PPT.FILE.CERTIFICATE.IMPORT',    'Import Certificate',  () => { /* Logic */ }),
  cmd('PPT.FILE.CERTIFICATE.EXPORT',    'Export Certificate',  () => { /* Logic */ }),
  cmd('PPT.FILE.CERTIFICATE.DELETE',    'Delete Certificate',  () => { /* Logic */ }),
  cmd('PPT.FILE.CERTIFICATE.DEFAULT',   'Default Certificate', () => { /* Logic */ }),
  cmd('PPT.FILE.CERTIFICATE.STORE',     'Certificate Store',   () => { /* Logic */ }),
  cmd('PPT.FILE.CERTIFICATE.TRUSTED',   'Trusted Certificates',() => { /* Logic */ }),
  cmd('PPT.FILE.CERTIFICATE.ROOT',      'Root Certificates',   () => { /* Logic */ }),
  cmd('PPT.FILE.CERTIFICATE.RENEW',     'Renew Certificate',   () => { /* Logic */ }),
  cmd('PPT.FILE.CERTIFICATE.REVOKED',   'Check Revocation',    () => { /* Logic */ }),

  // ── VALIDATION
  cmd('PPT.FILE.SIGNATURE.VALIDATE',    'Validate Signature',  () => { /* Logic */ }),
  cmd('PPT.FILE.SIGNATURE.VALIDATE.CERTIFICATE','Validate Certificate',() => { /* Logic */ }),
  cmd('PPT.FILE.SIGNATURE.VALIDATE.TIMESTAMP','Validate Timestamp',() => { /* Logic */ }),
  cmd('PPT.FILE.SIGNATURE.VALIDATE.CHAIN','Validate Certificate Chain',() => { /* Logic */ }),
  cmd('PPT.FILE.SIGNATURE.VALIDATE.TRUST','Validate Trust',    () => { /* Logic */ }),
  cmd('PPT.FILE.SIGNATURE.VALIDATE.INTEGRITY','Validate Presentation Integrity',() => { /* Logic */ }),
  cmd('PPT.FILE.SIGNATURE.VALIDATE.ONLINE','Online Validation',() => { /* Logic */ }),
  cmd('PPT.FILE.SIGNATURE.VALIDATE.OFFLINE','Offline Validation',() => { /* Logic */ }),

  // ── REMOVE SIGNATURE
  cmd('PPT.FILE.SIGNATURE.REMOVE',      'Remove Signature',    () => { /* Logic */ }),
  cmd('PPT.FILE.SIGNATURE.REMOVE.ALL',  'Remove All Signatures',() => { /* Logic */ }),
  cmd('PPT.FILE.SIGNATURE.REMOVE.SELECTED','Remove Selected Signature',() => { /* Logic */ }),
  cmd('PPT.FILE.SIGNATURE.REMOVE.INVALID','Remove Invalid Signature',() => { /* Logic */ }),

  // ── TRUST
  cmd('PPT.FILE.SIGNATURE.TRUST.ADD',   'Add Trusted Certificate',() => { /* Logic */ }),
  cmd('PPT.FILE.SIGNATURE.TRUST.REMOVE','Remove Trusted Certificate',() => { /* Logic */ }),
  cmd('PPT.FILE.SIGNATURE.TRUST.LIST',  'Trusted Certificate List',() => { /* Logic */ }),

  // ── AUDIT
  cmd('PPT.FILE.SIGNATURE.AUDIT.OPEN',  'Open Audit',          () => { /* Logic */ }),
  cmd('PPT.FILE.SIGNATURE.AUDIT.EXPORT','Export Audit',        () => { /* Logic */ }),
  cmd('PPT.FILE.SIGNATURE.AUDIT.CLEAR', 'Clear Audit',         () => { /* Logic */ }),

  // ══ TEMPLATE ══════════════════════════════════════════════════════════════
  // ── OPEN TEMPLATE
  cmd('PPT.FILE.TEMPLATE.OPEN',         'Open Template',       () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.OPEN.LOCAL',   'Open Local Template', () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.OPEN.CLOUD',   'Open Cloud Template', () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.OPEN.ENTERPRISE','Open Enterprise Template',() => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.OPEN.RECENT',  'Open Recent Template',() => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.OPEN.DEFAULT', 'Open Default Template',() => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.OPEN.CUSTOM',  'Open Custom Template',() => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.OPEN.READONLY','Open Read Only Template',() => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.OPEN.PROTECTED','Open Protected Template',() => { /* Logic */ }),

  // ── SAVE TEMPLATE
  cmd('PPT.FILE.TEMPLATE.SAVE',         'Save Template',       () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.SAVE.AS',      'Save Template As',    () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.SAVE.LOCAL',   'Save Local Template', () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.SAVE.CLOUD',   'Save Cloud Template', () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.SAVE.ENTERPRISE','Save Enterprise Template',() => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.SAVE.PERSONAL','Save Personal Template',() => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.SAVE.SHARED',  'Save Shared Template',() => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.SAVE.OVERWRITE','Overwrite Template', () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.SAVE.COPY',    'Save Template Copy',  () => { /* Logic */ }),

  // ── APPLY TEMPLATE
  cmd('PPT.FILE.TEMPLATE.APPLY',        'Apply Template',      () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.APPLY.STYLE',  'Apply Style Template',() => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.APPLY.THEME',  'Apply Theme Template',() => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.APPLY.PAGE',   'Apply Page Template', () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.APPLY.SECTION','Apply Section Template',() => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.APPLY.CONTENT','Apply Content Template',() => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.APPLY.Presentation','Apply Entire Template',() => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.APPLY.MULTIPLE','Apply Multiple Templates',() => { /* Logic */ }),

  // ── DEFAULT TEMPLATE
  cmd('PPT.FILE.TEMPLATE.DEFAULT',      'Default Template',    () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.DEFAULT.SET',  'Set Default Template',() => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.DEFAULT.RESET','Reset Default Template',() => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.DEFAULT.OPEN', 'Open Default Template',() => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.DEFAULT.RESTORE','Restore Built-in Template',() => { /* Logic */ }),

  // ── TEMPLATE GALLERY
  cmd('PPT.FILE.TEMPLATE.GALLERY.OPEN', 'Open Gallery',        () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.GALLERY.REFRESH','Refresh Gallery',   () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.GALLERY.SEARCH','Search Templates',   () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.GALLERY.FILTER','Filter Templates',   () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.GALLERY.PIN',  'Pin Template',        () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.GALLERY.UNPIN','Unpin Template',      () => { /* Logic */ }),

  // ── TEMPLATE CATEGORY
  cmd('PPT.FILE.TEMPLATE.CATEGORY.BUSINESS','Business',        () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.CATEGORY.LETTER','Letter',            () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.CATEGORY.REPORT','Report',            () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.CATEGORY.RESUME','Resume',            () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.CATEGORY.INVOICE','Invoice',          () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.CATEGORY.FORM','Forms',               () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.CATEGORY.ACADEMIC','Academic',        () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.CATEGORY.LEGAL','Legal',              () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.CATEGORY.CUSTOM','Custom',            () => { /* Logic */ }),

  // ── TEMPLATE MANAGEMENT
  cmd('PPT.FILE.TEMPLATE.RENAME',       'Rename Template',     () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.DELETE',       'Delete Template',     () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.DUPLICATE',    'Duplicate Template',  () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.EXPORT',       'Export Template',     () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.IMPORT',       'Import Template',     () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.VALIDATE',     'Validate Template',   () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.REPAIR',       'Repair Template',     () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.UPGRADE',      'Upgrade Template',    () => { /* Logic */ }),

  // ── TEMPLATE CACHE
  cmd('PPT.FILE.TEMPLATE.CACHE.OPEN',   'Open Cache',          () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.CACHE.CLEAR',  'Clear Cache',         () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.CACHE.REBUILD','Rebuild Cache',       () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.CACHE.REFRESH','Refresh Cache',       () => { /* Logic */ }),

  // ── CLOUD TEMPLATE
  cmd('PPT.FILE.TEMPLATE.CLOUD.SYNC',   'Sync Templates',      () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.CLOUD.DOWNLOAD','Download Template',  () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.CLOUD.UPLOAD', 'Upload Template',     () => { /* Logic */ }),
  cmd('PPT.FILE.TEMPLATE.CLOUD.SHARE',  'Share Template',      () => { /* Logic */ }),

  // ══ Presentation COMPARISON ═════════════════════════════════════════════════
  // ── COMPARE PresentationS
  cmd('PPT.FILE.COMPARE',               'Compare Presentations',   () => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.OPEN',          'Open Compare Dialog', () => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.START',         'Start Comparison',    () => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.STOP',          'Stop Comparison',     () => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.LOCAL',         'Compare Local Presentations',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.CLOUD',         'Compare Cloud Presentations',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.ACTIVE',        'Compare Active Presentation',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.SELECTED',      'Compare Selected Presentations',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.SIDEBYSIDE',    'Side By Side Compare',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.RESULT',        'Open Comparison Result',() => { /* Logic */ }),

  // ── MERGE
  cmd('PPT.FILE.MERGE',                 'Merge Presentations',     () => { /* Logic */ }),
  cmd('PPT.FILE.MERGE.START',           'Start Merge',         () => { /* Logic */ }),
  cmd('PPT.FILE.MERGE.AUTO',            'Automatic Merge',     () => { /* Logic */ }),
  cmd('PPT.FILE.MERGE.MANUAL',          'Manual Merge',        () => { /* Logic */ }),
  cmd('PPT.FILE.MERGE.CONFLICT',        'Resolve Merge Conflict',() => { /* Logic */ }),
  cmd('PPT.FILE.MERGE.ACCEPT',          'Accept Merge',        () => { /* Logic */ }),
  cmd('PPT.FILE.MERGE.REJECT',          'Reject Merge',        () => { /* Logic */ }),
  cmd('PPT.FILE.MERGE.SAVE',            'Save Merged Presentation',() => { /* Logic */ }),
  cmd('PPT.FILE.MERGE.EXPORT',          'Export Merge Result', () => { /* Logic */ }),

  // ── COMPARE FORMATTING
  cmd('PPT.FILE.COMPARE.FORMATTING',    'Compare Formatting',  () => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.FORMATTING.STYLES','Compare Styles',   () => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.FORMATTING.FONTS','Compare Fonts',     () => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.FORMATTING.COLORS','Compare Colors',   () => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.FORMATTING.TABLES','Compare Tables',   () => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.FORMATTING.IMAGES','Compare Images',   () => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.FORMATTING.LAYOUT','Compare Layout',   () => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.FORMATTING.PAGESETUP','Compare Page Setup',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.FORMATTING.HEADERS','Compare Headers', () => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.FORMATTING.FOOTERS','Compare Footers', () => { /* Logic */ }),

  // ── COMPARE VERSION
  cmd('PPT.FILE.COMPARE.VERSION',       'Compare Version',     () => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.VERSION.LATEST','Compare Latest Version',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.VERSION.SELECTED','Compare Selected Version',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.VERSION.LOCAL', 'Compare Local Version',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.VERSION.CLOUD', 'Compare Cloud Version',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.VERSION.HISTORY','Compare Version History',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.VERSION.BASELINE','Compare Against Baseline',() => { /* Logic */ }),

  // ── CONTENT COMPARISON
  cmd('PPT.FILE.COMPARE.CONTENT',       'Compare Content',     () => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.CONTENT.TEXT',  'Compare Text',        () => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.CONTENT.COMMENTS','Compare Comments',  () => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.CONTENT.FOOTNOTES','Compare Footnotes',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.CONTENT.ENDNOTES','Compare Endnotes',  () => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.CONTENT.HYPERLINKS','Compare Hyperlinks',() => { /* Logic */ }),

  // ── TRACK CHANGES
  cmd('PPT.FILE.COMPARE.TRACKCHANGES',  'Compare Track Changes',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.REVISIONS',     'Compare Revisions',   () => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.AUTHORS',       'Compare Authors',     () => { /* Logic */ }),

  // ── FILTER
  cmd('PPT.FILE.COMPARE.FILTER.TEXT',   'Filter Text',         () => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.FILTER.FORMATTING','Filter Formatting',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.FILTER.IMAGES', 'Filter Images',       () => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.FILTER.COMMENTS','Filter Comments',    () => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.FILTER.STYLES', 'Filter Styles',       () => { /* Logic */ }),

  // ── REPORT
  cmd('PPT.FILE.COMPARE.REPORT',        'Comparison Report',   () => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.REPORT.HTML',   'Export HTML Report',  () => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.REPORT.PDF',    'Export PDF Report',   () => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.REPORT.JSON',   'Export JSON Report',  () => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.REPORT.XML',    'Export XML Report',   () => { /* Logic */ }),

  // ── REVIEW
  cmd('PPT.FILE.COMPARE.REVIEW.OPEN',   'Open Review Panel',   () => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.REVIEW.NEXT',   'Next Difference',     () => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.REVIEW.PREVIOUS','Previous Difference',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.REVIEW.ACCEPT', 'Accept Change',       () => { /* Logic */ }),
  cmd('PPT.FILE.COMPARE.REVIEW.REJECT', 'Reject Change',       () => { /* Logic */ }),

  // ══ Presentation INSPECTOR ══════════════════════════════════════════════════
  // ── INSPECT Presentation
  cmd('PPT.FILE.INSPECT',               'Inspect Presentation',    () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.START',         'Start Inspection',    () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.STOP',          'Stop Inspection',     () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.REFRESH',       'Refresh Inspection',  () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.RESULTS',       'Inspection Results',  () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.EXPORT',        'Export Report',       () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.PRINT',         'Print Report',        () => { /* Logic */ }),

  // ── HIDDEN DATA
  cmd('PPT.FILE.INSPECT.HIDDEN',        'Inspect Hidden Data', () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.HIDDEN.TEXT',   'Hidden Text',         () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.HIDDEN.OBJECTS','Hidden Objects',      () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.HIDDEN.SHAPES', 'Hidden Shapes',       () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.HIDDEN.IMAGES', 'Hidden Images',       () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.HIDDEN.BOOKMARKS','Hidden Bookmarks',  () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.HIDDEN.FIELDS', 'Hidden Fields',       () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.HIDDEN.CONTROLS','Hidden Controls',    () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.HIDDEN.LAYERS', 'Hidden Layers',       () => { /* Logic */ }),

  // ── METADATA
  cmd('PPT.FILE.INSPECT.METADATA',      'Inspect Metadata',    () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.METADATA.AUTHOR','Author',             () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.METADATA.COMPANY','Company',           () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.METADATA.MANAGER','Manager',           () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.METADATA.TITLE','Title',               () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.METADATA.SUBJECT','Subject',           () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.METADATA.KEYPPTS','KeyPPTs',         () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.METADATA.CATEGORY','Category',         () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.METADATA.CREATED','Created Date',      () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.METADATA.MODIFIED','Modified Date',    () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.METADATA.LASTAUTHOR','Last Author',    () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.METADATA.VERSION','Version',           () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.METADATA.CUSTOM','Custom Properties',  () => { /* Logic */ }),

  // ── COMMENTS
  cmd('PPT.FILE.INSPECT.COMMENTS',      'Inspect Comments',    () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.COMMENTS.ALL',  'All Comments',        () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.COMMENTS.AUTHORS','Comment Authors',   () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.COMMENTS.RESOLVED','Resolved Comments',() => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.COMMENTS.UNRESOLVED','Unresolved Comments',() => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.COMMENTS.HIDDEN','Hidden Comments',    () => { /* Logic */ }),

  // ── XML
  cmd('PPT.FILE.INSPECT.XML',           'Inspect XML',         () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.XML.CUSTOM',    'Custom XML',          () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.XML.NAMESPACES','Namespaces',          () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.XML.PARTS',     'XML Parts',           () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.XML.RELATIONSHIPS','Relationships',    () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.XML.INVALID',   'Invalid XML',         () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.XML.ORPHAN',    'Orphan XML Parts',    () => { /* Logic */ }),

  // ── TRACK CHANGES
  cmd('PPT.FILE.INSPECT.TRACKCHANGES',  'Inspect Track Changes',() => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.TRACKCHANGES.INSERTIONS','Insertions', () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.TRACKCHANGES.DELETIONS','Deletions',   () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.TRACKCHANGES.MOVES','Moved Content',   () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.TRACKCHANGES.FORMATTING','Formatting Changes',() => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.TRACKCHANGES.AUTHORS','Revision Authors',() => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.TRACKCHANGES.DATE','Revision Dates',   () => { /* Logic */ }),

  // ── Presentation PROPERTIES
  cmd('PPT.FILE.INSPECT.PROPERTIES',    'Inspect Properties',  () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.PROPERTIES.BUILTIN','Built-in Properties',() => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.PROPERTIES.CUSTOM','Custom Properties',() => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.PROPERTIES.HIDDEN','Hidden Properties',() => { /* Logic */ }),

  // ── EMBEDDED CONTENT
  cmd('PPT.FILE.INSPECT.EMBEDDED',      'Inspect Embedded Objects',() => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.EMBEDDED.OLE',  'OLE Objects',         () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.EMBEDDED.MEDIA','Media Files',         () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.EMBEDDED.ACTIVEX','ActiveX Controls',  () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.EMBEDDED.MACROS','Macros',             () => { /* Logic */ }),

  // ── LINKS
  cmd('PPT.FILE.INSPECT.LINKS',         'Inspect External Links',() => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.LINKS.BROKEN',  'Broken Links',        () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.LINKS.EXTERNAL','External References', () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.LINKS.EMBEDDED','Embedded Links',      () => { /* Logic */ }),

  // ── REMOVE HIDDEN INFORMATION
  cmd('PPT.FILE.INSPECT.CLEAN',         'Remove Hidden Information',() => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.CLEAN.METADATA','Remove Metadata',     () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.CLEAN.COMMENTS','Remove Comments',     () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.CLEAN.TRACKCHANGES','Remove Track Changes',() => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.CLEAN.XML',     'Remove Custom XML',   () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.CLEAN.HIDDEN',  'Remove Hidden Data',  () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.CLEAN.PROPERTIES','Remove Properties', () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.CLEAN.LINKS',   'Remove External Links',() => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.CLEAN.ALL',     'Remove All Hidden Information',() => { /* Logic */ }),

  // ── COMPLIANCE
  cmd('PPT.FILE.INSPECT.COMPLIANCE',    'Compliance Check',    () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.COMPLIANCE.GDPR','GDPR',               () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.COMPLIANCE.ISO27001','ISO 27001',      () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.COMPLIANCE.HIPAA','HIPAA',             () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.COMPLIANCE.COMPANY','Enterprise Policy',() => { /* Logic */ }),

  // ── REPORTS
  cmd('PPT.FILE.INSPECT.REPORT.OPEN',   'Open Report',         () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.REPORT.SAVE',   'Save Report',         () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.REPORT.HTML',   'Export HTML',         () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.REPORT.PDF',    'Export PDF',          () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.REPORT.JSON',   'Export JSON',         () => { /* Logic */ }),
  cmd('PPT.FILE.INSPECT.REPORT.XML',    'Export XML',          () => { /* Logic */ }),

  // ══ METADATA ════════════════════════════════════════════════════════════
  // ── READ
  cmd('PPT.FILE.METADATA.READ',         'Read Metadata',       () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.READ.ALL',     'Read All Metadata',   () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.READ.CORE',    'Read Core Properties',() => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.READ.EXTENDED','Read Extended Properties',() => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.READ.CUSTOM',  'Read Custom Properties',() => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.READ.CLOUD',   'Read Cloud Metadata', () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.READ.SYSTEM',  'Read System Properties',() => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.READ.STATISTICS','Read Presentation Statistics',() => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.READ.CLASSIFICATION','Read Classification',() => { /* Logic */ }),

  // ── WRITE
  cmd('PPT.FILE.METADATA.WRITE',        'Write Metadata',      () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.WRITE.CORE',   'Write Core Properties',() => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.WRITE.EXTENDED','Write Extended Properties',() => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.WRITE.CUSTOM', 'Write Custom Properties',() => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.WRITE.AUTHOR', 'Write Author',        () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.WRITE.COMPANY','Write Company',       () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.WRITE.TITLE',  'Write Title',         () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.WRITE.SUBJECT','Write Subject',       () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.WRITE.KEYPPTS','Write KeyPPTs',     () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.WRITE.CATEGORY','Write Category',     () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.WRITE.COMMENTS','Write Comments',     () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.WRITE.CLASSIFICATION','Write Classification',() => { /* Logic */ }),

  // ── IMPORT
  cmd('PPT.FILE.METADATA.IMPORT',       'Import Metadata',     () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.IMPORT.XML',   'Import XML',          () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.IMPORT.JSON',  'Import JSON',         () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.IMPORT.CSV',   'Import CSV',          () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.IMPORT.PROFILE','Import Metadata Profile',() => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.IMPORT.CLOUD', 'Import Cloud Metadata',() => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.IMPORT.TEMPLATE','Import Template Metadata',() => { /* Logic */ }),

  // ── EXPORT
  cmd('PPT.FILE.METADATA.EXPORT',       'Export Metadata',     () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.EXPORT.XML',   'Export XML',          () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.EXPORT.JSON',  'Export JSON',         () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.EXPORT.CSV',   'Export CSV',          () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.EXPORT.TEXT',  'Export TXT',          () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.EXPORT.HTML',  'Export HTML',         () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.EXPORT.PDF',   'Export PDF Report',   () => { /* Logic */ }),

  // ── CLEAR METADATA
  cmd('PPT.FILE.METADATA.CLEAR',        'Clear Metadata',      () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.CLEAR.CORE',   'Clear Core Properties',() => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.CLEAR.EXTENDED','Clear Extended Properties',() => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.CLEAR.CUSTOM', 'Clear Custom Properties',() => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.CLEAR.AUTHOR', 'Remove Author',       () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.CLEAR.COMPANY','Remove Company',      () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.CLEAR.COMMENTS','Remove Comments',    () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.CLEAR.CLASSIFICATION','Remove Classification',() => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.CLEAR.ALL',    'Clear All Metadata',  () => { /* Logic */ }),

  // ── BUILT-IN PROPERTIES
  cmd('PPT.FILE.METADATA.PROPERTY.TITLE', 'Title',             () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.PROPERTY.SUBJECT', 'Subject',         () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.PROPERTY.AUTHOR', 'Author',           () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.PROPERTY.COMPANY', 'Company',         () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.PROPERTY.MANAGER', 'Manager',         () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.PROPERTY.KEYPPTS', 'KeyPPTs',       () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.PROPERTY.CATEGORY', 'Category',       () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.PROPERTY.STATUS', 'Status',           () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.PROPERTY.LANGUAGE', 'Language',       () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.PROPERTY.VERSION', 'Presentation Version',() => { /* Logic */ }),

  // ── Presentation STATISTICS
  cmd('PPT.FILE.METADATA.STATS.OPEN',   'Open Statistics',     () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.STATS.PPTCOUNT','PPT Count',        () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.STATS.PAGECOUNT','Page Count',        () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.STATS.CHARCOUNT','Character Count',   () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.STATS.LINECOUNT','Line Count',        () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.STATS.PARAGRAPHCOUNT','Paragraph Count',() => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.STATS.TABLECOUNT','Table Count',      () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.STATS.IMAGECOUNT','Image Count',      () => { /* Logic */ }),

  // ── VALIDATION
  cmd('PPT.FILE.METADATA.VALIDATE',     'Validate Metadata',   () => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.VALIDATE.CORE','Validate Core Properties',() => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.VALIDATE.CUSTOM','Validate Custom Properties',() => { /* Logic */ }),
  cmd('PPT.FILE.METADATA.VALIDATE.CLASSIFICATION','Validate Classification',() => { /* Logic */ }),

  // ══ COMPATIBILITY ═══════════════════════════════════════════════════════
  // ── COMPATIBILITY CHECK
  cmd('PPT.FILE.COMPATIBILITY.CHECK',   'Compatibility Check', () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.CHECK.START','Start Compatibility Check',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.CHECK.QUICK','Quick Check',      () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.CHECK.FULL','Full Compatibility Scan',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.CHECK.OPENXML','Check OpenXML Compatibility',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.CHECK.LEGACY','Check Legacy Features',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.CHECK.FONTS','Check Fonts',      () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.CHECK.MEDIA','Check Images',     () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.CHECK.TABLES','Check Tables',    () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.CHECK.SMARTART','Check SmartArt',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.CHECK.CHARTS','Check Charts',    () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.CHECK.MACROS','Check Macros',    () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.CHECK.COMMENTS','Check Comments',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.CHECK.TRACKCHANGES','Check Track Changes',() => { /* Logic */ }),

  // ── COMPATIBILITY REPORT
  cmd('PPT.FILE.COMPATIBILITY.REPORT',  'Compatibility Report',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.REPORT.OPEN','Open Report',      () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.REPORT.SAVE','Save Report',      () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.REPORT.HTML','Export HTML',      () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.REPORT.PDF','Export PDF',        () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.REPORT.JSON','Export JSON',      () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.REPORT.XML','Export XML',        () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.REPORT.PRINT','Print Report',    () => { /* Logic */ }),

  // ── CONVERT FORMAT
  cmd('PPT.FILE.COMPATIBILITY.CONVERT', 'Convert Format',      () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.CONVERT.DOC','Convert To DOC',   () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.CONVERT.pptx','Convert To DOCX', () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.CONVERT.ODT','Convert To ODT',   () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.CONVERT.PDF','Convert To PDF',   () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.CONVERT.HTML','Convert To HTML', () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.CONVERT.MARKDOWN','Convert To Markdown',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.CONVERT.TXT','Convert To TXT',   () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.CONVERT.XML','Convert To XML',   () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.CONVERT.OPENXML','Convert To OpenXML',() => { /* Logic */ }),

  // ── OFFICE VERSION
  cmd('PPT.FILE.COMPATIBILITY.VERSION', 'Office Version',      () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.VERSION.DETECT','Detect Office Version',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.VERSION.PPT97','PPT 97',       () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.VERSION.PPT2003','PPT 2003',   () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.VERSION.PPT2007','PPT 2007',   () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.VERSION.PPT2010','PPT 2010',   () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.VERSION.PPT2013','PPT 2013',   () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.VERSION.PPT2016','PPT 2016',   () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.VERSION.PPT2019','PPT 2019',   () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.VERSION.PPT2021','PPT 2021',   () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.VERSION.M365','Microsoft 365',   () => { /* Logic */ }),

  // ── TARGET PLATFORM
  cmd('PPT.FILE.COMPATIBILITY.PLATFORM.WINDOWS','Windows',     () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.PLATFORM.MACOS','macOS',         () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.PLATFORM.LINUX','Linux',         () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.PLATFORM.WEB','Office Web',      () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.PLATFORM.MOBILE','Mobile',       () => { /* Logic */ }),

  // ── THIRD-PARTY SUITES
  cmd('PPT.FILE.COMPATIBILITY.LIBREOFFICE','LibreOffice',      () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.OPENOFFICE','OpenOffice',        () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.WPS',     'WPS Office',          () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.ONLYOFFICE','ONLYOFFICE',        () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.GOOGLEDOCS','Google Docs',       () => { /* Logic */ }),

  // ── VALIDATION
  cmd('PPT.FILE.COMPATIBILITY.VALIDATE','Validate Compatibility',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.VALIDATE.OPENXML','Validate OpenXML',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.VALIDATE.RENDERING','Validate Rendering',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.VALIDATE.LAYOUT','Validate Layout',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.VALIDATE.FONTS','Validate Fonts',() => { /* Logic */ }),

  // ── REPAIR
  cmd('PPT.FILE.COMPATIBILITY.REPAIR',  'Repair Compatibility Issues',() => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.REPAIR.AUTO','Automatic Repair', () => { /* Logic */ }),
  cmd('PPT.FILE.COMPATIBILITY.REPAIR.MANUAL','Manual Repair',  () => { /* Logic */ }),

  // ══ CACHE MANAGEMENT ════════════════════════════════════════════════════
  // ── CACHE
  cmd('PPT.FILE.CACHE.OPEN',            'Open Cache',          () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.STATUS',          'Cache Status',        () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.SIZE',            'Cache Size',          () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.LOCATION',        'Cache Location',      () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.REFRESH',         'Refresh Cache',       () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.ENABLE',          'Enable Cache',        () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.DISABLE',         'Disable Cache',       () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.VALIDATE',        'Validate Cache',      () => { /* Logic */ }),

  // ── REBUILD
  cmd('PPT.FILE.CACHE.REBUILD',         'Rebuild Cache',       () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.REBUILD.ALL',     'Rebuild All Cache',   () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.REBUILD.RENDER',  'Rebuild Render Cache',() => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.REBUILD.FONT',    'Rebuild Font Cache',  () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.REBUILD.Presentation','Rebuild Presentation Cache',() => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.REBUILD.THUMBNAIL','Rebuild Thumbnail Cache',() => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.REBUILD.CLOUD',   'Rebuild Cloud Cache', () => { /* Logic */ }),

  // ── CLEAR CACHE
  cmd('PPT.FILE.CACHE.CLEAR',           'Clear Cache',         () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.CLEAR.ALL',       'Clear All Cache',     () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.CLEAR.RENDER',    'Clear Render Cache',  () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.CLEAR.FONT',      'Clear Font Cache',    () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.CLEAR.Presentation',  'Clear Presentation Cache',() => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.CLEAR.CLOUD',     'Clear Cloud Cache',   () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.CLEAR.PREVIEW',   'Clear Preview Cache', () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.CLEAR.RECENT',    'Clear Recent Cache',  () => { /* Logic */ }),

  // ── MEMORY CACHE
  cmd('PPT.FILE.CACHE.MEMORY',          'Memory Cache',        () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.MEMORY.STATUS',   'Memory Status',       () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.MEMORY.FLUSH',    'Flush Memory Cache',  () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.MEMORY.OPTIMIZE', 'Optimize Memory Cache',() => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.MEMORY.LIMIT',    'Memory Cache Limit',  () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.MEMORY.STATISTICS','Memory Statistics',  () => { /* Logic */ }),

  // ── THUMBNAIL CACHE
  cmd('PPT.FILE.CACHE.THUMBNAIL',       'Thumbnail Cache',     () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.THUMBNAIL.GENERATE','Generate Thumbnails',() => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.THUMBNAIL.REBUILD','Rebuild Thumbnails', () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.THUMBNAIL.DELETE','Delete Thumbnails',   () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.THUMBNAIL.SIZE',  'Thumbnail Size',      () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.THUMBNAIL.REFRESH','Refresh Thumbnails', () => { /* Logic */ }),

  // ── Presentation CACHE
  cmd('PPT.FILE.CACHE.Presentation',        'Presentation Cache',      () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.document.LOAD',   'Load Cache',          () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.document.SAVE',   'Save Cache',          () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.document.DELETE', 'Delete Cache',        () => { /* Logic */ }),

  // ── CLOUD CACHE
  cmd('PPT.FILE.CACHE.CLOUD',           'Cloud Cache',         () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.CLOUD.DOWNLOAD',  'Download Cache',      () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.CLOUD.UPLOAD',    'Upload Cache',        () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.CLOUD.SYNC',      'Sync Cache',          () => { /* Logic */ }),

  // ── PERFORMANCE
  cmd('PPT.FILE.CACHE.PERFORMANCE',     'Performance Cache',   () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.PERFORMANCE.OPTIMIZE','Optimize Cache',  () => { /* Logic */ }),
  cmd('PPT.FILE.CACHE.PERFORMANCE.STATS','Performance Statistics',() => { /* Logic */ }),

  // ══ SESSION MANAGEMENT ══════════════════════════════════════════════════
  // ── SAVE SESSION
  cmd('PPT.FILE.SESSION.SAVE',          'Save Session',        () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.SAVE.AUTO',     'Auto Save Session',   () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.SAVE.MANUAL',   'Manual Save',         () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.SAVE.LOCAL',    'Save Local Session',  () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.SAVE.CLOUD',    'Save Cloud Session',  () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.SAVE.WORKSPACE','Save Workspace',      () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.SAVE.WINDOWS',  'Save Window State',   () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.SAVE.PANELS',   'Save Panel Layout',   () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.SAVE.HISTORY',  'Save History',        () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.SAVE.CLIPBOARD','Save Clipboard',      () => { /* Logic */ }),

  // ── RESTORE SESSION
  cmd('PPT.FILE.SESSION.RESTORE',       'Restore Session',     () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.RESTORE.AUTO',  'Auto Restore',        () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.RESTORE.LAST',  'Restore Last Session',() => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.RESTORE.SELECTED','Restore Selected Session',() => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.RESTORE.LOCAL', 'Restore Local Session',() => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.RESTORE.CLOUD', 'Restore Cloud Session',() => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.RESTORE.WINDOWS','Restore Window Layout',() => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.RESTORE.PANELS','Restore Panels',      () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.RESTORE.HISTORY','Restore History',    () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.RESTORE.CLIPBOARD','Restore Clipboard',() => { /* Logic */ }),

  // ── WORKSPACE RESTORE
  cmd('PPT.FILE.WORKSPACE.RESTORE',     'Restore Workspace',   () => { /* Logic */ }),
  cmd('PPT.FILE.WORKSPACE.RESTORE.DEFAULT','Restore Default Workspace',() => { /* Logic */ }),
  cmd('PPT.FILE.WORKSPACE.RESTORE.CUSTOM','Restore Custom Workspace',() => { /* Logic */ }),
  cmd('PPT.FILE.WORKSPACE.RESTORE.PANELS','Restore Dock Panels',() => { /* Logic */ }),
  cmd('PPT.FILE.WORKSPACE.RESTORE.RIBBON','Restore Ribbon',    () => { /* Logic */ }),
  cmd('PPT.FILE.WORKSPACE.RESTORE.SIDEBAR','Restore Sidebar',  () => { /* Logic */ }),
  cmd('PPT.FILE.WORKSPACE.RESTORE.STATUSBAR','Restore Status Bar',() => { /* Logic */ }),
  cmd('PPT.FILE.WORKSPACE.RESTORE.QUICKACCESS','Restore Quick Access Toolbar',() => { /* Logic */ }),

  // ── CRASH RECOVERY
  cmd('PPT.FILE.SESSION.CRASH',         'Crash Recovery',      () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.CRASH.START',   'Start Recovery',      () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.CRASH.RESTORE', 'Restore After Crash', () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.CRASH.REPORT',  'Crash Report',        () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.CRASH.LOG',     'Open Crash Log',      () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.CRASH.DELETE',  'Delete Crash Data',   () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.CRASH.VALIDATE','Validate Recovery',   () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.CRASH.REPAIR',  'Repair Session',      () => { /* Logic */ }),

  // ── SESSION HISTORY
  cmd('PPT.FILE.SESSION.HISTORY',       'Session History',     () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.HISTORY.OPEN',  'Open History',        () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.HISTORY.DELETE','Delete History',      () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.HISTORY.CLEAR', 'Clear History',       () => { /* Logic */ }),

  // ── SESSION CACHE
  cmd('PPT.FILE.SESSION.CACHE',         'Session Cache',       () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.CACHE.OPEN',    'Open Cache',          () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.CACHE.CLEAR',   'Clear Cache',         () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.CACHE.REBUILD', 'Rebuild Cache',       () => { /* Logic */ }),

  // ── CLOUD SESSION
  cmd('PPT.FILE.SESSION.CLOUD',         'Cloud Session',       () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.CLOUD.UPLOAD',  'Upload Session',      () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.CLOUD.DOWNLOAD','Download Session',    () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.CLOUD.SYNC',    'Sync Session',        () => { /* Logic */ }),
  cmd('PPT.FILE.SESSION.CLOUD.DELETE',  'Delete Cloud Session',() => { /* Logic */ }),

  // ══ AI INTEGRATION ══════════════════════════════════════════════════════
  // ── AI SUMMARIZE
  cmd('PPT.FILE.AI.SUMMARIZE',          'Summarize Presentation',  () => { /* Logic */ }),
  cmd('PPT.FILE.AI.SUMMARIZE.SELECTION','Summarize Selection', () => { /* Logic */ }),
  cmd('PPT.FILE.AI.SUMMARIZE.PAGE',     'Summarize Current Page',() => { /* Logic */ }),
  cmd('PPT.FILE.AI.SUMMARIZE.SECTION',  'Summarize Section',   () => { /* Logic */ }),
  cmd('PPT.FILE.AI.SUMMARIZE.Presentation', 'Summarize Entire Presentation',() => { /* Logic */ }),
  cmd('PPT.FILE.AI.SUMMARIZE.BULLETS',  'Bullet Summary',      () => { /* Logic */ }),
  cmd('PPT.FILE.AI.SUMMARIZE.EXECUTIVE','Executive Summary',   () => { /* Logic */ }),
  cmd('PPT.FILE.AI.SUMMARIZE.ACADEMIC', 'Academic Summary',    () => { /* Logic */ }),
  cmd('PPT.FILE.AI.SUMMARIZE.TECHNICAL','Technical Summary',   () => { /* Logic */ }),
  cmd('PPT.FILE.AI.SUMMARIZE.CUSTOM',   'Custom Prompt Summary',() => { /* Logic */ }),

  // ── AI TRANSLATE
  cmd('PPT.FILE.AI.TRANSLATE',          'Translate',           () => { /* Logic */ }),
  cmd('PPT.FILE.AI.TRANSLATE.SELECTION','Translate Selection', () => { /* Logic */ }),
  cmd('PPT.FILE.AI.TRANSLATE.PAGE',     'Translate Page',      () => { /* Logic */ }),
  cmd('PPT.FILE.AI.TRANSLATE.Presentation', 'Translate Presentation',  () => { /* Logic */ }),
  cmd('PPT.FILE.AI.TRANSLATE.AUTO',     'Auto Detect Language',() => { /* Logic */ }),
  cmd('PPT.FILE.AI.TRANSLATE.PRESERVE_STYLE','Preserve Formatting',() => { /* Logic */ }),
  cmd('PPT.FILE.AI.TRANSLATE.BILINGUAL','Create Bilingual Version',() => { /* Logic */ }),
  cmd('PPT.FILE.AI.TRANSLATE.BACK',     'Back Translation',    () => { /* Logic */ }),

  // ── AI REWRITE
  cmd('PPT.FILE.AI.REWRITE',            'Rewrite',             () => { /* Logic */ }),
  cmd('PPT.FILE.AI.REWRITE.SHORTER',    'Rewrite Shorter',     () => { /* Logic */ }),
  cmd('PPT.FILE.AI.REWRITE.LONGER',     'Rewrite Longer',      () => { /* Logic */ }),
  cmd('PPT.FILE.AI.REWRITE.FORMAL',     'Formal Style',        () => { /* Logic */ }),
  cmd('PPT.FILE.AI.REWRITE.CASUAL',     'Casual Style',        () => { /* Logic */ }),
  cmd('PPT.FILE.AI.REWRITE.PROFESSIONAL','Professional Style', () => { /* Logic */ }),
  cmd('PPT.FILE.AI.REWRITE.ACADEMIC',   'Academic Style',      () => { /* Logic */ }),
  cmd('PPT.FILE.AI.REWRITE.GRAMMAR',    'Grammar Fix',         () => { /* Logic */ }),
  cmd('PPT.FILE.AI.REWRITE.SPELLING',   'Spelling Fix',        () => { /* Logic */ }),
  cmd('PPT.FILE.AI.REWRITE.CLARITY',    'Improve Clarity',     () => { /* Logic */ }),
  cmd('PPT.FILE.AI.REWRITE.SIMPLIFY',   'Simplify Text',       () => { /* Logic */ }),

  // ── AI REVIEW
  cmd('PPT.FILE.AI.REVIEW',             'Review Presentation',     () => { /* Logic */ }),
  cmd('PPT.FILE.AI.REVIEW.GRAMMAR',     'Grammar Review',      () => { /* Logic */ }),
  cmd('PPT.FILE.AI.REVIEW.STYLE',       'Style Review',        () => { /* Logic */ }),
  cmd('PPT.FILE.AI.REVIEW.TONE',        'Tone Review',         () => { /* Logic */ }),
  cmd('PPT.FILE.AI.REVIEW.LOGIC',       'Logic Review',        () => { /* Logic */ }),
  cmd('PPT.FILE.AI.REVIEW.CONSISTENCY', 'Consistency Review',  () => { /* Logic */ }),
  cmd('PPT.FILE.AI.REVIEW.ACCESSIBILITY','Accessibility Review',() => { /* Logic */ }),
  cmd('PPT.FILE.AI.REVIEW.SECURITY',    'Sensitive Information Review',() => { /* Logic */ }),
  cmd('PPT.FILE.AI.REVIEW.LEGAL',       'Legal Review',        () => { /* Logic */ }),
  cmd('PPT.FILE.AI.REVIEW.TECHNICAL',   'Technical Review',    () => { /* Logic */ }),

  // ── AI EXPLAIN
  cmd('PPT.FILE.AI.EXPLAIN',            'Explain',             () => { /* Logic */ }),
  cmd('PPT.FILE.AI.EXPLAIN.SELECTION',  'Explain Selection',   () => { /* Logic */ }),
  cmd('PPT.FILE.AI.EXPLAIN.PARAGRAPH',  'Explain Paragraph',   () => { /* Logic */ }),
  cmd('PPT.FILE.AI.EXPLAIN.TERM',       'Explain Term',        () => { /* Logic */ }),
  cmd('PPT.FILE.AI.EXPLAIN.TABLE',      'Explain Table',       () => { /* Logic */ }),
  cmd('PPT.FILE.AI.EXPLAIN.CHART',      'Explain Chart',       () => { /* Logic */ }),
  cmd('PPT.FILE.AI.EXPLAIN.CODE',       'Explain Code',        () => { /* Logic */ }),
  cmd('PPT.FILE.AI.EXPLAIN.FORMULA',    'Explain Formula',     () => { /* Logic */ }),
  cmd('PPT.FILE.AI.EXPLAIN.DIAGRAM',    'Explain Diagram',     () => { /* Logic */ }),

  // ── AI GENERATE METADATA
  cmd('PPT.FILE.AI.METADATA',           'Generate Metadata',   () => { /* Logic */ }),
  cmd('PPT.FILE.AI.METADATA.TITLE',     'Generate Title',      () => { /* Logic */ }),
  cmd('PPT.FILE.AI.METADATA.SUBJECT',   'Generate Subject',    () => { /* Logic */ }),
  cmd('PPT.FILE.AI.METADATA.KEYPPTS',  'Generate KeyPPTs',   () => { /* Logic */ }),
  cmd('PPT.FILE.AI.METADATA.CATEGORY',  'Generate Category',   () => { /* Logic */ }),
  cmd('PPT.FILE.AI.METADATA.TAGS',      'Generate Tags',       () => { /* Logic */ }),
  cmd('PPT.FILE.AI.METADATA.DESCRIPTION','Generate Description',() => { /* Logic */ }),
  cmd('PPT.FILE.AI.METADATA.AUTHOR',    'Suggest Author Information',() => { /* Logic */ }),
  cmd('PPT.FILE.AI.METADATA.CLASSIFICATION','Suggest Classification',() => { /* Logic */ }),

  // ── PROVIDERS
  cmd('PPT.FILE.AI.PROVIDER.AUTO',      'Auto Select Provider',() => { /* Logic */ }),
  cmd('PPT.FILE.AI.PROVIDER.OPENAI',    'OpenAI',              () => { /* Logic */ }),
  cmd('PPT.FILE.AI.PROVIDER.CLAUDE',    'Claude',              () => { /* Logic */ }),
  cmd('PPT.FILE.AI.PROVIDER.GEMINI',    'Gemini',              () => { /* Logic */ }),
  cmd('PPT.FILE.AI.PROVIDER.DEEPSEEK',  'DeepSeek',            () => { /* Logic */ }),
  cmd('PPT.FILE.AI.PROVIDER.OLLAMA',    'Ollama',              () => { /* Logic */ }),
  cmd('PPT.FILE.AI.PROVIDER.LMSTUDIO',  'LM Studio',           () => { /* Logic */ }),
  cmd('PPT.FILE.AI.PROVIDER.LOCAL',     'Local AI',            () => { /* Logic */ }),

  // ── STREAMING
  cmd('PPT.FILE.AI.STREAM.START',       'Start Streaming',     () => { /* Logic */ }),
  cmd('PPT.FILE.AI.STREAM.STOP',        'Stop Streaming',      () => { /* Logic */ }),
  cmd('PPT.FILE.AI.STREAM.RETRY',       'Retry',               () => { /* Logic */ }),
  cmd('PPT.FILE.AI.STREAM.CANCEL',      'Cancel',              () => { /* Logic */ }),

  // ── HISTORY
  cmd('PPT.FILE.AI.HISTORY.OPEN',       'Open History',        () => { /* Logic */ }),
  cmd('PPT.FILE.AI.HISTORY.CLEAR',      'Clear History',       () => { /* Logic */ }),
  cmd('PPT.FILE.AI.HISTORY.EXPORT',     'Export History',      () => { /* Logic */ }),
  cmd('PPT.FILE.AI.HISTORY.RESTORE',    'Restore Prompt',      () => { /* Logic */ }),

  // ══ AUDIT & COMPLIANCE ══════════════════════════════════════════════════
  // ── AUDIT
  cmd('PPT.FILE.AUDIT.OPEN',            'Open Audit Center',   () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.START',           'Start Audit Session', () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.STOP',            'Stop Audit Session',  () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.STATUS',          'Audit Status',        () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.SEARCH',          'Search Audit Log',    () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.FILTER',          'Filter Audit Records',() => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.REFRESH',         'Refresh Audit View',  () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.CLEARFILTER',     'Clear Filters',       () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.VERIFY',          'Verify Audit Integrity',() => { /* Logic */ }),

  // ── AUDIT EVENTS
  cmd('PPT.FILE.AUDIT.EVENT.FILE',      'File Operations',     () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.EVENT.SECURITY',  'Security Events',     () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.EVENT.PERMISSION','Permission Events',   () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.EVENT.LOGIN',     'Login Events',        () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.EVENT.SHARING',   'Sharing Events',      () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.EVENT.AI',        'AI Events',           () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.EVENT.EXPORT',    'Export Events',       () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.EVENT.PRINT',     'Print Events',        () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.EVENT.DELETE',    'Delete Events',       () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.EVENT.VERSION',   'Version Events',      () => { /* Logic */ }),

  // ── EXPORT LOGS
  cmd('PPT.FILE.AUDIT.EXPORT',          'Export Logs',         () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.EXPORT.PDF',      'Export PDF',          () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.EXPORT.HTML',     'Export HTML',         () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.EXPORT.CSV',      'Export CSV',          () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.EXPORT.JSON',     'Export JSON',         () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.EXPORT.XML',      'Export XML',          () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.EXPORT.SYSLOG',   'Export Syslog',       () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.EXPORT.SIEM',     'Export SIEM',         () => { /* Logic */ }),

  // ── SECURITY LOG
  cmd('PPT.FILE.AUDIT.SECURITY',        'Security Log',        () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.SECURITY.LOGIN',  'Login History',       () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.SECURITY.FAILEDLOGIN','Failed Login Attempts',() => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.SECURITY.PERMISSION','Permission Changes',() => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.SECURITY.ENCRYPTION','Encryption Events',() => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.SECURITY.SIGNATURE','Digital Signature Events',() => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.SECURITY.CERTIFICATE','Certificate Events',() => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.SECURITY.THREATS','Threat Detection',    () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.SECURITY.ALERTS', 'Security Alerts',     () => { /* Logic */ }),

  // ── COMPLIANCE
  cmd('PPT.FILE.AUDIT.COMPLIANCE',      'Compliance Center',   () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.COMPLIANCE.GDPR', 'GDPR Report',         () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.COMPLIANCE.ISO27001','ISO 27001',        () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.COMPLIANCE.SOC2', 'SOC 2',               () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.COMPLIANCE.HIPAA', 'HIPAA',              () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.COMPLIANCE.FINANCE','Financial Compliance',() => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.COMPLIANCE.COMPANY','Enterprise Policy', () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.COMPLIANCE.VALIDATE','Validate Compliance',() => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.COMPLIANCE.REPORT','Compliance Report',  () => { /* Logic */ }),

  // ── RETENTION
  cmd('PPT.FILE.AUDIT.RETENTION',       'Retention Policy',    () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.RETENTION.SET',   'Set Retention',       () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.RETENTION.DELETE','Delete Expired Logs', () => { /* Logic */ }),
  cmd('PPT.FILE.AUDIT.RETENTION.ARCHIVE','Archive Logs',       () => { /* Logic */ }),

  // ══ FAVORITES & RECENT ══════════════════════════════════════════════════
  // ── FAVORITE
  cmd('PPT.FILE.FAVORITE.ADD',          'Add Favorite',        () => { /* Logic */ }),
  cmd('PPT.FILE.FAVORITE.REMOVE',       'Remove Favorite',     () => { /* Logic */ }),
  cmd('PPT.FILE.FAVORITE.OPEN',         'Open Favorite',       () => { /* Logic */ }),
  cmd('PPT.FILE.FAVORITE.RENAME',       'Rename Favorite',     () => { /* Logic */ }),
  cmd('PPT.FILE.FAVORITE.MOVE',         'Move Favorite',       () => { /* Logic */ }),
  cmd('PPT.FILE.FAVORITE.SORT',         'Sort Favorites',      () => { /* Logic */ }),
  cmd('PPT.FILE.FAVORITE.GROUP',        'Favorite Groups',     () => { /* Logic */ }),
  cmd('PPT.FILE.FAVORITE.COLOR',        'Favorite Label',      () => { /* Logic */ }),
  cmd('PPT.FILE.FAVORITE.SEARCH',       'Search Favorites',    () => { /* Logic */ }),
  cmd('PPT.FILE.FAVORITE.EXPORT',       'Export Favorites',    () => { /* Logic */ }),
  cmd('PPT.FILE.FAVORITE.IMPORT',       'Import Favorites',    () => { /* Logic */ }),

  // ── PIN
  cmd('PPT.FILE.PIN',                   'Pin File',            () => { /* Logic */ }),
  cmd('PPT.FILE.PIN.CURRENT',           'Pin Current File',    () => { /* Logic */ }),
  cmd('PPT.FILE.PIN.SELECTED',          'Pin Selected File',   () => { /* Logic */ }),
  cmd('PPT.FILE.PIN.FOLDER',            'Pin Folder',          () => { /* Logic */ }),
  cmd('PPT.FILE.PIN.WORKSPACE',         'Pin Workspace',       () => { /* Logic */ }),

  // ── UNPIN
  cmd('PPT.FILE.UNPIN',                 'Unpin File',          () => { /* Logic */ }),
  cmd('PPT.FILE.UNPIN.ALL',             'Unpin All',           () => { /* Logic */ }),
  cmd('PPT.FILE.UNPIN.FOLDER',          'Unpin Folder',        () => { /* Logic */ }),

  // ── RECENT
  cmd('PPT.FILE.RECENT.OPEN',           'Open Recent',         () => { /* Logic */ }),
  cmd('PPT.FILE.RECENT.CLEAR',          'Clear Recent',        () => { /* Logic */ }),
  cmd('PPT.FILE.RECENT.CLEAR.ONE',      'Remove Recent Item',  () => { /* Logic */ }),
  cmd('PPT.FILE.RECENT.CLEAR.ALL',      'Clear All Recent Files',() => { /* Logic */ }),
  cmd('PPT.FILE.RECENT.PIN',            'Pin Recent File',     () => { /* Logic */ }),
  cmd('PPT.FILE.RECENT.SEARCH',         'Search Recent',       () => { /* Logic */ }),
  cmd('PPT.FILE.RECENT.FILTER',         'Filter Recent',       () => { /* Logic */ }),
  cmd('PPT.FILE.RECENT.SORT',           'Sort Recent',         () => { /* Logic */ }),

  // ── STAR
  cmd('PPT.FILE.STAR',                  'Star File',           () => { /* Logic */ }),
  cmd('PPT.FILE.STAR.REMOVE',           'Remove Star',         () => { /* Logic */ }),
  cmd('PPT.FILE.STAR.TOGGLE',           'Toggle Star',         () => { /* Logic */ }),
  cmd('PPT.FILE.STAR.OPEN',             'Open Starred File',   () => { /* Logic */ }),
  cmd('PPT.FILE.STAR.LIST',             'List Starred Files',  () => { /* Logic */ }),

  // ── CLOUD FAVORITES
  cmd('PPT.FILE.FAVORITE.CLOUD.SYNC',   'Sync Favorites',      () => { /* Logic */ }),
  cmd('PPT.FILE.FAVORITE.CLOUD.UPLOAD', 'Upload Favorites',    () => { /* Logic */ }),
  cmd('PPT.FILE.FAVORITE.CLOUD.DOWNLOAD','Download Favorites', () => { /* Logic */ }),

  // ══ FILE LOCK MANAGEMENT ════════════════════════════════════════════════
  // ── LOCK
  cmd('PPT.FILE.LOCK',                  'Lock Presentation',       () => { /* Logic */ }),
  cmd('PPT.FILE.LOCK.CURRENT',          'Lock Current Presentation',() => { /* Logic */ }),
  cmd('PPT.FILE.LOCK.SELECTED',         'Lock Selected File',  () => { /* Logic */ }),
  cmd('PPT.FILE.LOCK.READONLY',         'Read-only Lock',      () => { /* Logic */ }),
  cmd('PPT.FILE.LOCK.TEMPORARY',        'Temporary Lock',      () => { /* Logic */ }),
  cmd('PPT.FILE.LOCK.PERMANENT',        'Permanent Lock',      () => { /* Logic */ }),
  cmd('PPT.FILE.LOCK.SESSION',          'Session Lock',        () => { /* Logic */ }),
  cmd('PPT.FILE.LOCK.CLOUD',            'Cloud Lock',          () => { /* Logic */ }),
  cmd('PPT.FILE.LOCK.NETWORK',          'Network Lock',        () => { /* Logic */ }),
  cmd('PPT.FILE.LOCK.STATUS',           'Lock Status',         () => { /* Logic */ }),
  cmd('PPT.FILE.LOCK.INFO',             'Lock Information',    () => { /* Logic */ }),

  // ── UNLOCK
  cmd('PPT.FILE.UNLOCK',                'Unlock Presentation',     () => { /* Logic */ }),
  cmd('PPT.FILE.UNLOCK.CURRENT',        'Unlock Current Presentation',() => { /* Logic */ }),
  cmd('PPT.FILE.UNLOCK.SELECTED',       'Unlock Selected File',() => { /* Logic */ }),
  cmd('PPT.FILE.UNLOCK.FORCE',          'Force Unlock',        () => { /* Logic */ }),
  cmd('PPT.FILE.UNLOCK.ADMIN',          'Administrator Unlock',() => { /* Logic */ }),
  cmd('PPT.FILE.UNLOCK.ALL',            'Unlock All Files',    () => { /* Logic */ }),
  cmd('PPT.FILE.UNLOCK.EXPIRED',        'Unlock Expired Sessions',() => { /* Logic */ }),

  // ── CHECKOUT
  cmd('PPT.FILE.CHECKOUT',              'Checkout Presentation',   () => { /* Logic */ }),
  cmd('PPT.FILE.CHECKOUT.LOCAL',        'Checkout Local Copy', () => { /* Logic */ }),
  cmd('PPT.FILE.CHECKOUT.CLOUD',        'Checkout Cloud Copy', () => { /* Logic */ }),
  cmd('PPT.FILE.CHECKOUT.SHAREPOINT',   'Checkout SharePoint', () => { /* Logic */ }),
  cmd('PPT.FILE.CHECKOUT.ONEDRIVE',     'Checkout OneDrive',   () => { /* Logic */ }),
  cmd('PPT.FILE.CHECKOUT.EXCLUSIVE',    'Exclusive Checkout',  () => { /* Logic */ }),
  cmd('PPT.FILE.CHECKOUT.STATUS',       'Checkout Status',     () => { /* Logic */ }),

  // ── CHECKIN
  cmd('PPT.FILE.CHECKIN',               'Check-in Presentation',   () => { /* Logic */ }),
  cmd('PPT.FILE.CHECKIN.COMMIT',        'Commit Changes',      () => { /* Logic */ }),
  cmd('PPT.FILE.CHECKIN.KEEPLOCK',      'Check-in and Keep Lock',() => { /* Logic */ }),
  cmd('PPT.FILE.CHECKIN.RELEASE',       'Check-in and Release Lock',() => { /* Logic */ }),
  cmd('PPT.FILE.CHECKIN.VERSION',       'Check-in as New Version',() => { /* Logic */ }),
  cmd('PPT.FILE.CHECKIN.COMMENT',       'Check-in Comment',    () => { /* Logic */ }),

  // ── EXCLUSIVE OPEN
  cmd('PPT.FILE.OPEN.EXCLUSIVE',        'Open Exclusively',    () => { /* Logic */ }),
  cmd('PPT.FILE.OPEN.EXCLUSIVE.READWRITE','Exclusive Read/Write',() => { /* Logic */ }),
  cmd('PPT.FILE.OPEN.EXCLUSIVE.ADMIN',  'Administrator Exclusive Open',() => { /* Logic */ }),
  cmd('PPT.FILE.OPEN.EXCLUSIVE.STATUS', 'Exclusive Open Status',() => { /* Logic */ }),
  cmd('PPT.FILE.OPEN.EXCLUSIVE.RELEASE','Release Exclusive Access',() => { /* Logic */ }),

  // ── LOCK OWNERSHIP
  cmd('PPT.FILE.LOCK.OWNER',            'Current Owner',       () => { /* Logic */ }),
  cmd('PPT.FILE.LOCK.OWNER.TRANSFER',   'Transfer Ownership',  () => { /* Logic */ }),
  cmd('PPT.FILE.LOCK.OWNER.REQUEST',    'Request Ownership',   () => { /* Logic */ }),
  cmd('PPT.FILE.LOCK.OWNER.REVOKE',     'Revoke Ownership',    () => { /* Logic */ }),

  // ── CONFLICT MANAGEMENT
  cmd('PPT.FILE.LOCK.CONFLICT',         'Conflict Detection',  () => { /* Logic */ }),
  cmd('PPT.FILE.LOCK.CONFLICT.RESOLVE', 'Resolve Conflict',    () => { /* Logic */ }),
  cmd('PPT.FILE.LOCK.CONFLICT.MERGE',   'Merge Changes',       () => { /* Logic */ }),
  cmd('PPT.FILE.LOCK.CONFLICT.OVERRIDE','Override Conflict',   () => { /* Logic */ }),

  // ══ FILE OPERATIONS ════════════════════════════════════════════════════════
  cmd('PPT.FILE.RENAME',                'Rename',              (_, p) => p?.name && FileEngine.rename(p.name)),
  cmd('PPT.FILE.DUPLICATE',             'Duplicate',           () => FileEngine.duplicate()),
  cmd('PPT.FILE.DELETE',                'Delete',              () => { /* Delete with confirmation */ }),
  cmd('PPT.FILE.MOVE',                  'Move',                () => { /* Move dialog */ }),
  cmd('PPT.FILE.COPY',                  'Copy',                () => FileEngine.saveCopy()),
  cmd('PPT.FILE.REVEAL',                'Reveal in Explorer',  () => FileEngine.revealInExplorer()),
  cmd('PPT.FILE.OPEN_LOCATION',         'Open File Location',  () => FileEngine.revealInExplorer()),
  cmd('PPT.FILE.SPLIT',                 'Split Presentation',      () => { /* Presentation split */ }),

  // ══ FILE INFORMATION ════════════════════════════════════════════════════════
  cmd('PPT.FILE.INFO.SIZE',             'File Size',           () => FileEngine.getFileInfo()),
  cmd('PPT.FILE.INFO.PAGES',            'Page Count',          () => FileEngine.getFileInfo()),
  cmd('PPT.FILE.INFO.PPTS',            'PPT Count',          () => FileEngine.getFileInfo()),
  cmd('PPT.FILE.INFO.CHARACTERS',       'Character Count',     () => FileEngine.getFileInfo()),
  cmd('PPT.FILE.INFO.CREATED',          'Date Created',        () => FileEngine.getFileInfo()),
  cmd('PPT.FILE.INFO.MODIFIED',         'Date Modified',       () => FileEngine.getFileInfo()),
  cmd('PPT.FILE.INFO.PERMISSIONS',      'File Permissions',    () => FileEngine.getFileInfo()),
  cmd('PPT.FILE.INFO.FORMAT',           'File Format',         () => FileEngine.getFileInfo()),

  // ══ DEVELOPER TOOLS ═════════════════════════════════════════════════════
  // ── OPENXML
  cmd('PPT.FILE.DEVELOPER.OPENXML',     'Open OpenXML Explorer',() => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.OPENXML.OPEN','Open Package',        () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.OPENXML.CLOSE','Close Package',      () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.OPENXML.RELOAD','Reload Package',    () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.OPENXML.EXTRACT','Extract Package',  () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.OPENXML.REPACK','Rebuild Package',   () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.OPENXML.CONTENTTYPES','Content Types',() => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.OPENXML.RELATIONSHIPS','Relationships',() => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.OPENXML.PARTS','Package Parts',      () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.OPENXML.COREPROPERTIES','Core Properties',() => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.OPENXML.APPPROPERTIES','App Properties',() => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.OPENXML.CUSTOMPROPERTIES','Custom Properties',() => { /* Logic */ }),

  // ── XML
  cmd('PPT.FILE.DEVELOPER.XML',         'XML Explorer',        () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.XML.OPEN',    'Open XML Part',       () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.XML.EDIT',    'Edit XML',            () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.XML.SAVE',    'Save XML',            () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.XML.RELOAD',  'Reload XML',          () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.XML.FORMAT',  'Format XML',          () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.XML.MINIFY',  'Minify XML',          () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.XML.PRETTYPRINT','Pretty Print',     () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.XML.SEARCH',  'Search XML',          () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.XML.REPLACE', 'Replace XML',         () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.XML.NAMESPACE','Namespaces',         () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.XML.SCHEMA',  'Schema',              () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.XML.XPATH',   'XPath Query',         () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.XML.EXPORT',  'Export XML',          () => { /* Logic */ }),

  // ── PACKAGE
  cmd('PPT.FILE.DEVELOPER.PACKAGE',     'Package Explorer',    () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.PACKAGE.OPEN','Open Package',        () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.PACKAGE.INFO','Package Information', () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.PACKAGE.SIZE','Package Size',        () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.PACKAGE.PARTS','Package Parts',      () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.PACKAGE.MEDIA','Media Files',        () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.PACKAGE.FONTS','Fonts',              () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.PACKAGE.EMBEDDED','Embedded Objects',() => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.PACKAGE.SIGNATURES','Digital Signatures',() => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.PACKAGE.EXPORT','Export Package',    () => { /* Logic */ }),

  // ── OPC
  cmd('PPT.FILE.DEVELOPER.OPC',         'OPC Explorer',        () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.OPC.CONTENTTYPES','Content Types',   () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.OPC.RELATIONSHIPS','Relationship Tree',() => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.OPC.PARTS',   'Package Parts',       () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.OPC.URI',     'Part URI',            () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.OPC.STREAMS', 'Streams',             () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.OPC.MEDIA',   'Media Resources',     () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.OPC.EXPORT',  'Export OPC',          () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.OPC.IMPORT',  'Import OPC',          () => { /* Logic */ }),

  // ── VALIDATE PACKAGE
  cmd('PPT.FILE.DEVELOPER.VALIDATE',    'Validate Package',    () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.VALIDATE.OPENXML','Validate OpenXML',() => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.VALIDATE.XML','Validate XML',        () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.VALIDATE.OPC','Validate OPC',        () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.VALIDATE.RELATIONSHIPS','Validate Relationships',() => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.VALIDATE.CONTENTTYPES','Validate Content Types',() => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.VALIDATE.SCHEMA','Validate Schema',  () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.VALIDATE.MEDIA','Validate Media',    () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.VALIDATE.SIGNATURE','Validate Signature',() => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.VALIDATE.REPORT','Generate Validation Report',() => { /* Logic */ }),

  // ── DIAGNOSTICS
  cmd('PPT.FILE.DEVELOPER.DIAGNOSTICS', 'Diagnostics',         () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.DIAGNOSTICS.OPEN','Open Diagnostics',() => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.DIAGNOSTICS.LOG','Developer Log',    () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.DIAGNOSTICS.TRACE','Trace Engine',   () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.DIAGNOSTICS.PROFILE','Performance Profile',() => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.DIAGNOSTICS.ERRORS','Error List',    () => { /* Logic */ }),
  cmd('PPT.FILE.DEVELOPER.DIAGNOSTICS.WARNINGS','Warnings',    () => { /* Logic */ }),

  // ── APP RELOAD
  cmd('PPT.FILE.DEV.RELOAD',            'Reload App',          () => window.location.reload()),

  // ══ ACCOUNT ═════════════════════════════════════════════════════════════
  cmd('PPT.FILE.ACCOUNT',               'My Account',                () => { /* UI Action */ }),
  cmd('PPT.FILE.ACCOUNT.PROFILE',       'View Profile',              () => { /* UI Action */ }),
  cmd('PPT.FILE.LICENSE',               'License & Subscription',    () => { /* UI Action */ }),
  cmd('PPT.FILE.LICENSE.ACTIVATE',      'Activate License',          () => { /* UI Action */ }),
  cmd('PPT.FILE.LICENSE.DEACTIVATE',    'Deactivate License',        () => { /* UI Action */ }),
  cmd('PPT.FILE.SUBSCRIPTION',          'Subscription',              () => { /* UI Action */ }),
  cmd('PPT.FILE.CONNECTED_SERVICES',    'Connected Services',        () => { /* UI Action */ }),
  cmd('PPT.FILE.OFFICE_THEME',          'Office Theme',              () => { /* UI Action */ }),
  cmd('PPT.FILE.UPDATE',                'Check for Updates',         () => { /* UI Action */ }),
  cmd('PPT.FILE.SIGNOUT',               'Sign Out',                  () => { /* UI Action */ }),

  // ══ SETTINGS ═══════════════════════════════════════════════════════════
  cmd('PPT.FILE.SETTINGS',              'Settings',                  () => { /* UI Action */ }, 'Ctrl+,'),
  cmd('PPT.FILE.SETTINGS.GENERAL',      'General Settings',          () => { /* UI Action */ }),
  cmd('PPT.FILE.SETTINGS.LANGUAGE',     'Language Settings',         () => { /* UI Action */ }),
  cmd('PPT.FILE.SETTINGS.PROOFING',     'Proofing Settings',         () => { /* UI Action */ }),
  cmd('PPT.FILE.SETTINGS.SAVE',         'Save Settings',             () => { /* UI Action */ }),
  cmd('PPT.FILE.SETTINGS.ADVANCED',     'Advanced Settings',         () => { /* UI Action */ }),
  cmd('PPT.FILE.SETTINGS.RIBBON',       'Customize Ribbon',          () => { /* UI Action */ }),
  cmd('PPT.FILE.SETTINGS.QAT',          'Quick Access Toolbar',      () => { /* UI Action */ }),
  cmd('PPT.FILE.SETTINGS.SHORTCUTS',    'Keyboard Shortcuts',        () => { /* UI Action */ }),
  cmd('PPT.FILE.SETTINGS.PLUGINS',      'Plugins',                   () => { /* UI Action */ }),
  cmd('PPT.FILE.SETTINGS.AI',           'AI Settings',               () => { /* UI Action */ }),
  cmd('PPT.FILE.OPTIONS',               'Options',                   () => { /* UI Action */ }),

  // ══ FEEDBACK ════════════════════════════════════════════════════════════
  cmd('PPT.FILE.FEEDBACK',              'Send Feedback',             () => { /* UI Action */ }),
  cmd('PPT.FILE.FEEDBACK.SEND',         'Send Feedback',             () => { /* UI Action */ }),
  cmd('PPT.FILE.REPORT',                'Report a Bug',              () => { /* UI Action */ }),
  cmd('PPT.FILE.REPORT.BUG',            'Report Bug',                () => { /* UI Action */ }),
  cmd('PPT.FILE.SUGGEST',               'Suggest a Feature',         () => { /* UI Action */ }),
  cmd('PPT.FILE.DIAGNOSTICS',           'Diagnostics',               () => { /* UI Action */ }),
  cmd('PPT.FILE.LOGS',                  'View Logs',                 () => { /* UI Action */ }),

  // ══ HELP ════════════════════════════════════════════════════════════════
  cmd('PPT.FILE.HELP',                  'Help Center',               () => { /* UI Action */ }, 'F1'),
  cmd('PPT.FILE.HELP.CENTER',           'Open Help',                 () => { /* UI Action */ }),
  cmd('PPT.FILE.TUTORIALS',             'Tutorials',                 () => { /* UI Action */ }),
  cmd('PPT.FILE.SHORTCUTS',             'Keyboard Shortcuts',        () => { /* UI Action */ }),
  cmd('PPT.FILE.PresentationATION',         'Presentationation',             () => { /* UI Action */ }),
  cmd('PPT.FILE.ABOUT',                 'About OfficeX',             () => { /* UI Action */ }),

  // ══ EXIT (supplemental) ══════════════════════════════════════════════════
  cmd('PPT.FILE.EXIT_ALL',              'Exit All Applications',     () => FileEngine.forceExit()),
  cmd('PPT.FILE.RESTART',               'Restart OfficeX',           () => window.location.reload()),

  // ══ ONEDRIVE COMMANDS ════════════════════════════════════════════════════
  cmd('PPT.ONEDRIVE.LOGIN',             'OneDrive Login',            (_, p) => OneDriveEngine.login(p?.email)),
  cmd('PPT.ONEDRIVE.LOGOUT',            'OneDrive Logout',           () => OneDriveEngine.logout()),
  cmd('PPT.ONEDRIVE.OPEN',              'OneDrive Open Presentation',    (_, p) => p?.item && OneDriveEngine.openItem(p.item)),
  cmd('PPT.ONEDRIVE.SAVE',              'OneDrive Save Presentation',    (_, p) => p?.name && OneDriveEngine.saveCurrentPresentation(p.name, p?.content || '')),
  cmd('PPT.ONEDRIVE.SAVE_AS',           'OneDrive Save As',          (_, p) => p?.name && OneDriveEngine.saveCurrentPresentation(p.name, p?.content || '')),
  cmd('PPT.ONEDRIVE.AUTOSAVE',          'OneDrive AutoSave Sync',    (_, p) => p?.name && OneDriveSyncEngine.queueAutoSave(p.id, p.name, p.content)),
  cmd('PPT.ONEDRIVE.SYNC',              'OneDrive Force Sync',       () => OneDriveSyncEngine.processPendingSync()),
  cmd('PPT.ONEDRIVE.UPLOAD',            'OneDrive Upload File',      (_, p) => p?.name && MicrosoftGraphEngine.createUploadSession('root', p.name, p.size || 1000)),
  cmd('PPT.ONEDRIVE.DOWNLOAD',          'OneDrive Download File',    (_, p) => p?.item && OneDriveEngine.openItem(p.item)),
  cmd('PPT.ONEDRIVE.SEARCH',            'OneDrive Search',           (_, p) => p?.query && MicrosoftGraphEngine.searchItems(p.query)),
  cmd('PPT.ONEDRIVE.RECENT',            'OneDrive Recent Files',     () => MicrosoftGraphEngine.getRecentItems()),
  cmd('PPT.ONEDRIVE.SHARED',            'OneDrive Shared Files',     () => MicrosoftGraphEngine.getSharedItems()),
  cmd('PPT.ONEDRIVE.FAVORITE',          'OneDrive Pin Favorite',     (_, p) => p?.id && MicrosoftGraphEngine.toggleFavorite(p.id)),
  cmd('PPT.ONEDRIVE.NEW_FOLDER',        'OneDrive New Folder',       (_, p) => p?.name && MicrosoftGraphEngine.createFolder(p?.parentId || 'root', p.name)),
  cmd('PPT.ONEDRIVE.DELETE',            'OneDrive Delete Item',      (_, p) => p?.id && MicrosoftGraphEngine.deleteItem(p.id)),
  cmd('PPT.ONEDRIVE.RENAME',            'OneDrive Rename Item',      (_, p) => p?.id && p?.name && MicrosoftGraphEngine.renameItem(p.id, p.name)),
  cmd('PPT.ONEDRIVE.REFRESH',           'OneDrive Refresh',          () => MicrosoftGraphEngine.getRootChildren()),
];

// ── Export ──────────────────────────────────────────────────────────────────

export const FileCommandRegistry = {
  all(): CommandDefinition[] {
    return FileCommands;
  },
  get(id: string): CommandDefinition | undefined {
    return FileCommands.find(c => c.id === id);
  },
  getByCategory(prefix: string): CommandDefinition[] {
    return FileCommands.filter(c => c.id.startsWith(prefix));
  },
};
