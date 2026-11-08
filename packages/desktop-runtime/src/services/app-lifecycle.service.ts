import { injectable, inject } from 'tsyringe';
import { app } from 'electron';
import { StartupOrchestrator } from '../startup/startup-orchestrator';
import { ShutdownManager } from '../shutdown/shutdown-manager';

@injectable()
export class AppLifecycleService {
  private isInitialized = false;
  private secondInstanceHandlers: Array<(commandLine: string[]) => void> = [];

  constructor(
    @inject(StartupOrchestrator) private readonly orchestrator: StartupOrchestrator,
    @inject(ShutdownManager) private readonly shutdownManager: ShutdownManager,
  ) {}

  public getOrchestrator(): StartupOrchestrator {
    return this.orchestrator;
  }

  public getShutdownManager(): ShutdownManager {
    return this.shutdownManager;
  }

  public onSecondInstance(handler: (commandLine: string[]) => void) {
    this.secondInstanceHandlers.push(handler);
  }

  public bootstrap(onReady: () => void) {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // ── Single Instance Lock (Enforce single instance so second launches focus / open doc) ──
    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
      console.log('[Bootstrap] Another instance is already running. Quitting secondary process.');
      app.quit();
      return;
    }

    app.on('second-instance', (_event, commandLine) => {
      console.log('[Bootstrap] Second instance triggered with args:', commandLine);
      for (const handler of this.secondInstanceHandlers) {
        try {
          handler(commandLine);
        } catch (e) {
          console.error('[SecondInstanceHandler Error]', e);
        }
      }
      this.handleArguments(commandLine);
    });

    // ── Controlled Shutdown: before-quit ─────────────────────────────────────
    // Electron fires 'before-quit' when all windows are about to close.
    // We intercept it, run the full shutdown sequence, then allow exit.
    app.on('before-quit', (event) => {
      if (this.shutdownManager.isInProgress) return; // Already handling

      event.preventDefault(); // Hold the exit until we're done

      console.log('[Lifecycle] before-quit intercepted — running ShutdownManager...');
      this.shutdownManager.shutdown('user-exit').finally(() => {
        // Allow Electron to actually quit now
        app.exit(0);
      });
    });

    // ── Emergency Shutdown: will-quit (force / OS kill) ───────────────────────
    // 'will-quit' fires when exit is imminent (cannot be prevented).
    // We do a best-effort emergency save within a tight timeout.
    app.on('will-quit', (event) => {
      if (this.shutdownManager.isInProgress) return;

      event.preventDefault();
      console.warn('[Lifecycle] will-quit detected — running emergency shutdown...');

      this.shutdownManager.emergencyShutdown().finally(() => {
        app.exit(0);
      });
    });

    // ── Main Ready ────────────────────────────────────────────────────────────
    app.whenReady().then(() => {
      console.log('[Bootstrap] OfficeX Electron app ready. Starting Startup Orchestrator...');
      this.handleArguments(process.argv);
      onReady();
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit(); // Triggers 'before-quit' → ShutdownManager
      }
    });
  }

  private handleArguments(args: string[]) {
    const fileArgs = args.filter(
      (arg) => arg.endsWith('.docx') || arg.endsWith('.xlsx') || arg.endsWith('.pptx'),
    );
    if (fileArgs.length > 0) {
      console.log('[Bootstrap] Files to open:', fileArgs);
      // TODO: Pass to DocumentLoader / WindowManager
    }
  }
}
