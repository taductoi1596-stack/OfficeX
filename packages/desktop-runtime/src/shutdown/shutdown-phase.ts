export enum ShutdownPhase {
  Request      = 'Request',
  Validation   = 'Validation',
  DataSave     = 'DataSave',
  BackgroundStop = 'BackgroundStop',
  PluginUnload = 'PluginUnload',
  WindowClose  = 'WindowClose',
  LogFlush     = 'LogFlush',
  RuntimeDispose = 'RuntimeDispose',
  Exit         = 'Exit',
}

export type ShutdownTrigger =
  | 'user-exit'
  | 'window-all-closed'
  | 'os-shutdown'
  | 'update-install'
  | 'fatal-error'
  | 'emergency';

export type ShutdownStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

export interface ShutdownEvent {
  phase: ShutdownPhase;
  status: ShutdownStatus;
  trigger: ShutdownTrigger;
  duration?: number;
  error?: Error;
  message?: string;
}

export type ShutdownPhaseHandler = () => Promise<void>;
export type ShutdownStatusListener = (event: ShutdownEvent) => void;
