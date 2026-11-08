import { injectable } from 'tsyringe';
import {
  StartupPhase,
  StartupPhaseTask,
  StartupStatusListener,
  StartupEvent,
} from './startup-phase';

interface PhaseDefinition {
  phase: StartupPhase;
  task: StartupPhaseTask;
}

@injectable()
export class StartupOrchestrator {
  private listeners: StartupStatusListener[] = [];

  public onStatus(listener: StartupStatusListener): void {
    this.listeners.push(listener);
  }

  private emit(event: StartupEvent): void {
    this.listeners.forEach((l) => l(event));
  }

  /**
   * Run a sequence of phases in order, blocking until each completes.
   * Each phase is timed and its result is reported via the event system.
   */
  public async run(phases: PhaseDefinition[]): Promise<void> {
    for (const { phase, task } of phases) {
      const start = Date.now();
      this.emit({ phase, status: 'running', message: `Starting phase: ${phase}` });
      console.log(`[Startup] Phase '${phase}' starting...`);

      try {
        await task();
        const duration = Date.now() - start;
        console.log(`[Startup] Phase '${phase}' completed in ${duration}ms`);
        this.emit({ phase, status: 'completed', duration });
      } catch (error) {
        const duration = Date.now() - start;
        const err = error instanceof Error ? error : new Error(String(error));
        console.error(`[Startup] Phase '${phase}' failed after ${duration}ms:`, err.message);
        this.emit({ phase, status: 'failed', duration, error: err });
        // Non-critical phase failures are logged but don't abort the full startup
        // Critical phases should throw to propagate
        throw err;
      }
    }
  }

  /**
   * Schedule deferred (non-critical) tasks to run after Ready state.
   * These tasks run in the background and never block the UI.
   */
  public defer(tasks: Array<{ name: string; task: StartupPhaseTask }>): void {
    // Use setImmediate to ensure these run AFTER the event loop tick,
    // guaranteeing the main window has been created and shown first.
    setImmediate(async () => {
      for (const { name, task } of tasks) {
        const start = Date.now();
        console.log(`[Startup:Deferred] Task '${name}' starting...`);
        this.emit({
          phase: StartupPhase.Deferred,
          status: 'running',
          message: name,
        });

        try {
          await task();
          const duration = Date.now() - start;
          console.log(`[Startup:Deferred] Task '${name}' completed in ${duration}ms`);
          this.emit({
            phase: StartupPhase.Deferred,
            status: 'completed',
            duration,
            message: name,
          });
        } catch (error) {
          const err = error instanceof Error ? error : new Error(String(error));
          console.warn(`[Startup:Deferred] Task '${name}' failed (non-critical):`, err.message);
          this.emit({
            phase: StartupPhase.Deferred,
            status: 'failed',
            error: err,
            message: name,
          });
          // Deferred task failures are never fatal
        }
      }
    });
  }
}
