import { injectable } from 'tsyringe';
import {
  ShutdownPhase,
  ShutdownTrigger,
  ShutdownPhaseHandler,
  ShutdownStatusListener,
  ShutdownEvent,
} from './shutdown-phase';

interface PhaseEntry {
  phase: ShutdownPhase;
  handler: ShutdownPhaseHandler;
  /** If true, a failure in this phase will not abort remaining phases */
  nonCritical?: boolean;
}

@injectable()
export class ShutdownManager {
  private isShuttingDown = false;
  private readonly listeners: ShutdownStatusListener[] = [];
  private readonly phases: PhaseEntry[] = [];

  // ─── Registration ───────────────────────────────────────────────────────────

  /**
   * Register a handler for a specific shutdown phase.
   * Multiple handlers can be registered per phase; they run in registration order.
   */
  public registerPhase(
    phase: ShutdownPhase,
    handler: ShutdownPhaseHandler,
    nonCritical = false,
  ): void {
    this.phases.push({ phase, handler, nonCritical });
  }

  public onStatus(listener: ShutdownStatusListener): void {
    this.listeners.push(listener);
  }

  // ─── Execution ───────────────────────────────────────────────────────────────

  /**
   * Execute the full shutdown sequence.
   * Returns true if shutdown completed cleanly; false if an error occurred
   * (the process will still exit).
   */
  public async shutdown(trigger: ShutdownTrigger = 'user-exit'): Promise<boolean> {
    if (this.isShuttingDown) {
      console.warn('[Shutdown] Shutdown already in progress — ignoring duplicate request.');
      return true;
    }
    this.isShuttingDown = true;

    const startTime = Date.now();
    console.log(`[Shutdown] Initiated. Trigger: ${trigger}`);

    // Group phases by phase name so we can emit one event per phase
    const phaseOrder: ShutdownPhase[] = [
      ShutdownPhase.Request,
      ShutdownPhase.Validation,
      ShutdownPhase.DataSave,
      ShutdownPhase.BackgroundStop,
      ShutdownPhase.PluginUnload,
      ShutdownPhase.WindowClose,
      ShutdownPhase.LogFlush,
      ShutdownPhase.RuntimeDispose,
      ShutdownPhase.Exit,
    ];

    let cleanShutdown = true;

    for (const phase of phaseOrder) {
      const entries = this.phases.filter((p) => p.phase === phase);
      if (entries.length === 0) continue;

      const phaseStart = Date.now();
      this.emit({ phase, status: 'running', trigger });
      console.log(`[Shutdown] Phase '${phase}' starting...`);

      for (const entry of entries) {
        try {
          await entry.handler();
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          const duration = Date.now() - phaseStart;
          console.error(`[Shutdown] Phase '${phase}' handler failed:`, error.message);
          this.emit({ phase, status: 'failed', trigger, duration, error });

          if (!entry.nonCritical) {
            cleanShutdown = false;
            // Non-critical phases continue; critical phase failures log but still proceed
            // (we must always reach process exit)
          }
        }
      }

      const duration = Date.now() - phaseStart;
      this.emit({ phase, status: 'completed', trigger, duration });
      console.log(`[Shutdown] Phase '${phase}' completed in ${duration}ms`);
    }

    const totalDuration = Date.now() - startTime;
    console.log(`[Shutdown] Complete. Total time: ${totalDuration}ms. Clean: ${cleanShutdown}`);
    return cleanShutdown;
  }

  /**
   * Emergency shutdown: skip non-critical phases, just persist recovery data and exit.
   * Used when a force-kill or OS termination is detected.
   */
  public async emergencyShutdown(): Promise<void> {
    console.warn('[Shutdown] EMERGENCY shutdown triggered — running critical handlers only.');
    const criticalPhases = [ShutdownPhase.DataSave, ShutdownPhase.LogFlush];

    for (const phase of criticalPhases) {
      const entries = this.phases.filter((p) => p.phase === phase);
      for (const entry of entries) {
        try {
          await Promise.race([
            entry.handler(),
            new Promise<void>((_, reject) =>
              setTimeout(() => reject(new Error('Emergency timeout')), 500),
            ),
          ]);
        } catch {
          // Emergency handlers must never throw
        }
      }
    }
  }

  public get isInProgress(): boolean {
    return this.isShuttingDown;
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  private emit(event: ShutdownEvent): void {
    this.listeners.forEach((l) => {
      try {
        l(event);
      } catch {
        // Listener failures must never abort shutdown
      }
    });
  }
}
