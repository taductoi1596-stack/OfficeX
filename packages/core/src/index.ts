export interface IDisposable {
  dispose(): void;
}

export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

export enum AppEnvironment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}
