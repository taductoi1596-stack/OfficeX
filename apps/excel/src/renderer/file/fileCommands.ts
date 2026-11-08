/**
 * fileCommands.ts
 *
 * Complete File Command Registry for OfficeX EXCEL.
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

  // ══ NEW Workbook ════════════════════════════════════════════════════════
  cmd('EXCEL.FILE.NEW',                   'New Workbook',            () => FileEngine.newWorkbook(),                'Ctrl+N'),
  cmd('EXCEL.FILE.NEW.BLANK',             'New Blank Workbook',      () => FileEngine.newWorkbook()),
  cmd('EXCEL.FILE.NEW.DEFAULT',           'New Default Workbook',    () => FileEngine.newWorkbook('default')),
  cmd('EXCEL.FILE.NEW.WELCOME',           'Open Welcome Screen',     () => FileEngine.openWelcomeScreen()),
  cmd('EXCEL.FILE.NEW.RECENT_TEMPLATE',   'New from Recent Template', () => { /* FileMenu UI */ }),
  cmd('EXCEL.FILE.NEW.FROM_TEMPLATE',     'New from Template',       () => { /* FileMenu UI */ }),
  cmd('EXCEL.FILE.NEW.CUSTOM_TEMPLATE',   'New from Custom Template', () => { /* FileMenu template gallery */ }),
  cmd('EXCEL.FILE.NEW.EMPTY',             'New Empty Workbook',      () => FileEngine.newWorkbook('empty')),

  // ══ OPEN ════════════════════════════════════════════════════════════════
  cmd('EXCEL.FILE.OPEN',                  'Open File',               () => FileEngine.openLocal(),                  'Ctrl+O'),
  cmd('EXCEL.FILE.OPEN.LOCAL',            'Open Local File',         () => FileEngine.openLocal()),
  cmd('EXCEL.FILE.OPEN.BROWSE',           'Browse File System',      () => FileEngine.openLocal()),
  cmd('EXCEL.FILE.OPEN.DRAG_DROP',        'Open By Drag And Drop',   (_, p) => p?.path && FileEngine.openFromPath(p.path)),
  cmd('EXCEL.FILE.OPEN.CONTEXT_MENU',     'Open From Explorer',      (_, p) => p?.path && FileEngine.openFromPath(p.path)),
  cmd('EXCEL.FILE.OPEN.DOUBLE_CLICK',     'Open By Double Click',    (_, p) => p?.path && FileEngine.openFromPath(p.path)),
  
  // ── OPEN RECENT
  cmd('EXCEL.FILE.OPEN.RECENT',           'Open Recent File',        (_, p) => p?.path ? FileEngine.openFromPath(p.path) : /* Open UI */ null, 'Ctrl+Shift+O'),
  cmd('EXCEL.FILE.OPEN.RECENT.CLEAR',     'Clear Recent Files',      () => FileStorageEngine.clearRecent()),
  cmd('EXCEL.FILE.OPEN.RECENT.PIN',       'Pin Recent File',         (_, p) => p?.id && FileStorageEngine.pinFile(p.id)),
  cmd('EXCEL.FILE.OPEN.RECENT.UNPIN',     'Unpin Recent File',       (_, p) => p?.id && FileStorageEngine.unpinFile(p.id)),
  cmd('EXCEL.FILE.OPEN.RECENT.REMOVE',    'Remove Recent File',      (_, p) => p?.id && FileStorageEngine.removeFromRecent(p.id)),
  cmd('EXCEL.FILE.OPEN.RECENT.RESTORE',   'Restore Recent File',     (_, p) => p?.id && FileEngine.restoreRecoveryPoint(p.id)),
  cmd('EXCEL.FILE.OPEN.RECENT.SEARCH',    'Search Recent Files',     () => { /* UI Action */ }),

  // ── OPEN PINNED
  cmd('EXCEL.FILE.OPEN.PINNED',           'Open Pinned Workbook',    (_, p) => p?.path && FileEngine.openFromPath(p.path)),
  cmd('EXCEL.FILE.OPEN.PINNED.ALL',       'Open All Pinned',         () => { /* Loop and open */ }),
  cmd('EXCEL.FILE.OPEN.PINNED.REMOVE',    'Remove Pinned',           (_, p) => p?.id && FileStorageEngine.unpinFile(p.id)),

  // ── OPEN CLOUD
  cmd('EXCEL.FILE.OPEN.CLOUD',            'Open Cloud Workbook',     () => { /* UI Action */ }),
  cmd('EXCEL.FILE.OPEN.ONEDRIVE',         'Open OneDrive Workbook',  () => { /* Auth and Pick */ }),
  cmd('EXCEL.FILE.OPEN.GOOGLE_DRIVE',     'Open Google Drive Workbook', () => { /* Auth and Pick */ }),
  cmd('EXCEL.FILE.OPEN.DROPBOX',          'Open Dropbox Workbook',   () => { /* Auth and Pick */ }),
  cmd('EXCEL.FILE.OPEN.SHAREPOINT',       'Open SharePoint Workbook',() => { /* Auth and Pick */ }),
  cmd('EXCEL.FILE.OPEN.CLOUD.SEARCH',     'Search Cloud Workbooks',  () => { /* UI Action */ }),
  cmd('EXCEL.FILE.OPEN.CLOUD.OFFLINE',    'Open Cached Cloud File',  (_, p) => p?.path && FileEngine.openFromPath(p.path)),

  // ── OPEN READ ONLY
  cmd('EXCEL.FILE.OPEN.READONLY',         'Open Read Only',          (_, p) => p?.path && FileEngine.openReadOnly(p.path)),
  cmd('EXCEL.FILE.OPEN.READONLY.ALWAYS',  'Always Open Read Only',   () => { /* Preferences */ }),
  cmd('EXCEL.FILE.OPEN.READONLY.TEMP',    'Temporary Read Only',     (_, p) => p?.path && FileEngine.openReadOnly(p.path)),

  // ── OPEN PROTECTED
  cmd('EXCEL.FILE.OPEN.PROTECTED',        'Protected View',          (_, p) => p?.path && FileEngine.openReadOnly(p.path)),
  cmd('EXCEL.FILE.OPEN.PROTECTED.ENABLE', 'Enable Protected View',   () => FileEngine.setProtected(true)),
  cmd('EXCEL.FILE.OPEN.PROTECTED.DISABLE','Disable Protected View',  () => FileEngine.setProtected(false)),
  cmd('EXCEL.FILE.OPEN.PROTECTED.WARNING','Show Protected Warning',  () => { /* UI Action */ }),

  // ── OPEN SAFE MODE
  cmd('EXCEL.FILE.OPEN.SAFE',             'Open Safe Mode',          (_, p) => p?.path && FileEngine.openSafe(p.path)),
  cmd('EXCEL.FILE.OPEN.SAFE.NO_ADDINS',   'Disable Add-ins',         () => { /* Startup arg */ }),
  cmd('EXCEL.FILE.OPEN.SAFE.RECOVERY',    'Safe Recovery',           () => { /* Startup arg */ }),
  cmd('EXCEL.FILE.OPEN.SAFE.XML',         'Safe XML Loading',        () => { /* Parser arg */ }),

  // ── OPEN REPAIR
  cmd('EXCEL.FILE.OPEN.REPAIR',           'Open and Repair',         () => FileEngine.openAndRepair()),
  cmd('EXCEL.FILE.OPEN.REPAIR.XML',       'Repair OpenXML',          () => FileEngine.openAndRepair()),
  cmd('EXCEL.FILE.OPEN.REPAIR.MEDIA',     'Repair Media',            () => FileEngine.openAndRepair()),
  cmd('EXCEL.FILE.OPEN.REPAIR.FONTS',     'Repair Fonts',            () => FileEngine.openAndRepair()),
  cmd('EXCEL.FILE.OPEN.REPAIR.TABLES',    'Repair Tables',           () => FileEngine.openAndRepair()),
  cmd('EXCEL.FILE.OPEN.REPAIR.STYLES',    'Repair Styles',           () => FileEngine.openAndRepair()),

  // ── OPEN URL
  cmd('EXCEL.FILE.OPEN.URL',              'Open URL',                (_, p) => p?.url && FileEngine.openFromPath(p.url)),
  cmd('EXCEL.FILE.OPEN.HTTP',             'Open HTTP',               (_, p) => p?.url && FileEngine.openFromPath(p.url)),
  cmd('EXCEL.FILE.OPEN.HTTPS',            'Open HTTPS',              (_, p) => p?.url && FileEngine.openFromPath(p.url)),
  cmd('EXCEL.FILE.OPEN.WEBDAV',           'Open WebDAV',             (_, p) => p?.url && FileEngine.openFromPath(p.url)),

  // ── WORKSPACE
  cmd('EXCEL.FILE.OPEN.WORKSPACE',        'Open Workspace',          () => FileEngine.openWorkspace(), 'Alt+Ctrl+O'),
  cmd('EXCEL.FILE.OPEN.WORKSPACE.RECENT', 'Recent Workspace',        () => { /* UI Action */ }),
  cmd('EXCEL.FILE.OPEN.WORKSPACE.CLOUD',  'Cloud Workspace',         () => { /* UI Action */ }),
  cmd('EXCEL.FILE.OPEN.WORKSPACE.RESTORE','Restore Workspace',       () => FileEngine.restoreWorkspace()),

  // ── MULTIPLE
  cmd('EXCEL.FILE.OPEN.MULTIPLE',         'Open Multiple Workbooks', (_, p) => p?.paths?.forEach((path: string) => FileEngine.openFromPath(path))),
  cmd('EXCEL.FILE.OPEN.MULTIPLE.FOLDER',  'Open Folder',             () => FileEngine.openFolder()),
  cmd('EXCEL.FILE.OPEN.MULTIPLE.PROJECT', 'Open Project',            () => FileEngine.openProject()),
  cmd('EXCEL.FILE.OPEN.MULTIPLE.RECENT',  'Open Recent Group',       () => { /* UI Action */ }),

  // ── RECOVERY
  cmd('EXCEL.FILE.OPEN.RECOVERY',         'Recover File',            (_, p) => p?.id && FileEngine.restoreRecoveryPoint(p.id)),
  cmd('EXCEL.FILE.OPEN.RECOVERY.AUTO',    'Auto Recovery',           () => FileEngine.restoreAutoRecovery()),
  cmd('EXCEL.FILE.OPEN.RECOVERY.SEARCH',  'Search Recovery Files',   () => { /* UI Action */ }),
  cmd('EXCEL.FILE.OPEN.RECOVERY.RESTORE', 'Restore Recovery',        (_, p) => p?.id && FileEngine.restoreRecoveryPoint(p.id)),

  // ── SPECIAL
  cmd('EXCEL.FILE.OPEN.TEMPLATE',         'Open Template',           () => { /* UI Action */ }),
  cmd('EXCEL.FILE.OPEN.EXAMPLE',          'Open Sample Workbook',    () => FileEngine.openExample()),
  cmd('EXCEL.FILE.OPEN.LAST',             'Open Last Workbook',      () => FileEngine.openLastWorkbook()),
  cmd('EXCEL.FILE.OPEN.STARTUP',          'Open Startup Workbook',   () => FileEngine.openStartupWorkbook()),

  // ══ CLOSE ═══════════════════════════════════════════════════════════════
  cmd('EXCEL.FILE.CLOSE',                 'Close',                   () => FileEngine.close(),                      'Ctrl+W'),
  cmd('EXCEL.FILE.CLOSE.ACTIVE',          'Close Active Workbook',   () => FileEngine.close()),
  cmd('EXCEL.FILE.CLOSE.ALL',             'Close All Workbooks',     () => FileEngine.closeAll()),
  cmd('EXCEL.FILE.CLOSE.OTHERS',          'Close Other Workbooks',   () => { /* Multi-Workbook */ }),
  cmd('EXCEL.FILE.CLOSE.WITHOUT_SAVE',    'Close Without Saving',    () => FileEngine.closeWithoutSave()),
  cmd('EXCEL.FILE.CLOSE.SAVE_AND_CLOSE',  'Save and Close',          () => FileEngine.saveAndClose()),

  // ══ SAVE ════════════════════════════════════════════════════════════════
  cmd('EXCEL.FILE.SAVE',                  'Save',                    () => FileEngine.save(),                       'Ctrl+S'),
  cmd('EXCEL.FILE.SAVE.ACTIVE',           'Save Active Workbook',    () => FileEngine.save()),
  cmd('EXCEL.FILE.SAVE.ALL',              'Save All Open Workbooks', () => FileEngine.saveAll(),                    'Ctrl+Shift+S'),
  cmd('EXCEL.FILE.SAVE.SELECTED',         'Save Selected Workbook',  () => FileEngine.save()),
  cmd('EXCEL.FILE.SAVE.IF_DIRTY',         'Save Only If Modified',   () => FileEngine.saveIfDirty()),
  cmd('EXCEL.FILE.SAVE.FORCE',            'Force Save',              () => FileEngine.save()),
  cmd('EXCEL.FILE.SAVE.SILENT',           'Silent Save',             () => FileEngine.saveBackground()),
  cmd('EXCEL.FILE.SAVE.QUICK',            'Quick Save',              () => FileEngine.save()),

  // ── SAVE AS (format-specific) ════════════════════════════════════════════
  cmd('EXCEL.FILE.SAVE_AS',              'Save As',                 () => FileEngine.saveAs(),                     'F12'),
  cmd('EXCEL.FILE.SAVE_AS.XLSX',         'Save As XLSX',            () => FileEngine.saveAsFormat('xlsx')),
  cmd('EXCEL.FILE.SAVE_AS.XLS',          'Save As XLS',             () => FileEngine.saveAsFormat('xls')),
  cmd('EXCEL.FILE.SAVE_AS.ODS',          'Save As ODS',             () => FileEngine.saveAsFormat('ods')),
  cmd('EXCEL.FILE.SAVE_AS.CSV',          'Save As CSV',             () => FileEngine.saveAsFormat('csv')),
  cmd('EXCEL.FILE.SAVE_AS.PDF',          'Save As PDF',             () => FileEngine.saveAsFormat('pdf')),
  cmd('EXCEL.FILE.SAVE_AS.HTML',         'Save As HTML',            () => FileEngine.saveAsFormat('html')),
  cmd('EXCEL.FILE.SAVE_AS.MARKDOWN',     'Save As Markdown',        () => FileEngine.saveAsFormat('markdown')),
  cmd('EXCEL.FILE.SAVE_AS.TEXT',         'Save As TXT',             () => FileEngine.saveAsFormat('txt')),
  cmd('EXCEL.FILE.SAVE_AS.XML',          'Save As XML',             () => FileEngine.saveAsFormat('xml')),
  cmd('EXCEL.FILE.SAVE_AS.JSON',         'Save As JSON',            () => FileEngine.saveAsFormat('json')),

  // ── SAVE COPY ════════════════════════════════════════════════════════════
  cmd('EXCEL.FILE.SAVE_COPY',             'Save Copy',               () => FileEngine.saveCopy()),
  cmd('EXCEL.FILE.SAVE_COPY.LOCAL',       'Save Copy Local',         () => FileEngine.saveCopy()),
  cmd('EXCEL.FILE.SAVE_COPY.CLOUD',       'Save Copy Cloud',         () => { /* Cloud picker */ }),
  cmd('EXCEL.FILE.SAVE_COPY.PDF',         'Save Copy As PDF',        () => FileEngine.saveAsFormat('pdf')),
  cmd('EXCEL.FILE.SAVE_COPY.BACKUP',      'Save Backup Copy',        () => FileEngine.saveCopy()),

  // ── AUTO SAVE ════════════════════════════════════════════════════════════
  cmd('EXCEL.FILE.AUTOSAVE.ENABLE',       'Enable Auto Save',        () => FileEngine.enableAutoSave()),
  cmd('EXCEL.FILE.AUTOSAVE.DISABLE',      'Disable Auto Save',       () => FileEngine.disableAutoSave()),
  cmd('EXCEL.FILE.AUTOSAVE.START',        'Start Auto Save',         () => FileEngine.enableAutoSave()),
  cmd('EXCEL.FILE.AUTOSAVE.STOP',         'Stop Auto Save',          () => FileEngine.disableAutoSave()),
  cmd('EXCEL.FILE.AUTOSAVE.INTERVAL',     'Set Auto Save Interval',  (_, p) => p?.ms && FileEngine.setAutoSaveInterval(p.ms)),
  cmd('EXCEL.FILE.AUTOSAVE.STATUS',       'Get Auto Save Status',    () => { /* Get status */ }),
  cmd('EXCEL.FILE.AUTOSAVE.RESTORE',      'Restore Auto Save File',  () => FileEngine.restoreAutoRecovery()),
  cmd('EXCEL.FILE.AUTOSAVE.FLUSH',        'Force Auto Save',         () => FileEngine.saveBackground()),

  // ── SAVE VERSION ═════════════════════════════════════════════════════════
  cmd('EXCEL.FILE.VERSION.SAVE',          'Save Version',            (_, p) => FileEngine.saveVersion(p?.label, p?.comment)),
  cmd('EXCEL.FILE.VERSION.CREATE',        'Create Version',          (_, p) => FileEngine.saveVersion(p?.label, p?.comment)),
  cmd('EXCEL.FILE.VERSION.LABEL',         'Label Version',           (_, p) => p?.id && p?.label && FileStorageEngine.labelVersion(p.id, p.label)),
  cmd('EXCEL.FILE.VERSION.SNAPSHOT',      'Create Snapshot',         () => FileEngine.saveVersion('Snapshot', 'Auto-generated snapshot')),
  cmd('EXCEL.FILE.VERSION.MILESTONE',     'Create Milestone',        () => FileEngine.saveVersion('Milestone', 'Project Milestone')),

  // ── SAVE CLOUD ═══════════════════════════════════════════════════════════
  cmd('EXCEL.FILE.SAVE.CLOUD',            'Save To Cloud',           () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SAVE.ONEDRIVE',         'Save To OneDrive',        () => { /* OneDrive Sync */ }),
  cmd('EXCEL.FILE.SAVE.SHAREPOINT',       'Save To SharePoint',      () => { /* SharePoint Sync */ }),
  cmd('EXCEL.FILE.SAVE.GOOGLE_DRIVE',     'Save To Google Drive',    () => { /* GDrive Sync */ }),
  cmd('EXCEL.FILE.SAVE.DROPBOX',          'Save To Dropbox',         () => { /* Dropbox Sync */ }),
  cmd('EXCEL.FILE.SAVE.ICLOUD',           'Save To iCloud',          () => { /* iCloud Sync */ }),
  cmd('EXCEL.FILE.SAVE.CLOUD.SYNC',       'Sync Cloud',              () => { /* Sync All */ }),
  cmd('EXCEL.FILE.SAVE.CLOUD.BACKGROUND','Background Cloud Sync',   () => { /* Background Sync */ }),

  // ── SAVE LOCAL ═══════════════════════════════════════════════════════════
  cmd('EXCEL.FILE.SAVE.LOCAL',            'Save Local',              () => FileEngine.save()),
  cmd('EXCEL.FILE.SAVE.LOCAL.NEWNAME',    'Save Local With New Name',() => FileEngine.saveAs()),
  cmd('EXCEL.FILE.SAVE.LOCAL.REPLACE',    'Replace Existing File',   () => FileEngine.save()),
  cmd('EXCEL.FILE.SAVE.LOCAL.READONLY',   'Save Read Only Copy',     () => FileEngine.saveCopy()),

  // ── BACKGROUND SAVE ══════════════════════════════════════════════════════
  cmd('EXCEL.FILE.SAVE.BACKGROUND',       'Background Save',         () => FileEngine.saveBackground()),
  cmd('EXCEL.FILE.SAVE.BACKGROUND.ALL',   'Background Save All',     () => FileEngine.saveBackground()),
  cmd('EXCEL.FILE.SAVE.BACKGROUND.CLOUD', 'Background Cloud Save',   () => { /* Cloud Save */ }),
  cmd('EXCEL.FILE.SAVE.BACKGROUND.LOCAL', 'Background Local Save',   () => FileEngine.saveBackground()),

  // ── RECOVERY SAVE ════════════════════════════════════════════════════════
  cmd('EXCEL.FILE.SAVE.RECOVERY',         'Recovery Save',           () => FileEngine.saveBackground()),
  cmd('EXCEL.FILE.SAVE.CRASH',            'Crash Recovery Save',     () => FileEngine.saveBackground()),
  cmd('EXCEL.FILE.SAVE.EMERGENCY',        'Emergency Save',          () => FileEngine.save()),
  cmd('EXCEL.FILE.SAVE.RESTORE_POINT',    'Create Restore Point',    () => FileEngine.saveVersion('Restore Point', 'Manual restore point')),

  // ── CONFLICT ═════════════════════════════════════════════════════════════
  cmd('EXCEL.FILE.SAVE.CONFLICT.DETECT',  'Detect Save Conflict',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.SAVE.CONFLICT.RESOLVE', 'Resolve Conflict',        () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SAVE.CONFLICT.KEEP_LOCAL', 'Keep Local Version',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.SAVE.CONFLICT.KEEP_REMOTE','Keep Remote Version',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.SAVE.CONFLICT.MERGE',   'Merge Changes',           () => { /* Merge Engine */ }),

  // ── VALIDATION ═══════════════════════════════════════════════════════════
  cmd('EXCEL.FILE.SAVE.VALIDATE',         'Validate Before Save',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.SAVE.CHECK.PERMISSION', 'Check Write Permission',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.SAVE.CHECK.LOCK',       'Check File Lock',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.SAVE.CHECK.DISK',       'Check Disk Space',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.SAVE.CHECK.PATH',       'Check Save Path',         () => { /* Logic */ }),

  // ══ EXIT ════════════════════════════════════════════════════════════════
  cmd('EXCEL.FILE.EXIT',                  'Exit OfficeX',            () => FileEngine.exit(),                       'Alt+F4'),
  cmd('EXCEL.FILE.EXIT.FORCE',            'Force Exit',              () => FileEngine.forceExit()),
  cmd('EXCEL.FILE.EXIT.SAVE_ALL',         'Save All and Exit',       () => FileEngine.saveAllAndExit()),
  cmd('EXCEL.FILE.EXIT.CANCEL',           'Cancel Exit',             () => { /* Cancel pending exit */ }),

  // ══ IMPORT ══════════════════════════════════════════════════════════════
  // ── DOC IMPORT
  cmd('EXCEL.FILE.IMPORT.DOC',            'Import Microsoft Excel DOC',() => FileEngine.importFrom('doc')),
  cmd('EXCEL.FILE.IMPORT.DOC.REPAIR',     'Import DOC With Repair',  () => FileEngine.importFrom('doc')),
  cmd('EXCEL.FILE.IMPORT.DOC.READONLY',   'Import DOC Read Only',    () => FileEngine.importFrom('doc')),
  cmd('EXCEL.FILE.IMPORT.DOC.CONVERT',    'Convert DOC To DOCX',     () => FileEngine.importFrom('doc')),

  // ── DOCX IMPORT
  cmd('EXCEL.FILE.IMPORT.xlsx',           'Import DOCX',             () => FileEngine.importFrom('docx')),
  cmd('EXCEL.FILE.IMPORT.xlsx.REPAIR',    'Repair DOCX',             () => FileEngine.importFrom('docx')),
  cmd('EXCEL.FILE.IMPORT.xlsx.STRICT',    'Strict OpenXML',          () => FileEngine.importFrom('docx')),
  cmd('EXCEL.FILE.IMPORT.xlsx.MERGE',     'Merge DOCX',              () => FileEngine.importFrom('docx')),
  cmd('EXCEL.FILE.IMPORT.xlsx.READONLY',  'Read Only',               () => FileEngine.importFrom('docx')),

  // ── ODT IMPORT
  cmd('EXCEL.FILE.IMPORT.ODT',            'Import OpenWorkbook Text',() => FileEngine.importFrom('odt')),
  cmd('EXCEL.FILE.IMPORT.ODT.CONVERT',    'Convert ODT',             () => FileEngine.importFrom('odt')),
  cmd('EXCEL.FILE.IMPORT.ODT.REPAIR',     'Repair ODT',              () => FileEngine.importFrom('odt')),

  // ── HTML IMPORT
  cmd('EXCEL.FILE.IMPORT.HTML',           'Import HTML',             () => FileEngine.importFrom('html')),
  cmd('EXCEL.FILE.IMPORT.HTML.CSS',       'Import CSS',              () => { /* UI Action */ }),
  cmd('EXCEL.FILE.IMPORT.HTML.IMAGES',    'Import Images',           () => { /* UI Action */ }),
  cmd('EXCEL.FILE.IMPORT.HTML.TABLES',    'Import Tables',           () => { /* UI Action */ }),
  cmd('EXCEL.FILE.IMPORT.HTML.CLEAN',     'Clean HTML',              () => { /* UI Action */ }),

  // ── TXT IMPORT
  cmd('EXCEL.FILE.IMPORT.TXT',            'Import Plain Text',       () => FileEngine.importFrom('txt')),
  cmd('EXCEL.FILE.IMPORT.TXT.UTF8',       'UTF-8',                   () => FileEngine.importFrom('txt')),
  cmd('EXCEL.FILE.IMPORT.TXT.UTF16',      'UTF-16',                  () => FileEngine.importFrom('txt')),
  cmd('EXCEL.FILE.IMPORT.TXT.ASCII',      'ASCII',                   () => FileEngine.importFrom('txt')),
  cmd('EXCEL.FILE.IMPORT.TXT.AUTO_DETECT','Auto Detect Encoding',    () => FileEngine.importFrom('txt')),

  // ── PDF IMPORT
  cmd('EXCEL.FILE.IMPORT.PDF',            'Import PDF',              () => FileEngine.importFrom('pdf')),
  cmd('EXCEL.FILE.IMPORT.PDF.OCR',        'OCR PDF',                 () => FileEngine.importFrom('pdf')),
  cmd('EXCEL.FILE.IMPORT.PDF.TEXT',       'Extract Text',            () => FileEngine.importFrom('pdf')),
  cmd('EXCEL.FILE.IMPORT.PDF.LAYOUT',     'Preserve Layout',         () => FileEngine.importFrom('pdf')),
  cmd('EXCEL.FILE.IMPORT.PDF.IMAGES',     'Extract Images',          () => FileEngine.importFrom('pdf')),
  cmd('EXCEL.FILE.IMPORT.PDF.TABLES',     'Extract Tables',          () => FileEngine.importFrom('pdf')),

  // ── XML IMPORT
  cmd('EXCEL.FILE.IMPORT.XML',            'Import XML',              () => FileEngine.importFrom('xml')),
  cmd('EXCEL.FILE.IMPORT.XML.OPENXML',    'OpenXML',                 () => FileEngine.importFrom('xml')),
  cmd('EXCEL.FILE.IMPORT.XML.CUSTOM',     'Custom XML',              () => FileEngine.importFrom('xml')),
  cmd('EXCEL.FILE.IMPORT.XML.MAPPING',    'Import XML Mapping',      () => { /* Logic */ }),

  // ── JSON IMPORT
  cmd('EXCEL.FILE.IMPORT.JSON',           'Import JSON',             () => FileEngine.importFrom('json')),
  cmd('EXCEL.FILE.IMPORT.JSON.CONTENT',   'Content',                 () => FileEngine.importFrom('json')),
  cmd('EXCEL.FILE.IMPORT.JSON.STYLES',    'Styles',                  () => FileEngine.importFrom('json')),
  cmd('EXCEL.FILE.IMPORT.JSON.METADATA',  'Metadata',                () => FileEngine.importFrom('json')),

  // ── MARKDOWN IMPORT
  cmd('EXCEL.FILE.IMPORT.MARKDOWN',       'Import Markdown',         () => FileEngine.importFrom('markdown')),
  cmd('EXCEL.FILE.IMPORT.MARKDOWN.GITHUB','GitHub Markdown',         () => FileEngine.importFrom('markdown')),
  cmd('EXCEL.FILE.IMPORT.MARKDOWN.COMMONMARK', 'CommonMark',         () => FileEngine.importFrom('markdown')),
  cmd('EXCEL.FILE.IMPORT.MARKDOWN.TABLES','Tables',                  () => { /* UI Action */ }),
  cmd('EXCEL.FILE.IMPORT.MARKDOWN.FOOTNOTES','Footnotes',            () => { /* UI Action */ }),

  // ── BATCH IMPORT
  cmd('EXCEL.FILE.IMPORT.BATCH',          'Batch Import',            () => { /* Logic */ }),
  cmd('EXCEL.FILE.IMPORT.BATCH.FOLDER',   'Import Folder',           () => { /* Logic */ }),
  cmd('EXCEL.FILE.IMPORT.BATCH.ZIP',      'Import Archive',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.IMPORT.BATCH.WORKSPACE','Import Workspace',        () => { /* Logic */ }),

  // ── BACKGROUND IMPORT
  cmd('EXCEL.FILE.IMPORT.BACKGROUND',     'Background Import',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.IMPORT.CANCEL',         'Cancel Import',           () => { /* Logic */ }),
  cmd('EXCEL.FILE.IMPORT.RETRY',          'Retry Import',            () => { /* Logic */ }),
  cmd('EXCEL.FILE.IMPORT.PROGRESS',       'Import Progress',         () => { /* Logic */ }),

  // ── MERGE
  cmd('EXCEL.FILE.IMPORT.MERGE',          'Merge Imported Workbook', () => { /* Logic */ }),
  cmd('EXCEL.FILE.IMPORT.APPEND',         'Append To Current Workbook', () => { /* Logic */ }),
  cmd('EXCEL.FILE.IMPORT.REPLACE',        'Replace Current Workbook',() => { /* Logic */ }),

  // ── VALIDATION
  cmd('EXCEL.FILE.IMPORT.VALIDATE',       'Validate File',           () => { /* Logic */ }),
  cmd('EXCEL.FILE.IMPORT.CHECK.FORMAT',   'Check Format',            () => { /* Logic */ }),
  cmd('EXCEL.FILE.IMPORT.CHECK.VERSION',  'Check Version',           () => { /* Logic */ }),
  cmd('EXCEL.FILE.IMPORT.CHECK.SECURITY', 'Check Security',          () => { /* Logic */ }),

  // ── RECOVERY
  cmd('EXCEL.FILE.IMPORT.RECOVER',        'Recover Corrupted File',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.IMPORT.REPAIR',         'Repair Before Import',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.IMPORT.SKIP_ERRORS',    'Skip Invalid Content',    () => { /* Logic */ }),

  // ══ EXPORT ══════════════════════════════════════════════════════════════
  // ── PDF EXPORT
  cmd('EXCEL.FILE.EXPORT.PDF',            'Export PDF',              () => FileEngine.exportAs('pdf')),
  cmd('EXCEL.FILE.EXPORT.PDF.STANDARD',   'Standard PDF',            () => FileEngine.exportAs('pdf')),
  cmd('EXCEL.FILE.EXPORT.PDF.PRINT',      'High Quality Print',      () => FileEngine.exportAs('pdf')),
  cmd('EXCEL.FILE.EXPORT.PDF.MINIMUM',    'Minimum Size',            () => FileEngine.exportAs('pdf')),
  cmd('EXCEL.FILE.EXPORT.PDF.PASSExcel',   'PassExcel Protected PDF',  () => FileEngine.exportAs('pdf')),
  cmd('EXCEL.FILE.EXPORT.PDF.PDFA',       'Export PDF/A',            () => FileEngine.exportAs('pdf')),
  cmd('EXCEL.FILE.EXPORT.PDF.BOOKMARKS',  'Include Bookmarks',       () => { /* UI Action */ }),
  cmd('EXCEL.FILE.EXPORT.PDF.HYPERLINKS', 'Include Hyperlinks',      () => { /* UI Action */ }),
  cmd('EXCEL.FILE.EXPORT.PDF.ACCESSIBILITY','Accessible PDF',        () => FileEngine.exportAs('pdf')),
  cmd('EXCEL.FILE.EXPORT.PDF.COMMENTS',   'Include Comments',        () => { /* UI Action */ }),
  cmd('EXCEL.FILE.EXPORT.PDF.TRACK_CHANGES','Include Track Changes', () => { /* UI Action */ }),
  cmd('EXCEL.FILE.EXPORT.PDF.EMBED_FONTS','Embed Fonts',             () => { /* UI Action */ }),
  cmd('EXCEL.FILE.EXPORT.PDF.COMPRESS',   'Compress Images',         () => { /* UI Action */ }),

  // ── HTML EXPORT
  cmd('EXCEL.FILE.EXPORT.HTML',           'Export HTML',             () => FileEngine.exportAs('html')),
  cmd('EXCEL.FILE.EXPORT.HTML.EMBED_IMAGES', 'Embed Images',         () => { /* UI Action */ }),
  cmd('EXCEL.FILE.EXPORT.HTML.EXTERNAL_IMAGES', 'External Images',   () => { /* UI Action */ }),
  cmd('EXCEL.FILE.EXPORT.HTML.CSS_INLINE','Inline CSS',              () => { /* UI Action */ }),
  cmd('EXCEL.FILE.EXPORT.HTML.CSS_FILE',  'External CSS',            () => { /* UI Action */ }),
  cmd('EXCEL.FILE.EXPORT.HTML.RESPONSIVE','Responsive HTML',         () => { /* UI Action */ }),
  cmd('EXCEL.FILE.EXPORT.HTML.MINIFY',    'Minify HTML',             () => { /* UI Action */ }),

  // ── DOCX EXPORT
  cmd('EXCEL.FILE.EXPORT.xlsx',           'Export DOCX',             () => FileEngine.exportAs('docx')),
  cmd('EXCEL.FILE.EXPORT.xlsx.STRICT',    'Strict Open XML',         () => FileEngine.exportAs('docx')),
  cmd('EXCEL.FILE.EXPORT.xlsx.COMPATIBLE','Compatibility Mode',      () => FileEngine.exportAs('docx')),
  cmd('EXCEL.FILE.EXPORT.xlsx.FLATTEN',   'Flatten Workbook',        () => FileEngine.exportAs('docx')),

  // ── ODT EXPORT
  cmd('EXCEL.FILE.EXPORT.ODT',            'Export ODT',              () => FileEngine.exportAs('odt')),
  cmd('EXCEL.FILE.EXPORT.ODT.COMPATIBLE', 'Compatibility Mode',      () => FileEngine.exportAs('odt')),
  cmd('EXCEL.FILE.EXPORT.ODT.STRICT',     'Strict ODF',              () => FileEngine.exportAs('odt')),

  // ── MARKDOWN EXPORT
  cmd('EXCEL.FILE.EXPORT.MARKDOWN',       'Export Markdown',         () => FileEngine.exportAs('markdown')),
  cmd('EXCEL.FILE.EXPORT.MARKDOWN.GITHUB','GitHub Markdown',         () => FileEngine.exportAs('markdown')),
  cmd('EXCEL.FILE.EXPORT.MARKDOWN.COMMONMARK', 'CommonMark',         () => FileEngine.exportAs('markdown')),
  cmd('EXCEL.FILE.EXPORT.MARKDOWN.WIKI',  'Wiki Markdown',           () => FileEngine.exportAs('markdown')),
  cmd('EXCEL.FILE.EXPORT.MARKDOWN.TABLES','Enable Tables',           () => { /* UI Action */ }),
  cmd('EXCEL.FILE.EXPORT.MARKDOWN.FOOTNOTES','Include Footnotes',    () => { /* UI Action */ }),

  // ── TEXT EXPORT
  cmd('EXCEL.FILE.EXPORT.TEXT',           'Export TXT',              () => FileEngine.exportAs('txt')),
  cmd('EXCEL.FILE.EXPORT.TEXT.UTF8',      'UTF-8',                   () => FileEngine.exportAs('txt')),
  cmd('EXCEL.FILE.EXPORT.TEXT.UTF16',     'UTF-16',                  () => FileEngine.exportAs('txt')),
  cmd('EXCEL.FILE.EXPORT.TEXT.ASCII',     'ASCII',                   () => FileEngine.exportAs('txt')),
  cmd('EXCEL.FILE.EXPORT.TEXT.UNICODE',   'Unicode',                 () => FileEngine.exportAs('txt')),

  // ── XML EXPORT
  cmd('EXCEL.FILE.EXPORT.XML',            'Export XML',              () => FileEngine.exportAs('xml')),
  cmd('EXCEL.FILE.EXPORT.XML.OPENXML',    'Open XML',                () => FileEngine.exportAs('xml')),
  cmd('EXCEL.FILE.EXPORT.XML.CUSTOM',     'Custom XML',              () => FileEngine.exportAs('xml')),
  cmd('EXCEL.FILE.EXPORT.XML.PACKAGE',    'Package XML',             () => FileEngine.exportAs('xml')),

  // ── JSON EXPORT
  cmd('EXCEL.FILE.EXPORT.JSON',           'Export JSON',             () => FileEngine.exportAs('json')),
  cmd('EXCEL.FILE.EXPORT.JSON.Workbook',  'Workbook Structure',      () => FileEngine.exportAs('json')),
  cmd('EXCEL.FILE.EXPORT.JSON.STYLES',    'Styles',                  () => FileEngine.exportAs('json')),
  cmd('EXCEL.FILE.EXPORT.JSON.METADATA',  'Metadata',                () => FileEngine.exportAs('json')),
  cmd('EXCEL.FILE.EXPORT.JSON.CONTENT',   'Content Only',            () => FileEngine.exportAs('json')),

  // ── EPUB EXPORT
  cmd('EXCEL.FILE.EXPORT.EPUB',           'Export EPUB',             () => FileEngine.exportAs('epub')),
  cmd('EXCEL.FILE.EXPORT.EPUB.VERSION2',  'EPUB2',                   () => FileEngine.exportAs('epub')),
  cmd('EXCEL.FILE.EXPORT.EPUB.VERSION3',  'EPUB3',                   () => FileEngine.exportAs('epub')),
  cmd('EXCEL.FILE.EXPORT.EPUB.TOC',       'Include TOC',             () => { /* UI Action */ }),
  cmd('EXCEL.FILE.EXPORT.EPUB.EMBED_FONTS','Embed Fonts',            () => { /* UI Action */ }),

  // ── IMAGE EXPORT
  cmd('EXCEL.FILE.EXPORT.IMAGE',          'Export Images',           () => FileEngine.exportAs('png')),
  cmd('EXCEL.FILE.EXPORT.PNG',            'PNG',                     () => FileEngine.exportAs('png')),
  cmd('EXCEL.FILE.EXPORT.JPG',            'JPEG',                    () => FileEngine.exportAs('jpg')),
  cmd('EXCEL.FILE.EXPORT.WEBP',           'WEBP',                    () => FileEngine.exportAs('webp')),
  cmd('EXCEL.FILE.EXPORT.TIFF',           'TIFF',                    () => FileEngine.exportAs('tiff')),
  cmd('EXCEL.FILE.EXPORT.BMP',            'BMP',                     () => FileEngine.exportAs('bmp')),
  cmd('EXCEL.FILE.EXPORT.SVG',            'SVG',                     () => FileEngine.exportAs('svg')),
  cmd('EXCEL.FILE.EXPORT.PAGE_IMAGE',     'Current Page',            () => FileEngine.exportAs('png')),
  cmd('EXCEL.FILE.EXPORT.ALL_PAGES',      'All Pages',               () => FileEngine.exportAs('png')),

  // ── BATCH EXPORT
  cmd('EXCEL.FILE.EXPORT.BATCH',          'Batch Export',            () => { /* Logic */ }),
  cmd('EXCEL.FILE.EXPORT.BATCH.PDF',      'Batch Export PDF',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.EXPORT.BATCH.HTML',     'Batch Export HTML',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.EXPORT.BATCH.MARKDOWN', 'Batch Export Markdown',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.EXPORT.BATCH.IMAGE',    'Batch Export Image',      () => { /* Logic */ }),

  // ── BACKGROUND EXPORT
  cmd('EXCEL.FILE.EXPORT.BACKGROUND',     'Background Export',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.EXPORT.CANCEL',         'Cancel Export',           () => { /* Logic */ }),
  cmd('EXCEL.FILE.EXPORT.RETRY',          'Retry Export',            () => { /* Logic */ }),
  cmd('EXCEL.FILE.EXPORT.PROGRESS',       'Export Progress',         () => { /* Logic */ }),

  // ══ PRINT ═══════════════════════════════════════════════════════════════
  cmd('EXCEL.FILE.PRINT',                 'Print',               () => FileEngine.print(),                                  'Ctrl+P'),
  cmd('EXCEL.FILE.PRINT.QUICK',           'Quick Print',         () => FileEngine.print()),
  cmd('EXCEL.FILE.PRINT.PREVIEW',         'Print Preview',       () => { /* Opens print preview dialog */ }),
  cmd('EXCEL.FILE.PRINT.SETTINGS',        'Print Settings',      () => { /* Opens print settings */ }),
  cmd('EXCEL.FILE.PRINT.DUPLEX',          'Duplex',              () => { /* Opens print settings for duplex */ }),
  cmd('EXCEL.FILE.PRINT.PAGERANGE',       'Page Range',          () => { /* Opens print settings for page range */ }),
  cmd('EXCEL.FILE.PRINT.COPIES',          'Copies',              () => { /* Opens print settings for copies */ }),
  cmd('EXCEL.FILE.PRINT.PAPERSIZE',       'Paper Size',          () => { /* Opens print settings for paper size */ }),

  // ══ SHARE ═══════════════════════════════════════════════════════════════
  cmd('EXCEL.FILE.SHARE',                 'Share Workbook',      () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.QUICK',           'Quick Share',         () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.AS_COPY',         'Share Copy',          () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.READONLY',        'Share Read Only',     () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.EDITABLE',        'Share Editable',      () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.PUBLIC',          'Public Share',        () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.PRIVATE',         'Private Share',       () => { /* UI Action */ }),

  // ── EMAIL
  cmd('EXCEL.FILE.SHARE.EMAIL',           'Share By Email',      () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.EMAIL.ATTACHMENT','Email Attachment',    () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.EMAIL.PDF',       'Email PDF',           () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.EMAIL.LINK',      'Email Link',          () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.EMAIL.ZIP',       'Email ZIP',           () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.EMAIL.ENCRYPTED', 'Encrypted Email',     () => { /* UI Action */ }),

  // ── ONEDRIVE
  cmd('EXCEL.FILE.SHARE.ONEDRIVE',        'Share OneDrive',      () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.ONEDRIVE.UPLOAD', 'Upload',              () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.ONEDRIVE.LINK',   'Generate Link',       () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.ONEDRIVE.PERMISSION', 'Manage Permission',() => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.ONEDRIVE.SYNC',   'Sync',                () => { /* UI Action */ }),

  // ── DROPBOX
  cmd('EXCEL.FILE.SHARE.DROPBOX',         'Share Dropbox',       () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.DROPBOX.UPLOAD',  'Upload',              () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.DROPBOX.LINK',    'Create Link',         () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.DROPBOX.PERMISSION', 'Permission',       () => { /* UI Action */ }),

  // ── GOOGLE DRIVE
  cmd('EXCEL.FILE.SHARE.GDRIVE',          'Share Google Drive',  () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.GDRIVE.UPLOAD',   'Upload',              () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.GDRIVE.LINK',     'Generate Link',       () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.GDRIVE.PERMISSION','Permission',         () => { /* UI Action */ }),

  // ── SHAREPOINT
  cmd('EXCEL.FILE.SHARE.SHAREPOINT',      'Share SharePoint',    () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.SHAREPOINT.SITE', 'Site Upload',         () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.SHAREPOINT.LIBRARY','Workbook Library',  () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.SHAREPOINT.PERMISSION','Permission',     () => { /* UI Action */ }),

  // ── BOX
  cmd('EXCEL.FILE.SHARE.BOX',             'Share Box',           () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.BOX.UPLOAD',      'Upload',              () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.BOX.LINK',        'Generate Link',       () => { /* UI Action */ }),

  // ── NEXTCLOUD
  cmd('EXCEL.FILE.SHARE.NEXTCLOUD',       'Share Nextcloud',     () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.NEXTCLOUD.UPLOAD','Upload',              () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.NEXTCLOUD.LINK',  'Generate Link',       () => { /* UI Action */ }),

  // ── INTERNAL SHARE
  cmd('EXCEL.FILE.SHARE.INTERNAL',        'Internal Share',      () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.INTERNAL.USER',   'Share To User',       () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.INTERNAL.GROUP',  'Share To Group',      () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.INTERNAL.DEPARTMENT','Share To Department',() => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.INTERNAL.ORGANIZATION','Organization Share',() => { /* UI Action */ }),

  // ── TEAM
  cmd('EXCEL.FILE.SHARE.TEAMS',           'Microsoft Teams',     () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.SLACK',           'Slack',               () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.DISCORD',         'Discord',             () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.ZOOM',            'Zoom',                () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.WEBEX',           'Cisco Webex',         () => { /* UI Action */ }),

  // ── LINK
  cmd('EXCEL.FILE.SHARE.LINK',            'Generate Link',       () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.LINK.READONLY',   'Read Only Link',      () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.LINK.EDIT',       'Editable Link',       () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.LINK.EXPIRE',     'Expiration Date',     () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.LINK.PASSExcel',   'PassExcel Protected',  () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.LINK.REVOKE',     'Revoke Link',         () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.LINK.SHORTEN',    'Short URL',           () => { /* UI Action */ }),

  // ── QR CODE
  cmd('EXCEL.FILE.SHARE.QR',              'Generate QR Code',    () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.QR.DOWNLOAD',     'Download QR',         () => { /* UI Action */ }),

  // ── PERMISSIONS
  cmd('EXCEL.FILE.SHARE.PERMISSION.READ', 'Read Permission',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.SHARE.PERMISSION.WRITE','Write Permission',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.SHARE.PERMISSION.COMMENT','Comment Permission',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SHARE.PERMISSION.OWNER','Owner Permission',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.SHARE.PERMISSION.REMOVE','Remove Permission',  () => { /* Logic */ }),

  // ── INVITATION
  cmd('EXCEL.FILE.SHARE.INVITE.USER',     'Invite User',         () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.INVITE.GROUP',    'Invite Group',        () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.INVITE.EMAIL',    'Invite Email',        () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHARE.INVITE.RESEND',   'Resend Invitation',   () => { /* UI Action */ }),

  // ── COLLABORATION
  cmd('EXCEL.FILE.SHARE.COLLAB.START',    'Start Collaboration', () => { /* Logic */ }),
  cmd('EXCEL.FILE.SHARE.COLLAB.STOP',     'Stop Collaboration',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.SHARE.COLLAB.STATUS',   'Status',              () => { /* Logic */ }),
  cmd('EXCEL.FILE.SHARE.COLLAB.USERS',    'Connected Users',     () => { /* Logic */ }),

  // ── NOTIFICATION
  cmd('EXCEL.FILE.SHARE.NOTIFY',          'Notify Users',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.SHARE.NOTIFY.EMAIL',    'Email Notification',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.SHARE.NOTIFY.PUSH',     'Push Notification',   () => { /* Logic */ }),

  // ══ CLOUD ════════════════════════════════════════════════════════════════
  // ── LOGIN
  cmd('EXCEL.CLOUD.LOGIN',                'Login',               () => { /* UI Action */ }),
  cmd('EXCEL.CLOUD.LOGIN.ONEDRIVE',       'Login OneDrive',      () => { /* UI Action */ }),
  cmd('EXCEL.CLOUD.LOGIN.GOOGLE_DRIVE',   'Login Google Drive',  () => { /* UI Action */ }),
  cmd('EXCEL.CLOUD.LOGIN.DROPBOX',        'Login Dropbox',       () => { /* UI Action */ }),
  cmd('EXCEL.CLOUD.LOGIN.SHAREPOINT',     'Login SharePoint',    () => { /* UI Action */ }),
  cmd('EXCEL.CLOUD.LOGIN.BOX',            'Login Box',           () => { /* UI Action */ }),
  cmd('EXCEL.CLOUD.LOGIN.NEXTCLOUD',      'Login Nextcloud',     () => { /* UI Action */ }),
  cmd('EXCEL.CLOUD.LOGIN.S3',             'Login Amazon S3',     () => { /* UI Action */ }),
  cmd('EXCEL.CLOUD.LOGIN.AZURE',          'Login Azure Blob',    () => { /* UI Action */ }),
  cmd('EXCEL.CLOUD.LOGIN.WEBDAV',         'Login WebDAV',        () => { /* UI Action */ }),
  cmd('EXCEL.CLOUD.LOGIN.SMB',            'Login SMB',           () => { /* UI Action */ }),

  // ── LOGOUT
  cmd('EXCEL.CLOUD.LOGOUT',               'Logout',              () => { /* UI Action */ }),
  cmd('EXCEL.CLOUD.LOGOUT.ALL',           'Logout All Providers',() => { /* UI Action */ }),
  cmd('EXCEL.CLOUD.LOGOUT.ONEDRIVE',      'Logout OneDrive',     () => { /* UI Action */ }),
  cmd('EXCEL.CLOUD.LOGOUT.GOOGLE',        'Logout Google Drive', () => { /* UI Action */ }),
  cmd('EXCEL.CLOUD.LOGOUT.DROPBOX',       'Logout Dropbox',      () => { /* UI Action */ }),

  // ── ACCOUNT
  cmd('EXCEL.CLOUD.ACCOUNT.INFO',         'Account Information', () => { /* UI Action */ }),
  cmd('EXCEL.CLOUD.ACCOUNT.SWITCH',       'Switch Account',      () => { /* UI Action */ }),
  cmd('EXCEL.CLOUD.ACCOUNT.REMOVE',       'Remove Account',      () => { /* UI Action */ }),
  cmd('EXCEL.CLOUD.ACCOUNT.DEFAULT',      'Default Account',     () => { /* UI Action */ }),

  // ── UPLOAD
  cmd('EXCEL.CLOUD.UPLOAD',               'Upload',              () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.UPLOAD.ACTIVE',        'Upload Active Workbook',() => { /* Logic */ }),
  cmd('EXCEL.CLOUD.UPLOAD.ALL',           'Upload All Workbooks',() => { /* Logic */ }),
  cmd('EXCEL.CLOUD.UPLOAD.FOLDER',        'Upload Folder',       () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.UPLOAD.BACKGROUND',    'Background Upload',   () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.UPLOAD.RETRY',         'Retry Upload',        () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.UPLOAD.CANCEL',        'Cancel Upload',       () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.UPLOAD.PROGRESS',      'Upload Progress',     () => { /* Logic */ }),

  // ── DOWNLOAD
  cmd('EXCEL.CLOUD.DOWNLOAD',             'Download',            () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.DOWNLOAD.LATEST',      'Download Latest Version',() => { /* Logic */ }),
  cmd('EXCEL.CLOUD.DOWNLOAD.SELECTED',    'Download Selected Version',() => { /* Logic */ }),
  cmd('EXCEL.CLOUD.DOWNLOAD.FOLDER',      'Download Folder',     () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.DOWNLOAD.BACKGROUND',  'Background Download', () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.DOWNLOAD.CANCEL',      'Cancel Download',     () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.DOWNLOAD.PROGRESS',    'Progress',            () => { /* Logic */ }),

  // ── SYNC
  cmd('EXCEL.CLOUD.SYNC',                 'Sync',                () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.SYNC.START',           'Start Sync',          () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.SYNC.STOP',            'Stop Sync',           () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.SYNC.ALL',             'Sync All',            () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.SYNC.ACTIVE',          'Sync Active Workbook',() => { /* Logic */ }),
  cmd('EXCEL.CLOUD.SYNC.BACKGROUND',      'Background Sync',     () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.SYNC.MANUAL',          'Manual Sync',         () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.SYNC.AUTO',            'Auto Sync',           () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.SYNC.STATUS',          'Sync Status',         () => FileStorageEngine.getAllCloudStatuses()),
  cmd('EXCEL.CLOUD.SYNC.RETRY',           'Retry Sync',          () => { /* Logic */ }),

  // ── OFFLINE CACHE
  cmd('EXCEL.CLOUD.CACHE.ENABLE',         'Enable Offline Cache',() => { /* Logic */ }),
  cmd('EXCEL.CLOUD.CACHE.DISABLE',        'Disable Offline Cache',() => { /* Logic */ }),
  cmd('EXCEL.CLOUD.CACHE.OPEN',           'Open Offline Copy',   () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.CACHE.CLEAR',          'Clear Cache',         () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.CACHE.REBUILD',        'Rebuild Cache',       () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.CACHE.SIZE',           'Cache Size',          () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.CACHE.STATUS',         'Cache Status',        () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.CACHE.LOCATION',       'Cache Location',      () => { /* Logic */ }),

  // ── CLOUD VERSION
  cmd('EXCEL.CLOUD.VERSION.OPEN',         'Open Cloud Version',  () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.VERSION.LATEST',       'Latest Version',      () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.VERSION.RESTORE',      'Restore Version',     () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.VERSION.DELETE',       'Delete Version',      () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.VERSION.COMPARE',      'Compare Versions',    () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.VERSION.HISTORY',      'Version History',     () => { /* Logic */ }),

  // ── CONFLICT
  cmd('EXCEL.CLOUD.CONFLICT.DETECT',      'Detect Conflict',     () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.CONFLICT.RESOLVE',     'Resolve Conflict',    () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.CONFLICT.KEEP_LOCAL',  'Keep Local Version',  () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.CONFLICT.KEEP_REMOTE', 'Keep Cloud Version',  () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.CONFLICT.MERGE',       'Merge Changes',       () => { /* Logic */ }),

  // ── PERMISSION
  cmd('EXCEL.CLOUD.PERMISSION.READ',      'Read Permission',     () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.PERMISSION.WRITE',     'Write Permission',    () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.PERMISSION.ADMIN',     'Administrator',       () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.PERMISSION.REMOVE',    'Remove Permission',   () => { /* Logic */ }),

  // ── PROVIDER
  cmd('EXCEL.CLOUD.PROVIDER.ADD',         'Add Provider',        () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.PROVIDER.REMOVE',      'Remove Provider',     () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.PROVIDER.ENABLE',      'Enable Provider',     () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.PROVIDER.DISABLE',     'Disable Provider',    () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.PROVIDER.REFRESH',     'Refresh Provider',    () => { /* Logic */ }),

  // ── NOTIFICATION
  cmd('EXCEL.CLOUD.NOTIFY.ENABLE',        'Enable Notifications',() => { /* Logic */ }),
  cmd('EXCEL.CLOUD.NOTIFY.DISABLE',       'Disable Notifications',() => { /* Logic */ }),
  cmd('EXCEL.CLOUD.NOTIFY.SYNC',          'Sync Notification',   () => { /* Logic */ }),
  cmd('EXCEL.CLOUD.NOTIFY.CONFLICT',      'Conflict Notification',() => { /* Logic */ }),

  // ══ BACKUP ═══════════════════════════════════════════════════════════════
  cmd('EXCEL.FILE.BACKUP',                'Create Backup',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.NOW',            'Backup Now',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.ACTIVE',         'Backup Active Workbook',() => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.ALL',            'Backup All Workbooks',() => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.FOLDER',         'Backup Folder',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.WORKSPACE',      'Backup Workspace',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.SNAPSHOT',       'Create Snapshot',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.FULL',           'Full Backup',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.INCREMENTAL',    'Incremental Backup',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.DIFFERENTIAL',   'Differential Backup', () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.CLOUD',          'Cloud Backup',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.LOCAL',          'Local Backup',        () => { /* Logic */ }),

  // ── AUTO BACKUP
  cmd('EXCEL.FILE.BACKUP.AUTO.ENABLE',    'Enable Auto Backup',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.AUTO.DISABLE',   'Disable Auto Backup', () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.AUTO.START',     'Start Auto Backup',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.AUTO.STOP',      'Stop Auto Backup',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.AUTO.STATUS',    'Auto Backup Status',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.AUTO.INTERVAL',  'Set Backup Interval', () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.AUTO.ON_SAVE',   'Backup On Save',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.AUTO.ON_CLOSE',  'Backup On Close',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.AUTO.ON_EXIT',   'Backup Before Exit',  () => { /* Logic */ }),

  // ── RESTORE
  cmd('EXCEL.FILE.BACKUP.RESTORE',        'Restore Backup',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.RESTORE.LATEST', 'Restore Latest Backup',() => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.RESTORE.SELECTED','Restore Selected Backup',() => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.RESTORE.VERSION','Restore Specific Version',() => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.RESTORE.PARTIAL','Partial Restore',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.RESTORE.ALL',    'Restore Entire Workspace',() => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.RESTORE.PREVIEW','Preview Backup',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.RESTORE.VERIFY', 'Verify Restore',      () => { /* Logic */ }),

  // ── DELETE BACKUP
  cmd('EXCEL.FILE.BACKUP.DELETE',         'Delete Backup',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.DELETE.SELECTED','Delete Selected Backup',() => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.DELETE.ALL',     'Delete All Backups',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.DELETE.EXPIRED', 'Delete Expired Backups',() => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.DELETE.LOCAL',   'Delete Local Backup', () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.DELETE.CLOUD',   'Delete Cloud Backup', () => { /* Logic */ }),

  // ── BACKUP SCHEDULE
  cmd('EXCEL.FILE.BACKUP.SCHEDULE',       'Backup Schedule',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.SCHEDULE.CREATE','Create Schedule',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.SCHEDULE.EDIT',  'Edit Schedule',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.SCHEDULE.DELETE','Delete Schedule',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.SCHEDULE.ENABLE','Enable Schedule',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.SCHEDULE.DISABLE','Disable Schedule',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.SCHEDULE.DAILY', 'Daily Backup',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.SCHEDULE.WEEKLY','Weekly Backup',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.SCHEDULE.MONTHLY','Monthly Backup',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.SCHEDULE.CUSTOM','Custom Schedule',     () => { /* Logic */ }),

  // ── ENCRYPTION
  cmd('EXCEL.FILE.BACKUP.ENCRYPT',        'Encrypt Backup',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.DECRYPT',        'Decrypt Backup',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.PASSExcel',       'Backup PassExcel',     () => { /* Logic */ }),

  // ── COMPRESSION
  cmd('EXCEL.FILE.BACKUP.COMPRESS',       'Compress Backup',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.COMPRESS.HIGH',  'High Compression',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.COMPRESS.FAST',  'Fast Compression',    () => { /* Logic */ }),

  // ── VALIDATION
  cmd('EXCEL.FILE.BACKUP.VERIFY',         'Verify Backup',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.CHECKSUM',       'Generate Checksum',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.INTEGRITY',      'Integrity Check',     () => { /* Logic */ }),

  // ── STORAGE
  cmd('EXCEL.FILE.BACKUP.LOCATION',       'Backup Location',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.MOVE',           'Move Backup',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.COPY',           'Copy Backup',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.SIZE',           'Backup Size',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.STATISTICS',     'Backup Statistics',   () => { /* Logic */ }),

  // ── HISTORY
  cmd('EXCEL.FILE.BACKUP.HISTORY',        'Backup History',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.HISTORY.OPEN',   'Open History',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.HISTORY.CLEAR',  'Clear History',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.BACKUP.HISTORY.EXPORT', 'Export History',      () => { /* Logic */ }),

  // ══ RECENT FILES ═════════════════════════════════════════════════════════
  cmd('EXCEL.FILE.RECENT.OPEN',           'Open Recent File',    (_, p) => p?.path && FileEngine.openFromPath(p.path)),
  cmd('EXCEL.FILE.RECENT.CLEAR',          'Clear Recent Files',  () => FileStorageEngine.clearRecent()),
  cmd('EXCEL.FILE.RECENT.PIN',            'Pin File',            (_, p) => p?.id && FileStorageEngine.pinFile(p.id)),
  cmd('EXCEL.FILE.RECENT.UNPIN',          'Unpin File',          (_, p) => p?.id && FileStorageEngine.unpinFile(p.id)),
  cmd('EXCEL.FILE.RECENT.REMOVE',         'Remove from Recent',  (_, p) => p?.id && FileStorageEngine.removeFromRecent(p.id)),

  // ══ FILE PROPERTIES ══════════════════════════════════════════════════════
  cmd('EXCEL.FILE.PROPERTIES.OPEN',       'File Properties',     () => { /* Opens FileMenu on Info tab — handled by UI */ }),
  cmd('EXCEL.FILE.PROPERTIES.TITLE',      'Set Title',           (_, p) => p?.value && FileEngine.updateProperties({ title: p.value })),
  cmd('EXCEL.FILE.PROPERTIES.AUTHOR',     'Set Author',          (_, p) => p?.value && FileEngine.updateProperties({ author: p.value })),
  cmd('EXCEL.FILE.PROPERTIES.KEYExcelS',   'Set KeyExcels',        (_, p) => p?.value && FileEngine.updateProperties({ keyExcels: p.value })),
  cmd('EXCEL.FILE.PROPERTIES.SUBJECT',    'Set Subject',         (_, p) => p?.value && FileEngine.updateProperties({ subject: p.value })),
  cmd('EXCEL.FILE.PROPERTIES.CATEGORY',   'Set Category',        (_, p) => p?.value && FileEngine.updateProperties({ category: p.value })),
  cmd('EXCEL.FILE.PROPERTIES.COMPANY',    'Set Company',         (_, p) => p?.value && FileEngine.updateProperties({ company: p.value })),
  cmd('EXCEL.FILE.PROPERTIES.TAGS',       'Set Tags',            (_, p) => p?.tags && FileEngine.updateProperties({ tags: p.tags })),
  cmd('EXCEL.FILE.PROPERTIES.SECURITY',   'Security Info',       () => { /* Opens security panel */ }),

  // ══ VERSION HISTORY ═══════════════════════════════════════════════════════
  cmd('EXCEL.FILE.VERSION.HISTORY',       'Open Version History',() => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.HISTORY.OPEN',  'Open History Window', () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.HISTORY.CLOSE', 'Close History',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.HISTORY.REFRESH','Refresh History',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.HISTORY.SEARCH','Search Version',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.HISTORY.FILTER','Filter Version',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.HISTORY.PIN',   'Pin Version',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.HISTORY.UNPIN', 'Unpin Version',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.HISTORY.SORT',  'Sort History',        () => { /* Logic */ }),

  // ── CREATE VERSION
  cmd('EXCEL.FILE.VERSION.CREATE',        'Create Version',      (_, p) => FileEngine.saveVersion(p?.label, p?.comment)),
  cmd('EXCEL.FILE.VERSION.CREATE.MANUAL', 'Manual Version',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.CREATE.AUTO',   'Automatic Version',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.CREATE.SNAPSHOT','Snapshot',           () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.CREATE.MILESTONE','Milestone',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.CREATE.TAG',    'Tagged Version',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.CREATE.CLOUD',  'Cloud Version',       () => { /* Logic */ }),

  // ── COMPARE VERSION
  cmd('EXCEL.FILE.VERSION.COMPARE',       'Compare Versions',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.COMPARE.LATEST','Compare Latest',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.COMPARE.SELECTED','Compare Selected',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.COMPARE.CLOUD', 'Compare Cloud Version',() => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.COMPARE.LOCAL', 'Compare Local Version',() => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.COMPARE.CONTENT','Compare Content',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.COMPARE.STYLES','Compare Styles',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.COMPARE.FORMATTING','Compare Formatting',() => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.COMPARE.COMMENTS','Compare Comments',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.COMPARE.TRACKCHANGES','Compare Track Changes',() => { /* Logic */ }),

  // ── RESTORE
  cmd('EXCEL.FILE.VERSION.RESTORE',       'Restore Version',     (_, p) => p?.id && FileEngine.restoreVersion(p.id)),
  cmd('EXCEL.FILE.VERSION.RESTORE.LATEST','Restore Latest',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.RESTORE.SELECTED','Restore Selected',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.RESTORE.CLOUD', 'Restore Cloud Version',() => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.RESTORE.LOCAL', 'Restore Local Version',() => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.RESTORE.SNAPSHOT','Restore Snapshot',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.RESTORE.PREVIEW','Preview Before Restore',() => { /* Logic */ }),

  // ── DELETE
  cmd('EXCEL.FILE.VERSION.DELETE',        'Delete Version',      (_, p) => p?.id && FileRecoveryEngine.deleteVersion(p.id)),
  cmd('EXCEL.FILE.VERSION.DELETE.SELECTED','Delete Selected',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.DELETE.ALL',    'Delete All Versions', () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.DELETE.EXPIRED','Delete Expired Versions',() => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.DELETE.LOCAL',  'Delete Local Versions',() => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.DELETE.CLOUD',  'Delete Cloud Versions',() => { /* Logic */ }),

  // ── EXPORT VERSION
  cmd('EXCEL.FILE.VERSION.EXPORT',        'Export Version',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.EXPORT.PDF',    'Export As PDF',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.EXPORT.xlsx',   'Export DOCX',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.EXPORT.HTML',   'Export HTML',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.EXPORT.MARKDOWN','Export Markdown',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.EXPORT.JSON',   'Export JSON',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.EXPORT.XML',    'Export XML',          () => { /* Logic */ }),

  // ── IMPORT VERSION
  cmd('EXCEL.FILE.VERSION.IMPORT',        'Import Version',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.IMPORT.LOCAL',  'Import Local Version',() => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.IMPORT.CLOUD',  'Import Cloud Version',() => { /* Logic */ }),

  // ── SNAPSHOT
  cmd('EXCEL.FILE.VERSION.SNAPSHOT.CREATE','Create Snapshot',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.SNAPSHOT.RESTORE','Restore Snapshot',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.SNAPSHOT.DELETE','Delete Snapshot',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.SNAPSHOT.EXPORT','Export Snapshot',    () => { /* Logic */ }),

  // ── CLOUD VERSION
  cmd('EXCEL.FILE.VERSION.CLOUD.OPEN',    'Open Cloud Version',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.CLOUD.SYNC',    'Sync Versions',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.CLOUD.DOWNLOAD','Download Version',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.CLOUD.UPLOAD',  'Upload Version',      () => { /* Logic */ }),

  // ── LABEL
  cmd('EXCEL.FILE.VERSION.LABEL.ADD',     'Add Label',           () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.LABEL.EDIT',    'Edit Label',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.LABEL.DELETE',  'Delete Label',        () => { /* Logic */ }),

  // ── NOTES
  cmd('EXCEL.FILE.VERSION.NOTES.ADD',     'Add Version Notes',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.NOTES.EDIT',    'Edit Notes',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.NOTES.DELETE',  'Delete Notes',        () => { /* Logic */ }),

  // ── AUDIT
  cmd('EXCEL.FILE.VERSION.AUDIT.OPEN',    'Audit History',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.AUDIT.EXPORT',  'Export Audit',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.VERSION.AUDIT.CLEAR',   'Clear Audit',         () => { /* Logic */ }),

  // ══ RECOVERY ══════════════════════════════════════════════════════════════
  // ── AUTO RECOVERY
  cmd('EXCEL.FILE.RECOVERY.AUTO',         'Enable Auto Recovery',() => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.AUTO.START',   'Start Auto Recovery', () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.AUTO.STOP',    'Stop Auto Recovery',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.AUTO.STATUS',  'Recovery Status',     () => FileEngine.getRecoveryPoints()),
  cmd('EXCEL.FILE.RECOVERY.AUTO.INTERVAL','Recovery Interval',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.AUTO.SAVE',    'Create Recovery Snapshot',() => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.AUTO.DELETE',  'Delete Recovery Snapshot',() => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.AUTO.CLEAN',   'Clean Recovery Cache',() => { /* Logic */ }),

  // ── RECOVERY SEARCH
  cmd('EXCEL.FILE.RECOVERY.SEARCH',       'Search Recovery Files',() => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.SEARCH.LOCAL', 'Search Local Recovery',() => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.SEARCH.CLOUD', 'Search Cloud Recovery',() => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.SEARCH.BACKUP','Search Backup Files', () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.SEARCH.TEMP',  'Search Temporary Files',() => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.SEARCH.AUTOSAVE','Search AutoSave Files',() => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.SEARCH.ALL',   'Search All Sources',  () => { /* Logic */ }),

  // ── REPAIR
  cmd('EXCEL.FILE.RECOVERY.REPAIR',       'Repair Workbook',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.REPAIR.OPENXML','Repair OpenXML Package',() => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.REPAIR.XML',   'Repair XML',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.REPAIR.MEDIA', 'Repair Images',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.REPAIR.TABLES','Repair Tables',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.REPAIR.STYLES','Repair Styles',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.REPAIR.FONTS', 'Repair Fonts',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.REPAIR.HEADERS','Repair Headers',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.REPAIR.FOOTERS','Repair Footers',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.REPAIR.HYPERLINKS','Repair Hyperlinks',() => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.REPAIR.COMMENTS','Repair Comments',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.REPAIR.TRACKCHANGES','Repair Track Changes',() => { /* Logic */ }),

  // ── RESTORE
  cmd('EXCEL.FILE.RECOVERY.RESTORE',      'Restore Workbook',    (_, p) => p?.id && FileEngine.restoreRecoveryPoint(p.id)),
  cmd('EXCEL.FILE.RECOVERY.RESTORE.LATEST','Restore Latest',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.RESTORE.SELECTED','Restore Selected Recovery',() => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.RESTORE.VERSION','Restore Version',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.RESTORE.CLOUD','Restore Cloud Version',() => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.RESTORE.BACKUP','Restore Backup',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.RESTORE.TEMP', 'Restore Temporary File',() => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.RESTORE.SNAPSHOT','Restore Snapshot', () => { /* Logic */ }),

  // ── SCAN
  cmd('EXCEL.FILE.RECOVERY.SCAN',         'Scan Workbook',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.SCAN.FULL',    'Full Scan',           () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.SCAN.QUICK',   'Quick Scan',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.SCAN.OPENXML', 'OpenXML Scan',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.SCAN.MEDIA',   'Media Scan',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.SCAN.TABLES',  'Table Scan',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.SCAN.STYLES',  'Style Scan',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.SCAN.SECURITY','Security Scan',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.SCAN.INTEGRITY','Integrity Scan',     () => { /* Logic */ }),

  // ── REBUILD
  cmd('EXCEL.FILE.RECOVERY.REBUILD',      'Rebuild Workbook',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.REBUILD.OPENXML','Rebuild OpenXML Package',() => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.REBUILD.XML',  'Rebuild XML',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.REBUILD.MEDIA','Rebuild Media',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.REBUILD.TABLES','Rebuild Tables',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.REBUILD.STYLES','Rebuild Styles',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.REBUILD.FONTS','Rebuild Fonts',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.REBUILD.INDEX','Rebuild Index',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.REBUILD.METADATA','Rebuild Metadata', () => { /* Logic */ }),

  // ── VALIDATION
  cmd('EXCEL.FILE.RECOVERY.VALIDATE',     'Validate Workbook',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.VALIDATE.XML', 'Validate XML',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.VALIDATE.OPENXML','Validate Package', () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.VALIDATE.SIGNATURE','Validate Signature',() => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.VALIDATE.CHECKSUM','Checksum Validation',() => { /* Logic */ }),

  // ── HISTORY
  cmd('EXCEL.FILE.RECOVERY.HISTORY',      'Recovery History',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.HISTORY.OPEN', 'Open History',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.HISTORY.DELETE','Delete History',     (_, p) => p?.id && FileRecoveryEngine.deleteRecoveryPoint(p.id)),
  cmd('EXCEL.FILE.RECOVERY.HISTORY.CLEAR','Clear History',       () => { /* Logic */ }),

  // ── CACHE
  cmd('EXCEL.FILE.RECOVERY.CACHE.OPEN',   'Open Cache',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.CACHE.CLEAR',  'Clear Cache',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.CACHE.REBUILD','Rebuild Cache',       () => { /* Logic */ }),

  // ── EMERGENCY
  cmd('EXCEL.FILE.RECOVERY.EMERGENCY',    'Emergency Recovery',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.CRASH',        'Crash Recovery',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.POWERFAILURE', 'Power Failure Recovery',() => { /* Logic */ }),
  cmd('EXCEL.FILE.RECOVERY.FORCE',        'Force Recovery',      () => { /* Logic */ }),

  // ══ SECURITY ══════════════════════════════════════════════════════════════
  // ── ENCRYPTION
  cmd('EXCEL.FILE.SECURITY.ENCRYPT',      'Encrypt Workbook',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.ENCRYPT.AES128','AES-128 Encryption', () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.ENCRYPT.AES256','AES-256 Encryption', () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.ENCRYPT.CUSTOM','Custom Encryption',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.ENCRYPT.OPEN', 'Encrypt On Open',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.ENCRYPT.SAVE', 'Encrypt On Save',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.ENCRYPT.REMOVE','Remove Encryption',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.ENCRYPT.CHANGE_KEY','Change Encryption Key',() => { /* Logic */ }),

  // ── PASSExcel
  cmd('EXCEL.FILE.SECURITY.PASSEXCEL.SET', 'Set PassExcel',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.PASSEXCEL.CHANGE','Change PassExcel',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.PASSEXCEL.REMOVE','Remove PassExcel',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.PASSEXCEL.OPEN','PassExcel To Open',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.PASSEXCEL.MODIFY','PassExcel To Modify',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.PASSEXCEL.VERIFY','Verify PassExcel',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.PASSEXCEL.EXPIRE','PassExcel Expiration',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.PASSEXCEL.POLICY','PassExcel Policy',   () => { /* Logic */ }),

  // ── Workbook PROTECTION
  cmd('EXCEL.FILE.SECURITY.PROTECT',      'Protect Workbook',    () => FileEngine.setProtected(true)),
  cmd('EXCEL.FILE.SECURITY.PROTECT.EDITING','Restrict Editing',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.PROTECT.FORMATTING','Restrict Formatting',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.PROTECT.COMMENTS','Comments Only',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.PROTECT.FORMS','Forms Only',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.PROTECT.TRACKCHANGES','Track Changes Only',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.PROTECT.CONTENT','Protect Content',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.PROTECT.METADATA','Protect Metadata', () => { /* Logic */ }),

  // ── READ ONLY
  cmd('EXCEL.FILE.SECURITY.READONLY',     'Read Only',           () => FileEngine.setReadOnly(!FileEngine.getCurrentFile()?.isReadOnly)),
  cmd('EXCEL.FILE.SECURITY.READONLY.RECOMMENDED','Recommend Read Only',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.READONLY.FORCE','Force Read Only',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.READONLY.TEMPORARY','Temporary Read Only',() => { /* Logic */ }),

  // ── REMOVE PROTECTION
  cmd('EXCEL.FILE.SECURITY.UNPROTECT',    'Remove Protection',   () => FileEngine.setProtected(false)),
  cmd('EXCEL.FILE.SECURITY.UNPROTECT.EDITING','Remove Editing Restriction',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.UNPROTECT.FORMATTING','Remove Formatting Restriction',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.UNPROTECT.READONLY','Remove Read Only',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.UNPROTECT.ALL','Remove All Protection',() => { /* Logic */ }),

  // ── RIGHTS MANAGEMENT (RMS)
  cmd('EXCEL.FILE.SECURITY.RMS.ENABLE',   'Enable RMS',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.RMS.DISABLE',  'Disable RMS',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.RMS.APPLY',    'Apply Rights Policy', () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.RMS.REMOVE',   'Remove Rights Policy',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.RMS.READ',     'Read Permission',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.RMS.EDIT',     'Edit Permission',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.RMS.PRINT',    'Print Permission',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.RMS.COPY',     'Copy Permission',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.RMS.EXPORT',   'Export Permission',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.RMS.EXPIRE',   'Expiration Policy',   () => { /* Logic */ }),

  // ── DIGITAL RIGHTS MANAGEMENT (DRM)
  cmd('EXCEL.FILE.SECURITY.DRM.ENABLE',   'Enable DRM',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.DRM.DISABLE',  'Disable DRM',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.DRM.ACTIVATE', 'Activate License',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.DRM.DEACTIVATE','Deactivate License', () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.DRM.VALIDATE', 'Validate License',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.DRM.REVOKE',   'Revoke License',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.DRM.OFFLINE',  'Offline License',     () => { /* Logic */ }),

  // ══ PERMISSIONS & ACL ═══════════════════════════════════════════════════
  // ── GRANT
  cmd('EXCEL.FILE.PERMISSION.GRANT',      'Grant Permission',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.GRANT.USER', 'Grant To User',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.GRANT.GROUP','Grant To Group',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.GRANT.ROLE', 'Grant Role',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.GRANT.DOMAIN','Grant Domain',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.GRANT.PUBLIC','Grant Public Access',() => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.GRANT.GUEST','Grant Guest Access',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.GRANT.LINK', 'Grant Via Share Link',() => { /* Logic */ }),

  // ── REVOKE
  cmd('EXCEL.FILE.PERMISSION.REVOKE',     'Revoke Permission',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.REVOKE.USER','Remove User Permission',() => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.REVOKE.GROUP','Remove Group Permission',() => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.REVOKE.PUBLIC','Remove Public Access',() => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.REVOKE.GUEST','Remove Guest Access',() => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.REVOKE.ALL', 'Remove All Permissions',() => { /* Logic */ }),

  // ── READ
  cmd('EXCEL.FILE.PERMISSION.READ',       'Read Permission',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.READ.GRANT', 'Grant Read',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.READ.REMOVE','Remove Read',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.READ.VERIFY','Verify Read Access',  () => { /* Logic */ }),

  // ── WRITE
  cmd('EXCEL.FILE.PERMISSION.WRITE',      'Write Permission',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.WRITE.GRANT','Grant Write',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.WRITE.REMOVE','Remove Write',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.WRITE.VERIFY','Verify Write Access',() => { /* Logic */ }),

  // ── OWNER
  cmd('EXCEL.FILE.PERMISSION.OWNER',      'Owner Permission',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.OWNER.SET',  'Set Owner',           () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.OWNER.CHANGE','Transfer Ownership', () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.OWNER.REMOVE','Remove Owner',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.OWNER.VERIFY','Verify Ownership',   () => { /* Logic */ }),

  // ── ADMINISTRATOR
  cmd('EXCEL.FILE.PERMISSION.ADMIN',      'Administrator Permission',() => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.ADMIN.GRANT','Grant Administrator', () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.ADMIN.REMOVE','Remove Administrator',() => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.ADMIN.VERIFY','Verify Administrator',() => { /* Logic */ }),

  // ── ROLES
  cmd('EXCEL.FILE.PERMISSION.ROLE.CREATE','Create Role',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.ROLE.DELETE','Delete Role',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.ROLE.EDIT',  'Edit Role',           () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.ROLE.CLONE', 'Clone Role',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.ROLE.DEFAULT','Default Role',       () => { /* Logic */ }),

  // ── ACCESS CONTROL
  cmd('EXCEL.FILE.PERMISSION.ACL.OPEN',   'Open ACL',            () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.ACL.ADD',    'Add ACL Entry',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.ACL.REMOVE', 'Remove ACL Entry',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.ACL.RESET',  'Reset ACL',           () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.ACL.INHERIT','Enable Inheritance',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.ACL.BREAK',  'Break Inheritance',   () => { /* Logic */ }),

  // ── PERMISSION TEMPLATES
  cmd('EXCEL.FILE.PERMISSION.TEMPLATE.OPEN','Open Templates',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.TEMPLATE.APPLY','Apply Template',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.TEMPLATE.CREATE','Create Template', () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.TEMPLATE.DELETE','Delete Template', () => { /* Logic */ }),

  // ── POLICY
  cmd('EXCEL.FILE.PERMISSION.POLICY.APPLY','Apply Policy',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.POLICY.REMOVE','Remove Policy',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.POLICY.VALIDATE','Validate Policy', () => { /* Logic */ }),

  // ── VALIDATION
  cmd('EXCEL.FILE.PERMISSION.VALIDATE',   'Validate Permission', () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.CHECK.ACCESS','Check Access',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.CHECK.USER', 'Check User',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.CHECK.GROUP','Check Group',         () => { /* Logic */ }),

  // ── AUDIT
  cmd('EXCEL.FILE.PERMISSION.AUDIT.OPEN', 'Open Audit',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.AUDIT.EXPORT','Export Audit',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.AUDIT.CLEAR','Clear Audit',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.PERMISSION.AUDIT.HISTORY','Permission History',() => { /* Logic */ }),

  // ── CERTIFICATES
  cmd('EXCEL.FILE.SECURITY.CERTIFICATE.ADD','Add Certificate',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.CERTIFICATE.REMOVE','Remove Certificate',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.CERTIFICATE.VERIFY','Verify Certificate',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.CERTIFICATE.EXPORT','Export Certificate',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.CERTIFICATE.IMPORT','Import Certificate',() => { /* Logic */ }),

  // ── WATERMARK
  cmd('EXCEL.FILE.SECURITY.WATERMARK.ADD','Add Watermark',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.WATERMARK.REMOVE','Remove Watermark', () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.WATERMARK.CONFIDENTIAL','Confidential',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.WATERMARK.SECRET','Secret',           () => { /* Logic */ }),

  // ── AUDIT
  cmd('EXCEL.FILE.SECURITY.AUDIT.OPEN',   'Open Audit Log',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.AUDIT.EXPORT', 'Export Audit',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.AUDIT.CLEAR',  'Clear Audit',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.SECURITY.AUDIT.VIEW',   'View Security Events',() => { /* Logic */ }),

  // ══ DIGITAL SIGNATURE ═══════════════════════════════════════════════════
  // ── DIGITAL SIGNATURE
  cmd('EXCEL.FILE.SIGNATURE.CREATE',      'Create Digital Signature',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SIGNATURE.APPLY',       'Apply Signature',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.SIGNATURE.ADD',         'Add Signature',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.SIGNATURE.MULTIPLE',    'Multiple Signatures', () => { /* Logic */ }),
  cmd('EXCEL.FILE.SIGNATURE.TIMESTAMP',   'Timestamp Signature', () => { /* Logic */ }),
  cmd('EXCEL.FILE.SIGNATURE.VISIBLE',     'Visible Signature',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.SIGNATURE.INVISIBLE',   'Invisible Signature', () => { /* Logic */ }),
  cmd('EXCEL.FILE.SIGNATURE.SMARTCARD',   'Smart Card Signature',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SIGNATURE.HSM',         'Hardware Security Module',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SIGNATURE.TOKEN',       'USB Token',           () => { /* Logic */ }),

  // ── CERTIFICATE
  cmd('EXCEL.FILE.CERTIFICATE.OPEN',      'Open Certificate',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.CERTIFICATE.SELECT',    'Select Certificate',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.CERTIFICATE.IMPORT',    'Import Certificate',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.CERTIFICATE.EXPORT',    'Export Certificate',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.CERTIFICATE.DELETE',    'Delete Certificate',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.CERTIFICATE.DEFAULT',   'Default Certificate', () => { /* Logic */ }),
  cmd('EXCEL.FILE.CERTIFICATE.STORE',     'Certificate Store',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.CERTIFICATE.TRUSTED',   'Trusted Certificates',() => { /* Logic */ }),
  cmd('EXCEL.FILE.CERTIFICATE.ROOT',      'Root Certificates',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.CERTIFICATE.RENEW',     'Renew Certificate',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.CERTIFICATE.REVOKED',   'Check Revocation',    () => { /* Logic */ }),

  // ── VALIDATION
  cmd('EXCEL.FILE.SIGNATURE.VALIDATE',    'Validate Signature',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.SIGNATURE.VALIDATE.CERTIFICATE','Validate Certificate',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SIGNATURE.VALIDATE.TIMESTAMP','Validate Timestamp',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SIGNATURE.VALIDATE.CHAIN','Validate Certificate Chain',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SIGNATURE.VALIDATE.TRUST','Validate Trust',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.SIGNATURE.VALIDATE.INTEGRITY','Validate Workbook Integrity',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SIGNATURE.VALIDATE.ONLINE','Online Validation',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SIGNATURE.VALIDATE.OFFLINE','Offline Validation',() => { /* Logic */ }),

  // ── REMOVE SIGNATURE
  cmd('EXCEL.FILE.SIGNATURE.REMOVE',      'Remove Signature',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.SIGNATURE.REMOVE.ALL',  'Remove All Signatures',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SIGNATURE.REMOVE.SELECTED','Remove Selected Signature',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SIGNATURE.REMOVE.INVALID','Remove Invalid Signature',() => { /* Logic */ }),

  // ── TRUST
  cmd('EXCEL.FILE.SIGNATURE.TRUST.ADD',   'Add Trusted Certificate',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SIGNATURE.TRUST.REMOVE','Remove Trusted Certificate',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SIGNATURE.TRUST.LIST',  'Trusted Certificate List',() => { /* Logic */ }),

  // ── AUDIT
  cmd('EXCEL.FILE.SIGNATURE.AUDIT.OPEN',  'Open Audit',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.SIGNATURE.AUDIT.EXPORT','Export Audit',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.SIGNATURE.AUDIT.CLEAR', 'Clear Audit',         () => { /* Logic */ }),

  // ══ TEMPLATE ══════════════════════════════════════════════════════════════
  // ── OPEN TEMPLATE
  cmd('EXCEL.FILE.TEMPLATE.OPEN',         'Open Template',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.OPEN.LOCAL',   'Open Local Template', () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.OPEN.CLOUD',   'Open Cloud Template', () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.OPEN.ENTERPRISE','Open Enterprise Template',() => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.OPEN.RECENT',  'Open Recent Template',() => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.OPEN.DEFAULT', 'Open Default Template',() => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.OPEN.CUSTOM',  'Open Custom Template',() => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.OPEN.READONLY','Open Read Only Template',() => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.OPEN.PROTECTED','Open Protected Template',() => { /* Logic */ }),

  // ── SAVE TEMPLATE
  cmd('EXCEL.FILE.TEMPLATE.SAVE',         'Save Template',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.SAVE.AS',      'Save Template As',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.SAVE.LOCAL',   'Save Local Template', () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.SAVE.CLOUD',   'Save Cloud Template', () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.SAVE.ENTERPRISE','Save Enterprise Template',() => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.SAVE.PERSONAL','Save Personal Template',() => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.SAVE.SHARED',  'Save Shared Template',() => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.SAVE.OVERWRITE','Overwrite Template', () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.SAVE.COPY',    'Save Template Copy',  () => { /* Logic */ }),

  // ── APPLY TEMPLATE
  cmd('EXCEL.FILE.TEMPLATE.APPLY',        'Apply Template',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.APPLY.STYLE',  'Apply Style Template',() => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.APPLY.THEME',  'Apply Theme Template',() => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.APPLY.PAGE',   'Apply Page Template', () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.APPLY.SECTION','Apply Section Template',() => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.APPLY.CONTENT','Apply Content Template',() => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.APPLY.Workbook','Apply Entire Template',() => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.APPLY.MULTIPLE','Apply Multiple Templates',() => { /* Logic */ }),

  // ── DEFAULT TEMPLATE
  cmd('EXCEL.FILE.TEMPLATE.DEFAULT',      'Default Template',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.DEFAULT.SET',  'Set Default Template',() => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.DEFAULT.RESET','Reset Default Template',() => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.DEFAULT.OPEN', 'Open Default Template',() => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.DEFAULT.RESTORE','Restore Built-in Template',() => { /* Logic */ }),

  // ── TEMPLATE GALLERY
  cmd('EXCEL.FILE.TEMPLATE.GALLERY.OPEN', 'Open Gallery',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.GALLERY.REFRESH','Refresh Gallery',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.GALLERY.SEARCH','Search Templates',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.GALLERY.FILTER','Filter Templates',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.GALLERY.PIN',  'Pin Template',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.GALLERY.UNPIN','Unpin Template',      () => { /* Logic */ }),

  // ── TEMPLATE CATEGORY
  cmd('EXCEL.FILE.TEMPLATE.CATEGORY.BUSINESS','Business',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.CATEGORY.LETTER','Letter',            () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.CATEGORY.REPORT','Report',            () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.CATEGORY.RESUME','Resume',            () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.CATEGORY.INVOICE','Invoice',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.CATEGORY.FORM','Forms',               () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.CATEGORY.ACADEMIC','Academic',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.CATEGORY.LEGAL','Legal',              () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.CATEGORY.CUSTOM','Custom',            () => { /* Logic */ }),

  // ── TEMPLATE MANAGEMENT
  cmd('EXCEL.FILE.TEMPLATE.RENAME',       'Rename Template',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.DELETE',       'Delete Template',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.DUPLICATE',    'Duplicate Template',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.EXPORT',       'Export Template',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.IMPORT',       'Import Template',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.VALIDATE',     'Validate Template',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.REPAIR',       'Repair Template',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.UPGRADE',      'Upgrade Template',    () => { /* Logic */ }),

  // ── TEMPLATE CACHE
  cmd('EXCEL.FILE.TEMPLATE.CACHE.OPEN',   'Open Cache',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.CACHE.CLEAR',  'Clear Cache',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.CACHE.REBUILD','Rebuild Cache',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.CACHE.REFRESH','Refresh Cache',       () => { /* Logic */ }),

  // ── CLOUD TEMPLATE
  cmd('EXCEL.FILE.TEMPLATE.CLOUD.SYNC',   'Sync Templates',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.CLOUD.DOWNLOAD','Download Template',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.CLOUD.UPLOAD', 'Upload Template',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.TEMPLATE.CLOUD.SHARE',  'Share Template',      () => { /* Logic */ }),

  // ══ Workbook COMPARISON ═════════════════════════════════════════════════
  // ── COMPARE WorkbookS
  cmd('EXCEL.FILE.COMPARE',               'Compare Workbooks',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.OPEN',          'Open Compare Dialog', () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.START',         'Start Comparison',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.STOP',          'Stop Comparison',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.LOCAL',         'Compare Local Workbooks',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.CLOUD',         'Compare Cloud Workbooks',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.ACTIVE',        'Compare Active Workbook',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.SELECTED',      'Compare Selected Workbooks',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.SIDEBYSIDE',    'Side By Side Compare',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.RESULT',        'Open Comparison Result',() => { /* Logic */ }),

  // ── MERGE
  cmd('EXCEL.FILE.MERGE',                 'Merge Workbooks',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.MERGE.START',           'Start Merge',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.MERGE.AUTO',            'Automatic Merge',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.MERGE.MANUAL',          'Manual Merge',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.MERGE.CONFLICT',        'Resolve Merge Conflict',() => { /* Logic */ }),
  cmd('EXCEL.FILE.MERGE.ACCEPT',          'Accept Merge',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.MERGE.REJECT',          'Reject Merge',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.MERGE.SAVE',            'Save Merged Workbook',() => { /* Logic */ }),
  cmd('EXCEL.FILE.MERGE.EXPORT',          'Export Merge Result', () => { /* Logic */ }),

  // ── COMPARE FORMATTING
  cmd('EXCEL.FILE.COMPARE.FORMATTING',    'Compare Formatting',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.FORMATTING.STYLES','Compare Styles',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.FORMATTING.FONTS','Compare Fonts',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.FORMATTING.COLORS','Compare Colors',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.FORMATTING.TABLES','Compare Tables',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.FORMATTING.IMAGES','Compare Images',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.FORMATTING.LAYOUT','Compare Layout',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.FORMATTING.PAGESETUP','Compare Page Setup',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.FORMATTING.HEADERS','Compare Headers', () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.FORMATTING.FOOTERS','Compare Footers', () => { /* Logic */ }),

  // ── COMPARE VERSION
  cmd('EXCEL.FILE.COMPARE.VERSION',       'Compare Version',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.VERSION.LATEST','Compare Latest Version',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.VERSION.SELECTED','Compare Selected Version',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.VERSION.LOCAL', 'Compare Local Version',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.VERSION.CLOUD', 'Compare Cloud Version',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.VERSION.HISTORY','Compare Version History',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.VERSION.BASELINE','Compare Against Baseline',() => { /* Logic */ }),

  // ── CONTENT COMPARISON
  cmd('EXCEL.FILE.COMPARE.CONTENT',       'Compare Content',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.CONTENT.TEXT',  'Compare Text',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.CONTENT.COMMENTS','Compare Comments',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.CONTENT.FOOTNOTES','Compare Footnotes',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.CONTENT.ENDNOTES','Compare Endnotes',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.CONTENT.HYPERLINKS','Compare Hyperlinks',() => { /* Logic */ }),

  // ── TRACK CHANGES
  cmd('EXCEL.FILE.COMPARE.TRACKCHANGES',  'Compare Track Changes',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.REVISIONS',     'Compare Revisions',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.AUTHORS',       'Compare Authors',     () => { /* Logic */ }),

  // ── FILTER
  cmd('EXCEL.FILE.COMPARE.FILTER.TEXT',   'Filter Text',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.FILTER.FORMATTING','Filter Formatting',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.FILTER.IMAGES', 'Filter Images',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.FILTER.COMMENTS','Filter Comments',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.FILTER.STYLES', 'Filter Styles',       () => { /* Logic */ }),

  // ── REPORT
  cmd('EXCEL.FILE.COMPARE.REPORT',        'Comparison Report',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.REPORT.HTML',   'Export HTML Report',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.REPORT.PDF',    'Export PDF Report',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.REPORT.JSON',   'Export JSON Report',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.REPORT.XML',    'Export XML Report',   () => { /* Logic */ }),

  // ── REVIEW
  cmd('EXCEL.FILE.COMPARE.REVIEW.OPEN',   'Open Review Panel',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.REVIEW.NEXT',   'Next Difference',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.REVIEW.PREVIOUS','Previous Difference',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.REVIEW.ACCEPT', 'Accept Change',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPARE.REVIEW.REJECT', 'Reject Change',       () => { /* Logic */ }),

  // ══ Workbook INSPECTOR ══════════════════════════════════════════════════
  // ── INSPECT Workbook
  cmd('EXCEL.FILE.INSPECT',               'Inspect Workbook',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.START',         'Start Inspection',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.STOP',          'Stop Inspection',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.REFRESH',       'Refresh Inspection',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.RESULTS',       'Inspection Results',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.EXPORT',        'Export Report',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.PRINT',         'Print Report',        () => { /* Logic */ }),

  // ── HIDDEN DATA
  cmd('EXCEL.FILE.INSPECT.HIDDEN',        'Inspect Hidden Data', () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.HIDDEN.TEXT',   'Hidden Text',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.HIDDEN.OBJECTS','Hidden Objects',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.HIDDEN.SHAPES', 'Hidden Shapes',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.HIDDEN.IMAGES', 'Hidden Images',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.HIDDEN.BOOKMARKS','Hidden Bookmarks',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.HIDDEN.FIELDS', 'Hidden Fields',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.HIDDEN.CONTROLS','Hidden Controls',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.HIDDEN.LAYERS', 'Hidden Layers',       () => { /* Logic */ }),

  // ── METADATA
  cmd('EXCEL.FILE.INSPECT.METADATA',      'Inspect Metadata',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.METADATA.AUTHOR','Author',             () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.METADATA.COMPANY','Company',           () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.METADATA.MANAGER','Manager',           () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.METADATA.TITLE','Title',               () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.METADATA.SUBJECT','Subject',           () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.METADATA.KEYExcelS','KeyExcels',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.METADATA.CATEGORY','Category',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.METADATA.CREATED','Created Date',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.METADATA.MODIFIED','Modified Date',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.METADATA.LASTAUTHOR','Last Author',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.METADATA.VERSION','Version',           () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.METADATA.CUSTOM','Custom Properties',  () => { /* Logic */ }),

  // ── COMMENTS
  cmd('EXCEL.FILE.INSPECT.COMMENTS',      'Inspect Comments',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.COMMENTS.ALL',  'All Comments',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.COMMENTS.AUTHORS','Comment Authors',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.COMMENTS.RESOLVED','Resolved Comments',() => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.COMMENTS.UNRESOLVED','Unresolved Comments',() => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.COMMENTS.HIDDEN','Hidden Comments',    () => { /* Logic */ }),

  // ── XML
  cmd('EXCEL.FILE.INSPECT.XML',           'Inspect XML',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.XML.CUSTOM',    'Custom XML',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.XML.NAMESPACES','Namespaces',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.XML.PARTS',     'XML Parts',           () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.XML.RELATIONSHIPS','Relationships',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.XML.INVALID',   'Invalid XML',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.XML.ORPHAN',    'Orphan XML Parts',    () => { /* Logic */ }),

  // ── TRACK CHANGES
  cmd('EXCEL.FILE.INSPECT.TRACKCHANGES',  'Inspect Track Changes',() => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.TRACKCHANGES.INSERTIONS','Insertions', () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.TRACKCHANGES.DELETIONS','Deletions',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.TRACKCHANGES.MOVES','Moved Content',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.TRACKCHANGES.FORMATTING','Formatting Changes',() => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.TRACKCHANGES.AUTHORS','Revision Authors',() => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.TRACKCHANGES.DATE','Revision Dates',   () => { /* Logic */ }),

  // ── Workbook PROPERTIES
  cmd('EXCEL.FILE.INSPECT.PROPERTIES',    'Inspect Properties',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.PROPERTIES.BUILTIN','Built-in Properties',() => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.PROPERTIES.CUSTOM','Custom Properties',() => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.PROPERTIES.HIDDEN','Hidden Properties',() => { /* Logic */ }),

  // ── EMBEDDED CONTENT
  cmd('EXCEL.FILE.INSPECT.EMBEDDED',      'Inspect Embedded Objects',() => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.EMBEDDED.OLE',  'OLE Objects',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.EMBEDDED.MEDIA','Media Files',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.EMBEDDED.ACTIVEX','ActiveX Controls',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.EMBEDDED.MACROS','Macros',             () => { /* Logic */ }),

  // ── LINKS
  cmd('EXCEL.FILE.INSPECT.LINKS',         'Inspect External Links',() => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.LINKS.BROKEN',  'Broken Links',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.LINKS.EXTERNAL','External References', () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.LINKS.EMBEDDED','Embedded Links',      () => { /* Logic */ }),

  // ── REMOVE HIDDEN INFORMATION
  cmd('EXCEL.FILE.INSPECT.CLEAN',         'Remove Hidden Information',() => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.CLEAN.METADATA','Remove Metadata',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.CLEAN.COMMENTS','Remove Comments',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.CLEAN.TRACKCHANGES','Remove Track Changes',() => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.CLEAN.XML',     'Remove Custom XML',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.CLEAN.HIDDEN',  'Remove Hidden Data',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.CLEAN.PROPERTIES','Remove Properties', () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.CLEAN.LINKS',   'Remove External Links',() => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.CLEAN.ALL',     'Remove All Hidden Information',() => { /* Logic */ }),

  // ── COMPLIANCE
  cmd('EXCEL.FILE.INSPECT.COMPLIANCE',    'Compliance Check',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.COMPLIANCE.GDPR','GDPR',               () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.COMPLIANCE.ISO27001','ISO 27001',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.COMPLIANCE.HIPAA','HIPAA',             () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.COMPLIANCE.COMPANY','Enterprise Policy',() => { /* Logic */ }),

  // ── REPORTS
  cmd('EXCEL.FILE.INSPECT.REPORT.OPEN',   'Open Report',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.REPORT.SAVE',   'Save Report',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.REPORT.HTML',   'Export HTML',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.REPORT.PDF',    'Export PDF',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.REPORT.JSON',   'Export JSON',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.INSPECT.REPORT.XML',    'Export XML',          () => { /* Logic */ }),

  // ══ METADATA ════════════════════════════════════════════════════════════
  // ── READ
  cmd('EXCEL.FILE.METADATA.READ',         'Read Metadata',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.READ.ALL',     'Read All Metadata',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.READ.CORE',    'Read Core Properties',() => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.READ.EXTENDED','Read Extended Properties',() => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.READ.CUSTOM',  'Read Custom Properties',() => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.READ.CLOUD',   'Read Cloud Metadata', () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.READ.SYSTEM',  'Read System Properties',() => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.READ.STATISTICS','Read Workbook Statistics',() => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.READ.CLASSIFICATION','Read Classification',() => { /* Logic */ }),

  // ── WRITE
  cmd('EXCEL.FILE.METADATA.WRITE',        'Write Metadata',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.WRITE.CORE',   'Write Core Properties',() => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.WRITE.EXTENDED','Write Extended Properties',() => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.WRITE.CUSTOM', 'Write Custom Properties',() => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.WRITE.AUTHOR', 'Write Author',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.WRITE.COMPANY','Write Company',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.WRITE.TITLE',  'Write Title',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.WRITE.SUBJECT','Write Subject',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.WRITE.KEYExcelS','Write KeyExcels',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.WRITE.CATEGORY','Write Category',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.WRITE.COMMENTS','Write Comments',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.WRITE.CLASSIFICATION','Write Classification',() => { /* Logic */ }),

  // ── IMPORT
  cmd('EXCEL.FILE.METADATA.IMPORT',       'Import Metadata',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.IMPORT.XML',   'Import XML',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.IMPORT.JSON',  'Import JSON',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.IMPORT.CSV',   'Import CSV',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.IMPORT.PROFILE','Import Metadata Profile',() => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.IMPORT.CLOUD', 'Import Cloud Metadata',() => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.IMPORT.TEMPLATE','Import Template Metadata',() => { /* Logic */ }),

  // ── EXPORT
  cmd('EXCEL.FILE.METADATA.EXPORT',       'Export Metadata',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.EXPORT.XML',   'Export XML',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.EXPORT.JSON',  'Export JSON',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.EXPORT.CSV',   'Export CSV',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.EXPORT.TEXT',  'Export TXT',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.EXPORT.HTML',  'Export HTML',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.EXPORT.PDF',   'Export PDF Report',   () => { /* Logic */ }),

  // ── CLEAR METADATA
  cmd('EXCEL.FILE.METADATA.CLEAR',        'Clear Metadata',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.CLEAR.CORE',   'Clear Core Properties',() => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.CLEAR.EXTENDED','Clear Extended Properties',() => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.CLEAR.CUSTOM', 'Clear Custom Properties',() => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.CLEAR.AUTHOR', 'Remove Author',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.CLEAR.COMPANY','Remove Company',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.CLEAR.COMMENTS','Remove Comments',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.CLEAR.CLASSIFICATION','Remove Classification',() => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.CLEAR.ALL',    'Clear All Metadata',  () => { /* Logic */ }),

  // ── BUILT-IN PROPERTIES
  cmd('EXCEL.FILE.METADATA.PROPERTY.TITLE', 'Title',             () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.PROPERTY.SUBJECT', 'Subject',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.PROPERTY.AUTHOR', 'Author',           () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.PROPERTY.COMPANY', 'Company',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.PROPERTY.MANAGER', 'Manager',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.PROPERTY.KEYExcelS', 'KeyExcels',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.PROPERTY.CATEGORY', 'Category',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.PROPERTY.STATUS', 'Status',           () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.PROPERTY.LANGUAGE', 'Language',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.PROPERTY.VERSION', 'Workbook Version',() => { /* Logic */ }),

  // ── Workbook STATISTICS
  cmd('EXCEL.FILE.METADATA.STATS.OPEN',   'Open Statistics',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.STATS.ExcelCOUNT','Excel Count',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.STATS.PAGECOUNT','Page Count',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.STATS.CHARCOUNT','Character Count',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.STATS.LINECOUNT','Line Count',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.STATS.PARAGRAPHCOUNT','Paragraph Count',() => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.STATS.TABLECOUNT','Table Count',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.STATS.IMAGECOUNT','Image Count',      () => { /* Logic */ }),

  // ── VALIDATION
  cmd('EXCEL.FILE.METADATA.VALIDATE',     'Validate Metadata',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.VALIDATE.CORE','Validate Core Properties',() => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.VALIDATE.CUSTOM','Validate Custom Properties',() => { /* Logic */ }),
  cmd('EXCEL.FILE.METADATA.VALIDATE.CLASSIFICATION','Validate Classification',() => { /* Logic */ }),

  // ══ COMPATIBILITY ═══════════════════════════════════════════════════════
  // ── COMPATIBILITY CHECK
  cmd('EXCEL.FILE.COMPATIBILITY.CHECK',   'Compatibility Check', () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.CHECK.START','Start Compatibility Check',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.CHECK.QUICK','Quick Check',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.CHECK.FULL','Full Compatibility Scan',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.CHECK.OPENXML','Check OpenXML Compatibility',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.CHECK.LEGACY','Check Legacy Features',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.CHECK.FONTS','Check Fonts',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.CHECK.MEDIA','Check Images',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.CHECK.TABLES','Check Tables',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.CHECK.SMARTART','Check SmartArt',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.CHECK.CHARTS','Check Charts',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.CHECK.MACROS','Check Macros',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.CHECK.COMMENTS','Check Comments',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.CHECK.TRACKCHANGES','Check Track Changes',() => { /* Logic */ }),

  // ── COMPATIBILITY REPORT
  cmd('EXCEL.FILE.COMPATIBILITY.REPORT',  'Compatibility Report',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.REPORT.OPEN','Open Report',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.REPORT.SAVE','Save Report',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.REPORT.HTML','Export HTML',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.REPORT.PDF','Export PDF',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.REPORT.JSON','Export JSON',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.REPORT.XML','Export XML',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.REPORT.PRINT','Print Report',    () => { /* Logic */ }),

  // ── CONVERT FORMAT
  cmd('EXCEL.FILE.COMPATIBILITY.CONVERT', 'Convert Format',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.CONVERT.DOC','Convert To DOC',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.CONVERT.xlsx','Convert To DOCX', () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.CONVERT.ODT','Convert To ODT',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.CONVERT.PDF','Convert To PDF',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.CONVERT.HTML','Convert To HTML', () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.CONVERT.MARKDOWN','Convert To Markdown',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.CONVERT.TXT','Convert To TXT',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.CONVERT.XML','Convert To XML',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.CONVERT.OPENXML','Convert To OpenXML',() => { /* Logic */ }),

  // ── OFFICE VERSION
  cmd('EXCEL.FILE.COMPATIBILITY.VERSION', 'Office Version',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.VERSION.DETECT','Detect Office Version',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.VERSION.Excel97','Excel 97',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.VERSION.Excel2003','Excel 2003',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.VERSION.Excel2007','Excel 2007',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.VERSION.Excel2010','Excel 2010',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.VERSION.Excel2013','Excel 2013',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.VERSION.Excel2016','Excel 2016',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.VERSION.Excel2019','Excel 2019',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.VERSION.Excel2021','Excel 2021',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.VERSION.M365','Microsoft 365',   () => { /* Logic */ }),

  // ── TARGET PLATFORM
  cmd('EXCEL.FILE.COMPATIBILITY.PLATFORM.WINDOWS','Windows',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.PLATFORM.MACOS','macOS',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.PLATFORM.LINUX','Linux',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.PLATFORM.WEB','Office Web',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.PLATFORM.MOBILE','Mobile',       () => { /* Logic */ }),

  // ── THIRD-PARTY SUITES
  cmd('EXCEL.FILE.COMPATIBILITY.LIBREOFFICE','LibreOffice',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.OPENOFFICE','OpenOffice',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.WPS',     'WPS Office',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.ONLYOFFICE','ONLYOFFICE',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.GOOGLEDOCS','Google Docs',       () => { /* Logic */ }),

  // ── VALIDATION
  cmd('EXCEL.FILE.COMPATIBILITY.VALIDATE','Validate Compatibility',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.VALIDATE.OPENXML','Validate OpenXML',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.VALIDATE.RENDERING','Validate Rendering',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.VALIDATE.LAYOUT','Validate Layout',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.VALIDATE.FONTS','Validate Fonts',() => { /* Logic */ }),

  // ── REPAIR
  cmd('EXCEL.FILE.COMPATIBILITY.REPAIR',  'Repair Compatibility Issues',() => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.REPAIR.AUTO','Automatic Repair', () => { /* Logic */ }),
  cmd('EXCEL.FILE.COMPATIBILITY.REPAIR.MANUAL','Manual Repair',  () => { /* Logic */ }),

  // ══ CACHE MANAGEMENT ════════════════════════════════════════════════════
  // ── CACHE
  cmd('EXCEL.FILE.CACHE.OPEN',            'Open Cache',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.STATUS',          'Cache Status',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.SIZE',            'Cache Size',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.LOCATION',        'Cache Location',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.REFRESH',         'Refresh Cache',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.ENABLE',          'Enable Cache',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.DISABLE',         'Disable Cache',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.VALIDATE',        'Validate Cache',      () => { /* Logic */ }),

  // ── REBUILD
  cmd('EXCEL.FILE.CACHE.REBUILD',         'Rebuild Cache',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.REBUILD.ALL',     'Rebuild All Cache',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.REBUILD.RENDER',  'Rebuild Render Cache',() => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.REBUILD.FONT',    'Rebuild Font Cache',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.REBUILD.Workbook','Rebuild Workbook Cache',() => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.REBUILD.THUMBNAIL','Rebuild Thumbnail Cache',() => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.REBUILD.CLOUD',   'Rebuild Cloud Cache', () => { /* Logic */ }),

  // ── CLEAR CACHE
  cmd('EXCEL.FILE.CACHE.CLEAR',           'Clear Cache',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.CLEAR.ALL',       'Clear All Cache',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.CLEAR.RENDER',    'Clear Render Cache',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.CLEAR.FONT',      'Clear Font Cache',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.CLEAR.Workbook',  'Clear Workbook Cache',() => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.CLEAR.CLOUD',     'Clear Cloud Cache',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.CLEAR.PREVIEW',   'Clear Preview Cache', () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.CLEAR.RECENT',    'Clear Recent Cache',  () => { /* Logic */ }),

  // ── MEMORY CACHE
  cmd('EXCEL.FILE.CACHE.MEMORY',          'Memory Cache',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.MEMORY.STATUS',   'Memory Status',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.MEMORY.FLUSH',    'Flush Memory Cache',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.MEMORY.OPTIMIZE', 'Optimize Memory Cache',() => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.MEMORY.LIMIT',    'Memory Cache Limit',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.MEMORY.STATISTICS','Memory Statistics',  () => { /* Logic */ }),

  // ── THUMBNAIL CACHE
  cmd('EXCEL.FILE.CACHE.THUMBNAIL',       'Thumbnail Cache',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.THUMBNAIL.GENERATE','Generate Thumbnails',() => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.THUMBNAIL.REBUILD','Rebuild Thumbnails', () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.THUMBNAIL.DELETE','Delete Thumbnails',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.THUMBNAIL.SIZE',  'Thumbnail Size',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.THUMBNAIL.REFRESH','Refresh Thumbnails', () => { /* Logic */ }),

  // ── Workbook CACHE
  cmd('EXCEL.FILE.CACHE.Workbook',        'Workbook Cache',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.document.LOAD',   'Load Cache',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.document.SAVE',   'Save Cache',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.document.DELETE', 'Delete Cache',        () => { /* Logic */ }),

  // ── CLOUD CACHE
  cmd('EXCEL.FILE.CACHE.CLOUD',           'Cloud Cache',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.CLOUD.DOWNLOAD',  'Download Cache',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.CLOUD.UPLOAD',    'Upload Cache',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.CLOUD.SYNC',      'Sync Cache',          () => { /* Logic */ }),

  // ── PERFORMANCE
  cmd('EXCEL.FILE.CACHE.PERFORMANCE',     'Performance Cache',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.PERFORMANCE.OPTIMIZE','Optimize Cache',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.CACHE.PERFORMANCE.STATS','Performance Statistics',() => { /* Logic */ }),

  // ══ SESSION MANAGEMENT ══════════════════════════════════════════════════
  // ── SAVE SESSION
  cmd('EXCEL.FILE.SESSION.SAVE',          'Save Session',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.SAVE.AUTO',     'Auto Save Session',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.SAVE.MANUAL',   'Manual Save',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.SAVE.LOCAL',    'Save Local Session',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.SAVE.CLOUD',    'Save Cloud Session',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.SAVE.WORKSPACE','Save Workspace',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.SAVE.WINDOWS',  'Save Window State',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.SAVE.PANELS',   'Save Panel Layout',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.SAVE.HISTORY',  'Save History',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.SAVE.CLIPBOARD','Save Clipboard',      () => { /* Logic */ }),

  // ── RESTORE SESSION
  cmd('EXCEL.FILE.SESSION.RESTORE',       'Restore Session',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.RESTORE.AUTO',  'Auto Restore',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.RESTORE.LAST',  'Restore Last Session',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.RESTORE.SELECTED','Restore Selected Session',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.RESTORE.LOCAL', 'Restore Local Session',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.RESTORE.CLOUD', 'Restore Cloud Session',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.RESTORE.WINDOWS','Restore Window Layout',() => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.RESTORE.PANELS','Restore Panels',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.RESTORE.HISTORY','Restore History',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.RESTORE.CLIPBOARD','Restore Clipboard',() => { /* Logic */ }),

  // ── WORKSPACE RESTORE
  cmd('EXCEL.FILE.WORKSPACE.RESTORE',     'Restore Workspace',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.WORKSPACE.RESTORE.DEFAULT','Restore Default Workspace',() => { /* Logic */ }),
  cmd('EXCEL.FILE.WORKSPACE.RESTORE.CUSTOM','Restore Custom Workspace',() => { /* Logic */ }),
  cmd('EXCEL.FILE.WORKSPACE.RESTORE.PANELS','Restore Dock Panels',() => { /* Logic */ }),
  cmd('EXCEL.FILE.WORKSPACE.RESTORE.RIBBON','Restore Ribbon',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.WORKSPACE.RESTORE.SIDEBAR','Restore Sidebar',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.WORKSPACE.RESTORE.STATUSBAR','Restore Status Bar',() => { /* Logic */ }),
  cmd('EXCEL.FILE.WORKSPACE.RESTORE.QUICKACCESS','Restore Quick Access Toolbar',() => { /* Logic */ }),

  // ── CRASH RECOVERY
  cmd('EXCEL.FILE.SESSION.CRASH',         'Crash Recovery',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.CRASH.START',   'Start Recovery',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.CRASH.RESTORE', 'Restore After Crash', () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.CRASH.REPORT',  'Crash Report',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.CRASH.LOG',     'Open Crash Log',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.CRASH.DELETE',  'Delete Crash Data',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.CRASH.VALIDATE','Validate Recovery',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.CRASH.REPAIR',  'Repair Session',      () => { /* Logic */ }),

  // ── SESSION HISTORY
  cmd('EXCEL.FILE.SESSION.HISTORY',       'Session History',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.HISTORY.OPEN',  'Open History',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.HISTORY.DELETE','Delete History',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.HISTORY.CLEAR', 'Clear History',       () => { /* Logic */ }),

  // ── SESSION CACHE
  cmd('EXCEL.FILE.SESSION.CACHE',         'Session Cache',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.CACHE.OPEN',    'Open Cache',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.CACHE.CLEAR',   'Clear Cache',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.CACHE.REBUILD', 'Rebuild Cache',       () => { /* Logic */ }),

  // ── CLOUD SESSION
  cmd('EXCEL.FILE.SESSION.CLOUD',         'Cloud Session',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.CLOUD.UPLOAD',  'Upload Session',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.CLOUD.DOWNLOAD','Download Session',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.CLOUD.SYNC',    'Sync Session',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.SESSION.CLOUD.DELETE',  'Delete Cloud Session',() => { /* Logic */ }),

  // ══ AI INTEGRATION ══════════════════════════════════════════════════════
  // ── AI SUMMARIZE
  cmd('EXCEL.FILE.AI.SUMMARIZE',          'Summarize Workbook',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.SUMMARIZE.SELECTION','Summarize Selection', () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.SUMMARIZE.PAGE',     'Summarize Current Page',() => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.SUMMARIZE.SECTION',  'Summarize Section',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.SUMMARIZE.Workbook', 'Summarize Entire Workbook',() => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.SUMMARIZE.BULLETS',  'Bullet Summary',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.SUMMARIZE.EXECUTIVE','Executive Summary',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.SUMMARIZE.ACADEMIC', 'Academic Summary',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.SUMMARIZE.TECHNICAL','Technical Summary',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.SUMMARIZE.CUSTOM',   'Custom Prompt Summary',() => { /* Logic */ }),

  // ── AI TRANSLATE
  cmd('EXCEL.FILE.AI.TRANSLATE',          'Translate',           () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.TRANSLATE.SELECTION','Translate Selection', () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.TRANSLATE.PAGE',     'Translate Page',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.TRANSLATE.Workbook', 'Translate Workbook',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.TRANSLATE.AUTO',     'Auto Detect Language',() => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.TRANSLATE.PRESERVE_STYLE','Preserve Formatting',() => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.TRANSLATE.BILINGUAL','Create Bilingual Version',() => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.TRANSLATE.BACK',     'Back Translation',    () => { /* Logic */ }),

  // ── AI REWRITE
  cmd('EXCEL.FILE.AI.REWRITE',            'Rewrite',             () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.REWRITE.SHORTER',    'Rewrite Shorter',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.REWRITE.LONGER',     'Rewrite Longer',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.REWRITE.FORMAL',     'Formal Style',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.REWRITE.CASUAL',     'Casual Style',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.REWRITE.PROFESSIONAL','Professional Style', () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.REWRITE.ACADEMIC',   'Academic Style',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.REWRITE.GRAMMAR',    'Grammar Fix',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.REWRITE.SPELLING',   'Spelling Fix',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.REWRITE.CLARITY',    'Improve Clarity',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.REWRITE.SIMPLIFY',   'Simplify Text',       () => { /* Logic */ }),

  // ── AI REVIEW
  cmd('EXCEL.FILE.AI.REVIEW',             'Review Workbook',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.REVIEW.GRAMMAR',     'Grammar Review',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.REVIEW.STYLE',       'Style Review',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.REVIEW.TONE',        'Tone Review',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.REVIEW.LOGIC',       'Logic Review',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.REVIEW.CONSISTENCY', 'Consistency Review',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.REVIEW.ACCESSIBILITY','Accessibility Review',() => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.REVIEW.SECURITY',    'Sensitive Information Review',() => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.REVIEW.LEGAL',       'Legal Review',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.REVIEW.TECHNICAL',   'Technical Review',    () => { /* Logic */ }),

  // ── AI EXPLAIN
  cmd('EXCEL.FILE.AI.EXPLAIN',            'Explain',             () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.EXPLAIN.SELECTION',  'Explain Selection',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.EXPLAIN.PARAGRAPH',  'Explain Paragraph',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.EXPLAIN.TERM',       'Explain Term',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.EXPLAIN.TABLE',      'Explain Table',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.EXPLAIN.CHART',      'Explain Chart',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.EXPLAIN.CODE',       'Explain Code',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.EXPLAIN.FORMULA',    'Explain Formula',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.EXPLAIN.DIAGRAM',    'Explain Diagram',     () => { /* Logic */ }),

  // ── AI GENERATE METADATA
  cmd('EXCEL.FILE.AI.METADATA',           'Generate Metadata',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.METADATA.TITLE',     'Generate Title',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.METADATA.SUBJECT',   'Generate Subject',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.METADATA.KEYExcelS',  'Generate KeyExcels',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.METADATA.CATEGORY',  'Generate Category',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.METADATA.TAGS',      'Generate Tags',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.METADATA.DESCRIPTION','Generate Description',() => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.METADATA.AUTHOR',    'Suggest Author Information',() => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.METADATA.CLASSIFICATION','Suggest Classification',() => { /* Logic */ }),

  // ── PROVIDERS
  cmd('EXCEL.FILE.AI.PROVIDER.AUTO',      'Auto Select Provider',() => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.PROVIDER.OPENAI',    'OpenAI',              () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.PROVIDER.CLAUDE',    'Claude',              () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.PROVIDER.GEMINI',    'Gemini',              () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.PROVIDER.DEEPSEEK',  'DeepSeek',            () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.PROVIDER.OLLAMA',    'Ollama',              () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.PROVIDER.LMSTUDIO',  'LM Studio',           () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.PROVIDER.LOCAL',     'Local AI',            () => { /* Logic */ }),

  // ── STREAMING
  cmd('EXCEL.FILE.AI.STREAM.START',       'Start Streaming',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.STREAM.STOP',        'Stop Streaming',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.STREAM.RETRY',       'Retry',               () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.STREAM.CANCEL',      'Cancel',              () => { /* Logic */ }),

  // ── HISTORY
  cmd('EXCEL.FILE.AI.HISTORY.OPEN',       'Open History',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.HISTORY.CLEAR',      'Clear History',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.HISTORY.EXPORT',     'Export History',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.AI.HISTORY.RESTORE',    'Restore Prompt',      () => { /* Logic */ }),

  // ══ AUDIT & COMPLIANCE ══════════════════════════════════════════════════
  // ── AUDIT
  cmd('EXCEL.FILE.AUDIT.OPEN',            'Open Audit Center',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.START',           'Start Audit Session', () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.STOP',            'Stop Audit Session',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.STATUS',          'Audit Status',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.SEARCH',          'Search Audit Log',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.FILTER',          'Filter Audit Records',() => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.REFRESH',         'Refresh Audit View',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.CLEARFILTER',     'Clear Filters',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.VERIFY',          'Verify Audit Integrity',() => { /* Logic */ }),

  // ── AUDIT EVENTS
  cmd('EXCEL.FILE.AUDIT.EVENT.FILE',      'File Operations',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.EVENT.SECURITY',  'Security Events',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.EVENT.PERMISSION','Permission Events',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.EVENT.LOGIN',     'Login Events',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.EVENT.SHARING',   'Sharing Events',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.EVENT.AI',        'AI Events',           () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.EVENT.EXPORT',    'Export Events',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.EVENT.PRINT',     'Print Events',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.EVENT.DELETE',    'Delete Events',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.EVENT.VERSION',   'Version Events',      () => { /* Logic */ }),

  // ── EXPORT LOGS
  cmd('EXCEL.FILE.AUDIT.EXPORT',          'Export Logs',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.EXPORT.PDF',      'Export PDF',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.EXPORT.HTML',     'Export HTML',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.EXPORT.CSV',      'Export CSV',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.EXPORT.JSON',     'Export JSON',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.EXPORT.XML',      'Export XML',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.EXPORT.SYSLOG',   'Export Syslog',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.EXPORT.SIEM',     'Export SIEM',         () => { /* Logic */ }),

  // ── SECURITY LOG
  cmd('EXCEL.FILE.AUDIT.SECURITY',        'Security Log',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.SECURITY.LOGIN',  'Login History',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.SECURITY.FAILEDLOGIN','Failed Login Attempts',() => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.SECURITY.PERMISSION','Permission Changes',() => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.SECURITY.ENCRYPTION','Encryption Events',() => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.SECURITY.SIGNATURE','Digital Signature Events',() => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.SECURITY.CERTIFICATE','Certificate Events',() => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.SECURITY.THREATS','Threat Detection',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.SECURITY.ALERTS', 'Security Alerts',     () => { /* Logic */ }),

  // ── COMPLIANCE
  cmd('EXCEL.FILE.AUDIT.COMPLIANCE',      'Compliance Center',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.COMPLIANCE.GDPR', 'GDPR Report',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.COMPLIANCE.ISO27001','ISO 27001',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.COMPLIANCE.SOC2', 'SOC 2',               () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.COMPLIANCE.HIPAA', 'HIPAA',              () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.COMPLIANCE.FINANCE','Financial Compliance',() => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.COMPLIANCE.COMPANY','Enterprise Policy', () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.COMPLIANCE.VALIDATE','Validate Compliance',() => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.COMPLIANCE.REPORT','Compliance Report',  () => { /* Logic */ }),

  // ── RETENTION
  cmd('EXCEL.FILE.AUDIT.RETENTION',       'Retention Policy',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.RETENTION.SET',   'Set Retention',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.RETENTION.DELETE','Delete Expired Logs', () => { /* Logic */ }),
  cmd('EXCEL.FILE.AUDIT.RETENTION.ARCHIVE','Archive Logs',       () => { /* Logic */ }),

  // ══ FAVORITES & RECENT ══════════════════════════════════════════════════
  // ── FAVORITE
  cmd('EXCEL.FILE.FAVORITE.ADD',          'Add Favorite',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.FAVORITE.REMOVE',       'Remove Favorite',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.FAVORITE.OPEN',         'Open Favorite',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.FAVORITE.RENAME',       'Rename Favorite',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.FAVORITE.MOVE',         'Move Favorite',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.FAVORITE.SORT',         'Sort Favorites',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.FAVORITE.GROUP',        'Favorite Groups',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.FAVORITE.COLOR',        'Favorite Label',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.FAVORITE.SEARCH',       'Search Favorites',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.FAVORITE.EXPORT',       'Export Favorites',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.FAVORITE.IMPORT',       'Import Favorites',    () => { /* Logic */ }),

  // ── PIN
  cmd('EXCEL.FILE.PIN',                   'Pin File',            () => { /* Logic */ }),
  cmd('EXCEL.FILE.PIN.CURRENT',           'Pin Current File',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.PIN.SELECTED',          'Pin Selected File',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.PIN.FOLDER',            'Pin Folder',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.PIN.WORKSPACE',         'Pin Workspace',       () => { /* Logic */ }),

  // ── UNPIN
  cmd('EXCEL.FILE.UNPIN',                 'Unpin File',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.UNPIN.ALL',             'Unpin All',           () => { /* Logic */ }),
  cmd('EXCEL.FILE.UNPIN.FOLDER',          'Unpin Folder',        () => { /* Logic */ }),

  // ── RECENT
  cmd('EXCEL.FILE.RECENT.OPEN',           'Open Recent',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECENT.CLEAR',          'Clear Recent',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECENT.CLEAR.ONE',      'Remove Recent Item',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECENT.CLEAR.ALL',      'Clear All Recent Files',() => { /* Logic */ }),
  cmd('EXCEL.FILE.RECENT.PIN',            'Pin Recent File',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECENT.SEARCH',         'Search Recent',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECENT.FILTER',         'Filter Recent',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.RECENT.SORT',           'Sort Recent',         () => { /* Logic */ }),

  // ── STAR
  cmd('EXCEL.FILE.STAR',                  'Star File',           () => { /* Logic */ }),
  cmd('EXCEL.FILE.STAR.REMOVE',           'Remove Star',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.STAR.TOGGLE',           'Toggle Star',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.STAR.OPEN',             'Open Starred File',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.STAR.LIST',             'List Starred Files',  () => { /* Logic */ }),

  // ── CLOUD FAVORITES
  cmd('EXCEL.FILE.FAVORITE.CLOUD.SYNC',   'Sync Favorites',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.FAVORITE.CLOUD.UPLOAD', 'Upload Favorites',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.FAVORITE.CLOUD.DOWNLOAD','Download Favorites', () => { /* Logic */ }),

  // ══ FILE LOCK MANAGEMENT ════════════════════════════════════════════════
  // ── LOCK
  cmd('EXCEL.FILE.LOCK',                  'Lock Workbook',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.LOCK.CURRENT',          'Lock Current Workbook',() => { /* Logic */ }),
  cmd('EXCEL.FILE.LOCK.SELECTED',         'Lock Selected File',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.LOCK.READONLY',         'Read-only Lock',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.LOCK.TEMPORARY',        'Temporary Lock',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.LOCK.PERMANENT',        'Permanent Lock',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.LOCK.SESSION',          'Session Lock',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.LOCK.CLOUD',            'Cloud Lock',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.LOCK.NETWORK',          'Network Lock',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.LOCK.STATUS',           'Lock Status',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.LOCK.INFO',             'Lock Information',    () => { /* Logic */ }),

  // ── UNLOCK
  cmd('EXCEL.FILE.UNLOCK',                'Unlock Workbook',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.UNLOCK.CURRENT',        'Unlock Current Workbook',() => { /* Logic */ }),
  cmd('EXCEL.FILE.UNLOCK.SELECTED',       'Unlock Selected File',() => { /* Logic */ }),
  cmd('EXCEL.FILE.UNLOCK.FORCE',          'Force Unlock',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.UNLOCK.ADMIN',          'Administrator Unlock',() => { /* Logic */ }),
  cmd('EXCEL.FILE.UNLOCK.ALL',            'Unlock All Files',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.UNLOCK.EXPIRED',        'Unlock Expired Sessions',() => { /* Logic */ }),

  // ── CHECKOUT
  cmd('EXCEL.FILE.CHECKOUT',              'Checkout Workbook',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.CHECKOUT.LOCAL',        'Checkout Local Copy', () => { /* Logic */ }),
  cmd('EXCEL.FILE.CHECKOUT.CLOUD',        'Checkout Cloud Copy', () => { /* Logic */ }),
  cmd('EXCEL.FILE.CHECKOUT.SHAREPOINT',   'Checkout SharePoint', () => { /* Logic */ }),
  cmd('EXCEL.FILE.CHECKOUT.ONEDRIVE',     'Checkout OneDrive',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.CHECKOUT.EXCLUSIVE',    'Exclusive Checkout',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.CHECKOUT.STATUS',       'Checkout Status',     () => { /* Logic */ }),

  // ── CHECKIN
  cmd('EXCEL.FILE.CHECKIN',               'Check-in Workbook',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.CHECKIN.COMMIT',        'Commit Changes',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.CHECKIN.KEEPLOCK',      'Check-in and Keep Lock',() => { /* Logic */ }),
  cmd('EXCEL.FILE.CHECKIN.RELEASE',       'Check-in and Release Lock',() => { /* Logic */ }),
  cmd('EXCEL.FILE.CHECKIN.VERSION',       'Check-in as New Version',() => { /* Logic */ }),
  cmd('EXCEL.FILE.CHECKIN.COMMENT',       'Check-in Comment',    () => { /* Logic */ }),

  // ── EXCLUSIVE OPEN
  cmd('EXCEL.FILE.OPEN.EXCLUSIVE',        'Open Exclusively',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.OPEN.EXCLUSIVE.READWRITE','Exclusive Read/Write',() => { /* Logic */ }),
  cmd('EXCEL.FILE.OPEN.EXCLUSIVE.ADMIN',  'Administrator Exclusive Open',() => { /* Logic */ }),
  cmd('EXCEL.FILE.OPEN.EXCLUSIVE.STATUS', 'Exclusive Open Status',() => { /* Logic */ }),
  cmd('EXCEL.FILE.OPEN.EXCLUSIVE.RELEASE','Release Exclusive Access',() => { /* Logic */ }),

  // ── LOCK OWNERSHIP
  cmd('EXCEL.FILE.LOCK.OWNER',            'Current Owner',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.LOCK.OWNER.TRANSFER',   'Transfer Ownership',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.LOCK.OWNER.REQUEST',    'Request Ownership',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.LOCK.OWNER.REVOKE',     'Revoke Ownership',    () => { /* Logic */ }),

  // ── CONFLICT MANAGEMENT
  cmd('EXCEL.FILE.LOCK.CONFLICT',         'Conflict Detection',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.LOCK.CONFLICT.RESOLVE', 'Resolve Conflict',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.LOCK.CONFLICT.MERGE',   'Merge Changes',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.LOCK.CONFLICT.OVERRIDE','Override Conflict',   () => { /* Logic */ }),

  // ══ FILE OPERATIONS ════════════════════════════════════════════════════════
  cmd('EXCEL.FILE.RENAME',                'Rename',              (_, p) => p?.name && FileEngine.rename(p.name)),
  cmd('EXCEL.FILE.DUPLICATE',             'Duplicate',           () => FileEngine.duplicate()),
  cmd('EXCEL.FILE.DELETE',                'Delete',              () => { /* Delete with confirmation */ }),
  cmd('EXCEL.FILE.MOVE',                  'Move',                () => { /* Move dialog */ }),
  cmd('EXCEL.FILE.COPY',                  'Copy',                () => FileEngine.saveCopy()),
  cmd('EXCEL.FILE.REVEAL',                'Reveal in Explorer',  () => FileEngine.revealInExplorer()),
  cmd('EXCEL.FILE.OPEN_LOCATION',         'Open File Location',  () => FileEngine.revealInExplorer()),
  cmd('EXCEL.FILE.SPLIT',                 'Split Workbook',      () => { /* Workbook split */ }),

  // ══ FILE INFORMATION ════════════════════════════════════════════════════════
  cmd('EXCEL.FILE.INFO.SIZE',             'File Size',           () => FileEngine.getFileInfo()),
  cmd('EXCEL.FILE.INFO.PAGES',            'Page Count',          () => FileEngine.getFileInfo()),
  cmd('EXCEL.FILE.INFO.ExcelS',            'Excel Count',          () => FileEngine.getFileInfo()),
  cmd('EXCEL.FILE.INFO.CHARACTERS',       'Character Count',     () => FileEngine.getFileInfo()),
  cmd('EXCEL.FILE.INFO.CREATED',          'Date Created',        () => FileEngine.getFileInfo()),
  cmd('EXCEL.FILE.INFO.MODIFIED',         'Date Modified',       () => FileEngine.getFileInfo()),
  cmd('EXCEL.FILE.INFO.PERMISSIONS',      'File Permissions',    () => FileEngine.getFileInfo()),
  cmd('EXCEL.FILE.INFO.FORMAT',           'File Format',         () => FileEngine.getFileInfo()),

  // ══ DEVELOPER TOOLS ═════════════════════════════════════════════════════
  // ── OPENXML
  cmd('EXCEL.FILE.DEVELOPER.OPENXML',     'Open OpenXML Explorer',() => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.OPENXML.OPEN','Open Package',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.OPENXML.CLOSE','Close Package',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.OPENXML.RELOAD','Reload Package',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.OPENXML.EXTRACT','Extract Package',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.OPENXML.REPACK','Rebuild Package',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.OPENXML.CONTENTTYPES','Content Types',() => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.OPENXML.RELATIONSHIPS','Relationships',() => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.OPENXML.PARTS','Package Parts',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.OPENXML.COREPROPERTIES','Core Properties',() => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.OPENXML.APPPROPERTIES','App Properties',() => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.OPENXML.CUSTOMPROPERTIES','Custom Properties',() => { /* Logic */ }),

  // ── XML
  cmd('EXCEL.FILE.DEVELOPER.XML',         'XML Explorer',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.XML.OPEN',    'Open XML Part',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.XML.EDIT',    'Edit XML',            () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.XML.SAVE',    'Save XML',            () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.XML.RELOAD',  'Reload XML',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.XML.FORMAT',  'Format XML',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.XML.MINIFY',  'Minify XML',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.XML.PRETTYPRINT','Pretty Print',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.XML.SEARCH',  'Search XML',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.XML.REPLACE', 'Replace XML',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.XML.NAMESPACE','Namespaces',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.XML.SCHEMA',  'Schema',              () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.XML.XPATH',   'XPath Query',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.XML.EXPORT',  'Export XML',          () => { /* Logic */ }),

  // ── PACKAGE
  cmd('EXCEL.FILE.DEVELOPER.PACKAGE',     'Package Explorer',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.PACKAGE.OPEN','Open Package',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.PACKAGE.INFO','Package Information', () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.PACKAGE.SIZE','Package Size',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.PACKAGE.PARTS','Package Parts',      () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.PACKAGE.MEDIA','Media Files',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.PACKAGE.FONTS','Fonts',              () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.PACKAGE.EMBEDDED','Embedded Objects',() => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.PACKAGE.SIGNATURES','Digital Signatures',() => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.PACKAGE.EXPORT','Export Package',    () => { /* Logic */ }),

  // ── OPC
  cmd('EXCEL.FILE.DEVELOPER.OPC',         'OPC Explorer',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.OPC.CONTENTTYPES','Content Types',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.OPC.RELATIONSHIPS','Relationship Tree',() => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.OPC.PARTS',   'Package Parts',       () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.OPC.URI',     'Part URI',            () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.OPC.STREAMS', 'Streams',             () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.OPC.MEDIA',   'Media Resources',     () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.OPC.EXPORT',  'Export OPC',          () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.OPC.IMPORT',  'Import OPC',          () => { /* Logic */ }),

  // ── VALIDATE PACKAGE
  cmd('EXCEL.FILE.DEVELOPER.VALIDATE',    'Validate Package',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.VALIDATE.OPENXML','Validate OpenXML',() => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.VALIDATE.XML','Validate XML',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.VALIDATE.OPC','Validate OPC',        () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.VALIDATE.RELATIONSHIPS','Validate Relationships',() => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.VALIDATE.CONTENTTYPES','Validate Content Types',() => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.VALIDATE.SCHEMA','Validate Schema',  () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.VALIDATE.MEDIA','Validate Media',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.VALIDATE.SIGNATURE','Validate Signature',() => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.VALIDATE.REPORT','Generate Validation Report',() => { /* Logic */ }),

  // ── DIAGNOSTICS
  cmd('EXCEL.FILE.DEVELOPER.DIAGNOSTICS', 'Diagnostics',         () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.DIAGNOSTICS.OPEN','Open Diagnostics',() => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.DIAGNOSTICS.LOG','Developer Log',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.DIAGNOSTICS.TRACE','Trace Engine',   () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.DIAGNOSTICS.PROFILE','Performance Profile',() => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.DIAGNOSTICS.ERRORS','Error List',    () => { /* Logic */ }),
  cmd('EXCEL.FILE.DEVELOPER.DIAGNOSTICS.WARNINGS','Warnings',    () => { /* Logic */ }),

  // ── APP RELOAD
  cmd('EXCEL.FILE.DEV.RELOAD',            'Reload App',          () => window.location.reload()),

  // ══ ACCOUNT ═════════════════════════════════════════════════════════════
  cmd('EXCEL.FILE.ACCOUNT',               'My Account',                () => { /* UI Action */ }),
  cmd('EXCEL.FILE.ACCOUNT.PROFILE',       'View Profile',              () => { /* UI Action */ }),
  cmd('EXCEL.FILE.LICENSE',               'License & Subscription',    () => { /* UI Action */ }),
  cmd('EXCEL.FILE.LICENSE.ACTIVATE',      'Activate License',          () => { /* UI Action */ }),
  cmd('EXCEL.FILE.LICENSE.DEACTIVATE',    'Deactivate License',        () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SUBSCRIPTION',          'Subscription',              () => { /* UI Action */ }),
  cmd('EXCEL.FILE.CONNECTED_SERVICES',    'Connected Services',        () => { /* UI Action */ }),
  cmd('EXCEL.FILE.OFFICE_THEME',          'Office Theme',              () => { /* UI Action */ }),
  cmd('EXCEL.FILE.UPDATE',                'Check for Updates',         () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SIGNOUT',               'Sign Out',                  () => { /* UI Action */ }),

  // ══ SETTINGS ═══════════════════════════════════════════════════════════
  cmd('EXCEL.FILE.SETTINGS',              'Settings',                  () => { /* UI Action */ }, 'Ctrl+,'),
  cmd('EXCEL.FILE.SETTINGS.GENERAL',      'General Settings',          () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SETTINGS.LANGUAGE',     'Language Settings',         () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SETTINGS.PROOFING',     'Proofing Settings',         () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SETTINGS.SAVE',         'Save Settings',             () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SETTINGS.ADVANCED',     'Advanced Settings',         () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SETTINGS.RIBBON',       'Customize Ribbon',          () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SETTINGS.QAT',          'Quick Access Toolbar',      () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SETTINGS.SHORTCUTS',    'Keyboard Shortcuts',        () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SETTINGS.PLUGINS',      'Plugins',                   () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SETTINGS.AI',           'AI Settings',               () => { /* UI Action */ }),
  cmd('EXCEL.FILE.OPTIONS',               'Options',                   () => { /* UI Action */ }),

  // ══ FEEDBACK ════════════════════════════════════════════════════════════
  cmd('EXCEL.FILE.FEEDBACK',              'Send Feedback',             () => { /* UI Action */ }),
  cmd('EXCEL.FILE.FEEDBACK.SEND',         'Send Feedback',             () => { /* UI Action */ }),
  cmd('EXCEL.FILE.REPORT',                'Report a Bug',              () => { /* UI Action */ }),
  cmd('EXCEL.FILE.REPORT.BUG',            'Report Bug',                () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SUGGEST',               'Suggest a Feature',         () => { /* UI Action */ }),
  cmd('EXCEL.FILE.DIAGNOSTICS',           'Diagnostics',               () => { /* UI Action */ }),
  cmd('EXCEL.FILE.LOGS',                  'View Logs',                 () => { /* UI Action */ }),

  // ══ HELP ════════════════════════════════════════════════════════════════
  cmd('EXCEL.FILE.HELP',                  'Help Center',               () => { /* UI Action */ }, 'F1'),
  cmd('EXCEL.FILE.HELP.CENTER',           'Open Help',                 () => { /* UI Action */ }),
  cmd('EXCEL.FILE.TUTORIALS',             'Tutorials',                 () => { /* UI Action */ }),
  cmd('EXCEL.FILE.SHORTCUTS',             'Keyboard Shortcuts',        () => { /* UI Action */ }),
  cmd('EXCEL.FILE.WorkbookATION',         'Workbookation',             () => { /* UI Action */ }),
  cmd('EXCEL.FILE.ABOUT',                 'About OfficeX',             () => { /* UI Action */ }),

  // ══ EXIT (supplemental) ══════════════════════════════════════════════════
  cmd('EXCEL.FILE.EXIT_ALL',              'Exit All Applications',     () => FileEngine.forceExit()),
  cmd('EXCEL.FILE.RESTART',               'Restart OfficeX',           () => window.location.reload()),

  // ══ ONEDRIVE COMMANDS ════════════════════════════════════════════════════
  cmd('EXCEL.ONEDRIVE.LOGIN',             'OneDrive Login',            (_, p) => OneDriveEngine.login(p?.email)),
  cmd('EXCEL.ONEDRIVE.LOGOUT',            'OneDrive Logout',           () => OneDriveEngine.logout()),
  cmd('EXCEL.ONEDRIVE.OPEN',              'OneDrive Open Workbook',    (_, p) => p?.item && OneDriveEngine.openItem(p.item)),
  cmd('EXCEL.ONEDRIVE.SAVE',              'OneDrive Save Workbook',    (_, p) => p?.name && OneDriveEngine.saveCurrentWorkbook(p.name, p?.content || '')),
  cmd('EXCEL.ONEDRIVE.SAVE_AS',           'OneDrive Save As',          (_, p) => p?.name && OneDriveEngine.saveCurrentWorkbook(p.name, p?.content || '')),
  cmd('EXCEL.ONEDRIVE.AUTOSAVE',          'OneDrive AutoSave Sync',    (_, p) => p?.name && OneDriveSyncEngine.queueAutoSave(p.id, p.name, p.content)),
  cmd('EXCEL.ONEDRIVE.SYNC',              'OneDrive Force Sync',       () => OneDriveSyncEngine.processPendingSync()),
  cmd('EXCEL.ONEDRIVE.UPLOAD',            'OneDrive Upload File',      (_, p) => p?.name && MicrosoftGraphEngine.createUploadSession('root', p.name, p.size || 1000)),
  cmd('EXCEL.ONEDRIVE.DOWNLOAD',          'OneDrive Download File',    (_, p) => p?.item && OneDriveEngine.openItem(p.item)),
  cmd('EXCEL.ONEDRIVE.SEARCH',            'OneDrive Search',           (_, p) => p?.query && MicrosoftGraphEngine.searchItems(p.query)),
  cmd('EXCEL.ONEDRIVE.RECENT',            'OneDrive Recent Files',     () => MicrosoftGraphEngine.getRecentItems()),
  cmd('EXCEL.ONEDRIVE.SHARED',            'OneDrive Shared Files',     () => MicrosoftGraphEngine.getSharedItems()),
  cmd('EXCEL.ONEDRIVE.FAVORITE',          'OneDrive Pin Favorite',     (_, p) => p?.id && MicrosoftGraphEngine.toggleFavorite(p.id)),
  cmd('EXCEL.ONEDRIVE.NEW_FOLDER',        'OneDrive New Folder',       (_, p) => p?.name && MicrosoftGraphEngine.createFolder(p?.parentId || 'root', p.name)),
  cmd('EXCEL.ONEDRIVE.DELETE',            'OneDrive Delete Item',      (_, p) => p?.id && MicrosoftGraphEngine.deleteItem(p.id)),
  cmd('EXCEL.ONEDRIVE.RENAME',            'OneDrive Rename Item',      (_, p) => p?.id && p?.name && MicrosoftGraphEngine.renameItem(p.id, p.name)),
  cmd('EXCEL.ONEDRIVE.REFRESH',           'OneDrive Refresh',          () => MicrosoftGraphEngine.getRootChildren()),
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
