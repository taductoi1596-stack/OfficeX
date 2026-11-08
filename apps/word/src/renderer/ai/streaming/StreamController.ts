/**
 * StreamController.ts
 *
 * Manages the lifecycle, buffering, backpressure, and telemetry of a single AI stream.
 */

export type StreamState = 'idle' | 'connecting' | 'streaming' | 'paused' | 'completed' | 'error' | 'cancelled';

export interface StreamTelemetry {
  tokensReceived: number;
  tokensPerSecond: number;
  elapsedMs: number;
  firstTokenLatencyMs: number;
}

export class StreamController {
  private _state: StreamState = 'idle';
  private buffer: string[] = [];
  
  private startTime: number = 0;
  private firstTokenTime: number = 0;
  private endTime: number = 0;
  private tokenCount: number = 0;

  private onTokenCallback?: (token: string) => void;
  private onCompleteCallback?: (fullText: string) => void;
  private onErrorCallback?: (err: Error) => void;
  private onStateChangeCallback?: (state: StreamState) => void;

  private cancelProviderStream?: () => void;
  private renderInterval?: ReturnType<typeof setInterval>;

  private fullText: string = '';

  constructor() {
    this.setState('idle');
  }

  // --- Configuration ---

  onToken(cb: (token: string) => void) { this.onTokenCallback = cb; return this; }
  onComplete(cb: (text: string) => void) { this.onCompleteCallback = cb; return this; }
  onError(cb: (err: Error) => void) { this.onErrorCallback = cb; return this; }
  onStateChange(cb: (state: StreamState) => void) { this.onStateChangeCallback = cb; return this; }

  setProviderCancel(cancelFn: () => void) {
    this.cancelProviderStream = cancelFn;
  }

  // --- Provider Input ---

  /** Called when stream starts connecting */
  markConnecting() {
    this.setState('connecting');
    this.startTime = Date.now();
  }

  /** Called by provider when a new chunk/token arrives */
  receive(token: string) {
    if (this._state === 'cancelled' || this._state === 'error') return;

    if (this._state === 'connecting') {
      this.setState('streaming');
      this.firstTokenTime = Date.now();
      this.startRenderLoop();
    }

    this.tokenCount++;
    this.buffer.push(token);
    this.fullText += token;
  }

  /** Called by provider when stream is done */
  complete() {
    if (this._state === 'cancelled' || this._state === 'error') return;
    this.endTime = Date.now();
    
    // We don't mark as completed immediately, we let the render loop finish flushing the buffer
  }

  /** Called by provider on error */
  error(err: Error) {
    if (this._state === 'cancelled') return;
    this.setState('error');
    this.stopRenderLoop();
    this.onErrorCallback?.(err);
  }

  // --- Control APIs ---

  pause() {
    if (this._state === 'streaming') {
      this.setState('paused');
    }
  }

  resume() {
    if (this._state === 'paused') {
      this.setState('streaming');
    }
  }

  cancel() {
    if (this._state === 'completed' || this._state === 'cancelled') return;
    this.setState('cancelled');
    this.stopRenderLoop();
    this.cancelProviderStream?.();
  }

  // --- Telemetry ---

  getTelemetry(): StreamTelemetry {
    const now = this.endTime || Date.now();
    const elapsedMs = Math.max(1, now - (this.firstTokenTime || this.startTime));
    return {
      tokensReceived: this.tokenCount,
      tokensPerSecond: (this.tokenCount / elapsedMs) * 1000,
      elapsedMs: now - this.startTime,
      firstTokenLatencyMs: this.firstTokenTime ? this.firstTokenTime - this.startTime : 0,
    };
  }

  // --- Private ---

  private setState(state: StreamState) {
    this._state = state;
    this.onStateChangeCallback?.(state);
  }

  private startRenderLoop() {
    // 60FPS incremental rendering backpressure loop
    // Instead of blocking UI, we flush the buffer periodically (approx 16ms)
    this.renderInterval = setInterval(() => {
      if (this._state === 'cancelled' || this._state === 'error') {
        this.stopRenderLoop();
        return;
      }

      if (this._state === 'paused') {
        return; // Keep buffering, but don't flush to UI
      }

      if (this.buffer.length > 0) {
        // Flush everything in buffer to UI (or chunk it if we want stricter rate limiting)
        // For now, we flush all accumulated to stay as real-time as possible without overwhelming the call stack
        const chunk = this.buffer.join('');
        this.buffer = [];
        this.onTokenCallback?.(this.fullText);
      } else if (this.endTime > 0) {
        // Stream completed and buffer is empty
        this.setState('completed');
        this.stopRenderLoop();
        this.onCompleteCallback?.(this.fullText);
      }
    }, 16);
  }

  private stopRenderLoop() {
    if (this.renderInterval) {
      clearInterval(this.renderInterval);
      this.renderInterval = undefined;
    }
  }
}
