/**
 * SummaryTypesEngine.ts
 * 
 * Central registry for all AI Summary Types in OfficeX Word.
 * Responsible for mapping specific summary names to detailed AI Prompt Instructions.
 */

export interface SummaryTypeDef {
  id: string;
  category: string;
  name: string;
  instruction: string;
  defaultFormat: string;
}

export class SummaryTypesEngine {
  private static types: SummaryTypeDef[] = [
    // General Category
    { id: 'GENERAL', category: 'General', name: 'General', instruction: 'Provide a concise overview of the selected content.', defaultFormat: 'Paragraph' },
    { id: 'KEYPOINTS', category: 'General', name: 'Key Points', instruction: 'Extract only the most important information. Rank by importance.', defaultFormat: 'Bullet List' },
    { id: 'BULLETS', category: 'General', name: 'Bullet Summary', instruction: 'Convert the content into clean, nested bullet points.', defaultFormat: 'Bullet List' },
    { id: 'ONE_SENTENCE', category: 'General', name: 'One Sentence', instruction: 'Summarize the document in exactly one sentence. Maximum 50 words.', defaultFormat: 'Paragraph' },
    { id: 'ONE_PARAGRAPH', category: 'General', name: 'One Paragraph', instruction: 'Generate a concise single paragraph maintaining main ideas and flow.', defaultFormat: 'Paragraph' },
    { id: 'DETAILED', category: 'General', name: 'Detailed', instruction: 'Preserve most information while reducing size. Target ~50% compression.', defaultFormat: 'Paragraph' },
    { id: 'COMPREHENSIVE', category: 'General', name: 'Comprehensive', instruction: 'Create a long-form summary including every major topic, context, and examples.', defaultFormat: 'Paragraph' },
    { id: 'OUTLINE', category: 'General', name: 'Outline', instruction: 'Generate a hierarchical heading tree of topics and subtopics.', defaultFormat: 'Markdown' },
    { id: 'MINDMAP', category: 'General', name: 'Mind Map', instruction: 'Generate a structural mind map outline starting from a Root Topic with branches and relationships.', defaultFormat: 'Markdown' },
    { id: 'TRANSLATION', category: 'General', name: 'Translation', instruction: 'Summarize the content and then translate it maintaining the core meaning.', defaultFormat: 'Paragraph' },

    // Business Category
    { id: 'EXECUTIVE', category: 'Business', name: 'Executive', instruction: 'Provide a high-level summary for executives including Objectives, Results, Risks, Recommendations, and Business Impact.', defaultFormat: 'Paragraph' },
    { id: 'MEETING', category: 'Business', name: 'Meeting', instruction: 'Include Agenda, Participants, Discussion points, Decisions made, Action Items, Deadlines, and Risks.', defaultFormat: 'Bullet List' },
    { id: 'ACTIONS', category: 'Business', name: 'Action Items', instruction: 'Extract all Tasks, Owners, Due Dates, Priority, Status, and Dependencies.', defaultFormat: 'Checklist' },
    { id: 'DECISIONS', category: 'Business', name: 'Decisions', instruction: 'Extract all Decisions, Reasons, Impact, Approver, and Alternatives considered.', defaultFormat: 'Bullet List' },
    { id: 'RISKS', category: 'Business', name: 'Risks', instruction: 'Extract all Risks, Probability, Impact, Mitigation strategies, Owner, and Priority.', defaultFormat: 'Bullet List' },
    { id: 'TIMELINE', category: 'Business', name: 'Timeline', instruction: 'Extract all Dates, Events, Milestones, and Deliverables in chronological order.', defaultFormat: 'Bullet List' },
    { id: 'SWOT', category: 'Business', name: 'SWOT', instruction: 'Generate a comprehensive analysis of Strengths, Weaknesses, Opportunities, and Threats.', defaultFormat: 'Bullet List' },
    { id: 'EMAIL', category: 'Business', name: 'Email', instruction: 'Generate an email draft including Subject, Overview, Important Information, Required Actions, and Closing.', defaultFormat: 'Paragraph' },

    // Specialized Category
    { id: 'ACADEMIC', category: 'Specialized', name: 'Academic', instruction: 'Maintain academic tone. Summarize Thesis, Methodologies, and Conclusions.', defaultFormat: 'Paragraph' },
    { id: 'RESEARCH', category: 'Specialized', name: 'Research', instruction: 'Include Abstract, Methodology, Results, Discussion, Conclusion, Future Work, and References.', defaultFormat: 'Paragraph' },
    { id: 'TECHNICAL', category: 'Specialized', name: 'Technical', instruction: 'Extract Architecture, Components, Technologies used, Algorithms, Interfaces, Dependencies, and Performance metrics.', defaultFormat: 'Paragraph' },
    { id: 'LEGAL', category: 'Specialized', name: 'Legal', instruction: 'Extract Parties involved, Clauses, Obligations, Rights, Deadlines, Risks, and Compliance notes.', defaultFormat: 'Paragraph' },
    { id: 'MEDICAL', category: 'Specialized', name: 'Medical', instruction: 'Extract Symptoms, Diagnosis, Treatment, Medication, Recommendations, and Follow-up.', defaultFormat: 'Paragraph' },
    { id: 'FINANCIAL', category: 'Specialized', name: 'Financial', instruction: 'Extract Revenue, Expenses, Profit, Loss, Forecasts, Budgets, and Financial Risks.', defaultFormat: 'Paragraph' },
    { id: 'MARKETING', category: 'Specialized', name: 'Marketing', instruction: 'Extract Goals, Campaign details, Target Audience, KPIs, Results, and Recommendations.', defaultFormat: 'Paragraph' },
    { id: 'FAQ', category: 'Specialized', name: 'FAQ', instruction: 'Convert the document into a Frequently Asked Questions list with Answers.', defaultFormat: 'Bullet List' },
    { id: 'PRESENTATION', category: 'Specialized', name: 'Presentation', instruction: 'Generate Slide Titles, Speaker Notes, Key Points, and Visual Suggestions.', defaultFormat: 'Markdown' },

    // Structural Category
    { id: 'CHAPTER', category: 'Structural', name: 'Chapter', instruction: 'Summarize the chapter including the Main Topic, Important Facts, and Conclusion.', defaultFormat: 'Paragraph' },
    { id: 'SECTION', category: 'Structural', name: 'Section', instruction: 'Summarize the current section while strictly maintaining section structure.', defaultFormat: 'Paragraph' },
    { id: 'DOCUMENT', category: 'Structural', name: 'Whole Document', instruction: 'Summarize the entire document comprehensively.', defaultFormat: 'Paragraph' },
    { id: 'MULTI_DOCUMENT', category: 'Structural', name: 'Multi-Document', instruction: 'Summarize multiple documents, cross-reference, merge topics, and detect conflicts.', defaultFormat: 'Paragraph' },

    // Smart
    { id: 'AUTO', category: 'Smart', name: 'Smart Auto', instruction: 'Automatically detect the document type and choose the best summary style. Produce the optimal summary.', defaultFormat: 'Paragraph' },
    { id: 'CUSTOM', category: 'Custom', name: 'Custom', instruction: 'Follow user custom instructions closely.', defaultFormat: 'Paragraph' },
  ];

  /**
   * Returns all available summary types.
   */
  static getTypes(): SummaryTypeDef[] {
    return this.types;
  }

  /**
   * Retrieves the specific instruction set for a given summary type name.
   */
  static getInstructionForType(typeName: string): string {
    const typeDef = this.types.find(t => t.name === typeName);
    return typeDef ? typeDef.instruction : '';
  }

  /**
   * Returns types grouped by Category for UI rendering.
   */
  static getGroupedTypes(): Record<string, SummaryTypeDef[]> {
    const groups: Record<string, SummaryTypeDef[]> = {};
    for (const t of this.types) {
      if (!groups[t.category]) groups[t.category] = [];
      groups[t.category].push(t);
    }
    return groups;
  }
}
