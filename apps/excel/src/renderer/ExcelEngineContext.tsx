import React, { createContext, useContext, useMemo } from 'react';
import { DocumentManager } from '@officex/document-engine';
import { HistoryManager } from '@officex/history-engine';
import { ValidationEngine, CommandDispatcher } from '@officex/command-engine';
import { CacheManager } from '@officex/cache-engine';
import { DocumentRoot } from '@officex/object-model-engine';

export interface ExcelEngineContextValue {
  documentManager: DocumentManager;
  historyManager: HistoryManager;
  dispatcher: CommandDispatcher;
  cacheManager: CacheManager;
  documentRoot: DocumentRoot;
  activeDocumentId: string | null;
}

const ExcelEngineContext = createContext<ExcelEngineContextValue | null>(null);

export function ExcelEngineProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo<ExcelEngineContextValue>(() => {
    const cacheManager = new CacheManager();
    const historyManager = new HistoryManager();
    const validationEngine = new ValidationEngine();
    const dispatcher = new CommandDispatcher(historyManager, validationEngine);
    const documentManager = new DocumentManager(
      async () => {},
      async () => null,
    );
    const documentRoot = new DocumentRoot();

    const doc = documentManager.create('Untitled Spreadsheet');

    documentRoot.onChange(() => {
      cacheManager.invalidateDependents('spreadsheet:root');
    });

    return { documentManager, historyManager, dispatcher, cacheManager, documentRoot, activeDocumentId: doc.id };
  }, []);

  return <ExcelEngineContext.Provider value={value}>{children}</ExcelEngineContext.Provider>;
}

export function useExcelEngines(): ExcelEngineContextValue {
  const ctx = useContext(ExcelEngineContext);
  if (!ctx) throw new Error('useExcelEngines must be used inside <ExcelEngineProvider>');
  return ctx;
}
