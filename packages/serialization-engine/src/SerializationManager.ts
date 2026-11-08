import { ISerializer, FormatRegistry } from './FormatRegistry';
import { SerializationFormat, SerializedEnvelope } from './models/SerializedEnvelope';
import { JsonSerializer } from './serializers/JsonSerializer';

/**
 * SerializationManager is the main public API.
 *
 * Usage:
 *   const sm = new SerializationManager();
 *   const envelope = sm.serialize(myObjectModel, 'json');
 *   const restored = sm.deserialize<MyModel>(envelope);
 */
export class SerializationManager {
  private registry: FormatRegistry;

  constructor() {
    this.registry = new FormatRegistry();
    // Register built-in serializers
    this.registry.register(new JsonSerializer());
  }

  /**
   * Register a custom serializer (e.g. OpenXML, Binary, Plugin).
   */
  public registerSerializer(serializer: ISerializer): void {
    this.registry.register(serializer);
  }

  /**
   * Serialize an in-memory object into a versioned SerializedEnvelope.
   */
  public serialize(data: unknown, format: SerializationFormat): SerializedEnvelope {
    const serializer = this.registry.get(format);
    const payload = serializer.serialize(data);

    const envelope: SerializedEnvelope = {
      format,
      formatVersion: '1.0.0',
      timestamp: new Date().toISOString(),
      payload,
    };

    return envelope;
  }

  /**
   * Deserialize a SerializedEnvelope back into a typed object.
   */
  public deserialize<T>(envelope: SerializedEnvelope): T {
    this.validateEnvelope(envelope);
    const serializer = this.registry.get(envelope.format);
    return serializer.deserialize<T>(envelope.payload);
  }

  private validateEnvelope(envelope: SerializedEnvelope): void {
    if (!envelope || !envelope.format || !envelope.payload) {
      throw new Error('SerializationManager: Invalid or malformed envelope.');
    }
    if (!this.registry.has(envelope.format)) {
      throw new Error(`SerializationManager: Unknown format '${envelope.format}'.`);
    }
  }
}
