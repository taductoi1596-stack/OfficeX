/**
 * AIStreamingEngine.ts
 *
 * Orchestrates AI streams, handling connection to the Provider Manager,
 * while returning a manageable StreamController to the UI.
 */

import { AIProviderManager } from '../AIProviderManager';
import { StreamController } from './StreamController';

export interface StreamOptions {
  providerId: string;
  modelId: string;
  prompt: string;
  systemPrompt: string;
  operation: 'chat' | 'rewrite' | 'summarize' | 'translate';
  mockResponseText?: string;
}

export class AIStreamingEngine {
  private static activeStreams = new Set<StreamController>();

  /**
   * Opens a new AI stream.
   */
  static openStream(options: StreamOptions): StreamController {
    const controller = new StreamController();
    this.activeStreams.add(controller);
    
    controller.markConnecting();

    // In a real implementation, we would handle Retry, Reconnect, Timeout here.
    // For this prototype, we rely on the Provider Manager's abstraction.
    const cancelProvider = AIProviderManager.streamChat(
      options.providerId,
      options.modelId,
      options.prompt,
      options.systemPrompt,
      { operation: options.operation, mockResponseText: options.mockResponseText },
      (token) => controller.receive(token),
      (fullText) => {
        controller.complete();
        this.activeStreams.delete(controller);
      },
      (err) => {
        controller.error(err);
        this.activeStreams.delete(controller);
      }
    );

    controller.setProviderCancel(cancelProvider);

    return controller;
  }

  /**
   * Forcibly cancel all active streams (e.g., when closing the document).
   */
  static cancelAll() {
    for (const stream of this.activeStreams) {
      stream.cancel();
    }
    this.activeStreams.clear();
  }
}
