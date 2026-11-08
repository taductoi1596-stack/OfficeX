import { ISyncProvider, SyncStatus } from './models/ISyncProvider';
import { OutboxQueue } from './OutboxQueue';
import { HistoryManager } from '@officex/history-engine';

export class SyncManager {
  private outbox = new OutboxQueue();
  private provider: ISyncProvider | null = null;
  private syncInterval: any = null;
  private isSyncing = false;

  constructor(private historyManager: HistoryManager) {
    // Listen to history changes to enqueue them
    // Assuming historyManager has an event emitter or we can hook into it
    // In a real implementation, we would hook into CommandDispatcher or HistoryManager
  }

  public setProvider(provider: ISyncProvider) {
    this.provider = provider;
    this.provider.onStatusChange((status) => {
      // Broadcast status to UI
    });
    this.provider.onIncomingChanges((changes) => {
      this.handleIncomingChanges(changes);
    });
  }

  public enqueueLocalChange(change: any) {
    this.outbox.enqueue(change);
    this.triggerSync();
  }

  public start(intervalMs: number = 2000) {
    if (this.syncInterval) clearInterval(this.syncInterval);
    this.syncInterval = setInterval(() => this.triggerSync(), intervalMs);
    this.provider?.connect();
  }

  public stop() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    this.provider?.disconnect();
  }

  private async triggerSync() {
    if (!this.provider || this.isSyncing || this.outbox.length === 0) return;
    
    this.isSyncing = true;
    try {
      const changes = this.outbox.peekAll();
      await this.provider.push(changes);
      this.outbox.dequeue(changes.length);
    } catch (e) {
      console.error('Sync failed', e);
    } finally {
      this.isSyncing = false;
    }
  }

  private handleIncomingChanges(changes: any[]) {
    // Map remote changes into the CRDT/History system
    // The Collaboration Engine will process these specifically
  }
}
