import { AIEngine } from './AIEngine';
import { AIProviderManager } from './ai/AIProviderManager';
import { PromptBuilder } from './ai/prompt/PromptBuilder';
import { AIStreamingEngine } from './ai/streaming/AIStreamingEngine';
import { AIHistoryEngine } from './ai/history/AIHistoryEngine';
import { AISecurityEngine } from './ai/security/AISecurityEngine';
import { chatWorkflow } from './ai/workflow/ChatWorkflowEngine';

export type ChatRole = 'user' | 'assistant' | 'system';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  toolUsed?: string;
};

export type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  pinned?: boolean;
  model: string;
  provider: string;
};

// ─── Smart Mock Response Engine ───────────────────────────────────────────────

function buildMockResponse(userMessage: string, context: string, history: ChatMessage[]): string {
  const lower = userMessage.toLowerCase();

  // Detect intent
  if (/summarize|summary|tóm tắt/.test(lower)) {
    return context
      ? `Here is a summary of the selected content:\n\n**Key Points:**\n- ${context.substring(0, 60)}...\n- The content covers the main topic effectively.\n- Key themes and supporting details are present.\n\n**Conclusion:** The text presents a structured overview suitable for the stated objectives.`
      : `I'd be happy to summarize your document. Please select some text first, or describe what you'd like me to summarize.`;
  }

  if (/translate|dịch/.test(lower)) {
    return `I can help with translation! To translate your content:\n\n1. Select the text you want to translate\n2. Use **Ctrl+Shift+T** to open the AI Translate panel\n3. Choose your target language\n\nOr tell me what language you'd like me to translate to and paste the text here.`;
  }

  if (/rewrite|improve|viết lại/.test(lower)) {
    if (context) {
      return `Here's an improved version of your text:\n\n---\n\n${context.substring(0, 50).charAt(0).toUpperCase() + context.substring(1, 50)}... *(refined for clarity, flow, and professional tone)*\n\n---\n\nWould you like me to make it **shorter**, **longer**, or adjust the **tone**?`;
    }
    return `To rewrite text, please:\n1. Select the text in the document\n2. Press **Ctrl+Shift+A** for AI Rewrite panel\n\nOr paste the text here and I'll help improve it!`;
  }

  if (/grammar|spell|check/.test(lower)) {
    return context
      ? `I've reviewed the selected text for grammar and style:\n\n✅ **Structure:** Clear and well-organized\n⚠️ **Suggestion:** Consider using active voice for stronger impact\n💡 **Tip:** Break long sentences into shorter ones for readability\n\nWould you like me to apply these corrections automatically?`
      : `Share some text with me and I'll check it for grammar, spelling, and style issues!`;
  }

  if (/table|bảng/.test(lower)) {
    return `Here's a sample table structure:\n\n| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Data A   | Value 1  | Note X   |\n| Data B   | Value 2  | Note Y   |\n| Data C   | Value 3  | Note Z   |\n\nShall I insert this table into the document at your current cursor position?`;
  }

  if (/list|bullet|numbered/.test(lower)) {
    return `Here's a formatted list based on your request:\n\n• First key item with supporting detail\n• Second important point to consider\n• Third element completing the structure\n• Fourth item for comprehensive coverage\n• Final point summarizing the section\n\nWant me to **insert** this into the document, or adjust the content?`;
  }

  if (/code|programming|function/.test(lower)) {
    return "Here's a code example:\n\n```typescript\nfunction processDocument(doc: Document): string {\n  const content = doc.paragraphs\n    .map(p => p.text)\n    .filter(t => t.length > 0)\n    .join('\\n');\n  \n  return content;\n}\n```\n\nWould you like me to explain this code, modify it, or insert it into the document?";
  }

  if (/explain|what is|what does|how|why/.test(lower)) {
    return `Great question! Here's my explanation:\n\n${userMessage.replace(/explain|what is|how|why/gi, '').trim() || 'The concept you asked about'} refers to a fundamental aspect of the subject matter. Here's a breakdown:\n\n1. **Core Concept:** The basic principle involves the interaction of key elements\n2. **How it Works:** The mechanism operates through a series of structured processes\n3. **Practical Application:** In real-world scenarios, this manifests as...\n4. **Key Takeaway:** Understanding this helps you work more effectively with the material\n\nWould you like me to elaborate on any specific aspect?`;
  }

  if (/hello|hi |hey|greet/.test(lower)) {
    return `Hello! 👋 I'm your **OfficeX AI Assistant**, here to help you with:\n\n- 📝 **Writing** — rewrite, improve, expand, or shorten text\n- 📋 **Summarization** — get quick summaries of long documents\n- 🌐 **Translation** — translate to 30+ languages\n- 🔍 **Analysis** — check grammar, style, and readability\n- 🛠️ **Document Operations** — create tables, lists, outlines\n- 💡 **Q&A** — answer any question about your document\n\nWhat can I help you with today?`;
  }

  if (/outline|structure|heading/.test(lower)) {
    return `Here's a suggested document outline:\n\n# Document Title\n\n## 1. Introduction\n- Background and context\n- Scope and objectives\n- Key definitions\n\n## 2. Main Content\n### 2.1 Primary Topic\n- Supporting details\n- Evidence and examples\n\n### 2.2 Secondary Topic\n- Analysis\n- Findings\n\n## 3. Conclusion\n- Summary of key points\n- Recommendations\n- Next steps\n\nWould you like me to insert this outline into the document?`;
  }

  if (/action item|task|todo/.test(lower)) {
    return `Here are the action items I've identified:\n\n☐ **Task 1:** Review and validate the primary findings\n☐ **Task 2:** Schedule follow-up meeting with stakeholders\n☐ **Task 3:** Prepare updated documentation\n☐ **Task 4:** Distribute summary to relevant team members\n☐ **Task 5:** Set deadline reminders for critical deliverables\n\nWould you like me to insert these as a checklist in the document?`;
  }

  // Contextual response based on previous conversation
  if (history.length > 2) {
    const prevTopic = history[history.length - 2]?.content.substring(0, 30) ?? 'the topic';
    return `Following up on our discussion about "${prevTopic}"...\n\nBased on what we've covered, here are some additional insights:\n\n1. The key relationship between concepts becomes clearer when examined in context\n2. Additional supporting evidence strengthens the argument\n3. Practical implications suggest a structured approach works best\n\nIs there a specific aspect you'd like me to dig deeper into?`;
  }

  // Default intelligent response
  return `I understand you're asking about: *"${userMessage}"*\n\nHere's what I can tell you based on the document context:\n\n${context ? `**From your document:** ${context.substring(0, 80)}...\n\n` : ''}The question touches on an important aspect of the subject matter. Based on the available information:\n\n- The core principle relates directly to the stated objectives\n- Supporting context confirms the relevance of this inquiry  \n- Practical application can be implemented immediately\n\nWould you like me to **elaborate**, **rewrite** this explanation, or **insert** it into the document?`;
}

// ─── AIChatEngine ─────────────────────────────────────────────────────────────

let _nextId = 1;
const genId = () => `msg_${_nextId++}_${Date.now()}`;
const convId = () => `conv_${Date.now()}`;

export class AIChatEngine {
  private conversations: Conversation[] = [];
  private activeConvId: string | null = null;
  private provider: string = 'ollama';
  private model: string = 'qwen2.5:1.5b';
  private pendingCancel: (() => void) | null = null;

  // ── Conversation Management ────────────────────────────────────────────────

  newConversation(title?: string): Conversation {
    const conv: Conversation = {
      id: convId(),
      title: title ?? `Chat ${this.conversations.length + 1}`,
      messages: [],
      createdAt: new Date(),
      model: this.model,
      provider: this.provider,
    };
    this.conversations.unshift(conv);
    this.activeConvId = conv.id;
    return conv;
  }

  getConversations(): Conversation[] {
    return this.conversations;
  }

  getActiveConversation(): Conversation | null {
    return this.conversations.find(c => c.id === this.activeConvId) ?? null;
  }

  setActiveConversation(id: string) {
    this.activeConvId = id;
  }

  deleteConversation(id: string) {
    this.conversations = this.conversations.filter(c => c.id !== id);
    if (this.activeConvId === id) {
      this.activeConvId = this.conversations[0]?.id ?? null;
    }
  }

  pinConversation(id: string) {
    const conv = this.conversations.find(c => c.id === id);
    if (conv) conv.pinned = !conv.pinned;
    // Sort pinned to top
    this.conversations.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }

  renameConversation(id: string, title: string) {
    const conv = this.conversations.find(c => c.id === id);
    if (conv) conv.title = title;
  }

  searchConversations(query: string): Conversation[] {
    const q = query.toLowerCase();
    return this.conversations.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.messages.some(m => m.content.toLowerCase().includes(q))
    );
  }

  setProvider(providerId: string) {
    this.provider = providerId;
    const models = AIProviderManager.getModelsForProvider(providerId);
    if (models.length > 0) this.model = models[0].id;
  }

  setModel(model: string) {
    this.model = model;
  }

  getProvider() { return this.provider; }
  getModel() { return this.model; }

  // ── Messaging ──────────────────────────────────────────────────────────────

  send(
    userContent: string,
    contextText: string,
    onToken: (msgId: string, text: string) => void,
    onComplete: (msgId: string, text: string) => void
  ): string {
    let conv = this.getActiveConversation();
    if (!conv) conv = this.newConversation();

    // Add user message
    const userMsg: ChatMessage = {
      id: genId(),
      role: 'user',
      content: userContent,
      timestamp: new Date(),
    };
    conv.messages.push(userMsg);

    // Auto-rename conversation from first user message
    if (conv.messages.filter(m => m.role === 'user').length === 1) {
      conv.title = userContent.substring(0, 40) + (userContent.length > 40 ? '...' : '');
    }

    // Build AI response
    const responseText = buildMockResponse(userContent, contextText, conv.messages);

    // Add placeholder assistant message
    const assistantMsg: ChatMessage = {
      id: genId(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };
    conv.messages.push(assistantMsg);

    let safeContext: string;
    let safeUserPromptText: string;
    try {
      safeContext = AISecurityEngine.validateRequest(contextText, 'chat');
      safeUserPromptText = AISecurityEngine.validateRequest(userContent, 'chat');
    } catch (e: any) {
      // Create error message immediately
      const assistantMsg: ChatMessage = {
        id: genId(), role: 'assistant', content: `[Error: ${e.message}]`, timestamp: new Date()
      };
      conv.messages.push(assistantMsg);
      onComplete(assistantMsg.id, assistantMsg.content);
      return assistantMsg.id;
    }

    const mockInstruction = buildMockResponse(userContent, contextText, conv.messages);
    const { systemPrompt, safeUserPrompt } = PromptBuilder.build({
      operation: 'chat',
      variables: { instruction: mockInstruction }
    }, userContent);

    // Delegate execution strictly through the Workflow Engine
    chatWorkflow.execute({
      conversationId: conv.id,
      userMessage: userContent,
      providerId: this.provider,
      modelId: this.model
    }, (ctx) => {
      // Context collected
    }, () => {
      // Streaming phase
      const stream = AIStreamingEngine.openStream({
        providerId: this.provider,
        modelId: this.model,
        prompt: safeUserPrompt || userContent,
        systemPrompt,
        operation: 'chat',
        mockResponseText: mockInstruction
      });

      stream.onToken((token) => {
        assistantMsg.content = token;
        onToken(assistantMsg.id, token);
      })
      .onComplete((fullText) => {
        try {
          const safeResponse = AISecurityEngine.validateResponse(fullText, 'chat');
          assistantMsg.content = safeResponse;
          assistantMsg.isStreaming = false;
          AIHistoryEngine.recordTransaction('chat', systemPrompt, safeUserPrompt || safeUserPromptText, safeResponse, stream.getTelemetry() as any);
          chatWorkflow.completeWorkflow();
          onComplete(assistantMsg.id, safeResponse);
        } catch (e: any) {
          assistantMsg.content = `[Error: ${e.message}]`;
          assistantMsg.isStreaming = false;
          AIHistoryEngine.recordTransaction('chat', systemPrompt, safeUserPrompt || safeUserPromptText, e.message, stream.getTelemetry() as any, 'pending', 'error', e.message);
          chatWorkflow.completeWorkflow();
          onComplete(assistantMsg.id, assistantMsg.content);
        }
      })
      .onError((err) => {
        assistantMsg.content = `Error: ${err.message}`;
        assistantMsg.isStreaming = false;
        AIHistoryEngine.recordTransaction('chat', systemPrompt, safeUserPrompt || safeUserPromptText, err.message, stream.getTelemetry() as any, 'pending', 'error', err.message);
        chatWorkflow.completeWorkflow();
        onComplete(assistantMsg.id, assistantMsg.content);
      });

      this.pendingCancel = () => {
        stream.cancel();
        chatWorkflow.cancel();
      };
    });

    return assistantMsg.id;
  }

  stop() {
    this.pendingCancel?.();
    this.pendingCancel = null;
    chatWorkflow.cancel();
    const conv = this.getActiveConversation();
    if (conv) {
      const last = conv.messages[conv.messages.length - 1];
      if (last?.isStreaming) last.isStreaming = false;
    }
  }
}
