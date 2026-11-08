import { injectable } from 'tsyringe';
import fs from 'fs';
import path from 'path';
import os from 'os';

export interface RecoveryItem {
  id: string;
  appName: string;
  fileName: string;
  timestamp: number;
}

@injectable()
export class RecoveryManager {
  private getStoragePath() {
    return path.join(os.homedir(), '.officex', 'recovery.json');
  }

  public isCrashed(): boolean {
    try {
      const data = this.loadData();
      return data.isCrashed === true;
    } catch {
      return false;
    }
  }

  public getRecoveryItems(): RecoveryItem[] {
    try {
      const data = this.loadData();
      return data.items || [];
    } catch {
      return [];
    }
  }

  public setCrashState(items: RecoveryItem[]) {
    this.saveData({ isCrashed: true, items });
  }

  public clearCrashState() {
    this.saveData({ isCrashed: false, items: [] });
  }

  private loadData(): any {
    const file = this.getStoragePath();
    if (!fs.existsSync(file)) return {};
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  }

  private saveData(data: any) {
    const file = this.getStoragePath();
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  }
}
