export interface IpcRequest<T = any> {
  channel: string;
  payload?: T;
  requestId: string;
  timestamp: number;
}

export interface IpcResponse<T = any> {
  success: boolean;
  data?: T;
  error?: IpcError;
  requestId: string;
  timestamp: number;
}

export interface IpcError {
  code: string;
  message: string;
  details?: any;
}
