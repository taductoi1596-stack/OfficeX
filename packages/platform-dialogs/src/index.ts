import { injectable } from 'tsyringe';
import { dialog } from 'electron';

@injectable()
export class DialogService {
  public async showMessage(title: string, message: string): Promise<void> {
    await dialog.showMessageBox({
      type: 'info',
      title,
      message,
      buttons: ['OK']
    });
  }
}
