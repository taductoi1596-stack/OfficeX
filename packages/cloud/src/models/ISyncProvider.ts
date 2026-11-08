export interface SyncStatus {
  state: 'offline' | 'connecting' | 'syncing' | 'online' | 'error';
  lastSyncTime: number | null;
  pendingChanges: number;
  error?: Error;
}

export interface ISyncProvider {
  name: string;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  push(changes: any[]): Promise<void>;
  pull(): Promise<any[]>;
  onStatusChange(callback: (status: SyncStatus) => void): void;
  onIncomingChanges(callback: (changes: any[]) => void): void;
}
