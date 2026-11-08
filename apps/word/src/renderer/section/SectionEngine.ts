import type { DocModel } from '../document/DocumentTypes';
import type { DocSection, BreakType } from './SectionTypes';

export class SectionEngine {
  private static instance: SectionEngine;

  private constructor() {}

  public static get(): SectionEngine {
    if (!SectionEngine.instance) {
      SectionEngine.instance = new SectionEngine();
    }
    return SectionEngine.instance;
  }

  public Initialize() {
    // Initialization hook for any caches
  }

  // Get the section that contains a specific paragraph index
  public GetSectionForPara(doc: DocModel, paraIdx: number): DocSection {
    const fallbackSection: DocSection = {
      id: 'default-section',
      startParaIdx: 0,
      endParaIdx: Math.max(0, doc?.paras?.length ? doc.paras.length - 1 : 0),
      pageSetup: {
        width: 816, height: 1056,
        marginTop: 96, marginBottom: 96, marginLeft: 96, marginRight: 96,
        cols: 1, colLayout: 'equal'
      }
    };

    if (!doc || !doc.sections || doc.sections.length === 0) {
      return fallbackSection;
    }

    const sanitize = (s: DocSection): DocSection => ({
      ...s,
      pageSetup: {
        ...s.pageSetup,
        width: s.pageSetup?.width ?? 816,
        height: s.pageSetup?.height ?? 1056,
        marginTop: s.pageSetup?.marginTop ?? 96,
        marginBottom: s.pageSetup?.marginBottom ?? 96,
        marginLeft: s.pageSetup?.marginLeft ?? 96,
        marginRight: s.pageSetup?.marginRight ?? 96,
        cols: s.pageSetup?.cols ?? 1,
        colLayout: s.pageSetup?.colLayout ?? 'equal'
      }
    });

    for (const section of doc.sections) {
      if (section && paraIdx >= section.startParaIdx && paraIdx <= section.endParaIdx) {
        return sanitize(section);
      }
    }

    const lastSection = doc.sections[doc.sections.length - 1];
    return lastSection ? sanitize(lastSection) : fallbackSection;
  }

  public GetSections(doc: DocModel): DocSection[] {
    return doc.sections || [];
  }

  // Insert a section break at a specific paragraph index
  public InsertSectionBreak(doc: DocModel, paraIdx: number, breakType: BreakType): DocModel {
    if (!doc.sections || doc.sections.length === 0) return doc;

    const currentSectionIdx = doc.sections.findIndex(
      s => paraIdx >= s.startParaIdx && paraIdx <= s.endParaIdx
    );
    if (currentSectionIdx === -1) return doc;

    const currentSection = doc.sections[currentSectionIdx];
    
    // We split the current section at paraIdx
    const newSection1: DocSection = {
      ...currentSection,
      endParaIdx: paraIdx
    };

    const newSection2: DocSection = {
      ...currentSection,
      id: crypto.randomUUID(),
      startParaIdx: paraIdx + 1,
      breakType
      // pageSetup, headers, footers are cloned from previous section by default
    };

    const newSections = [
      ...doc.sections.slice(0, currentSectionIdx),
      newSection1,
      newSection2,
      ...doc.sections.slice(currentSectionIdx + 1)
    ];

    return { ...doc, sections: newSections };
  }

  public ClearCache() {
    // Clear internally memoized structures
  }
}
