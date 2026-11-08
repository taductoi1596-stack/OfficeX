import { ClipboardItem } from '../models/ClipboardItem';

/**
 * Interface that bridges the headless ClipboardEngine with the Native OS API.
 * The host environment (Web Browser or Electron) must implement this.
 */
export interface OSClipboardAdapter {
  /** Write the best available format to the OS clipboard */
  writeToOS(item: ClipboardItem): Promise<void>;
  
  /** Read whatever is currently in the OS clipboard into a new ClipboardItem */
  readFromOS(): Promise<ClipboardItem>;
}
