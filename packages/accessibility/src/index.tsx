import { useEffect, useRef } from 'react';

export const useKeyboardNavigation = (
  containerRef: React.RefObject<HTMLElement>,
  itemSelector: string
) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const items = Array.from(container.querySelectorAll<HTMLElement>(itemSelector));
      const activeElement = document.activeElement as HTMLElement;
      const currentIndex = items.indexOf(activeElement);

      if (currentIndex === -1) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % items.length;
        items[nextIndex]?.focus();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        items[prevIndex]?.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, itemSelector]);
};

export const ScreenReaderOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <span className="absolute w-[1px] h-[1px] p-0 -m-[1px] overflow-hidden clip-rect-0 border-0 whitespace-nowrap">
      {children}
    </span>
  );
};
