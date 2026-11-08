import React, { createContext, useContext, useMemo, useRef, useEffect } from 'react';
import { DocumentManager } from '@officex/document-engine';
import { HistoryManager } from '@officex/history-engine';
import { ValidationEngine, CommandDispatcher } from '@officex/command-engine';
import { CacheManager } from '@officex/cache-engine';
import { DocumentRoot, ParagraphNode, RunNode } from '@officex/object-model-engine';
import { SerializationManager } from '@officex/serialization-engine';
import { InputManager } from '@officex/input-engine';
import { EventManager } from '@officex/event-engine';
import { HitTestManager } from '@officex/hittest-engine';
import { ViewportManager } from '@officex/viewport-engine';
import { CoordinateManager } from '@officex/coordinate-engine';
import { PaginationManager } from '@officex/pagination-engine';
import { AccessibilityManager } from '@officex/accessibility-engine';
import { PrintPreviewManager } from '@officex/print-preview-engine';
import { ImportManager } from '@officex/import-engine';
import { TemplateManager } from '@officex/template-engine';
import { SessionManager } from '@officex/session-engine';
import { VersionManager } from '@officex/versioning-engine';
import { RecoveryManager as RecoveryEngineManager } from '@officex/recovery-engine';
import { DiagnosticsManager } from '@officex/diagnostics-engine';
import { ProfilerManager } from '@officex/profiling-engine';
import { TelemetryManager } from '@officex/telemetry-engine';
import { LicenseManager } from '@officex/licensing-engine';
import { PolicyManager } from '@officex/policy-engine';
import { RightsManager } from '@officex/rights-management-engine';
import { AuditManager } from '@officex/audit-engine';
import { HyperlinkManager } from '@officex/hyperlink-engine';
import { BookmarkManager } from '@officex/bookmark-engine';
import { FieldManager } from '@officex/field-engine';
import { ReferenceManager } from '@officex/reference-engine';
import { TrackChangesManager } from '@officex/track-changes-engine';
import { CommentManager } from '@officex/comment-engine';
import { MergeManager, CSVProvider, JSONProvider } from '@officex/mail-merge-engine';
import { ListManager as NumberingManager } from '@officex/numbering-engine';
import { PageSetupManager } from '@officex/page-setup-engine';
import { MetadataManager } from '@officex/metadata-engine';
import { ValidationManager } from '@officex/validation-engine';
import { SpellCheckManager } from '@officex/spellcheck-engine';
import { GrammarManager } from '@officex/grammar-engine';
import { CommandRegistry, CommandDispatcher as WordCommandDispatcher, registerCoreCommands, EditorBridge } from '@officex/word-commands';

// ─── Engine Context Shape ────────────────────────────────────────────────────

export interface EngineContextValue {
  documentManager: DocumentManager;
  historyManager: HistoryManager;
  validationEngine: ValidationEngine;
  dispatcher: CommandDispatcher;
  cacheManager: CacheManager;
  serializationManager: SerializationManager;
  inputManager: InputManager;
  eventManager: EventManager;
  hitTestManager: HitTestManager;
  viewportManager: ViewportManager;
  coordinateManager: CoordinateManager;
  paginationManager: PaginationManager;
  accessibilityManager: AccessibilityManager;
  printPreviewManager: PrintPreviewManager;
  importManager: ImportManager;
  templateManager: TemplateManager;
  sessionManager: SessionManager;
  versionManager: VersionManager;
  recoveryEngineManager: RecoveryEngineManager;
  diagnosticsManager: DiagnosticsManager;
  profilerManager: ProfilerManager;
  telemetryManager: TelemetryManager;
  licenseManager: LicenseManager;
  policyManager: PolicyManager;
  rightsManager: RightsManager;
  auditManager: AuditManager;
  hyperlinkManager: HyperlinkManager;
  bookmarkManager: BookmarkManager;
  fieldManager: FieldManager;
  referenceManager: ReferenceManager;
  trackChangesManager: TrackChangesManager;
  commentManager: CommentManager;
  mergeManager: MergeManager;
  numberingManager: NumberingManager;
  pageSetupManager: PageSetupManager;
  metadataManager: MetadataManager;
  validationManager: ValidationManager;
  spellCheckManager: SpellCheckManager;
  grammarManager: GrammarManager;
  commandDispatcher: WordCommandDispatcher;
  editorBridge: EditorBridge;
  /** The live in-memory DOM tree for the active document */
  documentRoot: DocumentRoot;
  /** The currently open document ID, or null */
  activeDocumentId: string | null;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const EngineContext = createContext<EngineContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function EngineProvider({ children }: { children: React.ReactNode }) {
  const activeDocumentIdRef = useRef<string | null>(null);

  const value = useMemo<EngineContextValue>(() => {
    // 0. Event Engine — the enterprise-wide event bus
    const eventManager = new EventManager();

    // 1. Cache Engine — shared across all engines
    const cacheManager = new CacheManager();

    // 2. HitTest Engine
    const hitTestManager = new HitTestManager();

    // 3. Viewport Engine
    const viewportManager = new ViewportManager();

    // 4. Coordinate Engine
    const coordinateManager = new CoordinateManager();

    // 5. Pagination Engine
    const paginationManager = new PaginationManager();

    // 6. Accessibility Engine
    const accessibilityManager = new AccessibilityManager();

    // 7. Print Preview Engine
    const printPreviewManager = new PrintPreviewManager();

    // 8. Import Engine
    const importManager = new ImportManager();

    // 9. Template Engine
    const templateManager = new TemplateManager();
    const renderedTemplate = templateManager.render('builtin:report', {
      variables: {
        title: 'OfficeX Architecture',
        author: 'AI Assistant',
        companyName: 'OfficeX Corp',
        date: '2026-07-15'
      }
    });
    console.log(`[TemplateEngine] Rendered "builtin:report" | Layout: ${templateManager.gallery.getById('builtin:report')?.layoutId} | Content preview: \n${renderedTemplate.content.substring(0, 100)}...`);

    // 10. Session Engine
    const sessionManager = new SessionManager();
    sessionManager.start();

    // 11. Versioning Engine
    const versionManager = new VersionManager();

    // 12. Recovery Engine
    const recoveryEngineManager = new RecoveryEngineManager();

    // 13. Diagnostics Engine
    const diagnosticsManager = new DiagnosticsManager();

    // 14. Profiling Engine
    const profilerManager = new ProfilerManager();

    // 15. Telemetry Engine
    const telemetryManager = new TelemetryManager({
      telemetryEnabled: true,
      allowCrashReports: true,
      allowPerformanceMetrics: true,
      allowFeatureUsage: true,
      allowAiUsage: false, // Default opt-out for AI
    });
    telemetryManager.start();

    // 16. Licensing Engine
    const licenseManager = new LicenseManager();
    // Simulate activation for demo
    licenseManager.activateAndRegister('TRIAL-12345', 'user-01', 'OfficeX-Web').catch(console.error);

    // 17. Policy Engine
    const policyManager = new PolicyManager();
    policyManager.loadPolicies([
      {
        policyId: 'pol-01',
        name: 'Disable Export to PDF for Guests',
        category: 'export',
        scope: ['role:guest'],
        priority: 100,
        rules: [
          {
            ruleId: 'rule-01',
            conditions: [{ field: 'action', operator: 'equals', value: 'export:pdf' }],
            action: 'deny',
          },
        ],
        status: 'active',
        metadata: {},
        lastUpdated: Date.now(),
      },
    ]);

    // 5. Document Engine — lifecycle orchestrator
    const documentManager = new DocumentManager(
      async (_doc, _content) => { },
      async (_path) => { return null; }
    );

    // 6. Object Model Engine — the live DOM tree
    const documentRoot = new DocumentRoot();

    // 7. Create default blank document and wire onChange → cache invalidation
    const doc = documentManager.create('Untitled Document');
    activeDocumentIdRef.current = doc.id;

    documentRoot.onChange(() => {
      // Invalidate layout + render caches whenever the DOM tree mutates
      cacheManager.invalidateDependents('document:root');
    });

    // 18. Rights Management Engine
    const rightsManager = new RightsManager();
    rightsManager.setCurrentUser('user-01');

    // 19. Audit Engine
    const auditManager = new AuditManager();
    auditManager.setCurrentUser('user-01', 'org-officex');
    auditManager.start();
    auditManager.recordDocumentOpen(doc.id);

    // 20. Hyperlink Engine
    const hyperlinkManager = new HyperlinkManager();
    // Register sample document bookmark
    hyperlinkManager.registerBookmark('introduction', 'page:1');

    // 21. Bookmark Engine
    const bookmarkManager = new BookmarkManager();
    bookmarkManager.create('introduction', 'user', { objectId: 'para-intro', pageHint: 1 });
    // Keep hyperlink and bookmark engines in sync (basic demonstration)
    bookmarkManager.getAll().forEach(bm => {
      hyperlinkManager.registerBookmark(bm.name, `page:${bm.position.pageHint}`);
    });

    // 22. Field Engine
    const fieldManager = new FieldManager();
    fieldManager.setContext({ metadata: { author: 'OfficeX User' } });
    fieldManager.createField(' AUTHOR ');
    fieldManager.createField(' DATE \\@ "dd/MM/yyyy" ');

    // 23. Reference Engine
    const referenceManager = new ReferenceManager();
    referenceManager.citations.addSource({ id: 'src-1', author: 'Smith, J.', title: 'Office Design Patterns', year: '2026', type: 'book' });
    referenceManager.citations.createCitation('para-1', 'src-1');
    referenceManager.notes.createFootnote('para-2', 'note-content-1');

    // 24. Track Changes Engine
    const trackChangesManager = new TrackChangesManager();
    trackChangesManager.setCurrentUser('user-01');
    trackChangesManager.enable();
    trackChangesManager.trackInsertion('para-3', { text: 'New content added during review.' });
    // Extended: track a formatting change and a move
    trackChangesManager.recorder.setAuthor('user-02');
    trackChangesManager.trackFormatting('para-1', { bold: false }, { bold: true });
    trackChangesManager.recorder.setAuthor('user-01');
    // Set display mode to simple-markup (only pending revisions visible)
    trackChangesManager.displayMode.setMode('simple-markup');
    const summary = trackChangesManager.getRevisionSummary();
    console.log(`[TrackChanges] ${summary.total} revision(s) | pending: ${summary.pending} | by user-01: ${summary.byAuthor['user-01'] || 0}`);

    // 25. Comment Engine
    const commentManager = new CommentManager();
    commentManager.setCurrentUser('user-02');
    const thread1 = commentManager.addComment('para-1', 'Should we rephrase this?', 'paragraph');
    const thread2 = commentManager.addComment('image-1', 'This chart needs updating.', 'image');
    commentManager.setCurrentUser('user-01');
    commentManager.replyToThread(thread1.threadId, 'I will update it in the next revision.');
    commentManager.resolveThread(thread1.threadId);
    commentManager.reopenThread(thread1.threadId); // Extended feature
    
    const unresolvedComments = commentManager.filterThreads({ unresolvedOnly: true });
    const nextThread = commentManager.getNextThread(thread1.threadId);
    console.log(`[CommentEngine] Total: 2 threads | Unresolved: ${unresolvedComments.length} | Next after thread1: ${nextThread?.threadId}`);

    // 26. Mail Merge Engine
    const mergeManager = new MergeManager();
    const jsonProvider = new JSONProvider('employees', [
      { FirstName: 'Alice', LastName: 'Smith', Department: 'Engineering', Score: 95 },
      { FirstName: 'Bob', LastName: 'Jones', Department: 'Marketing', Score: 85 },
      { FirstName: 'Charlie', LastName: 'Brown', Department: 'Engineering', Score: 88 }
    ]);
    mergeManager.registerProvider(jsonProvider);
    mergeManager.createJob('template-id', 'employees').then(job => {
      job.filterOptions = [{ field: 'Department', operator: 'equals', value: 'Engineering' }];
      job.sortOptions = [{ field: 'Score', direction: 'desc' }];
      
      const template = 'Hello {{FirstName}} {{LastName}}! {{IF Score="95"}}Great job!{{ELSE}}Keep trying!{{ENDIF}}';
      mergeManager.executeJob(job.jobId, template).then(outputs => {
        console.log(`[MailMerge] Filtered/Sorted Outputs (${outputs.length}):`, outputs);
      });
    });

    // 27. Numbering Engine
    const numberingManager = new NumberingManager();
    const numberedList = numberingManager.createList('outline');
    const item1 = numberingManager.addListItem(numberedList.listId, 'para-4', 0); // Level 0 -> 1.
    const item2 = numberingManager.addListItem(numberedList.listId, 'para-5', 1); // Level 1 -> a)
    const item3 = numberingManager.addListItem(numberedList.listId, 'para-6', 0); // Level 0 -> 2.
    console.log(`[NumberingEngine] Outline list preview: ${item1.renderedText}, ${item2.renderedText}, ${item3.renderedText}`);

    // 28. Page Setup Engine
    const pageSetupManager = new PageSetupManager();
    // Word document default: A4, portrait, 1-inch margins
    const pageSetup = pageSetupManager.getPageSetup();
    const printable = pageSetupManager.getPrintableArea();
    console.log(`[PageSetup] ${pageSetup.paperSize} ${pageSetup.orientation} — Printable area: ${printable.width.toFixed(1)}x${printable.height.toFixed(1)} pts`);

    // 29. Metadata Engine
    const metadataManager = new MetadataManager(doc.id, {
      title: 'OfficeX Sample Document',
      author: 'user-01',
      subject: 'Engine Architecture Demo',
      keywords: ['officex', 'architecture', 'demo'],
      company: 'OfficeX Corp',
      contentType: 'word-document',
    });
    metadataManager.addTag('enterprise');
    metadataManager.addTag('demo');
    metadataManager.custom.set('ProjectCode', 'OFX-2026');
    metadataManager.custom.set('ReviewCycle', 3);
    metadataManager.recordSave('user-01');
    console.log(`[Metadata] Title: "${metadataManager.core.get().title}" | Rev: ${metadataManager.getRevision().revisionNumber} | Tags: [${metadataManager.getTags().join(', ')}]`);

    // 30. Validation Engine
    const validationManager = new ValidationManager();
    const validationReport = validationManager.validateDocument(
      doc.id,
      { id: doc.id, sections: [{}], metadata: { title: 'OfficeX Sample Document' } },
      [],   // no broken references in this demo
      new Set(['para-1', 'para-2', 'para-3']),
      []    // no external resources in this demo
    );
    console.log(`[Validation] Report: ${validationReport.errorCount} errors, ${validationReport.warningCount} warnings, ${validationReport.infoCount} info | isValid: ${validationReport.isValid}`);

    // 31. SpellCheck Engine
    const spellCheckManager = new SpellCheckManager();
    const demoText = "Teh quick brown fox jumps  over the lazy docment.";
    const spellIssues = spellCheckManager.checkText(demoText);
    const autocorrected = spellCheckManager.tryAutoCorrect('teh');
    console.log(`[SpellCheck] Analyzed text: "${demoText}"`);
    console.log(`[SpellCheck] Found ${spellIssues.length} issues.`);
    spellIssues.forEach(issue => console.log(`   - [${issue.severity}] ${issue.type}: ${issue.message} ("${issue.originalText}") -> Suggestion: ${issue.suggestions[0]?.replacement}`));
    console.log(`[SpellCheck] AutoCorrect 'teh' -> '${autocorrected}'`);

    // 32. Grammar Engine
    const grammarManager = new GrammarManager();
    const grammarIssues = grammarManager.analyzeText('They is going to the store.');
    console.log(`[GrammarEngine] Found ${grammarIssues.length} issues.`);

    // 33. UI Command Layer (Word Commands)
    const registry = new CommandRegistry();
    registerCoreCommands(registry);
    const editorBridge = new EditorBridge();

    // 9. Serialization Engine
    const serializationManager = new SerializationManager();

    // 3. History Engine — manages Undo/Redo stacks
    const historyManager = new HistoryManager();

    // 4. Command Engine — Validation + Dispatcher
    const validationEngine = new ValidationEngine();
    const dispatcher = new CommandDispatcher(historyManager, validationEngine);

    // 8. Input Engine
    const inputManager = new InputManager(window);

    // Create dispatcher with references to required engines
    const commandDispatcher = new WordCommandDispatcher(registry, {
      documentId: doc.id,
      engines: {
        documentManager,
        historyManager,
        editorBridge
      }
    });

    return {
      documentManager,
      historyManager,
      validationEngine,
      dispatcher,
      cacheManager,
      serializationManager,
      inputManager,
      eventManager,
      hitTestManager,
      viewportManager,
      coordinateManager,
      paginationManager,
      accessibilityManager,
      printPreviewManager,
      importManager,
      templateManager,
      sessionManager,
      versionManager,
      recoveryEngineManager,
      diagnosticsManager,
      profilerManager,
      telemetryManager,
      licenseManager,
      policyManager,
      rightsManager,
      auditManager,
      hyperlinkManager,
      bookmarkManager,
      fieldManager,
      referenceManager,
      trackChangesManager,
      commentManager,
      mergeManager,
      numberingManager,
      pageSetupManager,
      metadataManager,
      validationManager,
      spellCheckManager,
      grammarManager,
      commandDispatcher,
      editorBridge,
      documentRoot,
      activeDocumentId: doc.id,
    };
  }, []);

  return (
    <EngineContext.Provider value={value}>
      {children}
    </EngineContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useEngines(): EngineContextValue {
  const ctx = useContext(EngineContext);
  if (!ctx) throw new Error('useEngines must be used inside <EngineProvider>');
  return ctx;
}
