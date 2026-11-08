/**
 * HistoryDatabase.ts
 *
 * IndexedDB wrapper simulating an enterprise SQLite backend for AI History.
 */

import { AIHistoryRecord } from './HistoryTypes';

const DB_NAME = 'OfficeX_AI_History';
const DB_VERSION = 1;
const STORE_NAME = 'transactions';

export class HistoryDatabase {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('feature', 'feature', { unique: false });
          store.createIndex('provider', 'telemetry.provider', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = (event) => {
        console.error('IndexedDB Error:', event);
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  async addRecord(record: AIHistoryRecord): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.add(record);
      
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getAllRecords(): Promise<AIHistoryRecord[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const records = req.result as AIHistoryRecord[];
        // Sort descending by timestamp
        resolve(records.sort((a, b) => b.timestamp - a.timestamp));
      };
      req.onerror = () => reject(req.error);
    });
  }

  async clear(): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
}

export const aiHistoryDb = new HistoryDatabase();
