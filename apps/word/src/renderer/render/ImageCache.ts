export const ImageCache = new Map<string, HTMLImageElement>();
export function getCachedImage(src: string, onRender: () => void): HTMLImageElement | null {
  if (!src) return null;
  if (ImageCache.has(src)) return ImageCache.get(src)!;
  const img = new Image();
  img.src = src;
  img.onload = () => onRender();
  ImageCache.set(src, img);
  return img; // Might not be loaded yet, but we cache the element
}
