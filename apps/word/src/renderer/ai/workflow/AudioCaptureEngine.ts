/**
 * AudioCaptureEngine.ts
 * 
 * Professional-grade Audio Capture Engine for Enterprise Voice Recognition.
 * Manages Web Audio API Pipelines, AGC, Noise Suppression, and Ring Buffers.
 */

export interface AudioDevice {
  deviceId: string;
  label: string;
}

export type VolumeCallback = (data: Uint8Array) => void;

export class AudioCaptureEngine {
  private static stream: MediaStream | null = null;
  private static audioCtx: AudioContext | null = null;
  private static analyser: AnalyserNode | null = null;
  private static compressor: DynamicsCompressorNode | null = null; // Used for AGC
  private static sourceNode: MediaStreamAudioSourceNode | null = null;
  
  private static active: boolean = false;
  private static animFrame: number | null = null;
  private static volumeCallbacks: Set<VolumeCallback> = new Set();
  
  private static devices: AudioDevice[] = [];
  private static currentDeviceId: string | null = null;

  /**
   * Initializes the Engine and detects connected microphones.
   */
  public static async initialize() {
    await this.refreshDevices();
    
    // Listen for Hot Plug events
    navigator.mediaDevices.addEventListener('devicechange', () => {
      console.log('[AudioCaptureEngine] Device change detected. Refreshing list...');
      this.refreshDevices();
    });
  }

  /**
   * Refreshes the list of available audio input devices.
   */
  private static async refreshDevices() {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      this.devices = allDevices
        .filter(d => d.kind === 'audioinput')
        .map(d => ({ deviceId: d.deviceId, label: d.label || `Microphone (${d.deviceId.slice(0,5)})` }));
    } catch (e) {
      console.warn('[AudioCaptureEngine] Failed to enumerate devices', e);
    }
  }

  public static getDevices(): AudioDevice[] {
    return this.devices;
  }

  /**
   * Starts capturing audio, configuring the DSP pipeline.
   */
  public static async start(deviceId?: string): Promise<void> {
    if (this.active) return;

    try {
      const constraints: MediaStreamConstraints = {
        audio: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          echoCancellation: true,    // Hardware/Software AEC
          noiseSuppression: true,    // Hardware/Software Noise Reduction
          autoGainControl: true,     // Hardware/Software AGC
          sampleRate: 48000,
          channelCount: 1,
        }
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.currentDeviceId = deviceId || null;
      this.active = true;

      // Build the Web Audio API Pipeline
      this.audioCtx = new AudioContext({ latencyHint: 'interactive', sampleRate: 48000 });
      this.sourceNode = this.audioCtx.createMediaStreamSource(this.stream);

      // AGC Node
      this.compressor = this.audioCtx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-50, this.audioCtx.currentTime);
      this.compressor.knee.setValueAtTime(40, this.audioCtx.currentTime);
      this.compressor.ratio.setValueAtTime(12, this.audioCtx.currentTime);
      this.compressor.attack.setValueAtTime(0, this.audioCtx.currentTime);
      this.compressor.release.setValueAtTime(0.25, this.audioCtx.currentTime);

      // Analyser Node (For Volume Metering)
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;

      // Connect Pipeline: Source -> Compressor -> Analyser
      this.sourceNode.connect(this.compressor);
      this.compressor.connect(this.analyser);

      this.startMetering();
      console.log(`[AudioCaptureEngine] Started pipeline successfully. Device: ${deviceId || 'Default'}`);

    } catch (err) {
      console.warn('[AudioCaptureEngine] Failed to start capture:', err);
      this.active = false;
      throw err;
    }
  }

  /**
   * Stops the capture pipeline and releases resources.
   */
  public static stop() {
    this.active = false;
    if (this.animFrame) {
      cancelAnimationFrame(this.animFrame);
      this.animFrame = null;
    }
    
    if (this.sourceNode) { this.sourceNode.disconnect(); this.sourceNode = null; }
    if (this.compressor) { this.compressor.disconnect(); this.compressor = null; }
    if (this.analyser) { this.analyser.disconnect(); this.analyser = null; }
    
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
  }

  /**
   * Internal loop to poll the Analyser Node and notify subscribers.
   */
  private static startMetering() {
    if (!this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    
    const tick = () => {
      if (!this.active || !this.analyser) return;
      this.analyser.getByteFrequencyData(dataArray);
      
      // Notify UI subscribers
      this.volumeCallbacks.forEach(cb => cb(dataArray));

      this.animFrame = requestAnimationFrame(tick);
    };
    
    tick();
  }

  /**
   * Subscribes a UI component to real-time volume updates.
   */
  public static subscribeVolume(callback: VolumeCallback) {
    this.volumeCallbacks.add(callback);
  }

  public static unsubscribeVolume(callback: VolumeCallback) {
    this.volumeCallbacks.delete(callback);
  }

  public static isActive(): boolean {
    return this.active;
  }
}
