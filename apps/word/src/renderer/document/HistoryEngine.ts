import { useRef, useCallback } from 'react';
import type { DocModel, Caret, SelRange } from './DocumentTypes';

export type Frame = { doc: DocModel; caret: Caret; sel: SelRange | null };

export function useHistory(initial: DocModel) {
  const hist  = useRef<Frame[]>([{ doc: initial, caret: { paraIdx: 0, charOffset: 0 }, sel: null }]);
  const idx   = useRef(0);

  const push = useCallback((frame: Frame) => {
    hist.current = hist.current.slice(0, idx.current + 1);
    hist.current.push(frame);
    if (hist.current.length > 200) { hist.current.shift(); }
    else { idx.current++; }
  }, []);

  const undo = useCallback((): Frame | null => {
    if (idx.current <= 0) return null;
    idx.current--;
    return hist.current[idx.current];
  }, []);

  const redo = useCallback((): Frame | null => {
    if (idx.current >= hist.current.length - 1) return null;
    idx.current++;
    return hist.current[idx.current];
  }, []);

  const canUndo = () => idx.current > 0;
  const canRedo = () => idx.current < hist.current.length - 1;

  const reset = useCallback((frameOrDoc: Frame | DocModel) => {
    const f: Frame = (frameOrDoc && 'paras' in frameOrDoc)
      ? { doc: frameOrDoc as DocModel, caret: { paraIdx: 0, charOffset: 0 }, sel: null }
      : (frameOrDoc as Frame);
    hist.current = [f];
    idx.current = 0;
  }, []);

  return { push, undo, redo, canUndo, canRedo, reset };
}
