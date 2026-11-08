export enum StartupPhase {
  Bootstrap = 'Bootstrap',
  Environment = 'Environment',
  Services = 'Services',
  Recovery = 'Recovery',
  Ready = 'Ready',
  Deferred = 'Deferred',
}

export type StartupStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface StartupEvent {
  phase: StartupPhase;
  status: StartupStatus;
  duration?: number;
  error?: Error;
  message?: string;
}

export type StartupPhaseTask = () => Promise<void>;

export type StartupStatusListener = (event: StartupEvent) => void;
