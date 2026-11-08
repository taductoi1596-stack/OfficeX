import { CommandDefinition } from '../CommandDispatcher';
import { InsertPluginEngine } from './InsertPluginEngine';

function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}

export class InsertPluginCommandRegistry {
  static all(): CommandDefinition[] {
    return [

      // --- Canonical Spec IDs ---
      cmd('WORD.PLUGIN.STORE', 'Marketplace', () => {}),
      cmd('WORD.PLUGIN.MANAGER', 'Plugin Manager', () => {}),
      cmd('WORD.PLUGIN.INSTALLED', 'Installed Plugins', () => {}),

      // PLUGIN PANEL
      cmd('WORD.PLUGIN.OPEN', 'Open Plugin Panel', () => InsertPluginEngine.Panel('main')),
      cmd('WORD.PLUGIN.CLOSE', 'Close Plugin Panel', () => InsertPluginEngine.Panel('close')),
      cmd('WORD.PLUGIN.SIDEBAR', 'Plugin Sidebar', () => InsertPluginEngine.Panel('sidebar')),
      cmd('WORD.PLUGIN.FLOATING', 'Floating Plugin Window', () => InsertPluginEngine.Panel('floating')),

      // MARKETPLACE
      cmd('WORD.PLUGIN.MARKETPLACE', 'Open Marketplace', () => InsertPluginEngine.Marketplace('open')),
      cmd('WORD.PLUGIN.MARKETPLACE.SEARCH', 'Search Plugins', () => InsertPluginEngine.Marketplace('search')),
      cmd('WORD.PLUGIN.MARKETPLACE.FEATURED', 'Featured Plugins', () => InsertPluginEngine.Marketplace('featured')),
      cmd('WORD.PLUGIN.MARKETPLACE.CATEGORIES', 'Plugin Categories', () => InsertPluginEngine.Marketplace('categories')),
      cmd('WORD.PLUGIN.MARKETPLACE.TOP', 'Top Plugins', () => InsertPluginEngine.Marketplace('top')),
      cmd('WORD.PLUGIN.MARKETPLACE.NEW', 'Newest Plugins', () => InsertPluginEngine.Marketplace('new')),
      cmd('WORD.PLUGIN.MARKETPLACE.UPDATE', 'Recently Updated', () => InsertPluginEngine.Marketplace('update')),

      // INSTALL
      cmd('WORD.PLUGIN.INSTALL', 'Install Plugin', () => InsertPluginEngine.Install('dialog')),
      cmd('WORD.PLUGIN.INSTALL.FILE', 'Install From File', () => InsertPluginEngine.Install('file')),
      cmd('WORD.PLUGIN.INSTALL.URL', 'Install From URL', () => InsertPluginEngine.Install('url')),
      cmd('WORD.PLUGIN.INSTALL.LOCAL', 'Install Local Plugin', () => InsertPluginEngine.Install('local')),
      cmd('WORD.PLUGIN.INSTALL.CLOUD', 'Install Cloud Plugin', () => InsertPluginEngine.Install('cloud')),

      // UNINSTALL
      cmd('WORD.PLUGIN.UNINSTALL', 'Uninstall Plugin', () => InsertPluginEngine.Uninstall('uninstall')),
      cmd('WORD.PLUGIN.REMOVE', 'Remove Plugin', () => InsertPluginEngine.Uninstall('remove')),
      cmd('WORD.PLUGIN.DELETE', 'Delete Plugin', () => InsertPluginEngine.Uninstall('delete')),

      // UPDATE
      cmd('WORD.PLUGIN.UPDATE', 'Update Plugin', () => InsertPluginEngine.Update('single')),
      cmd('WORD.PLUGIN.UPDATE.ALL', 'Update All Plugins', () => InsertPluginEngine.Update('all')),
      cmd('WORD.PLUGIN.CHECK.UPDATE', 'Check Updates', () => InsertPluginEngine.Update('check')),
      cmd('WORD.PLUGIN.AUTO.UPDATE', 'Automatic Updates', () => InsertPluginEngine.Update('auto')),

      // ENABLE
      cmd('WORD.PLUGIN.ENABLE', 'Enable Plugin', () => InsertPluginEngine.Enable('enable')),
      cmd('WORD.PLUGIN.DISABLE', 'Disable Plugin', () => InsertPluginEngine.Enable('disable')),
      cmd('WORD.PLUGIN.RELOAD', 'Reload Plugin', () => InsertPluginEngine.Enable('reload')),
      cmd('WORD.PLUGIN.RESTART', 'Restart Plugin', () => InsertPluginEngine.Enable('restart')),

      // CONFIGURATION
      cmd('WORD.PLUGIN.SETTINGS', 'Plugin Settings', () => InsertPluginEngine.Configuration('settings')),
      cmd('WORD.PLUGIN.CONFIG', 'Plugin Configuration', () => InsertPluginEngine.Configuration('config')),
      cmd('WORD.PLUGIN.RESET', 'Reset Settings', () => InsertPluginEngine.Configuration('reset')),
      cmd('WORD.PLUGIN.EXPORT.CONFIG', 'Export Configuration', () => InsertPluginEngine.Configuration('export')),
      cmd('WORD.PLUGIN.IMPORT.CONFIG', 'Import Configuration', () => InsertPluginEngine.Configuration('import')),

      // EXECUTION
      cmd('WORD.PLUGIN.RUN', 'Run Plugin', () => InsertPluginEngine.Execution('run')),
      cmd('WORD.PLUGIN.STOP', 'Stop Plugin', () => InsertPluginEngine.Execution('stop')),
      cmd('WORD.PLUGIN.RESTART.RUNTIME', 'Restart Runtime', () => InsertPluginEngine.Execution('restart')),
      cmd('WORD.PLUGIN.DEBUG', 'Debug Plugin', () => InsertPluginEngine.Execution('debug')),
      cmd('WORD.PLUGIN.PROFILE', 'Profile Plugin', () => InsertPluginEngine.Execution('profile')),

      // SECURITY
      cmd('WORD.PLUGIN.PERMISSION', 'Plugin Permissions', () => InsertPluginEngine.Security('permission')),
      cmd('WORD.PLUGIN.GRANT', 'Grant Permission', () => InsertPluginEngine.Security('grant')),
      cmd('WORD.PLUGIN.REVOKE', 'Revoke Permission', () => InsertPluginEngine.Security('revoke')),
      cmd('WORD.PLUGIN.SANDBOX', 'Sandbox Mode', () => InsertPluginEngine.Security('sandbox')),
      cmd('WORD.PLUGIN.SIGNATURE', 'Verify Signature', () => InsertPluginEngine.Security('signature')),
      cmd('WORD.PLUGIN.TRUST', 'Trust Plugin', () => InsertPluginEngine.Security('trust')),
      cmd('WORD.PLUGIN.UNTRUST', 'Remove Trust', () => InsertPluginEngine.Security('untrust')),

      // PERMISSIONS
      cmd('WORD.PLUGIN.PERMISSION.DOCUMENT', 'Document Access', () => InsertPluginEngine.Permission('document')),
      cmd('WORD.PLUGIN.PERMISSION.NETWORK', 'Network Access', () => InsertPluginEngine.Permission('network')),
      cmd('WORD.PLUGIN.PERMISSION.FILESYSTEM', 'File System Access', () => InsertPluginEngine.Permission('filesystem')),
      cmd('WORD.PLUGIN.PERMISSION.CLIPBOARD', 'Clipboard Access', () => InsertPluginEngine.Permission('clipboard')),
      cmd('WORD.PLUGIN.PERMISSION.CAMERA', 'Camera Access', () => InsertPluginEngine.Permission('camera')),
      cmd('WORD.PLUGIN.PERMISSION.MICROPHONE', 'Microphone Access', () => InsertPluginEngine.Permission('microphone')),

      // DEVELOPER
      cmd('WORD.PLUGIN.DEV', 'Developer Mode', () => InsertPluginEngine.Developer('mode')),
      cmd('WORD.PLUGIN.DEV.CONSOLE', 'Plugin Console', () => InsertPluginEngine.Developer('console')),
      cmd('WORD.PLUGIN.DEV.LOGS', 'Plugin Logs', () => InsertPluginEngine.Developer('logs')),
      cmd('WORD.PLUGIN.DEV.API', 'API Explorer', () => InsertPluginEngine.Developer('api')),
      cmd('WORD.PLUGIN.DEV.MANIFEST', 'Manifest Viewer', () => InsertPluginEngine.Developer('manifest')),
      cmd('WORD.PLUGIN.DEV.PACKAGE', 'Package Builder', () => InsertPluginEngine.Developer('package')),
      cmd('WORD.PLUGIN.DEV.VALIDATE', 'Validate Package', () => InsertPluginEngine.Developer('validate')),

      // MARKETPLACE PUBLISHING
      cmd('WORD.PLUGIN.PUBLISH', 'Publish Plugin', () => InsertPluginEngine.Publishing('publish')),
      cmd('WORD.PLUGIN.UNPUBLISH', 'Unpublish Plugin', () => InsertPluginEngine.Publishing('unpublish')),
      cmd('WORD.PLUGIN.SUBMIT', 'Submit For Review', () => InsertPluginEngine.Publishing('submit')),
      cmd('WORD.PLUGIN.REVIEW.STATUS', 'Review Status', () => InsertPluginEngine.Publishing('status')),

      // STORAGE
      cmd('WORD.PLUGIN.STORAGE', 'Plugin Storage', () => InsertPluginEngine.Storage('dialog')),
      cmd('WORD.PLUGIN.CACHE', 'Plugin Cache', () => InsertPluginEngine.Storage('cache')),
      cmd('WORD.PLUGIN.CLEAR.CACHE', 'Clear Cache', () => InsertPluginEngine.Storage('clear')),
      cmd('WORD.PLUGIN.DATA', 'Plugin Data', () => InsertPluginEngine.Storage('data')),
      cmd('WORD.PLUGIN.BACKUP', 'Backup Plugin', () => InsertPluginEngine.Storage('backup')),
      cmd('WORD.PLUGIN.RESTORE', 'Restore Plugin', () => InsertPluginEngine.Storage('restore')),

      // AI PLUGINS
      cmd('WORD.PLUGIN.AI', 'AI Plugins', () => InsertPluginEngine.AIPlugin('dialog')),
      cmd('WORD.PLUGIN.AI.ENABLE', 'Enable AI Plugin', () => InsertPluginEngine.AIPlugin('enable')),
      cmd('WORD.PLUGIN.AI.DISABLE', 'Disable AI Plugin', () => InsertPluginEngine.AIPlugin('disable')),
      cmd('WORD.PLUGIN.AI.MODEL', 'Select AI Model', () => InsertPluginEngine.AIPlugin('model')),
      cmd('WORD.PLUGIN.AI.PROVIDER', 'Select AI Provider', () => InsertPluginEngine.AIPlugin('provider')),
    ];
  }
}
