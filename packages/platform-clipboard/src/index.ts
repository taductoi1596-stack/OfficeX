import { injectable } from 'tsyringe';
import { clipboard } from 'electron';

@injectable()
export class ClipboardService {
  public writeText(text: string): void {
    clipboard.writeText(text);
  }

  public readText(): string {
    return clipboard.readText();
  }
}
