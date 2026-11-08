import React, { createContext, useContext, useMemo } from 'react';
import { DocumentManager } from '@officex/document-engine';
import { HistoryManager } from '@officex/history-engine';
import { ValidationEngine, CommandDispatcher } from '@officex/command-engine';
import { CacheManager } from '@officex/cache-engine';
import { DocumentRoot } from '@officex/object-model-engine';

export interface PPTEngineContextValue {
  documentManager: DocumentManager;
  historyManager: HistoryManager;
  dispatcher: CommandDispatcher;
  cacheManager: CacheManager;
  documentRoot: DocumentRoot;
  activeDocumentId: string | null;
}

const PPTEngineContext = createContext<PPTEngineContextValue | null>(null);

export function PPTEngineProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo<PPTEngineContextValue>(() => {
    const cacheManager = new CacheManager();
    const historyManager = new HistoryManager();
    const validationEngine = new ValidationEngine();
    const dispatcher = new CommandDispatcher(historyManager, validationEngine);
    const documentManager = new DocumentManager(
      async () => {},
      async () => null,
    );
    const documentRoot = new DocumentRoot();

    const doc = documentManager.create('Untitled Presentation');

    documentRoot.onChange(() => {
      cacheManager.invalidateDependents('presentation:root');
    });

    return { documentManager, historyManager, dispatcher, cacheManager, documentRoot, activeDocumentId: doc.id };
  }, []);

  return <PPTEngineContext.Provider value={value}>{children}</PPTEngineContext.Provider>;
}

export function usePPTEngines(): PPTEngineContextValue {
  const ctx = useContext(PPTEngineContext);
  if (!ctx) throw new Error('usePPTEngines must be used inside <PPTEngineProvider>');
  return ctx;
}
