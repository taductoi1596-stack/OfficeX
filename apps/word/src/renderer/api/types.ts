export enum ErrorCode {
  OK = 'OK',
  INVALID_ARGUMENT = 'INVALID_ARGUMENT',
  DOCUMENT_LOCKED = 'DOCUMENT_LOCKED',
  READ_ONLY = 'READ_ONLY',
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  ACCESS_DENIED = 'ACCESS_DENIED',
  OUT_OF_MEMORY = 'OUT_OF_MEMORY',
  INVALID_STATE = 'INVALID_STATE',
  PLUGIN_ERROR = 'PLUGIN_ERROR',
  AI_ERROR = 'AI_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface CommandResult<T = any> {
  success: boolean;
  errorCode: ErrorCode;
  message?: string;
  payload?: T;
  executionTimeMs: number;
}

export function createSuccessResult<T = any>(payload?: T): CommandResult<T> {
  return {
    success: true,
    errorCode: ErrorCode.OK,
    payload,
    executionTimeMs: 0
  };
}

export function createErrorResult(errorCode: ErrorCode, message?: string): CommandResult {
  return {
    success: false,
    errorCode,
    message,
    executionTimeMs: 0
  };
}
