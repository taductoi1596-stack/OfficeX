/**
 * KeyTipManager tracks the state of the Alt key to display Ribbon KeyTips.
 */

class KeyTipManagerImpl {
  private active = false;
  private listeners: Set<(active: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyDown);
      window.addEventListener('keyup', this.handleKeyUp);
      // Cancel KeyTips if user clicks anywhere
      window.addEventListener('mousedown', this.cancel);
    }
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    // If Alt is pressed alone
    if (e.key === 'Alt') {
      e.preventDefault();
      this.active = true;
      this.notify();
    } else if (this.active) {
      // If a key is pressed while KeyTips are active, we could dispatch Ribbon events here
      // For now, any keypress (other than Alt) dismisses the KeyTips
      this.active = false;
      this.notify();
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    // Sometimes Windows sends a bare Alt keyup
  };

  private cancel = () => {
    if (this.active) {
      this.active = false;
      this.notify();
    }
  };

  private notify() {
    this.listeners.forEach(fn => fn(this.active));
  }

  public subscribe(fn: (active: boolean) => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  public isActive() {
    return this.active;
  }
}

export const KeyTipManager = new KeyTipManagerImpl();
