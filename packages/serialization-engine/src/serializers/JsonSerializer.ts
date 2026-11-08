import { ISerializer } from '../FormatRegistry';

/**
 * Built-in JSON Serializer.
 * Used for APIs, AI integration, debugging, and plugin communication.
 * Preserves object identity via standard JSON.stringify / JSON.parse.
 */
export class JsonSerializer implements ISerializer {
  public readonly format = 'json' as const;

  public serialize(data: unknown): string {
    try {
      return JSON.stringify(data);
    } catch (e) {
      throw new Error(`JsonSerializer: Failed to serialize — ${(e as Error).message}`);
    }
  }

  public deserialize<T>(payload: unknown): T {
    if (typeof payload !== 'string') {
      throw new Error('JsonSerializer: Payload must be a string.');
    }
    try {
      return JSON.parse(payload) as T;
    } catch (e) {
      throw new Error(`JsonSerializer: Failed to deserialize — ${(e as Error).message}`);
    }
  }
}
