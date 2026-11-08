import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IpcRouter } from './router';
import { ipcMain } from 'electron';

// Mock electron ipcMain
vi.mock('electron', () => ({
  ipcMain: {
    handle: vi.fn()
  }
}));

describe('IpcRouter', () => {
  let router: IpcRouter;

  beforeEach(() => {
    router = new IpcRouter();
    vi.clearAllMocks();
  });

  it('should register a handler', () => {
    const handler = vi.fn();
    router.register('test-channel', handler);
    expect(true).toBe(true);
  });

  it('should handle missing handlers gracefully', async () => {
    router.start();
    const registeredCallback = (ipcMain.handle as any).mock.calls[0][1];

    const request = { channel: 'unknown-channel', requestId: '123', timestamp: Date.now() };
    const response = await registeredCallback(null, request);

    expect(response.success).toBe(false);
    expect(response.error.code).toBe('NOT_FOUND');
  });

  it('should execute handler and return success', async () => {
    router.register('test-channel', async (payload) => `Hello ${payload}`);
    router.start();

    const registeredCallback = (ipcMain.handle as any).mock.calls[0][1];

    const request = { channel: 'test-channel', payload: 'World', requestId: '123', timestamp: Date.now() };
    const response = await registeredCallback(null, request);

    expect(response.success).toBe(true);
    expect(response.data).toBe('Hello World');
  });

  it('should catch handler errors and return error boundary response', async () => {
    router.register('error-channel', async () => {
      throw new Error('Something went wrong');
    });
    router.start();

    const registeredCallback = (ipcMain.handle as any).mock.calls[0][1];

    const request = { channel: 'error-channel', requestId: '123', timestamp: Date.now() };
    const response = await registeredCallback(null, request);

    expect(response.success).toBe(false);
    expect(response.error.code).toBe('INTERNAL_ERROR');
    expect(response.error.message).toBe('Something went wrong');
  });
});
