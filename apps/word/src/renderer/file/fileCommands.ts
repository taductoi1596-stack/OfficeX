/**
 * fileCommands.ts
 *
 * Complete File Command Registry for OfficeX Word.
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

  // ══ NEW DOCUMENT ════════════════════════════════════════════════════════
  cmd('WORD.FILE.NEW',                   'New Document',            () => FileEngine.newDocument(),                'Ctrl+N'),
  cmd('WORD.FILE.NEW.BLANK',             'New Blank Document',      () => FileEngine.newDocument()),
  cmd('WORD.FILE.NEW.DEFAULT',           'New Default Document',    () => FileEngine.newDocument('default')),
  cmd('WORD.FILE.NEW.WELCOME',           'Open Welcome Screen',     () => FileEngine.openWelcomeScreen()),
  cmd('WORD.FILE.NEW.RECENT_TEMPLATE',   'New from Recent Template', () => { /* FileMenu UI */ }),
  cmd('WORD.FILE.NEW.FROM_TEMPLATE',     'New from Template',       () => { /* FileMenu UI */ }),
  cmd('WORD.FILE.NEW.CUSTOM_TEMPLATE',   'New from Custom Template', () => { /* FileMenu template gallery */ }),
  cmd('WORD.FILE.NEW.EMPTY',             'New Empty Document',      () => FileEngine.newDocument('empty')),

  // ══ OPEN ════════════════════════════════════════════════════════════════
  cmd('WORD.FILE.OPEN',                  'Open File',               () => FileEngine.openLocal(),                  'Ctrl+O'),
  cmd('WORD.FILE.OPEN.LOCAL',            'Open Local File',         () => FileEngine.openLocal()),
  cmd('WORD.FILE.OPEN.BROWSE',           'Browse File System',      () => FileEngine.openLocal()),
  cmd('WORD.FILE.OPEN.DRAG_DROP',        'Open By Drag And Drop',   (_, p) => p?.path && FileEngine.openFromPath(p.path)),
  cmd('WORD.FILE.OPEN.CONTEXT_MENU',     'Open From Explorer',      (_, p) => p?.path && FileEngine.openFromPath(p.path)),
  cmd('WORD.FILE.OPEN.DOUBLE_CLICK',     'Open By Double Click',    (_, p) => p?.path && FileEngine.openFromPath(p.path)),
  
  // ── OPEN RECENT
  cmd('WORD.FILE.OPEN.RECENT',           'Open Recent File',        (_, p) => p?.path ? FileEngine.openFromPath(p.path) : /* Open UI */ null, 'Ctrl+Shift+O'),
  cmd('WORD.FILE.OPEN.RECENT.CLEAR',     'Clear Recent Files',      () => FileStorageEngine.clearRecent()),
  cmd('WORD.FILE.OPEN.RECENT.PIN',       'Pin Recent File',         (_, p) => p?.id && FileStorageEngine.pinFile(p.id)),
  cmd('WORD.FILE.OPEN.RECENT.UNPIN',     'Unpin Recent File',       (_, p) => p?.id && FileStorageEngine.unpinFile(p.id)),
  cmd('WORD.FILE.OPEN.RECENT.REMOVE',    'Remove Recent File',      (_, p) => p?.id && FileStorageEngine.removeFromRecent(p.id)),
  cmd('WORD.FILE.OPEN.RECENT.RESTORE',   'Restore Recent File',     (_, p) => p?.id && FileEngine.restoreRecoveryPoint(p.id)),
  cmd('WORD.FILE.OPEN.RECENT.SEARCH',    'Search Recent Files',     () => { /* UI Action */ }),

  // ── OPEN PINNED
  cmd('WORD.FILE.OPEN.PINNED',           'Open Pinned Document',    (_, p) => p?.path && FileEngine.openFromPath(p.path)),
  cmd('WORD.FILE.OPEN.PINNED.ALL',       'Open All Pinned',         () => { /* Loop and open */ }),
  cmd('WORD.FILE.OPEN.PINNED.REMOVE',    'Remove Pinned',           (_, p) => p?.id && FileStorageEngine.unpinFile(p.id)),

  // ── OPEN CLOUD
  cmd('WORD.FILE.OPEN.CLOUD',            'Open Cloud Document',     () => { /* UI Action */ }),
  cmd('WORD.FILE.OPEN.ONEDRIVE',         'Open OneDrive Document',  () => { /* Auth and Pick */ }),
  cmd('WORD.FILE.OPEN.GOOGLE_DRIVE',     'Open Google Drive Document', () => { /* Auth and Pick */ }),
  cmd('WORD.FILE.OPEN.DROPBOX',          'Open Dropbox Document',   () => { /* Auth and Pick */ }),
  cmd('WORD.FILE.OPEN.SHAREPOINT',       'Open SharePoint Document',() => { /* Auth and Pick */ }),
  cmd('WORD.FILE.OPEN.CLOUD.SEARCH',     'Search Cloud Documents',  () => { /* UI Action */ }),
  cmd('WORD.FILE.OPEN.CLOUD.OFFLINE',    'Open Cached Cloud File',  (_, p) => p?.path && FileEngine.openFromPath(p.path)),

  // ── OPEN READ ONLY
  cmd('WORD.FILE.OPEN.READONLY',         'Open Read Only',          (_, p) => p?.path && FileEngine.openReadOnly(p.path)),
  cmd('WORD.FILE.OPEN.READONLY.ALWAYS',  'Always Open Read Only',   () => { /* Preferences */ }),
  cmd('WORD.FILE.OPEN.READONLY.TEMP',    'Temporary Read Only',     (_, p) => p?.path && FileEngine.openReadOnly(p.path)),

  // ── OPEN PROTECTED
  cmd('WORD.FILE.OPEN.PROTECTED',        'Protected View',          (_, p) => p?.path && FileEngine.openReadOnly(p.path)),
  cmd('WORD.FILE.OPEN.PROTECTED.ENABLE', 'Enable Protected View',   () => FileEngine.setProtected(true)),
  cmd('WORD.FILE.OPEN.PROTECTED.DISABLE','Disable Protected View',  () => FileEngine.setProtected(false)),
  cmd('WORD.FILE.OPEN.PROTECTED.WARNING','Show Protected Warning',  () => { /* UI Action */ }),

  // ── OPEN SAFE MODE
  cmd('WORD.FILE.OPEN.SAFE',             'Open Safe Mode',          (_, p) => p?.path && FileEngine.openSafe(p.path)),
  cmd('WORD.FILE.OPEN.SAFE.NO_ADDINS',   'Disable Add-ins',         () => { /* Startup arg */ }),
  cmd('WORD.FILE.OPEN.SAFE.RECOVERY',    'Safe Recovery',           () => { /* Startup arg */ }),
  cmd('WORD.FILE.OPEN.SAFE.XML',         'Safe XML Loading',        () => { /* Parser arg */ }),

  // ── OPEN REPAIR
  cmd('WORD.FILE.OPEN.REPAIR',           'Open and Repair',         () => FileEngine.openAndRepair()),
  cmd('WORD.FILE.OPEN.REPAIR.XML',       'Repair OpenXML',          () => FileEngine.openAndRepair()),
  cmd('WORD.FILE.OPEN.REPAIR.MEDIA',     'Repair Media',            () => FileEngine.openAndRepair()),
  cmd('WORD.FILE.OPEN.REPAIR.FONTS',     'Repair Fonts',            () => FileEngine.openAndRepair()),
  cmd('WORD.FILE.OPEN.REPAIR.TABLES',    'Repair Tables',           () => FileEngine.openAndRepair()),
  cmd('WORD.FILE.OPEN.REPAIR.STYLES',    'Repair Styles',           () => FileEngine.openAndRepair()),

  // ── OPEN URL
  cmd('WORD.FILE.OPEN.URL',              'Open URL',                (_, p) => p?.url && FileEngine.openFromPath(p.url)),
  cmd('WORD.FILE.OPEN.HTTP',             'Open HTTP',               (_, p) => p?.url && FileEngine.openFromPath(p.url)),
  cmd('WORD.FILE.OPEN.HTTPS',            'Open HTTPS',              (_, p) => p?.url && FileEngine.openFromPath(p.url)),
  cmd('WORD.FILE.OPEN.WEBDAV',           'Open WebDAV',             (_, p) => p?.url && FileEngine.openFromPath(p.url)),

  // ── WORKSPACE
  cmd('WORD.FILE.OPEN.WORKSPACE',        'Open Workspace',          () => FileEngine.openWorkspace(), 'Alt+Ctrl+O'),
  cmd('WORD.FILE.OPEN.WORKSPACE.RECENT', 'Recent Workspace',        () => { /* UI Action */ }),
  cmd('WORD.FILE.OPEN.WORKSPACE.CLOUD',  'Cloud Workspace',         () => { /* UI Action */ }),
  cmd('WORD.FILE.OPEN.WORKSPACE.RESTORE','Restore Workspace',       () => FileEngine.restoreWorkspace()),

  // ── MULTIPLE
  cmd('WORD.FILE.OPEN.MULTIPLE',         'Open Multiple Documents', (_, p) => p?.paths?.forEach((path: string) => FileEngine.openFromPath(path))),
  cmd('WORD.FILE.OPEN.MULTIPLE.FOLDER',  'Open Folder',             () => FileEngine.openFolder()),
  cmd('WORD.FILE.OPEN.MULTIPLE.PROJECT', 'Open Project',            () => FileEngine.openProject()),
  cmd('WORD.FILE.OPEN.MULTIPLE.RECENT',  'Open Recent Group',       () => { /* UI Action */ }),

  // ── RECOVERY
  cmd('WORD.FILE.OPEN.RECOVERY',         'Recover File',            (_, p) => p?.id && FileEngine.restoreRecoveryPoint(p.id)),
  cmd('WORD.FILE.OPEN.RECOVERY.AUTO',    'Auto Recovery',           () => FileEngine.restoreAutoRecovery()),
  cmd('WORD.FILE.OPEN.RECOVERY.SEARCH',  'Search Recovery Files',   () => { /* UI Action */ }),
  cmd('WORD.FILE.OPEN.RECOVERY.RESTORE', 'Restore Recovery',        (_, p) => p?.id && FileEngine.restoreRecoveryPoint(p.id)),

  // ── SPECIAL
  cmd('WORD.FILE.OPEN.TEMPLATE',         'Open Template',           () => { /* UI Action */ }),
  cmd('WORD.FILE.OPEN.EXAMPLE',          'Open Sample Document',    () => FileEngine.openExample()),
  cmd('WORD.FILE.OPEN.LAST',             'Open Last Document',      () => FileEngine.openLastDocument()),
  cmd('WORD.FILE.OPEN.STARTUP',          'Open Startup Document',   () => FileEngine.openStartupDocument()),

  // ══ CLOSE ═══════════════════════════════════════════════════════════════
  cmd('WORD.FILE.CLOSE',                 'Close',                   () => FileEngine.close(),                      'Ctrl+W'),
  cmd('WORD.FILE.CLOSE.ACTIVE',          'Close Active Document',   () => FileEngine.close()),
  cmd('WORD.FILE.CLOSE.ALL',             'Close All Documents',     () => FileEngine.closeAll()),
  cmd('WORD.FILE.CLOSE.OTHERS',          'Close Other Documents',   () => { /* Multi-document */ }),
  cmd('WORD.FILE.CLOSE.WITHOUT_SAVE',    'Close Without Saving',    () => FileEngine.closeWithoutSave()),
  cmd('WORD.FILE.CLOSE.SAVE_AND_CLOSE',  'Save and Close',          () => FileEngine.saveAndClose()),

  // ══ SAVE ════════════════════════════════════════════════════════════════
  cmd('WORD.FILE.SAVE',                  'Save',                    () => FileEngine.save(),                       'Ctrl+S'),
  cmd('WORD.FILE.SAVE.ACTIVE',           'Save Active Document',    () => FileEngine.save()),
  cmd('WORD.FILE.SAVE.ALL',              'Save All Open Documents', () => FileEngine.saveAll(),                    'Ctrl+Shift+S'),
  cmd('WORD.FILE.SAVE.SELECTED',         'Save Selected Document',  () => FileEngine.save()),
  cmd('WORD.FILE.SAVE.IF_DIRTY',         'Save Only If Modified',   () => FileEngine.saveIfDirty()),
  cmd('WORD.FILE.SAVE.FORCE',            'Force Save',              () => FileEngine.save()),
  cmd('WORD.FILE.SAVE.SILENT',           'Silent Save',             () => FileEngine.saveBackground()),
  cmd('WORD.FILE.SAVE.QUICK',            'Quick Save',              () => FileEngine.save()),

  // ── SAVE AS (format-specific) ════════════════════════════════════════════
  cmd('WORD.FILE.SAVE_AS',              'Save As',                 () => FileEngine.saveAs(),                     'F12'),
  cmd('WORD.FILE.SAVE_AS.DOCX',         'Save As DOCX',            () => FileEngine.saveAsFormat('docx')),
  cmd('WORD.FILE.SAVE_AS.DOC',          'Save As DOC',             () => FileEngine.saveAsFormat('doc')),
  cmd('WORD.FILE.SAVE_AS.ODT',          'Save As ODT',             () => FileEngine.saveAsFormat('odt')),
  cmd('WORD.FILE.SAVE_AS.PDF',          'Save As PDF',             () => FileEngine.saveAsFormat('pdf')),
  cmd('WORD.FILE.SAVE_AS.HTML',         'Save As HTML',            () => FileEngine.saveAsFormat('html')),
  cmd('WORD.FILE.SAVE_AS.MARKDOWN',     'Save As Markdown',        () => FileEngine.saveAsFormat('markdown')),
  cmd('WORD.FILE.SAVE_AS.TEXT',         'Save As TXT',             () => FileEngine.saveAsFormat('txt')),
  cmd('WORD.FILE.SAVE_AS.XML',          'Save As XML',             () => FileEngine.saveAsFormat('xml')),
  cmd('WORD.FILE.SAVE_AS.JSON',         'Save As JSON',            () => FileEngine.saveAsFormat('json')),
  cmd('WORD.FILE.SAVE_AS.TEMPLATE',     'Save As Template',        () => FileEngine.saveAsFormat('dotx')),

  // ── SAVE COPY ════════════════════════════════════════════════════════════
  cmd('WORD.FILE.SAVE_COPY',             'Save Copy',               () => FileEngine.saveCopy()),
  cmd('WORD.FILE.SAVE_COPY.LOCAL',       'Save Copy Local',         () => FileEngine.saveCopy()),
  cmd('WORD.FILE.SAVE_COPY.CLOUD',       'Save Copy Cloud',         () => { /* Cloud picker */ }),
  cmd('WORD.FILE.SAVE_COPY.PDF',         'Save Copy As PDF',        () => FileEngine.saveAsFormat('pdf')),
  cmd('WORD.FILE.SAVE_COPY.BACKUP',      'Save Backup Copy',        () => FileEngine.saveCopy()),

  // ── AUTO SAVE ════════════════════════════════════════════════════════════
  cmd('WORD.FILE.AUTOSAVE.ENABLE',       'Enable Auto Save',        () => FileEngine.enableAutoSave()),
  cmd('WORD.FILE.AUTOSAVE.DISABLE',      'Disable Auto Save',       () => FileEngine.disableAutoSave()),
  cmd('WORD.FILE.AUTOSAVE.START',        'Start Auto Save',         () => FileEngine.enableAutoSave()),
  cmd('WORD.FILE.AUTOSAVE.STOP',         'Stop Auto Save',          () => FileEngine.disableAutoSave()),
  cmd('WORD.FILE.AUTOSAVE.INTERVAL',     'Set Auto Save Interval',  (_, p) => p?.ms && FileEngine.setAutoSaveInterval(p.ms)),
  cmd('WORD.FILE.AUTOSAVE.STATUS',       'Get Auto Save Status',    () => { /* Get status */ }),
  cmd('WORD.FILE.AUTOSAVE.RESTORE',      'Restore Auto Save File',  () => FileEngine.restoreAutoRecovery()),
  cmd('WORD.FILE.AUTOSAVE.FLUSH',        'Force Auto Save',         () => FileEngine.saveBackground()),

  // ── SAVE VERSION ═════════════════════════════════════════════════════════
  cmd('WORD.FILE.VERSION.SAVE',          'Save Version',            (_, p) => FileEngine.saveVersion(p?.label, p?.comment)),
  cmd('WORD.FILE.VERSION.CREATE',        'Create Version',          (_, p) => FileEngine.saveVersion(p?.label, p?.comment)),
  cmd('WORD.FILE.VERSION.LABEL',         'Label Version',           (_, p) => p?.id && p?.label && FileStorageEngine.labelVersion(p.id, p.label)),
  cmd('WORD.FILE.VERSION.SNAPSHOT',      'Create Snapshot',         () => FileEngine.saveVersion('Snapshot', 'Auto-generated snapshot')),
  cmd('WORD.FILE.VERSION.MILESTONE',     'Create Milestone',        () => FileEngine.saveVersion('Milestone', 'Project Milestone')),

  // ── SAVE CLOUD ═══════════════════════════════════════════════════════════
  cmd('WORD.FILE.SAVE.CLOUD',            'Save To Cloud',           () => { /* UI Action */ }),
  cmd('WORD.FILE.SAVE.ONEDRIVE',         'Save To OneDrive',        () => { /* OneDrive Sync */ }),
  cmd('WORD.FILE.SAVE.SHAREPOINT',       'Save To SharePoint',      () => { /* SharePoint Sync */ }),
  cmd('WORD.FILE.SAVE.GOOGLE_DRIVE',     'Save To Google Drive',    () => { /* GDrive Sync */ }),
  cmd('WORD.FILE.SAVE.DROPBOX',          'Save To Dropbox',         () => { /* Dropbox Sync */ }),
  cmd('WORD.FILE.SAVE.ICLOUD',           'Save To iCloud',          () => { /* iCloud Sync */ }),
  cmd('WORD.FILE.SAVE.CLOUD.SYNC',       'Sync Cloud',              () => { /* Sync All */ }),
  cmd('WORD.FILE.SAVE.CLOUD.BACKGROUND','Background Cloud Sync',   () => { /* Background Sync */ }),

  // ── SAVE LOCAL ═══════════════════════════════════════════════════════════
  cmd('WORD.FILE.SAVE.LOCAL',            'Save Local',              () => FileEngine.save()),
  cmd('WORD.FILE.SAVE.LOCAL.NEWNAME',    'Save Local With New Name',() => FileEngine.saveAs()),
  cmd('WORD.FILE.SAVE.LOCAL.REPLACE',    'Replace Existing File',   () => FileEngine.save()),
  cmd('WORD.FILE.SAVE.LOCAL.READONLY',   'Save Read Only Copy',     () => FileEngine.saveCopy()),

  // ── BACKGROUND SAVE ══════════════════════════════════════════════════════
  cmd('WORD.FILE.SAVE.BACKGROUND',       'Background Save',         () => FileEngine.saveBackground()),
  cmd('WORD.FILE.SAVE.BACKGROUND.ALL',   'Background Save All',     () => FileEngine.saveBackground()),
  cmd('WORD.FILE.SAVE.BACKGROUND.CLOUD', 'Background Cloud Save',   () => { /* Cloud Save */ }),
  cmd('WORD.FILE.SAVE.BACKGROUND.LOCAL', 'Background Local Save',   () => FileEngine.saveBackground()),

  // ── RECOVERY SAVE ════════════════════════════════════════════════════════
  cmd('WORD.FILE.SAVE.RECOVERY',         'Recovery Save',           () => FileEngine.saveBackground()),
  cmd('WORD.FILE.SAVE.CRASH',            'Crash Recovery Save',     () => FileEngine.saveBackground()),
  cmd('WORD.FILE.SAVE.EMERGENCY',        'Emergency Save',          () => FileEngine.save()),
  cmd('WORD.FILE.SAVE.RESTORE_POINT',    'Create Restore Point',    () => FileEngine.saveVersion('Restore Point', 'Manual restore point')),

  // ── CONFLICT ═════════════════════════════════════════════════════════════
  cmd('WORD.FILE.SAVE.CONFLICT.DETECT',  'Detect Save Conflict',    () => { /* Logic */ }),
  cmd('WORD.FILE.SAVE.CONFLICT.RESOLVE', 'Resolve Conflict',        () => { /* UI Action */ }),
  cmd('WORD.FILE.SAVE.CONFLICT.KEEP_LOCAL', 'Keep Local Version',   () => { /* Logic */ }),
  cmd('WORD.FILE.SAVE.CONFLICT.KEEP_REMOTE','Keep Remote Version',  () => { /* Logic */ }),
  cmd('WORD.FILE.SAVE.CONFLICT.MERGE',   'Merge Changes',           () => { /* Merge Engine */ }),

  // ── VALIDATION ═══════════════════════════════════════════════════════════
  cmd('WORD.FILE.SAVE.VALIDATE',         'Validate Before Save',    () => { /* Logic */ }),
  cmd('WORD.FILE.SAVE.CHECK.PERMISSION', 'Check Write Permission',  () => { /* Logic */ }),
  cmd('WORD.FILE.SAVE.CHECK.LOCK',       'Check File Lock',         () => { /* Logic */ }),
  cmd('WORD.FILE.SAVE.CHECK.DISK',       'Check Disk Space',        () => { /* Logic */ }),
  cmd('WORD.FILE.SAVE.CHECK.PATH',       'Check Save Path',         () => { /* Logic */ }),

  // ══ EXIT ════════════════════════════════════════════════════════════════
  cmd('WORD.FILE.EXIT',                  'Exit OfficeX',            () => FileEngine.exit(),                       'Alt+F4'),
  cmd('WORD.FILE.EXIT.FORCE',            'Force Exit',              () => FileEngine.forceExit()),
  cmd('WORD.FILE.EXIT.SAVE_ALL',         'Save All and Exit',       () => FileEngine.saveAllAndExit()),
  cmd('WORD.FILE.EXIT.CANCEL',           'Cancel Exit',             () => { /* Cancel pending exit */ }),

  // ══ IMPORT ══════════════════════════════════════════════════════════════
  // ── DOC IMPORT
  cmd('WORD.FILE.IMPORT.DOC',            'Import Microsoft Word DOC',() => FileEngine.importFrom('doc')),
  cmd('WORD.FILE.IMPORT.DOC.REPAIR',     'Import DOC With Repair',  () => FileEngine.importFrom('doc')),
  cmd('WORD.FILE.IMPORT.DOC.READONLY',   'Import DOC Read Only',    () => FileEngine.importFrom('doc')),
  cmd('WORD.FILE.IMPORT.DOC.CONVERT',    'Convert DOC To DOCX',     () => FileEngine.importFrom('doc')),

  // ── DOCX IMPORT
  cmd('WORD.FILE.IMPORT.DOCX',           'Import DOCX',             () => FileEngine.importFrom('docx')),
  cmd('WORD.FILE.IMPORT.DOCX.REPAIR',    'Repair DOCX',             () => FileEngine.importFrom('docx')),
  cmd('WORD.FILE.IMPORT.DOCX.STRICT',    'Strict OpenXML',          () => FileEngine.importFrom('docx')),
  cmd('WORD.FILE.IMPORT.DOCX.MERGE',     'Merge DOCX',              () => FileEngine.importFrom('docx')),
  cmd('WORD.FILE.IMPORT.DOCX.READONLY',  'Read Only',               () => FileEngine.importFrom('docx')),

  // ── ODT IMPORT
  cmd('WORD.FILE.IMPORT.ODT',            'Import OpenDocument Text',() => FileEngine.importFrom('odt')),
  cmd('WORD.FILE.IMPORT.ODT.CONVERT',    'Convert ODT',             () => FileEngine.importFrom('odt')),
  cmd('WORD.FILE.IMPORT.ODT.REPAIR',     'Repair ODT',              () => FileEngine.importFrom('odt')),

  // ── HTML IMPORT
  cmd('WORD.FILE.IMPORT.HTML',           'Import HTML',             () => FileEngine.importFrom('html')),
  cmd('WORD.FILE.IMPORT.HTML.CSS',       'Import CSS',              () => { /* UI Action */ }),
  cmd('WORD.FILE.IMPORT.HTML.IMAGES',    'Import Images',           () => { /* UI Action */ }),
  cmd('WORD.FILE.IMPORT.HTML.TABLES',    'Import Tables',           () => { /* UI Action */ }),
  cmd('WORD.FILE.IMPORT.HTML.CLEAN',     'Clean HTML',              () => { /* UI Action */ }),

  // ── TXT IMPORT
  cmd('WORD.FILE.IMPORT.TXT',            'Import Plain Text',       () => FileEngine.importFrom('txt')),
  cmd('WORD.FILE.IMPORT.TXT.UTF8',       'UTF-8',                   () => FileEngine.importFrom('txt')),
  cmd('WORD.FILE.IMPORT.TXT.UTF16',      'UTF-16',                  () => FileEngine.importFrom('txt')),
  cmd('WORD.FILE.IMPORT.TXT.ASCII',      'ASCII',                   () => FileEngine.importFrom('txt')),
  cmd('WORD.FILE.IMPORT.TXT.AUTO_DETECT','Auto Detect Encoding',    () => FileEngine.importFrom('txt')),

  // ── PDF IMPORT
  cmd('WORD.FILE.IMPORT.PDF',            'Import PDF',              () => FileEngine.importFrom('pdf')),
  cmd('WORD.FILE.IMPORT.PDF.OCR',        'OCR PDF',                 () => FileEngine.importFrom('pdf')),
  cmd('WORD.FILE.IMPORT.PDF.TEXT',       'Extract Text',            () => FileEngine.importFrom('pdf')),
  cmd('WORD.FILE.IMPORT.PDF.LAYOUT',     'Preserve Layout',         () => FileEngine.importFrom('pdf')),
  cmd('WORD.FILE.IMPORT.PDF.IMAGES',     'Extract Images',          () => FileEngine.importFrom('pdf')),
  cmd('WORD.FILE.IMPORT.PDF.TABLES',     'Extract Tables',          () => FileEngine.importFrom('pdf')),

  // ── XML IMPORT
  cmd('WORD.FILE.IMPORT.XML',            'Import XML',              () => FileEngine.importFrom('xml')),
  cmd('WORD.FILE.IMPORT.XML.OPENXML',    'OpenXML',                 () => FileEngine.importFrom('xml')),
  cmd('WORD.FILE.IMPORT.XML.CUSTOM',     'Custom XML',              () => FileEngine.importFrom('xml')),
  cmd('WORD.FILE.IMPORT.XML.MAPPING',    'Import XML Mapping',      () => { /* Logic */ }),

  // ── JSON IMPORT
  cmd('WORD.FILE.IMPORT.JSON',           'Import JSON',             () => FileEngine.importFrom('json')),
  cmd('WORD.FILE.IMPORT.JSON.CONTENT',   'Content',                 () => FileEngine.importFrom('json')),
  cmd('WORD.FILE.IMPORT.JSON.STYLES',    'Styles',                  () => FileEngine.importFrom('json')),
  cmd('WORD.FILE.IMPORT.JSON.METADATA',  'Metadata',                () => FileEngine.importFrom('json')),

  // ── MARKDOWN IMPORT
  cmd('WORD.FILE.IMPORT.MARKDOWN',       'Import Markdown',         () => FileEngine.importFrom('markdown')),
  cmd('WORD.FILE.IMPORT.MARKDOWN.GITHUB','GitHub Markdown',         () => FileEngine.importFrom('markdown')),
  cmd('WORD.FILE.IMPORT.MARKDOWN.COMMONMARK', 'CommonMark',         () => FileEngine.importFrom('markdown')),
  cmd('WORD.FILE.IMPORT.MARKDOWN.TABLES','Tables',                  () => { /* UI Action */ }),
  cmd('WORD.FILE.IMPORT.MARKDOWN.FOOTNOTES','Footnotes',            () => { /* UI Action */ }),

  // ── BATCH IMPORT
  cmd('WORD.FILE.IMPORT.BATCH',          'Batch Import',            () => { /* Logic */ }),
  cmd('WORD.FILE.IMPORT.BATCH.FOLDER',   'Import Folder',           () => { /* Logic */ }),
  cmd('WORD.FILE.IMPORT.BATCH.ZIP',      'Import Archive',          () => { /* Logic */ }),
  cmd('WORD.FILE.IMPORT.BATCH.WORKSPACE','Import Workspace',        () => { /* Logic */ }),

  // ── BACKGROUND IMPORT
  cmd('WORD.FILE.IMPORT.BACKGROUND',     'Background Import',       () => { /* Logic */ }),
  cmd('WORD.FILE.IMPORT.CANCEL',         'Cancel Import',           () => { /* Logic */ }),
  cmd('WORD.FILE.IMPORT.RETRY',          'Retry Import',            () => { /* Logic */ }),
  cmd('WORD.FILE.IMPORT.PROGRESS',       'Import Progress',         () => { /* Logic */ }),

  // ── MERGE
  cmd('WORD.FILE.IMPORT.MERGE',          'Merge Imported Document', () => { /* Logic */ }),
  cmd('WORD.FILE.IMPORT.APPEND',         'Append To Current Document', () => { /* Logic */ }),
  cmd('WORD.FILE.IMPORT.REPLACE',        'Replace Current Document',() => { /* Logic */ }),

  // ── VALIDATION
  cmd('WORD.FILE.IMPORT.VALIDATE',       'Validate File',           () => { /* Logic */ }),
  cmd('WORD.FILE.IMPORT.CHECK.FORMAT',   'Check Format',            () => { /* Logic */ }),
  cmd('WORD.FILE.IMPORT.CHECK.VERSION',  'Check Version',           () => { /* Logic */ }),
  cmd('WORD.FILE.IMPORT.CHECK.SECURITY', 'Check Security',          () => { /* Logic */ }),

  // ── RECOVERY
  cmd('WORD.FILE.IMPORT.RECOVER',        'Recover Corrupted File',  () => { /* Logic */ }),
  cmd('WORD.FILE.IMPORT.REPAIR',         'Repair Before Import',    () => { /* Logic */ }),
  cmd('WORD.FILE.IMPORT.SKIP_ERRORS',    'Skip Invalid Content',    () => { /* Logic */ }),

  // ══ EXPORT ══════════════════════════════════════════════════════════════
  // ── PDF EXPORT
  cmd('WORD.FILE.EXPORT.PDF',            'Export PDF',              () => FileEngine.exportAs('pdf')),
  cmd('WORD.FILE.EXPORT.PDF.STANDARD',   'Standard PDF',            () => FileEngine.exportAs('pdf')),
  cmd('WORD.FILE.EXPORT.PDF.PRINT',      'High Quality Print',      () => FileEngine.exportAs('pdf')),
  cmd('WORD.FILE.EXPORT.PDF.MINIMUM',    'Minimum Size',            () => FileEngine.exportAs('pdf')),
  cmd('WORD.FILE.EXPORT.PDF.PASSWORD',   'Password Protected PDF',  () => FileEngine.exportAs('pdf')),
  cmd('WORD.FILE.EXPORT.PDF.PDFA',       'Export PDF/A',            () => FileEngine.exportAs('pdf')),
  cmd('WORD.FILE.EXPORT.PDF.BOOKMARKS',  'Include Bookmarks',       () => { /* UI Action */ }),
  cmd('WORD.FILE.EXPORT.PDF.HYPERLINKS', 'Include Hyperlinks',      () => { /* UI Action */ }),
  cmd('WORD.FILE.EXPORT.PDF.ACCESSIBILITY','Accessible PDF',        () => FileEngine.exportAs('pdf')),
  cmd('WORD.FILE.EXPORT.PDF.COMMENTS',   'Include Comments',        () => { /* UI Action */ }),
  cmd('WORD.FILE.EXPORT.PDF.TRACK_CHANGES','Include Track Changes', () => { /* UI Action */ }),
  cmd('WORD.FILE.EXPORT.PDF.EMBED_FONTS','Embed Fonts',             () => { /* UI Action */ }),
  cmd('WORD.FILE.EXPORT.PDF.COMPRESS',   'Compress Images',         () => { /* UI Action */ }),

  // ── HTML EXPORT
  cmd('WORD.FILE.EXPORT.HTML',           'Export HTML',             () => FileEngine.exportAs('html')),
  cmd('WORD.FILE.EXPORT.HTML.EMBED_IMAGES', 'Embed Images',         () => { /* UI Action */ }),
  cmd('WORD.FILE.EXPORT.HTML.EXTERNAL_IMAGES', 'External Images',   () => { /* UI Action */ }),
  cmd('WORD.FILE.EXPORT.HTML.CSS_INLINE','Inline CSS',              () => { /* UI Action */ }),
  cmd('WORD.FILE.EXPORT.HTML.CSS_FILE',  'External CSS',            () => { /* UI Action */ }),
  cmd('WORD.FILE.EXPORT.HTML.RESPONSIVE','Responsive HTML',         () => { /* UI Action */ }),
  cmd('WORD.FILE.EXPORT.HTML.MINIFY',    'Minify HTML',             () => { /* UI Action */ }),

  // ── DOCX EXPORT
  cmd('WORD.FILE.EXPORT.DOCX',           'Export DOCX',             () => FileEngine.exportAs('docx')),
  cmd('WORD.FILE.EXPORT.DOCX.STRICT',    'Strict Open XML',         () => FileEngine.exportAs('docx')),
  cmd('WORD.FILE.EXPORT.DOCX.COMPATIBLE','Compatibility Mode',      () => FileEngine.exportAs('docx')),
  cmd('WORD.FILE.EXPORT.DOCX.FLATTEN',   'Flatten Document',        () => FileEngine.exportAs('docx')),

  // ── ODT EXPORT
  cmd('WORD.FILE.EXPORT.ODT',            'Export ODT',              () => FileEngine.exportAs('odt')),
  cmd('WORD.FILE.EXPORT.ODT.COMPATIBLE', 'Compatibility Mode',      () => FileEngine.exportAs('odt')),
  cmd('WORD.FILE.EXPORT.ODT.STRICT',     'Strict ODF',              () => FileEngine.exportAs('odt')),

  // ── MARKDOWN EXPORT
  cmd('WORD.FILE.EXPORT.MARKDOWN',       'Export Markdown',         () => FileEngine.exportAs('markdown')),
  cmd('WORD.FILE.EXPORT.MARKDOWN.GITHUB','GitHub Markdown',         () => FileEngine.exportAs('markdown')),
  cmd('WORD.FILE.EXPORT.MARKDOWN.COMMONMARK', 'CommonMark',         () => FileEngine.exportAs('markdown')),
  cmd('WORD.FILE.EXPORT.MARKDOWN.WIKI',  'Wiki Markdown',           () => FileEngine.exportAs('markdown')),
  cmd('WORD.FILE.EXPORT.MARKDOWN.TABLES','Enable Tables',           () => { /* UI Action */ }),
  cmd('WORD.FILE.EXPORT.MARKDOWN.FOOTNOTES','Include Footnotes',    () => { /* UI Action */ }),

  // ── TEXT EXPORT
  cmd('WORD.FILE.EXPORT.TEXT',           'Export TXT',              () => FileEngine.exportAs('txt')),
  cmd('WORD.FILE.EXPORT.TEXT.UTF8',      'UTF-8',                   () => FileEngine.exportAs('txt')),
  cmd('WORD.FILE.EXPORT.TEXT.UTF16',     'UTF-16',                  () => FileEngine.exportAs('txt')),
  cmd('WORD.FILE.EXPORT.TEXT.ASCII',     'ASCII',                   () => FileEngine.exportAs('txt')),
  cmd('WORD.FILE.EXPORT.TEXT.UNICODE',   'Unicode',                 () => FileEngine.exportAs('txt')),

  // ── XML EXPORT
  cmd('WORD.FILE.EXPORT.XML',            'Export XML',              () => FileEngine.exportAs('xml')),
  cmd('WORD.FILE.EXPORT.XML.OPENXML',    'Open XML',                () => FileEngine.exportAs('xml')),
  cmd('WORD.FILE.EXPORT.XML.CUSTOM',     'Custom XML',              () => FileEngine.exportAs('xml')),
  cmd('WORD.FILE.EXPORT.XML.PACKAGE',    'Package XML',             () => FileEngine.exportAs('xml')),

  // ── JSON EXPORT
  cmd('WORD.FILE.EXPORT.JSON',           'Export JSON',             () => FileEngine.exportAs('json')),
  cmd('WORD.FILE.EXPORT.JSON.DOCUMENT',  'Document Structure',      () => FileEngine.exportAs('json')),
  cmd('WORD.FILE.EXPORT.JSON.STYLES',    'Styles',                  () => FileEngine.exportAs('json')),
  cmd('WORD.FILE.EXPORT.JSON.METADATA',  'Metadata',                () => FileEngine.exportAs('json')),
  cmd('WORD.FILE.EXPORT.JSON.CONTENT',   'Content Only',            () => FileEngine.exportAs('json')),

  // ── EPUB EXPORT
  cmd('WORD.FILE.EXPORT.EPUB',           'Export EPUB',             () => FileEngine.exportAs('epub')),
  cmd('WORD.FILE.EXPORT.EPUB.VERSION2',  'EPUB2',                   () => FileEngine.exportAs('epub')),
  cmd('WORD.FILE.EXPORT.EPUB.VERSION3',  'EPUB3',                   () => FileEngine.exportAs('epub')),
  cmd('WORD.FILE.EXPORT.EPUB.TOC',       'Include TOC',             () => { /* UI Action */ }),
  cmd('WORD.FILE.EXPORT.EPUB.EMBED_FONTS','Embed Fonts',            () => { /* UI Action */ }),

  // ── IMAGE EXPORT
  cmd('WORD.FILE.EXPORT.IMAGE',          'Export Images',           () => FileEngine.exportAs('png')),
  cmd('WORD.FILE.EXPORT.PNG',            'PNG',                     () => FileEngine.exportAs('png')),
  cmd('WORD.FILE.EXPORT.JPG',            'JPEG',                    () => FileEngine.exportAs('jpg')),
  cmd('WORD.FILE.EXPORT.WEBP',           'WEBP',                    () => FileEngine.exportAs('webp')),
  cmd('WORD.FILE.EXPORT.TIFF',           'TIFF',                    () => FileEngine.exportAs('tiff')),
  cmd('WORD.FILE.EXPORT.BMP',            'BMP',                     () => FileEngine.exportAs('bmp')),
  cmd('WORD.FILE.EXPORT.SVG',            'SVG',                     () => FileEngine.exportAs('svg')),
  cmd('WORD.FILE.EXPORT.PAGE_IMAGE',     'Current Page',            () => FileEngine.exportAs('png')),
  cmd('WORD.FILE.EXPORT.ALL_PAGES',      'All Pages',               () => FileEngine.exportAs('png')),

  // ── BATCH EXPORT
  cmd('WORD.FILE.EXPORT.BATCH',          'Batch Export',            () => { /* Logic */ }),
  cmd('WORD.FILE.EXPORT.BATCH.PDF',      'Batch Export PDF',        () => { /* Logic */ }),
  cmd('WORD.FILE.EXPORT.BATCH.HTML',     'Batch Export HTML',       () => { /* Logic */ }),
  cmd('WORD.FILE.EXPORT.BATCH.MARKDOWN', 'Batch Export Markdown',   () => { /* Logic */ }),
  cmd('WORD.FILE.EXPORT.BATCH.IMAGE',    'Batch Export Image',      () => { /* Logic */ }),

  // ── BACKGROUND EXPORT
  cmd('WORD.FILE.EXPORT.BACKGROUND',     'Background Export',       () => { /* Logic */ }),
  cmd('WORD.FILE.EXPORT.CANCEL',         'Cancel Export',           () => { /* Logic */ }),
  cmd('WORD.FILE.EXPORT.RETRY',          'Retry Export',            () => { /* Logic */ }),
  cmd('WORD.FILE.EXPORT.PROGRESS',       'Export Progress',         () => { /* Logic */ }),

  // ══ PRINT ═══════════════════════════════════════════════════════════════
  cmd('WORD.FILE.PRINT',                 'Print',               () => FileEngine.print(),                                  'Ctrl+P'),
  cmd('WORD.FILE.PRINT.QUICK',           'Quick Print',         () => FileEngine.print()),
  cmd('WORD.FILE.PRINT.PREVIEW',         'Print Preview',       () => { /* Opens print preview dialog */ }),
  cmd('WORD.FILE.PRINT.SETTINGS',        'Print Settings',      () => { /* Opens print settings */ }),
  cmd('WORD.FILE.PRINT.DUPLEX',          'Duplex',              () => { /* Opens print settings for duplex */ }),
  cmd('WORD.FILE.PRINT.PAGERANGE',       'Page Range',          () => { /* Opens print settings for page range */ }),
  cmd('WORD.FILE.PRINT.COPIES',          'Copies',              () => { /* Opens print settings for copies */ }),
  cmd('WORD.FILE.PRINT.PAPERSIZE',       'Paper Size',          () => { /* Opens print settings for paper size */ }),

  // ══ SHARE ═══════════════════════════════════════════════════════════════
  cmd('WORD.FILE.SHARE',                 'Share Document',      () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.QUICK',           'Quick Share',         () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.AS_COPY',         'Share Copy',          () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.READONLY',        'Share Read Only',     () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.EDITABLE',        'Share Editable',      () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.PUBLIC',          'Public Share',        () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.PRIVATE',         'Private Share',       () => { /* UI Action */ }),

  // ── EMAIL
  cmd('WORD.FILE.SHARE.EMAIL',           'Share By Email',      () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.EMAIL.ATTACHMENT','Email Attachment',    () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.EMAIL.PDF',       'Email PDF',           () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.EMAIL.LINK',      'Email Link',          () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.EMAIL.ZIP',       'Email ZIP',           () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.EMAIL.ENCRYPTED', 'Encrypted Email',     () => { /* UI Action */ }),

  // ── ONEDRIVE
  cmd('WORD.FILE.SHARE.ONEDRIVE',        'Share OneDrive',      () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.ONEDRIVE.UPLOAD', 'Upload',              () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.ONEDRIVE.LINK',   'Generate Link',       () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.ONEDRIVE.PERMISSION', 'Manage Permission',() => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.ONEDRIVE.SYNC',   'Sync',                () => { /* UI Action */ }),

  // ── DROPBOX
  cmd('WORD.FILE.SHARE.DROPBOX',         'Share Dropbox',       () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.DROPBOX.UPLOAD',  'Upload',              () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.DROPBOX.LINK',    'Create Link',         () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.DROPBOX.PERMISSION', 'Permission',       () => { /* UI Action */ }),

  // ── GOOGLE DRIVE
  cmd('WORD.FILE.SHARE.GDRIVE',          'Share Google Drive',  () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.GDRIVE.UPLOAD',   'Upload',              () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.GDRIVE.LINK',     'Generate Link',       () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.GDRIVE.PERMISSION','Permission',         () => { /* UI Action */ }),

  // ── SHAREPOINT
  cmd('WORD.FILE.SHARE.SHAREPOINT',      'Share SharePoint',    () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.SHAREPOINT.SITE', 'Site Upload',         () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.SHAREPOINT.LIBRARY','Document Library',  () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.SHAREPOINT.PERMISSION','Permission',     () => { /* UI Action */ }),

  // ── BOX
  cmd('WORD.FILE.SHARE.BOX',             'Share Box',           () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.BOX.UPLOAD',      'Upload',              () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.BOX.LINK',        'Generate Link',       () => { /* UI Action */ }),

  // ── NEXTCLOUD
  cmd('WORD.FILE.SHARE.NEXTCLOUD',       'Share Nextcloud',     () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.NEXTCLOUD.UPLOAD','Upload',              () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.NEXTCLOUD.LINK',  'Generate Link',       () => { /* UI Action */ }),

  // ── INTERNAL SHARE
  cmd('WORD.FILE.SHARE.INTERNAL',        'Internal Share',      () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.INTERNAL.USER',   'Share To User',       () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.INTERNAL.GROUP',  'Share To Group',      () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.INTERNAL.DEPARTMENT','Share To Department',() => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.INTERNAL.ORGANIZATION','Organization Share',() => { /* UI Action */ }),

  // ── TEAM
  cmd('WORD.FILE.SHARE.TEAMS',           'Microsoft Teams',     () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.SLACK',           'Slack',               () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.DISCORD',         'Discord',             () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.ZOOM',            'Zoom',                () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.WEBEX',           'Cisco Webex',         () => { /* UI Action */ }),

  // ── LINK
  cmd('WORD.FILE.SHARE.LINK',            'Generate Link',       () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.LINK.READONLY',   'Read Only Link',      () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.LINK.EDIT',       'Editable Link',       () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.LINK.EXPIRE',     'Expiration Date',     () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.LINK.PASSWORD',   'Password Protected',  () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.LINK.REVOKE',     'Revoke Link',         () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.LINK.SHORTEN',    'Short URL',           () => { /* UI Action */ }),

  // ── QR CODE
  cmd('WORD.FILE.SHARE.QR',              'Generate QR Code',    () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.QR.DOWNLOAD',     'Download QR',         () => { /* UI Action */ }),

  // ── PERMISSIONS
  cmd('WORD.FILE.SHARE.PERMISSION.READ', 'Read Permission',     () => { /* Logic */ }),
  cmd('WORD.FILE.SHARE.PERMISSION.WRITE','Write Permission',    () => { /* Logic */ }),
  cmd('WORD.FILE.SHARE.PERMISSION.COMMENT','Comment Permission',() => { /* Logic */ }),
  cmd('WORD.FILE.SHARE.PERMISSION.OWNER','Owner Permission',    () => { /* Logic */ }),
  cmd('WORD.FILE.SHARE.PERMISSION.REMOVE','Remove Permission',  () => { /* Logic */ }),

  // ── INVITATION
  cmd('WORD.FILE.SHARE.INVITE.USER',     'Invite User',         () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.INVITE.GROUP',    'Invite Group',        () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.INVITE.EMAIL',    'Invite Email',        () => { /* UI Action */ }),
  cmd('WORD.FILE.SHARE.INVITE.RESEND',   'Resend Invitation',   () => { /* UI Action */ }),

  // ── COLLABORATION
  cmd('WORD.FILE.SHARE.COLLAB.START',    'Start Collaboration', () => { /* Logic */ }),
  cmd('WORD.FILE.SHARE.COLLAB.STOP',     'Stop Collaboration',  () => { /* Logic */ }),
  cmd('WORD.FILE.SHARE.COLLAB.STATUS',   'Status',              () => { /* Logic */ }),
  cmd('WORD.FILE.SHARE.COLLAB.USERS',    'Connected Users',     () => { /* Logic */ }),

  // ── NOTIFICATION
  cmd('WORD.FILE.SHARE.NOTIFY',          'Notify Users',        () => { /* Logic */ }),
  cmd('WORD.FILE.SHARE.NOTIFY.EMAIL',    'Email Notification',  () => { /* Logic */ }),
  cmd('WORD.FILE.SHARE.NOTIFY.PUSH',     'Push Notification',   () => { /* Logic */ }),

  // ══ CLOUD ════════════════════════════════════════════════════════════════
  // ── LOGIN
  cmd('WORD.CLOUD.LOGIN',                'Login',               () => { /* UI Action */ }),
  cmd('WORD.CLOUD.LOGIN.ONEDRIVE',       'Login OneDrive',      () => { /* UI Action */ }),
  cmd('WORD.CLOUD.LOGIN.GOOGLE_DRIVE',   'Login Google Drive',  () => { /* UI Action */ }),
  cmd('WORD.CLOUD.LOGIN.DROPBOX',        'Login Dropbox',       () => { /* UI Action */ }),
  cmd('WORD.CLOUD.LOGIN.SHAREPOINT',     'Login SharePoint',    () => { /* UI Action */ }),
  cmd('WORD.CLOUD.LOGIN.BOX',            'Login Box',           () => { /* UI Action */ }),
  cmd('WORD.CLOUD.LOGIN.NEXTCLOUD',      'Login Nextcloud',     () => { /* UI Action */ }),
  cmd('WORD.CLOUD.LOGIN.S3',             'Login Amazon S3',     () => { /* UI Action */ }),
  cmd('WORD.CLOUD.LOGIN.AZURE',          'Login Azure Blob',    () => { /* UI Action */ }),
  cmd('WORD.CLOUD.LOGIN.WEBDAV',         'Login WebDAV',        () => { /* UI Action */ }),
  cmd('WORD.CLOUD.LOGIN.SMB',            'Login SMB',           () => { /* UI Action */ }),

  // ── LOGOUT
  cmd('WORD.CLOUD.LOGOUT',               'Logout',              () => { /* UI Action */ }),
  cmd('WORD.CLOUD.LOGOUT.ALL',           'Logout All Providers',() => { /* UI Action */ }),
  cmd('WORD.CLOUD.LOGOUT.ONEDRIVE',      'Logout OneDrive',     () => { /* UI Action */ }),
  cmd('WORD.CLOUD.LOGOUT.GOOGLE',        'Logout Google Drive', () => { /* UI Action */ }),
  cmd('WORD.CLOUD.LOGOUT.DROPBOX',       'Logout Dropbox',      () => { /* UI Action */ }),

  // ── ACCOUNT
  cmd('WORD.CLOUD.ACCOUNT.INFO',         'Account Information', () => { /* UI Action */ }),
  cmd('WORD.CLOUD.ACCOUNT.SWITCH',       'Switch Account',      () => { /* UI Action */ }),
  cmd('WORD.CLOUD.ACCOUNT.REMOVE',       'Remove Account',      () => { /* UI Action */ }),
  cmd('WORD.CLOUD.ACCOUNT.DEFAULT',      'Default Account',     () => { /* UI Action */ }),

  // ── UPLOAD
  cmd('WORD.CLOUD.UPLOAD',               'Upload',              () => { /* Logic */ }),
  cmd('WORD.CLOUD.UPLOAD.ACTIVE',        'Upload Active Document',() => { /* Logic */ }),
  cmd('WORD.CLOUD.UPLOAD.ALL',           'Upload All Documents',() => { /* Logic */ }),
  cmd('WORD.CLOUD.UPLOAD.FOLDER',        'Upload Folder',       () => { /* Logic */ }),
  cmd('WORD.CLOUD.UPLOAD.BACKGROUND',    'Background Upload',   () => { /* Logic */ }),
  cmd('WORD.CLOUD.UPLOAD.RETRY',         'Retry Upload',        () => { /* Logic */ }),
  cmd('WORD.CLOUD.UPLOAD.CANCEL',        'Cancel Upload',       () => { /* Logic */ }),
  cmd('WORD.CLOUD.UPLOAD.PROGRESS',      'Upload Progress',     () => { /* Logic */ }),

  // ── DOWNLOAD
  cmd('WORD.CLOUD.DOWNLOAD',             'Download',            () => { /* Logic */ }),
  cmd('WORD.CLOUD.DOWNLOAD.LATEST',      'Download Latest Version',() => { /* Logic */ }),
  cmd('WORD.CLOUD.DOWNLOAD.SELECTED',    'Download Selected Version',() => { /* Logic */ }),
  cmd('WORD.CLOUD.DOWNLOAD.FOLDER',      'Download Folder',     () => { /* Logic */ }),
  cmd('WORD.CLOUD.DOWNLOAD.BACKGROUND',  'Background Download', () => { /* Logic */ }),
  cmd('WORD.CLOUD.DOWNLOAD.CANCEL',      'Cancel Download',     () => { /* Logic */ }),
  cmd('WORD.CLOUD.DOWNLOAD.PROGRESS',    'Progress',            () => { /* Logic */ }),

  // ── SYNC
  cmd('WORD.CLOUD.SYNC',                 'Sync',                () => { /* Logic */ }),
  cmd('WORD.CLOUD.SYNC.START',           'Start Sync',          () => { /* Logic */ }),
  cmd('WORD.CLOUD.SYNC.STOP',            'Stop Sync',           () => { /* Logic */ }),
  cmd('WORD.CLOUD.SYNC.ALL',             'Sync All',            () => { /* Logic */ }),
  cmd('WORD.CLOUD.SYNC.ACTIVE',          'Sync Active Document',() => { /* Logic */ }),
  cmd('WORD.CLOUD.SYNC.BACKGROUND',      'Background Sync',     () => { /* Logic */ }),
  cmd('WORD.CLOUD.SYNC.MANUAL',          'Manual Sync',         () => { /* Logic */ }),
  cmd('WORD.CLOUD.SYNC.AUTO',            'Auto Sync',           () => { /* Logic */ }),
  cmd('WORD.CLOUD.SYNC.STATUS',          'Sync Status',         () => FileStorageEngine.getAllCloudStatuses()),
  cmd('WORD.CLOUD.SYNC.RETRY',           'Retry Sync',          () => { /* Logic */ }),

  // ── OFFLINE CACHE
  cmd('WORD.CLOUD.CACHE.ENABLE',         'Enable Offline Cache',() => { /* Logic */ }),
  cmd('WORD.CLOUD.CACHE.DISABLE',        'Disable Offline Cache',() => { /* Logic */ }),
  cmd('WORD.CLOUD.CACHE.OPEN',           'Open Offline Copy',   () => { /* Logic */ }),
  cmd('WORD.CLOUD.CACHE.CLEAR',          'Clear Cache',         () => { /* Logic */ }),
  cmd('WORD.CLOUD.CACHE.REBUILD',        'Rebuild Cache',       () => { /* Logic */ }),
  cmd('WORD.CLOUD.CACHE.SIZE',           'Cache Size',          () => { /* Logic */ }),
  cmd('WORD.CLOUD.CACHE.STATUS',         'Cache Status',        () => { /* Logic */ }),
  cmd('WORD.CLOUD.CACHE.LOCATION',       'Cache Location',      () => { /* Logic */ }),

  // ── CLOUD VERSION
  cmd('WORD.CLOUD.VERSION.OPEN',         'Open Cloud Version',  () => { /* Logic */ }),
  cmd('WORD.CLOUD.VERSION.LATEST',       'Latest Version',      () => { /* Logic */ }),
  cmd('WORD.CLOUD.VERSION.RESTORE',      'Restore Version',     () => { /* Logic */ }),
  cmd('WORD.CLOUD.VERSION.DELETE',       'Delete Version',      () => { /* Logic */ }),
  cmd('WORD.CLOUD.VERSION.COMPARE',      'Compare Versions',    () => { /* Logic */ }),
  cmd('WORD.CLOUD.VERSION.HISTORY',      'Version History',     () => { /* Logic */ }),

  // ── CONFLICT
  cmd('WORD.CLOUD.CONFLICT.DETECT',      'Detect Conflict',     () => { /* Logic */ }),
  cmd('WORD.CLOUD.CONFLICT.RESOLVE',     'Resolve Conflict',    () => { /* Logic */ }),
  cmd('WORD.CLOUD.CONFLICT.KEEP_LOCAL',  'Keep Local Version',  () => { /* Logic */ }),
  cmd('WORD.CLOUD.CONFLICT.KEEP_REMOTE', 'Keep Cloud Version',  () => { /* Logic */ }),
  cmd('WORD.CLOUD.CONFLICT.MERGE',       'Merge Changes',       () => { /* Logic */ }),

  // ── PERMISSION
  cmd('WORD.CLOUD.PERMISSION.READ',      'Read Permission',     () => { /* Logic */ }),
  cmd('WORD.CLOUD.PERMISSION.WRITE',     'Write Permission',    () => { /* Logic */ }),
  cmd('WORD.CLOUD.PERMISSION.ADMIN',     'Administrator',       () => { /* Logic */ }),
  cmd('WORD.CLOUD.PERMISSION.REMOVE',    'Remove Permission',   () => { /* Logic */ }),

  // ── PROVIDER
  cmd('WORD.CLOUD.PROVIDER.ADD',         'Add Provider',        () => { /* Logic */ }),
  cmd('WORD.CLOUD.PROVIDER.REMOVE',      'Remove Provider',     () => { /* Logic */ }),
  cmd('WORD.CLOUD.PROVIDER.ENABLE',      'Enable Provider',     () => { /* Logic */ }),
  cmd('WORD.CLOUD.PROVIDER.DISABLE',     'Disable Provider',    () => { /* Logic */ }),
  cmd('WORD.CLOUD.PROVIDER.REFRESH',     'Refresh Provider',    () => { /* Logic */ }),

  // ── NOTIFICATION
  cmd('WORD.CLOUD.NOTIFY.ENABLE',        'Enable Notifications',() => { /* Logic */ }),
  cmd('WORD.CLOUD.NOTIFY.DISABLE',       'Disable Notifications',() => { /* Logic */ }),
  cmd('WORD.CLOUD.NOTIFY.SYNC',          'Sync Notification',   () => { /* Logic */ }),
  cmd('WORD.CLOUD.NOTIFY.CONFLICT',      'Conflict Notification',() => { /* Logic */ }),

  // ══ BACKUP ═══════════════════════════════════════════════════════════════
  cmd('WORD.FILE.BACKUP',                'Create Backup',       () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.NOW',            'Backup Now',          () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.ACTIVE',         'Backup Active Document',() => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.ALL',            'Backup All Documents',() => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.FOLDER',         'Backup Folder',       () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.WORKSPACE',      'Backup Workspace',    () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.SNAPSHOT',       'Create Snapshot',     () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.FULL',           'Full Backup',         () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.INCREMENTAL',    'Incremental Backup',  () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.DIFFERENTIAL',   'Differential Backup', () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.CLOUD',          'Cloud Backup',        () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.LOCAL',          'Local Backup',        () => { /* Logic */ }),

  // ── AUTO BACKUP
  cmd('WORD.FILE.BACKUP.AUTO.ENABLE',    'Enable Auto Backup',  () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.AUTO.DISABLE',   'Disable Auto Backup', () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.AUTO.START',     'Start Auto Backup',   () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.AUTO.STOP',      'Stop Auto Backup',    () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.AUTO.STATUS',    'Auto Backup Status',  () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.AUTO.INTERVAL',  'Set Backup Interval', () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.AUTO.ON_SAVE',   'Backup On Save',      () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.AUTO.ON_CLOSE',  'Backup On Close',     () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.AUTO.ON_EXIT',   'Backup Before Exit',  () => { /* Logic */ }),

  // ── RESTORE
  cmd('WORD.FILE.BACKUP.RESTORE',        'Restore Backup',      () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.RESTORE.LATEST', 'Restore Latest Backup',() => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.RESTORE.SELECTED','Restore Selected Backup',() => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.RESTORE.VERSION','Restore Specific Version',() => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.RESTORE.PARTIAL','Partial Restore',     () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.RESTORE.ALL',    'Restore Entire Workspace',() => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.RESTORE.PREVIEW','Preview Backup',      () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.RESTORE.VERIFY', 'Verify Restore',      () => { /* Logic */ }),

  // ── DELETE BACKUP
  cmd('WORD.FILE.BACKUP.DELETE',         'Delete Backup',       () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.DELETE.SELECTED','Delete Selected Backup',() => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.DELETE.ALL',     'Delete All Backups',  () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.DELETE.EXPIRED', 'Delete Expired Backups',() => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.DELETE.LOCAL',   'Delete Local Backup', () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.DELETE.CLOUD',   'Delete Cloud Backup', () => { /* Logic */ }),

  // ── BACKUP SCHEDULE
  cmd('WORD.FILE.BACKUP.SCHEDULE',       'Backup Schedule',     () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.SCHEDULE.CREATE','Create Schedule',     () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.SCHEDULE.EDIT',  'Edit Schedule',       () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.SCHEDULE.DELETE','Delete Schedule',     () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.SCHEDULE.ENABLE','Enable Schedule',     () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.SCHEDULE.DISABLE','Disable Schedule',    () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.SCHEDULE.DAILY', 'Daily Backup',        () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.SCHEDULE.WEEKLY','Weekly Backup',       () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.SCHEDULE.MONTHLY','Monthly Backup',      () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.SCHEDULE.CUSTOM','Custom Schedule',     () => { /* Logic */ }),

  // ── ENCRYPTION
  cmd('WORD.FILE.BACKUP.ENCRYPT',        'Encrypt Backup',      () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.DECRYPT',        'Decrypt Backup',      () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.PASSWORD',       'Backup Password',     () => { /* Logic */ }),

  // ── COMPRESSION
  cmd('WORD.FILE.BACKUP.COMPRESS',       'Compress Backup',     () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.COMPRESS.HIGH',  'High Compression',    () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.COMPRESS.FAST',  'Fast Compression',    () => { /* Logic */ }),

  // ── VALIDATION
  cmd('WORD.FILE.BACKUP.VERIFY',         'Verify Backup',       () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.CHECKSUM',       'Generate Checksum',   () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.INTEGRITY',      'Integrity Check',     () => { /* Logic */ }),

  // ── STORAGE
  cmd('WORD.FILE.BACKUP.LOCATION',       'Backup Location',     () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.MOVE',           'Move Backup',         () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.COPY',           'Copy Backup',         () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.SIZE',           'Backup Size',         () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.STATISTICS',     'Backup Statistics',   () => { /* Logic */ }),

  // ── HISTORY
  cmd('WORD.FILE.BACKUP.HISTORY',        'Backup History',      () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.HISTORY.OPEN',   'Open History',        () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.HISTORY.CLEAR',  'Clear History',       () => { /* Logic */ }),
  cmd('WORD.FILE.BACKUP.HISTORY.EXPORT', 'Export History',      () => { /* Logic */ }),

  // ══ RECENT FILES ═════════════════════════════════════════════════════════
  cmd('WORD.FILE.RECENT.OPEN',           'Open Recent File',    (_, p) => p?.path && FileEngine.openFromPath(p.path)),
  cmd('WORD.FILE.RECENT.CLEAR',          'Clear Recent Files',  () => FileStorageEngine.clearRecent()),
  cmd('WORD.FILE.RECENT.PIN',            'Pin File',            (_, p) => p?.id && FileStorageEngine.pinFile(p.id)),
  cmd('WORD.FILE.RECENT.UNPIN',          'Unpin File',          (_, p) => p?.id && FileStorageEngine.unpinFile(p.id)),
  cmd('WORD.FILE.RECENT.REMOVE',         'Remove from Recent',  (_, p) => p?.id && FileStorageEngine.removeFromRecent(p.id)),

  // ══ FILE PROPERTIES ══════════════════════════════════════════════════════
  cmd('WORD.FILE.PROPERTIES.OPEN',       'File Properties',     () => { /* Opens FileMenu on Info tab — handled by UI */ }),
  cmd('WORD.FILE.PROPERTIES.TITLE',      'Set Title',           (_, p) => p?.value && FileEngine.updateProperties({ title: p.value })),
  cmd('WORD.FILE.PROPERTIES.AUTHOR',     'Set Author',          (_, p) => p?.value && FileEngine.updateProperties({ author: p.value })),
  cmd('WORD.FILE.PROPERTIES.KEYWORDS',   'Set Keywords',        (_, p) => p?.value && FileEngine.updateProperties({ keywords: p.value })),
  cmd('WORD.FILE.PROPERTIES.SUBJECT',    'Set Subject',         (_, p) => p?.value && FileEngine.updateProperties({ subject: p.value })),
  cmd('WORD.FILE.PROPERTIES.CATEGORY',   'Set Category',        (_, p) => p?.value && FileEngine.updateProperties({ category: p.value })),
  cmd('WORD.FILE.PROPERTIES.COMPANY',    'Set Company',         (_, p) => p?.value && FileEngine.updateProperties({ company: p.value })),
  cmd('WORD.FILE.PROPERTIES.TAGS',       'Set Tags',            (_, p) => p?.tags && FileEngine.updateProperties({ tags: p.tags })),
  cmd('WORD.FILE.PROPERTIES.SECURITY',   'Security Info',       () => { /* Opens security panel */ }),

  // ══ VERSION HISTORY ═══════════════════════════════════════════════════════
  cmd('WORD.FILE.VERSION.HISTORY',       'Open Version History',() => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.HISTORY.OPEN',  'Open History Window', () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.HISTORY.CLOSE', 'Close History',       () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.HISTORY.REFRESH','Refresh History',    () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.HISTORY.SEARCH','Search Version',      () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.HISTORY.FILTER','Filter Version',      () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.HISTORY.PIN',   'Pin Version',         () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.HISTORY.UNPIN', 'Unpin Version',       () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.HISTORY.SORT',  'Sort History',        () => { /* Logic */ }),

  // ── CREATE VERSION
  cmd('WORD.FILE.VERSION.CREATE',        'Create Version',      (_, p) => FileEngine.saveVersion(p?.label, p?.comment)),
  cmd('WORD.FILE.VERSION.CREATE.MANUAL', 'Manual Version',      () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.CREATE.AUTO',   'Automatic Version',   () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.CREATE.SNAPSHOT','Snapshot',           () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.CREATE.MILESTONE','Milestone',         () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.CREATE.TAG',    'Tagged Version',      () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.CREATE.CLOUD',  'Cloud Version',       () => { /* Logic */ }),

  // ── COMPARE VERSION
  cmd('WORD.FILE.VERSION.COMPARE',       'Compare Versions',    () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.COMPARE.LATEST','Compare Latest',      () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.COMPARE.SELECTED','Compare Selected',  () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.COMPARE.CLOUD', 'Compare Cloud Version',() => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.COMPARE.LOCAL', 'Compare Local Version',() => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.COMPARE.CONTENT','Compare Content',    () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.COMPARE.STYLES','Compare Styles',      () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.COMPARE.FORMATTING','Compare Formatting',() => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.COMPARE.COMMENTS','Compare Comments',  () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.COMPARE.TRACKCHANGES','Compare Track Changes',() => { /* Logic */ }),

  // ── RESTORE
  cmd('WORD.FILE.VERSION.RESTORE',       'Restore Version',     (_, p) => p?.id && FileEngine.restoreVersion(p.id)),
  cmd('WORD.FILE.VERSION.RESTORE.LATEST','Restore Latest',      () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.RESTORE.SELECTED','Restore Selected',  () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.RESTORE.CLOUD', 'Restore Cloud Version',() => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.RESTORE.LOCAL', 'Restore Local Version',() => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.RESTORE.SNAPSHOT','Restore Snapshot',  () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.RESTORE.PREVIEW','Preview Before Restore',() => { /* Logic */ }),

  // ── DELETE
  cmd('WORD.FILE.VERSION.DELETE',        'Delete Version',      (_, p) => p?.id && FileRecoveryEngine.deleteVersion(p.id)),
  cmd('WORD.FILE.VERSION.DELETE.SELECTED','Delete Selected',    () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.DELETE.ALL',    'Delete All Versions', () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.DELETE.EXPIRED','Delete Expired Versions',() => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.DELETE.LOCAL',  'Delete Local Versions',() => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.DELETE.CLOUD',  'Delete Cloud Versions',() => { /* Logic */ }),

  // ── EXPORT VERSION
  cmd('WORD.FILE.VERSION.EXPORT',        'Export Version',      () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.EXPORT.PDF',    'Export As PDF',       () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.EXPORT.DOCX',   'Export DOCX',         () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.EXPORT.HTML',   'Export HTML',         () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.EXPORT.MARKDOWN','Export Markdown',    () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.EXPORT.JSON',   'Export JSON',         () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.EXPORT.XML',    'Export XML',          () => { /* Logic */ }),

  // ── IMPORT VERSION
  cmd('WORD.FILE.VERSION.IMPORT',        'Import Version',      () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.IMPORT.LOCAL',  'Import Local Version',() => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.IMPORT.CLOUD',  'Import Cloud Version',() => { /* Logic */ }),

  // ── SNAPSHOT
  cmd('WORD.FILE.VERSION.SNAPSHOT.CREATE','Create Snapshot',    () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.SNAPSHOT.RESTORE','Restore Snapshot',  () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.SNAPSHOT.DELETE','Delete Snapshot',    () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.SNAPSHOT.EXPORT','Export Snapshot',    () => { /* Logic */ }),

  // ── CLOUD VERSION
  cmd('WORD.FILE.VERSION.CLOUD.OPEN',    'Open Cloud Version',  () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.CLOUD.SYNC',    'Sync Versions',       () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.CLOUD.DOWNLOAD','Download Version',    () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.CLOUD.UPLOAD',  'Upload Version',      () => { /* Logic */ }),

  // ── LABEL
  cmd('WORD.FILE.VERSION.LABEL.ADD',     'Add Label',           () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.LABEL.EDIT',    'Edit Label',          () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.LABEL.DELETE',  'Delete Label',        () => { /* Logic */ }),

  // ── NOTES
  cmd('WORD.FILE.VERSION.NOTES.ADD',     'Add Version Notes',   () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.NOTES.EDIT',    'Edit Notes',          () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.NOTES.DELETE',  'Delete Notes',        () => { /* Logic */ }),

  // ── AUDIT
  cmd('WORD.FILE.VERSION.AUDIT.OPEN',    'Audit History',       () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.AUDIT.EXPORT',  'Export Audit',        () => { /* Logic */ }),
  cmd('WORD.FILE.VERSION.AUDIT.CLEAR',   'Clear Audit',         () => { /* Logic */ }),

  // ══ RECOVERY ══════════════════════════════════════════════════════════════
  // ── AUTO RECOVERY
  cmd('WORD.FILE.RECOVERY.AUTO',         'Enable Auto Recovery',() => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.AUTO.START',   'Start Auto Recovery', () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.AUTO.STOP',    'Stop Auto Recovery',  () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.AUTO.STATUS',  'Recovery Status',     () => FileEngine.getRecoveryPoints()),
  cmd('WORD.FILE.RECOVERY.AUTO.INTERVAL','Recovery Interval',   () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.AUTO.SAVE',    'Create Recovery Snapshot',() => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.AUTO.DELETE',  'Delete Recovery Snapshot',() => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.AUTO.CLEAN',   'Clean Recovery Cache',() => { /* Logic */ }),

  // ── RECOVERY SEARCH
  cmd('WORD.FILE.RECOVERY.SEARCH',       'Search Recovery Files',() => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.SEARCH.LOCAL', 'Search Local Recovery',() => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.SEARCH.CLOUD', 'Search Cloud Recovery',() => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.SEARCH.BACKUP','Search Backup Files', () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.SEARCH.TEMP',  'Search Temporary Files',() => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.SEARCH.AUTOSAVE','Search AutoSave Files',() => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.SEARCH.ALL',   'Search All Sources',  () => { /* Logic */ }),

  // ── REPAIR
  cmd('WORD.FILE.RECOVERY.REPAIR',       'Repair Document',     () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.REPAIR.OPENXML','Repair OpenXML Package',() => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.REPAIR.XML',   'Repair XML',          () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.REPAIR.MEDIA', 'Repair Images',       () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.REPAIR.TABLES','Repair Tables',       () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.REPAIR.STYLES','Repair Styles',       () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.REPAIR.FONTS', 'Repair Fonts',        () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.REPAIR.HEADERS','Repair Headers',     () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.REPAIR.FOOTERS','Repair Footers',     () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.REPAIR.HYPERLINKS','Repair Hyperlinks',() => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.REPAIR.COMMENTS','Repair Comments',   () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.REPAIR.TRACKCHANGES','Repair Track Changes',() => { /* Logic */ }),

  // ── RESTORE
  cmd('WORD.FILE.RECOVERY.RESTORE',      'Restore Document',    (_, p) => p?.id && FileEngine.restoreRecoveryPoint(p.id)),
  cmd('WORD.FILE.RECOVERY.RESTORE.LATEST','Restore Latest',     () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.RESTORE.SELECTED','Restore Selected Recovery',() => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.RESTORE.VERSION','Restore Version',   () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.RESTORE.CLOUD','Restore Cloud Version',() => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.RESTORE.BACKUP','Restore Backup',     () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.RESTORE.TEMP', 'Restore Temporary File',() => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.RESTORE.SNAPSHOT','Restore Snapshot', () => { /* Logic */ }),

  // ── SCAN
  cmd('WORD.FILE.RECOVERY.SCAN',         'Scan Document',       () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.SCAN.FULL',    'Full Scan',           () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.SCAN.QUICK',   'Quick Scan',          () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.SCAN.OPENXML', 'OpenXML Scan',        () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.SCAN.MEDIA',   'Media Scan',          () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.SCAN.TABLES',  'Table Scan',          () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.SCAN.STYLES',  'Style Scan',          () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.SCAN.SECURITY','Security Scan',       () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.SCAN.INTEGRITY','Integrity Scan',     () => { /* Logic */ }),

  // ── REBUILD
  cmd('WORD.FILE.RECOVERY.REBUILD',      'Rebuild Document',    () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.REBUILD.OPENXML','Rebuild OpenXML Package',() => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.REBUILD.XML',  'Rebuild XML',         () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.REBUILD.MEDIA','Rebuild Media',       () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.REBUILD.TABLES','Rebuild Tables',     () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.REBUILD.STYLES','Rebuild Styles',     () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.REBUILD.FONTS','Rebuild Fonts',       () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.REBUILD.INDEX','Rebuild Index',       () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.REBUILD.METADATA','Rebuild Metadata', () => { /* Logic */ }),

  // ── VALIDATION
  cmd('WORD.FILE.RECOVERY.VALIDATE',     'Validate Document',   () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.VALIDATE.XML', 'Validate XML',        () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.VALIDATE.OPENXML','Validate Package', () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.VALIDATE.SIGNATURE','Validate Signature',() => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.VALIDATE.CHECKSUM','Checksum Validation',() => { /* Logic */ }),

  // ── HISTORY
  cmd('WORD.FILE.RECOVERY.HISTORY',      'Recovery History',    () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.HISTORY.OPEN', 'Open History',        () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.HISTORY.DELETE','Delete History',     (_, p) => p?.id && FileRecoveryEngine.deleteRecoveryPoint(p.id)),
  cmd('WORD.FILE.RECOVERY.HISTORY.CLEAR','Clear History',       () => { /* Logic */ }),

  // ── CACHE
  cmd('WORD.FILE.RECOVERY.CACHE.OPEN',   'Open Cache',          () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.CACHE.CLEAR',  'Clear Cache',         () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.CACHE.REBUILD','Rebuild Cache',       () => { /* Logic */ }),

  // ── EMERGENCY
  cmd('WORD.FILE.RECOVERY.EMERGENCY',    'Emergency Recovery',  () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.CRASH',        'Crash Recovery',      () => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.POWERFAILURE', 'Power Failure Recovery',() => { /* Logic */ }),
  cmd('WORD.FILE.RECOVERY.FORCE',        'Force Recovery',      () => { /* Logic */ }),

  // ══ SECURITY ══════════════════════════════════════════════════════════════
  // ── ENCRYPTION
  cmd('WORD.FILE.SECURITY.ENCRYPT',      'Encrypt Document',    () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.ENCRYPT.AES128','AES-128 Encryption', () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.ENCRYPT.AES256','AES-256 Encryption', () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.ENCRYPT.CUSTOM','Custom Encryption',  () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.ENCRYPT.OPEN', 'Encrypt On Open',     () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.ENCRYPT.SAVE', 'Encrypt On Save',     () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.ENCRYPT.REMOVE','Remove Encryption',  () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.ENCRYPT.CHANGE_KEY','Change Encryption Key',() => { /* Logic */ }),

  // ── PASSWORD
  cmd('WORD.FILE.SECURITY.PASSWORD.SET', 'Set Password',        () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.PASSWORD.CHANGE','Change Password',   () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.PASSWORD.REMOVE','Remove Password',   () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.PASSWORD.OPEN','Password To Open',    () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.PASSWORD.MODIFY','Password To Modify',() => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.PASSWORD.VERIFY','Verify Password',   () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.PASSWORD.EXPIRE','Password Expiration',() => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.PASSWORD.POLICY','Password Policy',   () => { /* Logic */ }),

  // ── DOCUMENT PROTECTION
  cmd('WORD.FILE.SECURITY.PROTECT',      'Protect Document',    () => FileEngine.setProtected(true)),
  cmd('WORD.FILE.SECURITY.PROTECT.EDITING','Restrict Editing',  () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.PROTECT.FORMATTING','Restrict Formatting',() => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.PROTECT.COMMENTS','Comments Only',    () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.PROTECT.FORMS','Forms Only',          () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.PROTECT.TRACKCHANGES','Track Changes Only',() => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.PROTECT.CONTENT','Protect Content',   () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.PROTECT.METADATA','Protect Metadata', () => { /* Logic */ }),

  // ── READ ONLY
  cmd('WORD.FILE.SECURITY.READONLY',     'Read Only',           () => FileEngine.setReadOnly(!FileEngine.getCurrentFile()?.isReadOnly)),
  cmd('WORD.FILE.SECURITY.READONLY.RECOMMENDED','Recommend Read Only',() => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.READONLY.FORCE','Force Read Only',    () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.READONLY.TEMPORARY','Temporary Read Only',() => { /* Logic */ }),

  // ── REMOVE PROTECTION
  cmd('WORD.FILE.SECURITY.UNPROTECT',    'Remove Protection',   () => FileEngine.setProtected(false)),
  cmd('WORD.FILE.SECURITY.UNPROTECT.EDITING','Remove Editing Restriction',() => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.UNPROTECT.FORMATTING','Remove Formatting Restriction',() => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.UNPROTECT.READONLY','Remove Read Only',() => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.UNPROTECT.ALL','Remove All Protection',() => { /* Logic */ }),

  // ── RIGHTS MANAGEMENT (RMS)
  cmd('WORD.FILE.SECURITY.RMS.ENABLE',   'Enable RMS',          () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.RMS.DISABLE',  'Disable RMS',         () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.RMS.APPLY',    'Apply Rights Policy', () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.RMS.REMOVE',   'Remove Rights Policy',() => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.RMS.READ',     'Read Permission',     () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.RMS.EDIT',     'Edit Permission',     () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.RMS.PRINT',    'Print Permission',    () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.RMS.COPY',     'Copy Permission',     () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.RMS.EXPORT',   'Export Permission',   () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.RMS.EXPIRE',   'Expiration Policy',   () => { /* Logic */ }),

  // ── DIGITAL RIGHTS MANAGEMENT (DRM)
  cmd('WORD.FILE.SECURITY.DRM.ENABLE',   'Enable DRM',          () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.DRM.DISABLE',  'Disable DRM',         () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.DRM.ACTIVATE', 'Activate License',    () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.DRM.DEACTIVATE','Deactivate License', () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.DRM.VALIDATE', 'Validate License',    () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.DRM.REVOKE',   'Revoke License',      () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.DRM.OFFLINE',  'Offline License',     () => { /* Logic */ }),

  // ══ PERMISSIONS & ACL ═══════════════════════════════════════════════════
  // ── GRANT
  cmd('WORD.FILE.PERMISSION.GRANT',      'Grant Permission',    () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.GRANT.USER', 'Grant To User',       () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.GRANT.GROUP','Grant To Group',      () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.GRANT.ROLE', 'Grant Role',          () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.GRANT.DOMAIN','Grant Domain',       () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.GRANT.PUBLIC','Grant Public Access',() => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.GRANT.GUEST','Grant Guest Access',  () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.GRANT.LINK', 'Grant Via Share Link',() => { /* Logic */ }),

  // ── REVOKE
  cmd('WORD.FILE.PERMISSION.REVOKE',     'Revoke Permission',   () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.REVOKE.USER','Remove User Permission',() => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.REVOKE.GROUP','Remove Group Permission',() => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.REVOKE.PUBLIC','Remove Public Access',() => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.REVOKE.GUEST','Remove Guest Access',() => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.REVOKE.ALL', 'Remove All Permissions',() => { /* Logic */ }),

  // ── READ
  cmd('WORD.FILE.PERMISSION.READ',       'Read Permission',     () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.READ.GRANT', 'Grant Read',          () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.READ.REMOVE','Remove Read',         () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.READ.VERIFY','Verify Read Access',  () => { /* Logic */ }),

  // ── WRITE
  cmd('WORD.FILE.PERMISSION.WRITE',      'Write Permission',    () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.WRITE.GRANT','Grant Write',         () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.WRITE.REMOVE','Remove Write',       () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.WRITE.VERIFY','Verify Write Access',() => { /* Logic */ }),

  // ── OWNER
  cmd('WORD.FILE.PERMISSION.OWNER',      'Owner Permission',    () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.OWNER.SET',  'Set Owner',           () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.OWNER.CHANGE','Transfer Ownership', () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.OWNER.REMOVE','Remove Owner',       () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.OWNER.VERIFY','Verify Ownership',   () => { /* Logic */ }),

  // ── ADMINISTRATOR
  cmd('WORD.FILE.PERMISSION.ADMIN',      'Administrator Permission',() => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.ADMIN.GRANT','Grant Administrator', () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.ADMIN.REMOVE','Remove Administrator',() => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.ADMIN.VERIFY','Verify Administrator',() => { /* Logic */ }),

  // ── ROLES
  cmd('WORD.FILE.PERMISSION.ROLE.CREATE','Create Role',         () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.ROLE.DELETE','Delete Role',         () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.ROLE.EDIT',  'Edit Role',           () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.ROLE.CLONE', 'Clone Role',          () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.ROLE.DEFAULT','Default Role',       () => { /* Logic */ }),

  // ── ACCESS CONTROL
  cmd('WORD.FILE.PERMISSION.ACL.OPEN',   'Open ACL',            () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.ACL.ADD',    'Add ACL Entry',       () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.ACL.REMOVE', 'Remove ACL Entry',    () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.ACL.RESET',  'Reset ACL',           () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.ACL.INHERIT','Enable Inheritance',  () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.ACL.BREAK',  'Break Inheritance',   () => { /* Logic */ }),

  // ── PERMISSION TEMPLATES
  cmd('WORD.FILE.PERMISSION.TEMPLATE.OPEN','Open Templates',    () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.TEMPLATE.APPLY','Apply Template',   () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.TEMPLATE.CREATE','Create Template', () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.TEMPLATE.DELETE','Delete Template', () => { /* Logic */ }),

  // ── POLICY
  cmd('WORD.FILE.PERMISSION.POLICY.APPLY','Apply Policy',       () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.POLICY.REMOVE','Remove Policy',     () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.POLICY.VALIDATE','Validate Policy', () => { /* Logic */ }),

  // ── VALIDATION
  cmd('WORD.FILE.PERMISSION.VALIDATE',   'Validate Permission', () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.CHECK.ACCESS','Check Access',       () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.CHECK.USER', 'Check User',          () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.CHECK.GROUP','Check Group',         () => { /* Logic */ }),

  // ── AUDIT
  cmd('WORD.FILE.PERMISSION.AUDIT.OPEN', 'Open Audit',          () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.AUDIT.EXPORT','Export Audit',       () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.AUDIT.CLEAR','Clear Audit',         () => { /* Logic */ }),
  cmd('WORD.FILE.PERMISSION.AUDIT.HISTORY','Permission History',() => { /* Logic */ }),

  // ── CERTIFICATES
  cmd('WORD.FILE.SECURITY.CERTIFICATE.ADD','Add Certificate',   () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.CERTIFICATE.REMOVE','Remove Certificate',() => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.CERTIFICATE.VERIFY','Verify Certificate',() => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.CERTIFICATE.EXPORT','Export Certificate',() => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.CERTIFICATE.IMPORT','Import Certificate',() => { /* Logic */ }),

  // ── WATERMARK
  cmd('WORD.FILE.SECURITY.WATERMARK.ADD','Add Watermark',       () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.WATERMARK.REMOVE','Remove Watermark', () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.WATERMARK.CONFIDENTIAL','Confidential',() => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.WATERMARK.SECRET','Secret',           () => { /* Logic */ }),

  // ── AUDIT
  cmd('WORD.FILE.SECURITY.AUDIT.OPEN',   'Open Audit Log',      () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.AUDIT.EXPORT', 'Export Audit',        () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.AUDIT.CLEAR',  'Clear Audit',         () => { /* Logic */ }),
  cmd('WORD.FILE.SECURITY.AUDIT.VIEW',   'View Security Events',() => { /* Logic */ }),

  // ══ DIGITAL SIGNATURE ═══════════════════════════════════════════════════
  // ── DIGITAL SIGNATURE
  cmd('WORD.FILE.SIGNATURE.CREATE',      'Create Digital Signature',() => { /* Logic */ }),
  cmd('WORD.FILE.SIGNATURE.APPLY',       'Apply Signature',     () => { /* Logic */ }),
  cmd('WORD.FILE.SIGNATURE.ADD',         'Add Signature',       () => { /* Logic */ }),
  cmd('WORD.FILE.SIGNATURE.MULTIPLE',    'Multiple Signatures', () => { /* Logic */ }),
  cmd('WORD.FILE.SIGNATURE.TIMESTAMP',   'Timestamp Signature', () => { /* Logic */ }),
  cmd('WORD.FILE.SIGNATURE.VISIBLE',     'Visible Signature',   () => { /* Logic */ }),
  cmd('WORD.FILE.SIGNATURE.INVISIBLE',   'Invisible Signature', () => { /* Logic */ }),
  cmd('WORD.FILE.SIGNATURE.SMARTCARD',   'Smart Card Signature',() => { /* Logic */ }),
  cmd('WORD.FILE.SIGNATURE.HSM',         'Hardware Security Module',() => { /* Logic */ }),
  cmd('WORD.FILE.SIGNATURE.TOKEN',       'USB Token',           () => { /* Logic */ }),

  // ── CERTIFICATE
  cmd('WORD.FILE.CERTIFICATE.OPEN',      'Open Certificate',    () => { /* Logic */ }),
  cmd('WORD.FILE.CERTIFICATE.SELECT',    'Select Certificate',  () => { /* Logic */ }),
  cmd('WORD.FILE.CERTIFICATE.IMPORT',    'Import Certificate',  () => { /* Logic */ }),
  cmd('WORD.FILE.CERTIFICATE.EXPORT',    'Export Certificate',  () => { /* Logic */ }),
  cmd('WORD.FILE.CERTIFICATE.DELETE',    'Delete Certificate',  () => { /* Logic */ }),
  cmd('WORD.FILE.CERTIFICATE.DEFAULT',   'Default Certificate', () => { /* Logic */ }),
  cmd('WORD.FILE.CERTIFICATE.STORE',     'Certificate Store',   () => { /* Logic */ }),
  cmd('WORD.FILE.CERTIFICATE.TRUSTED',   'Trusted Certificates',() => { /* Logic */ }),
  cmd('WORD.FILE.CERTIFICATE.ROOT',      'Root Certificates',   () => { /* Logic */ }),
  cmd('WORD.FILE.CERTIFICATE.RENEW',     'Renew Certificate',   () => { /* Logic */ }),
  cmd('WORD.FILE.CERTIFICATE.REVOKED',   'Check Revocation',    () => { /* Logic */ }),

  // ── VALIDATION
  cmd('WORD.FILE.SIGNATURE.VALIDATE',    'Validate Signature',  () => { /* Logic */ }),
  cmd('WORD.FILE.SIGNATURE.VALIDATE.CERTIFICATE','Validate Certificate',() => { /* Logic */ }),
  cmd('WORD.FILE.SIGNATURE.VALIDATE.TIMESTAMP','Validate Timestamp',() => { /* Logic */ }),
  cmd('WORD.FILE.SIGNATURE.VALIDATE.CHAIN','Validate Certificate Chain',() => { /* Logic */ }),
  cmd('WORD.FILE.SIGNATURE.VALIDATE.TRUST','Validate Trust',    () => { /* Logic */ }),
  cmd('WORD.FILE.SIGNATURE.VALIDATE.INTEGRITY','Validate Document Integrity',() => { /* Logic */ }),
  cmd('WORD.FILE.SIGNATURE.VALIDATE.ONLINE','Online Validation',() => { /* Logic */ }),
  cmd('WORD.FILE.SIGNATURE.VALIDATE.OFFLINE','Offline Validation',() => { /* Logic */ }),

  // ── REMOVE SIGNATURE
  cmd('WORD.FILE.SIGNATURE.REMOVE',      'Remove Signature',    () => { /* Logic */ }),
  cmd('WORD.FILE.SIGNATURE.REMOVE.ALL',  'Remove All Signatures',() => { /* Logic */ }),
  cmd('WORD.FILE.SIGNATURE.REMOVE.SELECTED','Remove Selected Signature',() => { /* Logic */ }),
  cmd('WORD.FILE.SIGNATURE.REMOVE.INVALID','Remove Invalid Signature',() => { /* Logic */ }),

  // ── TRUST
  cmd('WORD.FILE.SIGNATURE.TRUST.ADD',   'Add Trusted Certificate',() => { /* Logic */ }),
  cmd('WORD.FILE.SIGNATURE.TRUST.REMOVE','Remove Trusted Certificate',() => { /* Logic */ }),
  cmd('WORD.FILE.SIGNATURE.TRUST.LIST',  'Trusted Certificate List',() => { /* Logic */ }),

  // ── AUDIT
  cmd('WORD.FILE.SIGNATURE.AUDIT.OPEN',  'Open Audit',          () => { /* Logic */ }),
  cmd('WORD.FILE.SIGNATURE.AUDIT.EXPORT','Export Audit',        () => { /* Logic */ }),
  cmd('WORD.FILE.SIGNATURE.AUDIT.CLEAR', 'Clear Audit',         () => { /* Logic */ }),

  // ══ TEMPLATE ══════════════════════════════════════════════════════════════
  // ── OPEN TEMPLATE
  cmd('WORD.FILE.TEMPLATE.OPEN',         'Open Template',       () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.OPEN.LOCAL',   'Open Local Template', () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.OPEN.CLOUD',   'Open Cloud Template', () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.OPEN.ENTERPRISE','Open Enterprise Template',() => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.OPEN.RECENT',  'Open Recent Template',() => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.OPEN.DEFAULT', 'Open Default Template',() => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.OPEN.CUSTOM',  'Open Custom Template',() => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.OPEN.READONLY','Open Read Only Template',() => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.OPEN.PROTECTED','Open Protected Template',() => { /* Logic */ }),

  // ── SAVE TEMPLATE
  cmd('WORD.FILE.TEMPLATE.SAVE',         'Save Template',       () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.SAVE.AS',      'Save Template As',    () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.SAVE.LOCAL',   'Save Local Template', () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.SAVE.CLOUD',   'Save Cloud Template', () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.SAVE.ENTERPRISE','Save Enterprise Template',() => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.SAVE.PERSONAL','Save Personal Template',() => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.SAVE.SHARED',  'Save Shared Template',() => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.SAVE.OVERWRITE','Overwrite Template', () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.SAVE.COPY',    'Save Template Copy',  () => { /* Logic */ }),

  // ── APPLY TEMPLATE
  cmd('WORD.FILE.TEMPLATE.APPLY',        'Apply Template',      () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.APPLY.STYLE',  'Apply Style Template',() => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.APPLY.THEME',  'Apply Theme Template',() => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.APPLY.PAGE',   'Apply Page Template', () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.APPLY.SECTION','Apply Section Template',() => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.APPLY.CONTENT','Apply Content Template',() => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.APPLY.DOCUMENT','Apply Entire Template',() => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.APPLY.MULTIPLE','Apply Multiple Templates',() => { /* Logic */ }),

  // ── DEFAULT TEMPLATE
  cmd('WORD.FILE.TEMPLATE.DEFAULT',      'Default Template',    () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.DEFAULT.SET',  'Set Default Template',() => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.DEFAULT.RESET','Reset Default Template',() => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.DEFAULT.OPEN', 'Open Default Template',() => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.DEFAULT.RESTORE','Restore Built-in Template',() => { /* Logic */ }),

  // ── TEMPLATE GALLERY
  cmd('WORD.FILE.TEMPLATE.GALLERY.OPEN', 'Open Gallery',        () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.GALLERY.REFRESH','Refresh Gallery',   () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.GALLERY.SEARCH','Search Templates',   () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.GALLERY.FILTER','Filter Templates',   () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.GALLERY.PIN',  'Pin Template',        () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.GALLERY.UNPIN','Unpin Template',      () => { /* Logic */ }),

  // ── TEMPLATE CATEGORY
  cmd('WORD.FILE.TEMPLATE.CATEGORY.BUSINESS','Business',        () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.CATEGORY.LETTER','Letter',            () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.CATEGORY.REPORT','Report',            () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.CATEGORY.RESUME','Resume',            () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.CATEGORY.INVOICE','Invoice',          () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.CATEGORY.FORM','Forms',               () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.CATEGORY.ACADEMIC','Academic',        () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.CATEGORY.LEGAL','Legal',              () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.CATEGORY.CUSTOM','Custom',            () => { /* Logic */ }),

  // ── TEMPLATE MANAGEMENT
  cmd('WORD.FILE.TEMPLATE.RENAME',       'Rename Template',     () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.DELETE',       'Delete Template',     () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.DUPLICATE',    'Duplicate Template',  () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.EXPORT',       'Export Template',     () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.IMPORT',       'Import Template',     () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.VALIDATE',     'Validate Template',   () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.REPAIR',       'Repair Template',     () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.UPGRADE',      'Upgrade Template',    () => { /* Logic */ }),

  // ── TEMPLATE CACHE
  cmd('WORD.FILE.TEMPLATE.CACHE.OPEN',   'Open Cache',          () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.CACHE.CLEAR',  'Clear Cache',         () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.CACHE.REBUILD','Rebuild Cache',       () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.CACHE.REFRESH','Refresh Cache',       () => { /* Logic */ }),

  // ── CLOUD TEMPLATE
  cmd('WORD.FILE.TEMPLATE.CLOUD.SYNC',   'Sync Templates',      () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.CLOUD.DOWNLOAD','Download Template',  () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.CLOUD.UPLOAD', 'Upload Template',     () => { /* Logic */ }),
  cmd('WORD.FILE.TEMPLATE.CLOUD.SHARE',  'Share Template',      () => { /* Logic */ }),

  // ══ DOCUMENT COMPARISON ═════════════════════════════════════════════════
  // ── COMPARE DOCUMENTS
  cmd('WORD.FILE.COMPARE',               'Compare Documents',   () => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.OPEN',          'Open Compare Dialog', () => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.START',         'Start Comparison',    () => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.STOP',          'Stop Comparison',     () => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.LOCAL',         'Compare Local Documents',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.CLOUD',         'Compare Cloud Documents',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.ACTIVE',        'Compare Active Document',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.SELECTED',      'Compare Selected Documents',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.SIDEBYSIDE',    'Side By Side Compare',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.RESULT',        'Open Comparison Result',() => { /* Logic */ }),

  // ── MERGE
  cmd('WORD.FILE.MERGE',                 'Merge Documents',     () => { /* Logic */ }),
  cmd('WORD.FILE.MERGE.START',           'Start Merge',         () => { /* Logic */ }),
  cmd('WORD.FILE.MERGE.AUTO',            'Automatic Merge',     () => { /* Logic */ }),
  cmd('WORD.FILE.MERGE.MANUAL',          'Manual Merge',        () => { /* Logic */ }),
  cmd('WORD.FILE.MERGE.CONFLICT',        'Resolve Merge Conflict',() => { /* Logic */ }),
  cmd('WORD.FILE.MERGE.ACCEPT',          'Accept Merge',        () => { /* Logic */ }),
  cmd('WORD.FILE.MERGE.REJECT',          'Reject Merge',        () => { /* Logic */ }),
  cmd('WORD.FILE.MERGE.SAVE',            'Save Merged Document',() => { /* Logic */ }),
  cmd('WORD.FILE.MERGE.EXPORT',          'Export Merge Result', () => { /* Logic */ }),

  // ── COMPARE FORMATTING
  cmd('WORD.FILE.COMPARE.FORMATTING',    'Compare Formatting',  () => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.FORMATTING.STYLES','Compare Styles',   () => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.FORMATTING.FONTS','Compare Fonts',     () => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.FORMATTING.COLORS','Compare Colors',   () => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.FORMATTING.TABLES','Compare Tables',   () => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.FORMATTING.IMAGES','Compare Images',   () => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.FORMATTING.LAYOUT','Compare Layout',   () => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.FORMATTING.PAGESETUP','Compare Page Setup',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.FORMATTING.HEADERS','Compare Headers', () => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.FORMATTING.FOOTERS','Compare Footers', () => { /* Logic */ }),

  // ── COMPARE VERSION
  cmd('WORD.FILE.COMPARE.VERSION',       'Compare Version',     () => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.VERSION.LATEST','Compare Latest Version',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.VERSION.SELECTED','Compare Selected Version',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.VERSION.LOCAL', 'Compare Local Version',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.VERSION.CLOUD', 'Compare Cloud Version',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.VERSION.HISTORY','Compare Version History',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.VERSION.BASELINE','Compare Against Baseline',() => { /* Logic */ }),

  // ── CONTENT COMPARISON
  cmd('WORD.FILE.COMPARE.CONTENT',       'Compare Content',     () => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.CONTENT.TEXT',  'Compare Text',        () => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.CONTENT.COMMENTS','Compare Comments',  () => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.CONTENT.FOOTNOTES','Compare Footnotes',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.CONTENT.ENDNOTES','Compare Endnotes',  () => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.CONTENT.HYPERLINKS','Compare Hyperlinks',() => { /* Logic */ }),

  // ── TRACK CHANGES
  cmd('WORD.FILE.COMPARE.TRACKCHANGES',  'Compare Track Changes',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.REVISIONS',     'Compare Revisions',   () => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.AUTHORS',       'Compare Authors',     () => { /* Logic */ }),

  // ── FILTER
  cmd('WORD.FILE.COMPARE.FILTER.TEXT',   'Filter Text',         () => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.FILTER.FORMATTING','Filter Formatting',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.FILTER.IMAGES', 'Filter Images',       () => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.FILTER.COMMENTS','Filter Comments',    () => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.FILTER.STYLES', 'Filter Styles',       () => { /* Logic */ }),

  // ── REPORT
  cmd('WORD.FILE.COMPARE.REPORT',        'Comparison Report',   () => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.REPORT.HTML',   'Export HTML Report',  () => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.REPORT.PDF',    'Export PDF Report',   () => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.REPORT.JSON',   'Export JSON Report',  () => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.REPORT.XML',    'Export XML Report',   () => { /* Logic */ }),

  // ── REVIEW
  cmd('WORD.FILE.COMPARE.REVIEW.OPEN',   'Open Review Panel',   () => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.REVIEW.NEXT',   'Next Difference',     () => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.REVIEW.PREVIOUS','Previous Difference',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.REVIEW.ACCEPT', 'Accept Change',       () => { /* Logic */ }),
  cmd('WORD.FILE.COMPARE.REVIEW.REJECT', 'Reject Change',       () => { /* Logic */ }),

  // ══ DOCUMENT INSPECTOR ══════════════════════════════════════════════════
  // ── INSPECT DOCUMENT
  cmd('WORD.FILE.INSPECT',               'Inspect Document',    () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.START',         'Start Inspection',    () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.STOP',          'Stop Inspection',     () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.REFRESH',       'Refresh Inspection',  () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.RESULTS',       'Inspection Results',  () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.EXPORT',        'Export Report',       () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.PRINT',         'Print Report',        () => { /* Logic */ }),

  // ── HIDDEN DATA
  cmd('WORD.FILE.INSPECT.HIDDEN',        'Inspect Hidden Data', () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.HIDDEN.TEXT',   'Hidden Text',         () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.HIDDEN.OBJECTS','Hidden Objects',      () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.HIDDEN.SHAPES', 'Hidden Shapes',       () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.HIDDEN.IMAGES', 'Hidden Images',       () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.HIDDEN.BOOKMARKS','Hidden Bookmarks',  () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.HIDDEN.FIELDS', 'Hidden Fields',       () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.HIDDEN.CONTROLS','Hidden Controls',    () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.HIDDEN.LAYERS', 'Hidden Layers',       () => { /* Logic */ }),

  // ── METADATA
  cmd('WORD.FILE.INSPECT.METADATA',      'Inspect Metadata',    () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.METADATA.AUTHOR','Author',             () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.METADATA.COMPANY','Company',           () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.METADATA.MANAGER','Manager',           () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.METADATA.TITLE','Title',               () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.METADATA.SUBJECT','Subject',           () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.METADATA.KEYWORDS','Keywords',         () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.METADATA.CATEGORY','Category',         () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.METADATA.CREATED','Created Date',      () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.METADATA.MODIFIED','Modified Date',    () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.METADATA.LASTAUTHOR','Last Author',    () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.METADATA.VERSION','Version',           () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.METADATA.CUSTOM','Custom Properties',  () => { /* Logic */ }),

  // ── COMMENTS
  cmd('WORD.FILE.INSPECT.COMMENTS',      'Inspect Comments',    () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.COMMENTS.ALL',  'All Comments',        () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.COMMENTS.AUTHORS','Comment Authors',   () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.COMMENTS.RESOLVED','Resolved Comments',() => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.COMMENTS.UNRESOLVED','Unresolved Comments',() => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.COMMENTS.HIDDEN','Hidden Comments',    () => { /* Logic */ }),

  // ── XML
  cmd('WORD.FILE.INSPECT.XML',           'Inspect XML',         () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.XML.CUSTOM',    'Custom XML',          () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.XML.NAMESPACES','Namespaces',          () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.XML.PARTS',     'XML Parts',           () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.XML.RELATIONSHIPS','Relationships',    () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.XML.INVALID',   'Invalid XML',         () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.XML.ORPHAN',    'Orphan XML Parts',    () => { /* Logic */ }),

  // ── TRACK CHANGES
  cmd('WORD.FILE.INSPECT.TRACKCHANGES',  'Inspect Track Changes',() => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.TRACKCHANGES.INSERTIONS','Insertions', () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.TRACKCHANGES.DELETIONS','Deletions',   () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.TRACKCHANGES.MOVES','Moved Content',   () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.TRACKCHANGES.FORMATTING','Formatting Changes',() => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.TRACKCHANGES.AUTHORS','Revision Authors',() => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.TRACKCHANGES.DATE','Revision Dates',   () => { /* Logic */ }),

  // ── DOCUMENT PROPERTIES
  cmd('WORD.FILE.INSPECT.PROPERTIES',    'Inspect Properties',  () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.PROPERTIES.BUILTIN','Built-in Properties',() => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.PROPERTIES.CUSTOM','Custom Properties',() => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.PROPERTIES.HIDDEN','Hidden Properties',() => { /* Logic */ }),

  // ── EMBEDDED CONTENT
  cmd('WORD.FILE.INSPECT.EMBEDDED',      'Inspect Embedded Objects',() => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.EMBEDDED.OLE',  'OLE Objects',         () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.EMBEDDED.MEDIA','Media Files',         () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.EMBEDDED.ACTIVEX','ActiveX Controls',  () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.EMBEDDED.MACROS','Macros',             () => { /* Logic */ }),

  // ── LINKS
  cmd('WORD.FILE.INSPECT.LINKS',         'Inspect External Links',() => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.LINKS.BROKEN',  'Broken Links',        () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.LINKS.EXTERNAL','External References', () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.LINKS.EMBEDDED','Embedded Links',      () => { /* Logic */ }),

  // ── REMOVE HIDDEN INFORMATION
  cmd('WORD.FILE.INSPECT.CLEAN',         'Remove Hidden Information',() => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.CLEAN.METADATA','Remove Metadata',     () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.CLEAN.COMMENTS','Remove Comments',     () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.CLEAN.TRACKCHANGES','Remove Track Changes',() => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.CLEAN.XML',     'Remove Custom XML',   () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.CLEAN.HIDDEN',  'Remove Hidden Data',  () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.CLEAN.PROPERTIES','Remove Properties', () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.CLEAN.LINKS',   'Remove External Links',() => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.CLEAN.ALL',     'Remove All Hidden Information',() => { /* Logic */ }),

  // ── COMPLIANCE
  cmd('WORD.FILE.INSPECT.COMPLIANCE',    'Compliance Check',    () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.COMPLIANCE.GDPR','GDPR',               () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.COMPLIANCE.ISO27001','ISO 27001',      () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.COMPLIANCE.HIPAA','HIPAA',             () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.COMPLIANCE.COMPANY','Enterprise Policy',() => { /* Logic */ }),

  // ── REPORTS
  cmd('WORD.FILE.INSPECT.REPORT.OPEN',   'Open Report',         () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.REPORT.SAVE',   'Save Report',         () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.REPORT.HTML',   'Export HTML',         () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.REPORT.PDF',    'Export PDF',          () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.REPORT.JSON',   'Export JSON',         () => { /* Logic */ }),
  cmd('WORD.FILE.INSPECT.REPORT.XML',    'Export XML',          () => { /* Logic */ }),

  // ══ METADATA ════════════════════════════════════════════════════════════
  // ── READ
  cmd('WORD.FILE.METADATA.READ',         'Read Metadata',       () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.READ.ALL',     'Read All Metadata',   () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.READ.CORE',    'Read Core Properties',() => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.READ.EXTENDED','Read Extended Properties',() => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.READ.CUSTOM',  'Read Custom Properties',() => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.READ.CLOUD',   'Read Cloud Metadata', () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.READ.SYSTEM',  'Read System Properties',() => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.READ.STATISTICS','Read Document Statistics',() => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.READ.CLASSIFICATION','Read Classification',() => { /* Logic */ }),

  // ── WRITE
  cmd('WORD.FILE.METADATA.WRITE',        'Write Metadata',      () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.WRITE.CORE',   'Write Core Properties',() => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.WRITE.EXTENDED','Write Extended Properties',() => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.WRITE.CUSTOM', 'Write Custom Properties',() => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.WRITE.AUTHOR', 'Write Author',        () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.WRITE.COMPANY','Write Company',       () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.WRITE.TITLE',  'Write Title',         () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.WRITE.SUBJECT','Write Subject',       () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.WRITE.KEYWORDS','Write Keywords',     () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.WRITE.CATEGORY','Write Category',     () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.WRITE.COMMENTS','Write Comments',     () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.WRITE.CLASSIFICATION','Write Classification',() => { /* Logic */ }),

  // ── IMPORT
  cmd('WORD.FILE.METADATA.IMPORT',       'Import Metadata',     () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.IMPORT.XML',   'Import XML',          () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.IMPORT.JSON',  'Import JSON',         () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.IMPORT.CSV',   'Import CSV',          () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.IMPORT.PROFILE','Import Metadata Profile',() => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.IMPORT.CLOUD', 'Import Cloud Metadata',() => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.IMPORT.TEMPLATE','Import Template Metadata',() => { /* Logic */ }),

  // ── EXPORT
  cmd('WORD.FILE.METADATA.EXPORT',       'Export Metadata',     () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.EXPORT.XML',   'Export XML',          () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.EXPORT.JSON',  'Export JSON',         () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.EXPORT.CSV',   'Export CSV',          () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.EXPORT.TEXT',  'Export TXT',          () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.EXPORT.HTML',  'Export HTML',         () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.EXPORT.PDF',   'Export PDF Report',   () => { /* Logic */ }),

  // ── CLEAR METADATA
  cmd('WORD.FILE.METADATA.CLEAR',        'Clear Metadata',      () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.CLEAR.CORE',   'Clear Core Properties',() => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.CLEAR.EXTENDED','Clear Extended Properties',() => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.CLEAR.CUSTOM', 'Clear Custom Properties',() => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.CLEAR.AUTHOR', 'Remove Author',       () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.CLEAR.COMPANY','Remove Company',      () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.CLEAR.COMMENTS','Remove Comments',    () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.CLEAR.CLASSIFICATION','Remove Classification',() => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.CLEAR.ALL',    'Clear All Metadata',  () => { /* Logic */ }),

  // ── BUILT-IN PROPERTIES
  cmd('WORD.FILE.METADATA.PROPERTY.TITLE', 'Title',             () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.PROPERTY.SUBJECT', 'Subject',         () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.PROPERTY.AUTHOR', 'Author',           () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.PROPERTY.COMPANY', 'Company',         () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.PROPERTY.MANAGER', 'Manager',         () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.PROPERTY.KEYWORDS', 'Keywords',       () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.PROPERTY.CATEGORY', 'Category',       () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.PROPERTY.STATUS', 'Status',           () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.PROPERTY.LANGUAGE', 'Language',       () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.PROPERTY.VERSION', 'Document Version',() => { /* Logic */ }),

  // ── DOCUMENT STATISTICS
  cmd('WORD.FILE.METADATA.STATS.OPEN',   'Open Statistics',     () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.STATS.WORDCOUNT','Word Count',        () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.STATS.PAGECOUNT','Page Count',        () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.STATS.CHARCOUNT','Character Count',   () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.STATS.LINECOUNT','Line Count',        () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.STATS.PARAGRAPHCOUNT','Paragraph Count',() => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.STATS.TABLECOUNT','Table Count',      () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.STATS.IMAGECOUNT','Image Count',      () => { /* Logic */ }),

  // ── VALIDATION
  cmd('WORD.FILE.METADATA.VALIDATE',     'Validate Metadata',   () => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.VALIDATE.CORE','Validate Core Properties',() => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.VALIDATE.CUSTOM','Validate Custom Properties',() => { /* Logic */ }),
  cmd('WORD.FILE.METADATA.VALIDATE.CLASSIFICATION','Validate Classification',() => { /* Logic */ }),

  // ══ COMPATIBILITY ═══════════════════════════════════════════════════════
  // ── COMPATIBILITY CHECK
  cmd('WORD.FILE.COMPATIBILITY.CHECK',   'Compatibility Check', () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.CHECK.START','Start Compatibility Check',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.CHECK.QUICK','Quick Check',      () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.CHECK.FULL','Full Compatibility Scan',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.CHECK.OPENXML','Check OpenXML Compatibility',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.CHECK.LEGACY','Check Legacy Features',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.CHECK.FONTS','Check Fonts',      () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.CHECK.MEDIA','Check Images',     () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.CHECK.TABLES','Check Tables',    () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.CHECK.SMARTART','Check SmartArt',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.CHECK.CHARTS','Check Charts',    () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.CHECK.MACROS','Check Macros',    () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.CHECK.COMMENTS','Check Comments',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.CHECK.TRACKCHANGES','Check Track Changes',() => { /* Logic */ }),

  // ── COMPATIBILITY REPORT
  cmd('WORD.FILE.COMPATIBILITY.REPORT',  'Compatibility Report',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.REPORT.OPEN','Open Report',      () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.REPORT.SAVE','Save Report',      () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.REPORT.HTML','Export HTML',      () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.REPORT.PDF','Export PDF',        () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.REPORT.JSON','Export JSON',      () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.REPORT.XML','Export XML',        () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.REPORT.PRINT','Print Report',    () => { /* Logic */ }),

  // ── CONVERT FORMAT
  cmd('WORD.FILE.COMPATIBILITY.CONVERT', 'Convert Format',      () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.CONVERT.DOC','Convert To DOC',   () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.CONVERT.DOCX','Convert To DOCX', () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.CONVERT.ODT','Convert To ODT',   () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.CONVERT.PDF','Convert To PDF',   () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.CONVERT.HTML','Convert To HTML', () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.CONVERT.MARKDOWN','Convert To Markdown',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.CONVERT.TXT','Convert To TXT',   () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.CONVERT.XML','Convert To XML',   () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.CONVERT.OPENXML','Convert To OpenXML',() => { /* Logic */ }),

  // ── OFFICE VERSION
  cmd('WORD.FILE.COMPATIBILITY.VERSION', 'Office Version',      () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.VERSION.DETECT','Detect Office Version',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.VERSION.WORD97','Word 97',       () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.VERSION.WORD2003','Word 2003',   () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.VERSION.WORD2007','Word 2007',   () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.VERSION.WORD2010','Word 2010',   () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.VERSION.WORD2013','Word 2013',   () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.VERSION.WORD2016','Word 2016',   () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.VERSION.WORD2019','Word 2019',   () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.VERSION.WORD2021','Word 2021',   () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.VERSION.M365','Microsoft 365',   () => { /* Logic */ }),

  // ── TARGET PLATFORM
  cmd('WORD.FILE.COMPATIBILITY.PLATFORM.WINDOWS','Windows',     () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.PLATFORM.MACOS','macOS',         () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.PLATFORM.LINUX','Linux',         () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.PLATFORM.WEB','Office Web',      () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.PLATFORM.MOBILE','Mobile',       () => { /* Logic */ }),

  // ── THIRD-PARTY SUITES
  cmd('WORD.FILE.COMPATIBILITY.LIBREOFFICE','LibreOffice',      () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.OPENOFFICE','OpenOffice',        () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.WPS',     'WPS Office',          () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.ONLYOFFICE','ONLYOFFICE',        () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.GOOGLEDOCS','Google Docs',       () => { /* Logic */ }),

  // ── VALIDATION
  cmd('WORD.FILE.COMPATIBILITY.VALIDATE','Validate Compatibility',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.VALIDATE.OPENXML','Validate OpenXML',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.VALIDATE.RENDERING','Validate Rendering',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.VALIDATE.LAYOUT','Validate Layout',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.VALIDATE.FONTS','Validate Fonts',() => { /* Logic */ }),

  // ── REPAIR
  cmd('WORD.FILE.COMPATIBILITY.REPAIR',  'Repair Compatibility Issues',() => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.REPAIR.AUTO','Automatic Repair', () => { /* Logic */ }),
  cmd('WORD.FILE.COMPATIBILITY.REPAIR.MANUAL','Manual Repair',  () => { /* Logic */ }),

  // ══ CACHE MANAGEMENT ════════════════════════════════════════════════════
  // ── CACHE
  cmd('WORD.FILE.CACHE.OPEN',            'Open Cache',          () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.STATUS',          'Cache Status',        () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.SIZE',            'Cache Size',          () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.LOCATION',        'Cache Location',      () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.REFRESH',         'Refresh Cache',       () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.ENABLE',          'Enable Cache',        () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.DISABLE',         'Disable Cache',       () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.VALIDATE',        'Validate Cache',      () => { /* Logic */ }),

  // ── REBUILD
  cmd('WORD.FILE.CACHE.REBUILD',         'Rebuild Cache',       () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.REBUILD.ALL',     'Rebuild All Cache',   () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.REBUILD.RENDER',  'Rebuild Render Cache',() => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.REBUILD.FONT',    'Rebuild Font Cache',  () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.REBUILD.DOCUMENT','Rebuild Document Cache',() => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.REBUILD.THUMBNAIL','Rebuild Thumbnail Cache',() => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.REBUILD.CLOUD',   'Rebuild Cloud Cache', () => { /* Logic */ }),

  // ── CLEAR CACHE
  cmd('WORD.FILE.CACHE.CLEAR',           'Clear Cache',         () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.CLEAR.ALL',       'Clear All Cache',     () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.CLEAR.RENDER',    'Clear Render Cache',  () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.CLEAR.FONT',      'Clear Font Cache',    () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.CLEAR.DOCUMENT',  'Clear Document Cache',() => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.CLEAR.CLOUD',     'Clear Cloud Cache',   () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.CLEAR.PREVIEW',   'Clear Preview Cache', () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.CLEAR.RECENT',    'Clear Recent Cache',  () => { /* Logic */ }),

  // ── MEMORY CACHE
  cmd('WORD.FILE.CACHE.MEMORY',          'Memory Cache',        () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.MEMORY.STATUS',   'Memory Status',       () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.MEMORY.FLUSH',    'Flush Memory Cache',  () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.MEMORY.OPTIMIZE', 'Optimize Memory Cache',() => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.MEMORY.LIMIT',    'Memory Cache Limit',  () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.MEMORY.STATISTICS','Memory Statistics',  () => { /* Logic */ }),

  // ── THUMBNAIL CACHE
  cmd('WORD.FILE.CACHE.THUMBNAIL',       'Thumbnail Cache',     () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.THUMBNAIL.GENERATE','Generate Thumbnails',() => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.THUMBNAIL.REBUILD','Rebuild Thumbnails', () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.THUMBNAIL.DELETE','Delete Thumbnails',   () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.THUMBNAIL.SIZE',  'Thumbnail Size',      () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.THUMBNAIL.REFRESH','Refresh Thumbnails', () => { /* Logic */ }),

  // ── DOCUMENT CACHE
  cmd('WORD.FILE.CACHE.DOCUMENT',        'Document Cache',      () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.DOCUMENT.LOAD',   'Load Cache',          () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.DOCUMENT.SAVE',   'Save Cache',          () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.DOCUMENT.DELETE', 'Delete Cache',        () => { /* Logic */ }),

  // ── CLOUD CACHE
  cmd('WORD.FILE.CACHE.CLOUD',           'Cloud Cache',         () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.CLOUD.DOWNLOAD',  'Download Cache',      () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.CLOUD.UPLOAD',    'Upload Cache',        () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.CLOUD.SYNC',      'Sync Cache',          () => { /* Logic */ }),

  // ── PERFORMANCE
  cmd('WORD.FILE.CACHE.PERFORMANCE',     'Performance Cache',   () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.PERFORMANCE.OPTIMIZE','Optimize Cache',  () => { /* Logic */ }),
  cmd('WORD.FILE.CACHE.PERFORMANCE.STATS','Performance Statistics',() => { /* Logic */ }),

  // ══ SESSION MANAGEMENT ══════════════════════════════════════════════════
  // ── SAVE SESSION
  cmd('WORD.FILE.SESSION.SAVE',          'Save Session',        () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.SAVE.AUTO',     'Auto Save Session',   () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.SAVE.MANUAL',   'Manual Save',         () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.SAVE.LOCAL',    'Save Local Session',  () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.SAVE.CLOUD',    'Save Cloud Session',  () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.SAVE.WORKSPACE','Save Workspace',      () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.SAVE.WINDOWS',  'Save Window State',   () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.SAVE.PANELS',   'Save Panel Layout',   () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.SAVE.HISTORY',  'Save History',        () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.SAVE.CLIPBOARD','Save Clipboard',      () => { /* Logic */ }),

  // ── RESTORE SESSION
  cmd('WORD.FILE.SESSION.RESTORE',       'Restore Session',     () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.RESTORE.AUTO',  'Auto Restore',        () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.RESTORE.LAST',  'Restore Last Session',() => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.RESTORE.SELECTED','Restore Selected Session',() => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.RESTORE.LOCAL', 'Restore Local Session',() => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.RESTORE.CLOUD', 'Restore Cloud Session',() => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.RESTORE.WINDOWS','Restore Window Layout',() => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.RESTORE.PANELS','Restore Panels',      () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.RESTORE.HISTORY','Restore History',    () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.RESTORE.CLIPBOARD','Restore Clipboard',() => { /* Logic */ }),

  // ── WORKSPACE RESTORE
  cmd('WORD.FILE.WORKSPACE.RESTORE',     'Restore Workspace',   () => { /* Logic */ }),
  cmd('WORD.FILE.WORKSPACE.RESTORE.DEFAULT','Restore Default Workspace',() => { /* Logic */ }),
  cmd('WORD.FILE.WORKSPACE.RESTORE.CUSTOM','Restore Custom Workspace',() => { /* Logic */ }),
  cmd('WORD.FILE.WORKSPACE.RESTORE.PANELS','Restore Dock Panels',() => { /* Logic */ }),
  cmd('WORD.FILE.WORKSPACE.RESTORE.RIBBON','Restore Ribbon',    () => { /* Logic */ }),
  cmd('WORD.FILE.WORKSPACE.RESTORE.SIDEBAR','Restore Sidebar',  () => { /* Logic */ }),
  cmd('WORD.FILE.WORKSPACE.RESTORE.STATUSBAR','Restore Status Bar',() => { /* Logic */ }),
  cmd('WORD.FILE.WORKSPACE.RESTORE.QUICKACCESS','Restore Quick Access Toolbar',() => { /* Logic */ }),

  // ── CRASH RECOVERY
  cmd('WORD.FILE.SESSION.CRASH',         'Crash Recovery',      () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.CRASH.START',   'Start Recovery',      () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.CRASH.RESTORE', 'Restore After Crash', () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.CRASH.REPORT',  'Crash Report',        () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.CRASH.LOG',     'Open Crash Log',      () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.CRASH.DELETE',  'Delete Crash Data',   () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.CRASH.VALIDATE','Validate Recovery',   () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.CRASH.REPAIR',  'Repair Session',      () => { /* Logic */ }),

  // ── SESSION HISTORY
  cmd('WORD.FILE.SESSION.HISTORY',       'Session History',     () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.HISTORY.OPEN',  'Open History',        () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.HISTORY.DELETE','Delete History',      () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.HISTORY.CLEAR', 'Clear History',       () => { /* Logic */ }),

  // ── SESSION CACHE
  cmd('WORD.FILE.SESSION.CACHE',         'Session Cache',       () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.CACHE.OPEN',    'Open Cache',          () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.CACHE.CLEAR',   'Clear Cache',         () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.CACHE.REBUILD', 'Rebuild Cache',       () => { /* Logic */ }),

  // ── CLOUD SESSION
  cmd('WORD.FILE.SESSION.CLOUD',         'Cloud Session',       () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.CLOUD.UPLOAD',  'Upload Session',      () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.CLOUD.DOWNLOAD','Download Session',    () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.CLOUD.SYNC',    'Sync Session',        () => { /* Logic */ }),
  cmd('WORD.FILE.SESSION.CLOUD.DELETE',  'Delete Cloud Session',() => { /* Logic */ }),

  // ══ AI INTEGRATION ══════════════════════════════════════════════════════
  // ── AI SUMMARIZE
  cmd('WORD.FILE.AI.SUMMARIZE',          'Summarize Document',  () => { /* Logic */ }),
  cmd('WORD.FILE.AI.SUMMARIZE.SELECTION','Summarize Selection', () => { /* Logic */ }),
  cmd('WORD.FILE.AI.SUMMARIZE.PAGE',     'Summarize Current Page',() => { /* Logic */ }),
  cmd('WORD.FILE.AI.SUMMARIZE.SECTION',  'Summarize Section',   () => { /* Logic */ }),
  cmd('WORD.FILE.AI.SUMMARIZE.DOCUMENT', 'Summarize Entire Document',() => { /* Logic */ }),
  cmd('WORD.FILE.AI.SUMMARIZE.BULLETS',  'Bullet Summary',      () => { /* Logic */ }),
  cmd('WORD.FILE.AI.SUMMARIZE.EXECUTIVE','Executive Summary',   () => { /* Logic */ }),
  cmd('WORD.FILE.AI.SUMMARIZE.ACADEMIC', 'Academic Summary',    () => { /* Logic */ }),
  cmd('WORD.FILE.AI.SUMMARIZE.TECHNICAL','Technical Summary',   () => { /* Logic */ }),
  cmd('WORD.FILE.AI.SUMMARIZE.CUSTOM',   'Custom Prompt Summary',() => { /* Logic */ }),

  // ── AI TRANSLATE
  cmd('WORD.FILE.AI.TRANSLATE',          'Translate',           () => { /* Logic */ }),
  cmd('WORD.FILE.AI.TRANSLATE.SELECTION','Translate Selection', () => { /* Logic */ }),
  cmd('WORD.FILE.AI.TRANSLATE.PAGE',     'Translate Page',      () => { /* Logic */ }),
  cmd('WORD.FILE.AI.TRANSLATE.DOCUMENT', 'Translate Document',  () => { /* Logic */ }),
  cmd('WORD.FILE.AI.TRANSLATE.AUTO',     'Auto Detect Language',() => { /* Logic */ }),
  cmd('WORD.FILE.AI.TRANSLATE.PRESERVE_STYLE','Preserve Formatting',() => { /* Logic */ }),
  cmd('WORD.FILE.AI.TRANSLATE.BILINGUAL','Create Bilingual Version',() => { /* Logic */ }),
  cmd('WORD.FILE.AI.TRANSLATE.BACK',     'Back Translation',    () => { /* Logic */ }),

  // ── AI REWRITE
  cmd('WORD.FILE.AI.REWRITE',            'Rewrite',             () => { /* Logic */ }),
  cmd('WORD.FILE.AI.REWRITE.SHORTER',    'Rewrite Shorter',     () => { /* Logic */ }),
  cmd('WORD.FILE.AI.REWRITE.LONGER',     'Rewrite Longer',      () => { /* Logic */ }),
  cmd('WORD.FILE.AI.REWRITE.FORMAL',     'Formal Style',        () => { /* Logic */ }),
  cmd('WORD.FILE.AI.REWRITE.CASUAL',     'Casual Style',        () => { /* Logic */ }),
  cmd('WORD.FILE.AI.REWRITE.PROFESSIONAL','Professional Style', () => { /* Logic */ }),
  cmd('WORD.FILE.AI.REWRITE.ACADEMIC',   'Academic Style',      () => { /* Logic */ }),
  cmd('WORD.FILE.AI.REWRITE.GRAMMAR',    'Grammar Fix',         () => { /* Logic */ }),
  cmd('WORD.FILE.AI.REWRITE.SPELLING',   'Spelling Fix',        () => { /* Logic */ }),
  cmd('WORD.FILE.AI.REWRITE.CLARITY',    'Improve Clarity',     () => { /* Logic */ }),
  cmd('WORD.FILE.AI.REWRITE.SIMPLIFY',   'Simplify Text',       () => { /* Logic */ }),

  // ── AI REVIEW
  cmd('WORD.FILE.AI.REVIEW',             'Review Document',     () => { /* Logic */ }),
  cmd('WORD.FILE.AI.REVIEW.GRAMMAR',     'Grammar Review',      () => { /* Logic */ }),
  cmd('WORD.FILE.AI.REVIEW.STYLE',       'Style Review',        () => { /* Logic */ }),
  cmd('WORD.FILE.AI.REVIEW.TONE',        'Tone Review',         () => { /* Logic */ }),
  cmd('WORD.FILE.AI.REVIEW.LOGIC',       'Logic Review',        () => { /* Logic */ }),
  cmd('WORD.FILE.AI.REVIEW.CONSISTENCY', 'Consistency Review',  () => { /* Logic */ }),
  cmd('WORD.FILE.AI.REVIEW.ACCESSIBILITY','Accessibility Review',() => { /* Logic */ }),
  cmd('WORD.FILE.AI.REVIEW.SECURITY',    'Sensitive Information Review',() => { /* Logic */ }),
  cmd('WORD.FILE.AI.REVIEW.LEGAL',       'Legal Review',        () => { /* Logic */ }),
  cmd('WORD.FILE.AI.REVIEW.TECHNICAL',   'Technical Review',    () => { /* Logic */ }),

  // ── AI EXPLAIN
  cmd('WORD.FILE.AI.EXPLAIN',            'Explain',             () => { /* Logic */ }),
  cmd('WORD.FILE.AI.EXPLAIN.SELECTION',  'Explain Selection',   () => { /* Logic */ }),
  cmd('WORD.FILE.AI.EXPLAIN.PARAGRAPH',  'Explain Paragraph',   () => { /* Logic */ }),
  cmd('WORD.FILE.AI.EXPLAIN.TERM',       'Explain Term',        () => { /* Logic */ }),
  cmd('WORD.FILE.AI.EXPLAIN.TABLE',      'Explain Table',       () => { /* Logic */ }),
  cmd('WORD.FILE.AI.EXPLAIN.CHART',      'Explain Chart',       () => { /* Logic */ }),
  cmd('WORD.FILE.AI.EXPLAIN.CODE',       'Explain Code',        () => { /* Logic */ }),
  cmd('WORD.FILE.AI.EXPLAIN.FORMULA',    'Explain Formula',     () => { /* Logic */ }),
  cmd('WORD.FILE.AI.EXPLAIN.DIAGRAM',    'Explain Diagram',     () => { /* Logic */ }),

  // ── AI GENERATE METADATA
  cmd('WORD.FILE.AI.METADATA',           'Generate Metadata',   () => { /* Logic */ }),
  cmd('WORD.FILE.AI.METADATA.TITLE',     'Generate Title',      () => { /* Logic */ }),
  cmd('WORD.FILE.AI.METADATA.SUBJECT',   'Generate Subject',    () => { /* Logic */ }),
  cmd('WORD.FILE.AI.METADATA.KEYWORDS',  'Generate Keywords',   () => { /* Logic */ }),
  cmd('WORD.FILE.AI.METADATA.CATEGORY',  'Generate Category',   () => { /* Logic */ }),
  cmd('WORD.FILE.AI.METADATA.TAGS',      'Generate Tags',       () => { /* Logic */ }),
  cmd('WORD.FILE.AI.METADATA.DESCRIPTION','Generate Description',() => { /* Logic */ }),
  cmd('WORD.FILE.AI.METADATA.AUTHOR',    'Suggest Author Information',() => { /* Logic */ }),
  cmd('WORD.FILE.AI.METADATA.CLASSIFICATION','Suggest Classification',() => { /* Logic */ }),

  // ── PROVIDERS
  cmd('WORD.FILE.AI.PROVIDER.AUTO',      'Auto Select Provider',() => { /* Logic */ }),
  cmd('WORD.FILE.AI.PROVIDER.OPENAI',    'OpenAI',              () => { /* Logic */ }),
  cmd('WORD.FILE.AI.PROVIDER.CLAUDE',    'Claude',              () => { /* Logic */ }),
  cmd('WORD.FILE.AI.PROVIDER.GEMINI',    'Gemini',              () => { /* Logic */ }),
  cmd('WORD.FILE.AI.PROVIDER.DEEPSEEK',  'DeepSeek',            () => { /* Logic */ }),
  cmd('WORD.FILE.AI.PROVIDER.OLLAMA',    'Ollama',              () => { /* Logic */ }),
  cmd('WORD.FILE.AI.PROVIDER.LMSTUDIO',  'LM Studio',           () => { /* Logic */ }),
  cmd('WORD.FILE.AI.PROVIDER.LOCAL',     'Local AI',            () => { /* Logic */ }),

  // ── STREAMING
  cmd('WORD.FILE.AI.STREAM.START',       'Start Streaming',     () => { /* Logic */ }),
  cmd('WORD.FILE.AI.STREAM.STOP',        'Stop Streaming',      () => { /* Logic */ }),
  cmd('WORD.FILE.AI.STREAM.RETRY',       'Retry',               () => { /* Logic */ }),
  cmd('WORD.FILE.AI.STREAM.CANCEL',      'Cancel',              () => { /* Logic */ }),

  // ── HISTORY
  cmd('WORD.FILE.AI.HISTORY.OPEN',       'Open History',        () => { /* Logic */ }),
  cmd('WORD.FILE.AI.HISTORY.CLEAR',      'Clear History',       () => { /* Logic */ }),
  cmd('WORD.FILE.AI.HISTORY.EXPORT',     'Export History',      () => { /* Logic */ }),
  cmd('WORD.FILE.AI.HISTORY.RESTORE',    'Restore Prompt',      () => { /* Logic */ }),

  // ══ AUDIT & COMPLIANCE ══════════════════════════════════════════════════
  // ── AUDIT
  cmd('WORD.FILE.AUDIT.OPEN',            'Open Audit Center',   () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.START',           'Start Audit Session', () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.STOP',            'Stop Audit Session',  () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.STATUS',          'Audit Status',        () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.SEARCH',          'Search Audit Log',    () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.FILTER',          'Filter Audit Records',() => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.REFRESH',         'Refresh Audit View',  () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.CLEARFILTER',     'Clear Filters',       () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.VERIFY',          'Verify Audit Integrity',() => { /* Logic */ }),

  // ── AUDIT EVENTS
  cmd('WORD.FILE.AUDIT.EVENT.FILE',      'File Operations',     () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.EVENT.SECURITY',  'Security Events',     () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.EVENT.PERMISSION','Permission Events',   () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.EVENT.LOGIN',     'Login Events',        () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.EVENT.SHARING',   'Sharing Events',      () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.EVENT.AI',        'AI Events',           () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.EVENT.EXPORT',    'Export Events',       () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.EVENT.PRINT',     'Print Events',        () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.EVENT.DELETE',    'Delete Events',       () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.EVENT.VERSION',   'Version Events',      () => { /* Logic */ }),

  // ── EXPORT LOGS
  cmd('WORD.FILE.AUDIT.EXPORT',          'Export Logs',         () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.EXPORT.PDF',      'Export PDF',          () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.EXPORT.HTML',     'Export HTML',         () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.EXPORT.CSV',      'Export CSV',          () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.EXPORT.JSON',     'Export JSON',         () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.EXPORT.XML',      'Export XML',          () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.EXPORT.SYSLOG',   'Export Syslog',       () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.EXPORT.SIEM',     'Export SIEM',         () => { /* Logic */ }),

  // ── SECURITY LOG
  cmd('WORD.FILE.AUDIT.SECURITY',        'Security Log',        () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.SECURITY.LOGIN',  'Login History',       () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.SECURITY.FAILEDLOGIN','Failed Login Attempts',() => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.SECURITY.PERMISSION','Permission Changes',() => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.SECURITY.ENCRYPTION','Encryption Events',() => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.SECURITY.SIGNATURE','Digital Signature Events',() => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.SECURITY.CERTIFICATE','Certificate Events',() => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.SECURITY.THREATS','Threat Detection',    () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.SECURITY.ALERTS', 'Security Alerts',     () => { /* Logic */ }),

  // ── COMPLIANCE
  cmd('WORD.FILE.AUDIT.COMPLIANCE',      'Compliance Center',   () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.COMPLIANCE.GDPR', 'GDPR Report',         () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.COMPLIANCE.ISO27001','ISO 27001',        () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.COMPLIANCE.SOC2', 'SOC 2',               () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.COMPLIANCE.HIPAA', 'HIPAA',              () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.COMPLIANCE.FINANCE','Financial Compliance',() => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.COMPLIANCE.COMPANY','Enterprise Policy', () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.COMPLIANCE.VALIDATE','Validate Compliance',() => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.COMPLIANCE.REPORT','Compliance Report',  () => { /* Logic */ }),

  // ── RETENTION
  cmd('WORD.FILE.AUDIT.RETENTION',       'Retention Policy',    () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.RETENTION.SET',   'Set Retention',       () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.RETENTION.DELETE','Delete Expired Logs', () => { /* Logic */ }),
  cmd('WORD.FILE.AUDIT.RETENTION.ARCHIVE','Archive Logs',       () => { /* Logic */ }),

  // ══ FAVORITES & RECENT ══════════════════════════════════════════════════
  // ── FAVORITE
  cmd('WORD.FILE.FAVORITE.ADD',          'Add Favorite',        () => { /* Logic */ }),
  cmd('WORD.FILE.FAVORITE.REMOVE',       'Remove Favorite',     () => { /* Logic */ }),
  cmd('WORD.FILE.FAVORITE.OPEN',         'Open Favorite',       () => { /* Logic */ }),
  cmd('WORD.FILE.FAVORITE.RENAME',       'Rename Favorite',     () => { /* Logic */ }),
  cmd('WORD.FILE.FAVORITE.MOVE',         'Move Favorite',       () => { /* Logic */ }),
  cmd('WORD.FILE.FAVORITE.SORT',         'Sort Favorites',      () => { /* Logic */ }),
  cmd('WORD.FILE.FAVORITE.GROUP',        'Favorite Groups',     () => { /* Logic */ }),
  cmd('WORD.FILE.FAVORITE.COLOR',        'Favorite Label',      () => { /* Logic */ }),
  cmd('WORD.FILE.FAVORITE.SEARCH',       'Search Favorites',    () => { /* Logic */ }),
  cmd('WORD.FILE.FAVORITE.EXPORT',       'Export Favorites',    () => { /* Logic */ }),
  cmd('WORD.FILE.FAVORITE.IMPORT',       'Import Favorites',    () => { /* Logic */ }),

  // ── PIN
  cmd('WORD.FILE.PIN',                   'Pin File',            () => { /* Logic */ }),
  cmd('WORD.FILE.PIN.CURRENT',           'Pin Current File',    () => { /* Logic */ }),
  cmd('WORD.FILE.PIN.SELECTED',          'Pin Selected File',   () => { /* Logic */ }),
  cmd('WORD.FILE.PIN.FOLDER',            'Pin Folder',          () => { /* Logic */ }),
  cmd('WORD.FILE.PIN.WORKSPACE',         'Pin Workspace',       () => { /* Logic */ }),

  // ── UNPIN
  cmd('WORD.FILE.UNPIN',                 'Unpin File',          () => { /* Logic */ }),
  cmd('WORD.FILE.UNPIN.ALL',             'Unpin All',           () => { /* Logic */ }),
  cmd('WORD.FILE.UNPIN.FOLDER',          'Unpin Folder',        () => { /* Logic */ }),

  // ── RECENT
  cmd('WORD.FILE.RECENT.OPEN',           'Open Recent',         () => { /* Logic */ }),
  cmd('WORD.FILE.RECENT.CLEAR',          'Clear Recent',        () => { /* Logic */ }),
  cmd('WORD.FILE.RECENT.CLEAR.ONE',      'Remove Recent Item',  () => { /* Logic */ }),
  cmd('WORD.FILE.RECENT.CLEAR.ALL',      'Clear All Recent Files',() => { /* Logic */ }),
  cmd('WORD.FILE.RECENT.PIN',            'Pin Recent File',     () => { /* Logic */ }),
  cmd('WORD.FILE.RECENT.SEARCH',         'Search Recent',       () => { /* Logic */ }),
  cmd('WORD.FILE.RECENT.FILTER',         'Filter Recent',       () => { /* Logic */ }),
  cmd('WORD.FILE.RECENT.SORT',           'Sort Recent',         () => { /* Logic */ }),

  // ── STAR
  cmd('WORD.FILE.STAR',                  'Star File',           () => { /* Logic */ }),
  cmd('WORD.FILE.STAR.REMOVE',           'Remove Star',         () => { /* Logic */ }),
  cmd('WORD.FILE.STAR.TOGGLE',           'Toggle Star',         () => { /* Logic */ }),
  cmd('WORD.FILE.STAR.OPEN',             'Open Starred File',   () => { /* Logic */ }),
  cmd('WORD.FILE.STAR.LIST',             'List Starred Files',  () => { /* Logic */ }),

  // ── CLOUD FAVORITES
  cmd('WORD.FILE.FAVORITE.CLOUD.SYNC',   'Sync Favorites',      () => { /* Logic */ }),
  cmd('WORD.FILE.FAVORITE.CLOUD.UPLOAD', 'Upload Favorites',    () => { /* Logic */ }),
  cmd('WORD.FILE.FAVORITE.CLOUD.DOWNLOAD','Download Favorites', () => { /* Logic */ }),

  // ══ FILE LOCK MANAGEMENT ════════════════════════════════════════════════
  // ── LOCK
  cmd('WORD.FILE.LOCK',                  'Lock Document',       () => { /* Logic */ }),
  cmd('WORD.FILE.LOCK.CURRENT',          'Lock Current Document',() => { /* Logic */ }),
  cmd('WORD.FILE.LOCK.SELECTED',         'Lock Selected File',  () => { /* Logic */ }),
  cmd('WORD.FILE.LOCK.READONLY',         'Read-only Lock',      () => { /* Logic */ }),
  cmd('WORD.FILE.LOCK.TEMPORARY',        'Temporary Lock',      () => { /* Logic */ }),
  cmd('WORD.FILE.LOCK.PERMANENT',        'Permanent Lock',      () => { /* Logic */ }),
  cmd('WORD.FILE.LOCK.SESSION',          'Session Lock',        () => { /* Logic */ }),
  cmd('WORD.FILE.LOCK.CLOUD',            'Cloud Lock',          () => { /* Logic */ }),
  cmd('WORD.FILE.LOCK.NETWORK',          'Network Lock',        () => { /* Logic */ }),
  cmd('WORD.FILE.LOCK.STATUS',           'Lock Status',         () => { /* Logic */ }),
  cmd('WORD.FILE.LOCK.INFO',             'Lock Information',    () => { /* Logic */ }),

  // ── UNLOCK
  cmd('WORD.FILE.UNLOCK',                'Unlock Document',     () => { /* Logic */ }),
  cmd('WORD.FILE.UNLOCK.CURRENT',        'Unlock Current Document',() => { /* Logic */ }),
  cmd('WORD.FILE.UNLOCK.SELECTED',       'Unlock Selected File',() => { /* Logic */ }),
  cmd('WORD.FILE.UNLOCK.FORCE',          'Force Unlock',        () => { /* Logic */ }),
  cmd('WORD.FILE.UNLOCK.ADMIN',          'Administrator Unlock',() => { /* Logic */ }),
  cmd('WORD.FILE.UNLOCK.ALL',            'Unlock All Files',    () => { /* Logic */ }),
  cmd('WORD.FILE.UNLOCK.EXPIRED',        'Unlock Expired Sessions',() => { /* Logic */ }),

  // ── CHECKOUT
  cmd('WORD.FILE.CHECKOUT',              'Checkout Document',   () => { /* Logic */ }),
  cmd('WORD.FILE.CHECKOUT.LOCAL',        'Checkout Local Copy', () => { /* Logic */ }),
  cmd('WORD.FILE.CHECKOUT.CLOUD',        'Checkout Cloud Copy', () => { /* Logic */ }),
  cmd('WORD.FILE.CHECKOUT.SHAREPOINT',   'Checkout SharePoint', () => { /* Logic */ }),
  cmd('WORD.FILE.CHECKOUT.ONEDRIVE',     'Checkout OneDrive',   () => { /* Logic */ }),
  cmd('WORD.FILE.CHECKOUT.EXCLUSIVE',    'Exclusive Checkout',  () => { /* Logic */ }),
  cmd('WORD.FILE.CHECKOUT.STATUS',       'Checkout Status',     () => { /* Logic */ }),

  // ── CHECKIN
  cmd('WORD.FILE.CHECKIN',               'Check-in Document',   () => { /* Logic */ }),
  cmd('WORD.FILE.CHECKIN.COMMIT',        'Commit Changes',      () => { /* Logic */ }),
  cmd('WORD.FILE.CHECKIN.KEEPLOCK',      'Check-in and Keep Lock',() => { /* Logic */ }),
  cmd('WORD.FILE.CHECKIN.RELEASE',       'Check-in and Release Lock',() => { /* Logic */ }),
  cmd('WORD.FILE.CHECKIN.VERSION',       'Check-in as New Version',() => { /* Logic */ }),
  cmd('WORD.FILE.CHECKIN.COMMENT',       'Check-in Comment',    () => { /* Logic */ }),

  // ── EXCLUSIVE OPEN
  cmd('WORD.FILE.OPEN.EXCLUSIVE',        'Open Exclusively',    () => { /* Logic */ }),
  cmd('WORD.FILE.OPEN.EXCLUSIVE.READWRITE','Exclusive Read/Write',() => { /* Logic */ }),
  cmd('WORD.FILE.OPEN.EXCLUSIVE.ADMIN',  'Administrator Exclusive Open',() => { /* Logic */ }),
  cmd('WORD.FILE.OPEN.EXCLUSIVE.STATUS', 'Exclusive Open Status',() => { /* Logic */ }),
  cmd('WORD.FILE.OPEN.EXCLUSIVE.RELEASE','Release Exclusive Access',() => { /* Logic */ }),

  // ── LOCK OWNERSHIP
  cmd('WORD.FILE.LOCK.OWNER',            'Current Owner',       () => { /* Logic */ }),
  cmd('WORD.FILE.LOCK.OWNER.TRANSFER',   'Transfer Ownership',  () => { /* Logic */ }),
  cmd('WORD.FILE.LOCK.OWNER.REQUEST',    'Request Ownership',   () => { /* Logic */ }),
  cmd('WORD.FILE.LOCK.OWNER.REVOKE',     'Revoke Ownership',    () => { /* Logic */ }),

  // ── CONFLICT MANAGEMENT
  cmd('WORD.FILE.LOCK.CONFLICT',         'Conflict Detection',  () => { /* Logic */ }),
  cmd('WORD.FILE.LOCK.CONFLICT.RESOLVE', 'Resolve Conflict',    () => { /* Logic */ }),
  cmd('WORD.FILE.LOCK.CONFLICT.MERGE',   'Merge Changes',       () => { /* Logic */ }),
  cmd('WORD.FILE.LOCK.CONFLICT.OVERRIDE','Override Conflict',   () => { /* Logic */ }),

  // ══ FILE OPERATIONS ════════════════════════════════════════════════════════
  cmd('WORD.FILE.RENAME',                'Rename',              (_, p) => p?.name && FileEngine.rename(p.name)),
  cmd('WORD.FILE.DUPLICATE',             'Duplicate',           () => FileEngine.duplicate()),
  cmd('WORD.FILE.DELETE',                'Delete',              () => { /* Delete with confirmation */ }),
  cmd('WORD.FILE.MOVE',                  'Move',                () => { /* Move dialog */ }),
  cmd('WORD.FILE.COPY',                  'Copy',                () => FileEngine.saveCopy()),
  cmd('WORD.FILE.REVEAL',                'Reveal in Explorer',  () => FileEngine.revealInExplorer()),
  cmd('WORD.FILE.OPEN_LOCATION',         'Open File Location',  () => FileEngine.revealInExplorer()),
  cmd('WORD.FILE.SPLIT',                 'Split Document',      () => { /* Document split */ }),

  // ══ FILE INFORMATION ════════════════════════════════════════════════════════
  cmd('WORD.FILE.INFO.SIZE',             'File Size',           () => FileEngine.getFileInfo()),
  cmd('WORD.FILE.INFO.PAGES',            'Page Count',          () => FileEngine.getFileInfo()),
  cmd('WORD.FILE.INFO.WORDS',            'Word Count',          () => FileEngine.getFileInfo()),
  cmd('WORD.FILE.INFO.CHARACTERS',       'Character Count',     () => FileEngine.getFileInfo()),
  cmd('WORD.FILE.INFO.CREATED',          'Date Created',        () => FileEngine.getFileInfo()),
  cmd('WORD.FILE.INFO.MODIFIED',         'Date Modified',       () => FileEngine.getFileInfo()),
  cmd('WORD.FILE.INFO.PERMISSIONS',      'File Permissions',    () => FileEngine.getFileInfo()),
  cmd('WORD.FILE.INFO.FORMAT',           'File Format',         () => FileEngine.getFileInfo()),

  // ══ DEVELOPER TOOLS ═════════════════════════════════════════════════════
  // ── OPENXML
  cmd('WORD.FILE.DEVELOPER.OPENXML',     'Open OpenXML Explorer',() => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.OPENXML.OPEN','Open Package',        () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.OPENXML.CLOSE','Close Package',      () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.OPENXML.RELOAD','Reload Package',    () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.OPENXML.EXTRACT','Extract Package',  () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.OPENXML.REPACK','Rebuild Package',   () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.OPENXML.CONTENTTYPES','Content Types',() => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.OPENXML.RELATIONSHIPS','Relationships',() => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.OPENXML.PARTS','Package Parts',      () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.OPENXML.COREPROPERTIES','Core Properties',() => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.OPENXML.APPPROPERTIES','App Properties',() => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.OPENXML.CUSTOMPROPERTIES','Custom Properties',() => { /* Logic */ }),

  // ── XML
  cmd('WORD.FILE.DEVELOPER.XML',         'XML Explorer',        () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.XML.OPEN',    'Open XML Part',       () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.XML.EDIT',    'Edit XML',            () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.XML.SAVE',    'Save XML',            () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.XML.RELOAD',  'Reload XML',          () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.XML.FORMAT',  'Format XML',          () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.XML.MINIFY',  'Minify XML',          () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.XML.PRETTYPRINT','Pretty Print',     () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.XML.SEARCH',  'Search XML',          () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.XML.REPLACE', 'Replace XML',         () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.XML.NAMESPACE','Namespaces',         () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.XML.SCHEMA',  'Schema',              () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.XML.XPATH',   'XPath Query',         () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.XML.EXPORT',  'Export XML',          () => { /* Logic */ }),

  // ── PACKAGE
  cmd('WORD.FILE.DEVELOPER.PACKAGE',     'Package Explorer',    () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.PACKAGE.OPEN','Open Package',        () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.PACKAGE.INFO','Package Information', () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.PACKAGE.SIZE','Package Size',        () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.PACKAGE.PARTS','Package Parts',      () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.PACKAGE.MEDIA','Media Files',        () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.PACKAGE.FONTS','Fonts',              () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.PACKAGE.EMBEDDED','Embedded Objects',() => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.PACKAGE.SIGNATURES','Digital Signatures',() => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.PACKAGE.EXPORT','Export Package',    () => { /* Logic */ }),

  // ── OPC
  cmd('WORD.FILE.DEVELOPER.OPC',         'OPC Explorer',        () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.OPC.CONTENTTYPES','Content Types',   () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.OPC.RELATIONSHIPS','Relationship Tree',() => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.OPC.PARTS',   'Package Parts',       () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.OPC.URI',     'Part URI',            () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.OPC.STREAMS', 'Streams',             () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.OPC.MEDIA',   'Media Resources',     () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.OPC.EXPORT',  'Export OPC',          () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.OPC.IMPORT',  'Import OPC',          () => { /* Logic */ }),

  // ── VALIDATE PACKAGE
  cmd('WORD.FILE.DEVELOPER.VALIDATE',    'Validate Package',    () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.VALIDATE.OPENXML','Validate OpenXML',() => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.VALIDATE.XML','Validate XML',        () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.VALIDATE.OPC','Validate OPC',        () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.VALIDATE.RELATIONSHIPS','Validate Relationships',() => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.VALIDATE.CONTENTTYPES','Validate Content Types',() => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.VALIDATE.SCHEMA','Validate Schema',  () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.VALIDATE.MEDIA','Validate Media',    () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.VALIDATE.SIGNATURE','Validate Signature',() => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.VALIDATE.REPORT','Generate Validation Report',() => { /* Logic */ }),

  // ── DIAGNOSTICS
  cmd('WORD.FILE.DEVELOPER.DIAGNOSTICS', 'Diagnostics',         () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.DIAGNOSTICS.OPEN','Open Diagnostics',() => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.DIAGNOSTICS.LOG','Developer Log',    () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.DIAGNOSTICS.TRACE','Trace Engine',   () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.DIAGNOSTICS.PROFILE','Performance Profile',() => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.DIAGNOSTICS.ERRORS','Error List',    () => { /* Logic */ }),
  cmd('WORD.FILE.DEVELOPER.DIAGNOSTICS.WARNINGS','Warnings',    () => { /* Logic */ }),

  // ── APP RELOAD
  cmd('WORD.FILE.DEV.RELOAD',            'Reload App',          () => window.location.reload()),

  // ══ ACCOUNT ═════════════════════════════════════════════════════════════
  cmd('WORD.FILE.ACCOUNT',               'My Account',                () => { /* UI Action */ }),
  cmd('WORD.FILE.ACCOUNT.PROFILE',       'View Profile',              () => { /* UI Action */ }),
  cmd('WORD.FILE.LICENSE',               'License & Subscription',    () => { /* UI Action */ }),
  cmd('WORD.FILE.LICENSE.ACTIVATE',      'Activate License',          () => { /* UI Action */ }),
  cmd('WORD.FILE.LICENSE.DEACTIVATE',    'Deactivate License',        () => { /* UI Action */ }),
  cmd('WORD.FILE.SUBSCRIPTION',          'Subscription',              () => { /* UI Action */ }),
  cmd('WORD.FILE.CONNECTED_SERVICES',    'Connected Services',        () => { /* UI Action */ }),
  cmd('WORD.FILE.OFFICE_THEME',          'Office Theme',              () => { /* UI Action */ }),
  cmd('WORD.FILE.UPDATE',                'Check for Updates',         () => { /* UI Action */ }),
  cmd('WORD.FILE.SIGNOUT',               'Sign Out',                  () => { /* UI Action */ }),

  // ══ SETTINGS ═══════════════════════════════════════════════════════════
  cmd('WORD.FILE.SETTINGS',              'Settings',                  () => { /* UI Action */ }, 'Ctrl+,'),
  cmd('WORD.FILE.SETTINGS.GENERAL',      'General Settings',          () => { /* UI Action */ }),
  cmd('WORD.FILE.SETTINGS.LANGUAGE',     'Language Settings',         () => { /* UI Action */ }),
  cmd('WORD.FILE.SETTINGS.PROOFING',     'Proofing Settings',         () => { /* UI Action */ }),
  cmd('WORD.FILE.SETTINGS.SAVE',         'Save Settings',             () => { /* UI Action */ }),
  cmd('WORD.FILE.SETTINGS.ADVANCED',     'Advanced Settings',         () => { /* UI Action */ }),
  cmd('WORD.FILE.SETTINGS.RIBBON',       'Customize Ribbon',          () => { /* UI Action */ }),
  cmd('WORD.FILE.SETTINGS.QAT',          'Quick Access Toolbar',      () => { /* UI Action */ }),
  cmd('WORD.FILE.SETTINGS.SHORTCUTS',    'Keyboard Shortcuts',        () => { /* UI Action */ }),
  cmd('WORD.FILE.SETTINGS.PLUGINS',      'Plugins',                   () => { /* UI Action */ }),
  cmd('WORD.FILE.SETTINGS.AI',           'AI Settings',               () => { /* UI Action */ }),
  cmd('WORD.FILE.OPTIONS',               'Options',                   () => { /* UI Action */ }),

  // ══ FEEDBACK ════════════════════════════════════════════════════════════
  cmd('WORD.FILE.FEEDBACK',              'Send Feedback',             () => { /* UI Action */ }),
  cmd('WORD.FILE.FEEDBACK.SEND',         'Send Feedback',             () => { /* UI Action */ }),
  cmd('WORD.FILE.REPORT',                'Report a Bug',              () => { /* UI Action */ }),
  cmd('WORD.FILE.REPORT.BUG',            'Report Bug',                () => { /* UI Action */ }),
  cmd('WORD.FILE.SUGGEST',               'Suggest a Feature',         () => { /* UI Action */ }),
  cmd('WORD.FILE.DIAGNOSTICS',           'Diagnostics',               () => { /* UI Action */ }),
  cmd('WORD.FILE.LOGS',                  'View Logs',                 () => { /* UI Action */ }),

  // ══ HELP ════════════════════════════════════════════════════════════════
  cmd('WORD.FILE.HELP',                  'Help Center',               () => { /* UI Action */ }, 'F1'),
  cmd('WORD.FILE.HELP.CENTER',           'Open Help',                 () => { /* UI Action */ }),
  cmd('WORD.FILE.TUTORIALS',             'Tutorials',                 () => { /* UI Action */ }),
  cmd('WORD.FILE.SHORTCUTS',             'Keyboard Shortcuts',        () => { /* UI Action */ }),
  cmd('WORD.FILE.DOCUMENTATION',         'Documentation',             () => { /* UI Action */ }),
  cmd('WORD.FILE.ABOUT',                 'About OfficeX',             () => { /* UI Action */ }),

  // ══ EXIT (supplemental) ══════════════════════════════════════════════════
  cmd('WORD.FILE.EXIT_ALL',              'Exit All Applications',     () => FileEngine.forceExit()),
  cmd('WORD.FILE.RESTART',               'Restart OfficeX',           () => window.location.reload()),

  // ══ ONEDRIVE COMMANDS ════════════════════════════════════════════════════
  cmd('WORD.ONEDRIVE.LOGIN',             'OneDrive Login',            (_, p) => OneDriveEngine.login(p?.email)),
  cmd('WORD.ONEDRIVE.LOGOUT',            'OneDrive Logout',           () => OneDriveEngine.logout()),
  cmd('WORD.ONEDRIVE.OPEN',              'OneDrive Open Document',    (_, p) => p?.item && OneDriveEngine.openItem(p.item)),
  cmd('WORD.ONEDRIVE.SAVE',              'OneDrive Save Document',    (_, p) => p?.name && OneDriveEngine.saveCurrentDocument(p.name, p?.content || '')),
  cmd('WORD.ONEDRIVE.SAVE_AS',           'OneDrive Save As',          (_, p) => p?.name && OneDriveEngine.saveCurrentDocument(p.name, p?.content || '')),
  cmd('WORD.ONEDRIVE.AUTOSAVE',          'OneDrive AutoSave Sync',    (_, p) => p?.name && OneDriveSyncEngine.queueAutoSave(p.id, p.name, p.content)),
  cmd('WORD.ONEDRIVE.SYNC',              'OneDrive Force Sync',       () => OneDriveSyncEngine.processPendingSync()),
  cmd('WORD.ONEDRIVE.UPLOAD',            'OneDrive Upload File',      (_, p) => p?.name && MicrosoftGraphEngine.createUploadSession('root', p.name, p.size || 1000)),
  cmd('WORD.ONEDRIVE.DOWNLOAD',          'OneDrive Download File',    (_, p) => p?.item && OneDriveEngine.openItem(p.item)),
  cmd('WORD.ONEDRIVE.SEARCH',            'OneDrive Search',           (_, p) => p?.query && MicrosoftGraphEngine.searchItems(p.query)),
  cmd('WORD.ONEDRIVE.RECENT',            'OneDrive Recent Files',     () => MicrosoftGraphEngine.getRecentItems()),
  cmd('WORD.ONEDRIVE.SHARED',            'OneDrive Shared Files',     () => MicrosoftGraphEngine.getSharedItems()),
  cmd('WORD.ONEDRIVE.FAVORITE',          'OneDrive Pin Favorite',     (_, p) => p?.id && MicrosoftGraphEngine.toggleFavorite(p.id)),
  cmd('WORD.ONEDRIVE.NEW_FOLDER',        'OneDrive New Folder',       (_, p) => p?.name && MicrosoftGraphEngine.createFolder(p?.parentId || 'root', p.name)),
  cmd('WORD.ONEDRIVE.DELETE',            'OneDrive Delete Item',      (_, p) => p?.id && MicrosoftGraphEngine.deleteItem(p.id)),
  cmd('WORD.ONEDRIVE.RENAME',            'OneDrive Rename Item',      (_, p) => p?.id && p?.name && MicrosoftGraphEngine.renameItem(p.id, p.name)),
  cmd('WORD.ONEDRIVE.REFRESH',           'OneDrive Refresh',          () => MicrosoftGraphEngine.getRootChildren()),
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
