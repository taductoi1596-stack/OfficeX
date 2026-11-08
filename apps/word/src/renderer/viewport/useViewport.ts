import { useState, useCallback, useRef, useEffect } from 'react';
import { PageBox } from '../pagination/PaginationTypes';
import { ViewportEngine } from './ViewportEngine';
import { VisibleRange, ScreenCaret } from './ViewportTypes';

const PAGE_GAP = 24;

export function useViewport(
  pages: PageBox[],
  sc: ScreenCaret | null
) {
  const [zoom, setZoom] = useState(1.0);
  const [vis, setVis] = useState<VisibleRange>({ start: 0, end: 3 });
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const hRulerRef = useRef<HTMLDivElement>(null);
  const vRulerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll caret into view
  useEffect(() => {
    if (!sc || !scrollRef.current) return;
    const { scrollTop, clientHeight } = scrollRef.current;
    
    const newScrollTop = ViewportEngine.get().calculateAutoScroll(
      sc, scrollTop, clientHeight, pages, zoom, PAGE_GAP
    );

    if (newScrollTop !== null) {
      scrollRef.current.scrollTop = newScrollTop;
    }
  }, [sc, zoom, pages]);

  // Handle scrolling and visible page recalculation
  const onScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollLeft, clientHeight } = scrollRef.current;
    
    if (hRulerRef.current) hRulerRef.current.scrollLeft = scrollLeft;
    if (vRulerRef.current) vRulerRef.current.scrollTop = scrollTop;

    const newVis = ViewportEngine.get().calculateVisiblePages(
      scrollTop, clientHeight, pages, zoom, PAGE_GAP
    );
    
    // Only update state if visibility range actually changed to prevent excessive re-renders
    setVis(prev => {
      if (prev.start !== newVis.start || prev.end !== newVis.end) return newVis;
      return prev;
    });
  }, [pages, zoom]);

  // Sync scroll on mount or when page structure/zoom changes
  useEffect(() => {
    onScroll();
  }, [pages, zoom, onScroll]);

  return {
    zoom,
    setZoom,
    vis,
    scrollRef,
    hRulerRef,
    vRulerRef,
    onScroll,
    PAGE_GAP
  };
}
