import { SerializationFormat, SerializedEnvelope } from './models/SerializedEnvelope';

/**
 * A Serializer implements one specific format.
 * The Format Registry maps SerializationFormat → ISerializer.
 */
export interface ISerializer {
  readonly format: SerializationFormat;
  serialize(data: unknown): unknown;
  deserialize<T>(payload: unknown): T;
}

/**
 * The Format Registry is a simple IoC container for serializers.
 * Any engine or plugin can register a custom serializer.
 */
export class FormatRegistry {
  private serializers: Map<SerializationFormat, ISerializer> = new Map();

  public register(serializer: ISerializer): void {
    this.serializers.set(serializer.format, serializer);
  }

  public get(format: SerializationFormat): ISerializer {
    const s = this.serializers.get(format);
    if (!s) throw new Error(`FormatRegistry: No serializer registered for format '${format}'.`);
    return s;
  }

  public has(format: SerializationFormat): boolean {
    return this.serializers.has(format);
  }
}
