/**
 * InsertPictureEngine
 * 
 * Handles the logic for inserting pictures (From Device, Online, etc.)
 * Decodes metadata, manages the file picker, interacts with clipboard.
 */
class InsertPictureEngineImpl {
  private events: Record<string, Function[]> = {};

  initialize() {
    console.log('[InsertPictureEngine] Initialized');
  }

  dispose() {
    this.events = {};
  }

  on(event: string, callback: Function) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
    return () => {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    };
  }

  private emit(event: string, payload?: any) {
    if (this.events[event]) {
      this.events[event].forEach(cb => cb(payload));
    }
  }

  Picture(action: string) {
    console.log('[InsertPictureEngine] Picture', action);
    if (action === 'file') {
      this.openFilePicker();
    } else if (action === 'online') {
      alert('Online media library is coming soon! For now, please use the local file picker.');
      this.openFilePicker();
    }
  }

  private openFilePicker() {
    // 1. Create hidden input element
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    
    // Supported Formats
    // png, jpg, jpeg, gif, bmp, tiff, webp, svg, ico, heic, avif, raw
    input.accept = 'image/png, image/jpeg, image/gif, image/bmp, image/tiff, image/webp, image/svg+xml, image/x-icon, image/heic, image/avif, image/x-raw';
    
    input.onchange = (e: any) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        this.processImages(Array.from(files));
      }
    };

    // Trigger Native Dialog (Intercepted by Electron automatically)
    input.click();
  }

  private async processImages(files: File[]) {
    // Load and insert sequentially to maintain original order
    for (const file of files) {
      await this.processSingleImage(file);
    }
  }

  private processSingleImage(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        
        // 6. Image Engine: Decode image, Read metadata
        const img = new Image();
        img.onload = () => {
          // Generate thumbnail / cache / read EXIF here in a real implementation
          console.log(`[InsertPictureEngine] Loaded ${file.name} - ${img.width}x${img.height}`);
          
          // 5. Insert Position
          this.insertIntoDocument(img, file.name);
          resolve();
        };
        img.onerror = () => {
          console.error(`[InsertPictureEngine] Failed to load image: ${file.name}`);
          // 13. Error Handling - Corrupted image
          alert(`Failed to load image: ${file.name}`);
          resolve(); // Resolve anyway to continue sequentially
        };
        img.src = dataUrl;
      };

      reader.onerror = () => {
        console.error(`[InsertPictureEngine] Failed to read file: ${file.name}`);
        alert(`Failed to read file: ${file.name}`);
        resolve();
      };

      reader.readAsDataURL(file);
    });
  }

  private insertIntoDocument(img: HTMLImageElement, filename: string) {
    // 8. Auto Resize: Resize proportionally if wider than page
    // Assuming A4 page width printable area ~ 600px for this mock
    const maxPrintableWidth = 600;
    let finalWidth = img.width;
    let finalHeight = img.height;

    if (finalWidth > maxPrintableWidth) {
      const ratio = maxPrintableWidth / finalWidth;
      finalWidth = maxPrintableWidth;
      finalHeight = img.height * ratio;
    }

    // Generate HTML for the canvas (old mockup logic)
    // const imgHtml = `<img src="${img.src}" alt="${filename}" style="width: ${finalWidth}px; height: ${finalHeight}px; max-width: 100%; display: block;" data-layout="inline-with-text" />`;
    // const customEvent = new CustomEvent('officex:insert-html', { detail: { html: imgHtml } });
    // document.dispatchEvent(customEvent);

    // Call the legacy API to insert the inline image
    import('../editorApi').then(({ EditorAPI }) => {
      const api = EditorAPI.getLegacy() as any;
      if (api && api.insertImage) {
        api.insertImage(img.src, finalWidth, finalHeight);
      }
    });

    console.log('[InsertPictureEngine] Inserted image into document via insertImage API.');
  }

  // 4. Drag Drop
  handleDrop(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      const imageFiles = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
      if (imageFiles.length > 0) {
        this.processImages(imageFiles);
      }
    }
  }

  // 9. Clipboard
  handlePaste(e: ClipboardEvent) {
    console.log('[InsertPictureEngine] handlePaste called', e);
    if (!e.clipboardData) {
      console.warn('[InsertPictureEngine] No clipboardData');
      return;
    }

    console.log('[InsertPictureEngine] items count:', e.clipboardData.items.length);
    console.log('[InsertPictureEngine] files count:', e.clipboardData.files.length);
    Array.from(e.clipboardData.items).forEach((item, i) => {
      console.log(`[InsertPictureEngine] item[${i}]: kind=${item.kind}, type=${item.type}`);
    });

    // First try clipboardData.items (covers screenshots, browser copy, etc.)
    const items = Array.from(e.clipboardData.items);
    const imageItems = items.filter(item => item.kind === 'file' && item.type.startsWith('image/'));
    if (imageItems.length > 0) {
      e.preventDefault();
      const files = imageItems.map(item => item.getAsFile()).filter(Boolean) as File[];
      console.log('[InsertPictureEngine] image files from items:', files.length);
      if (files.length > 0) {
        this.processImages(files);
        return;
      }
    }

    // Fallback: clipboardData.files (drag-drop style)
    if (e.clipboardData.files && e.clipboardData.files.length > 0) {
      const imageFiles = Array.from(e.clipboardData.files).filter(file => file.type.startsWith('image/'));
      if (imageFiles.length > 0) {
        e.preventDefault();
        console.log('[InsertPictureEngine] image files from files:', imageFiles.length);
        this.processImages(imageFiles);
      }
    }
  }
}

export const InsertPictureEngine = new InsertPictureEngineImpl();
