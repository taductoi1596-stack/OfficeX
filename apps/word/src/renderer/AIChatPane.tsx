import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { EditorAPI } from './editorApi';
import { AIChatEngine, ChatMessage, Conversation } from './AIChatEngine';
import { AIProviderManager } from './ai/AIProviderManager';
import { CommandDispatcher } from './CommandDispatcher';

// ─── Singleton engine instance ────────────────────────────────────────────────
const engine = new AIChatEngine();

// ─── Markdown-like renderer (lightweight) ─────────────────────────────────────
function RenderMarkdown({ text }: { text: string }) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let inCode = false;
  let codeLines: string[] = [];
  let codeLang = '';

  const flushCode = (key: number) => {
    const block = codeLines.join('\n');
    codeLines = [];
    return (
      <div key={key} style={{
        background: '#1E1E1E', color: '#D4D4D4', borderRadius: 6,
        padding: '8px 12px', fontSize: 11, fontFamily: 'Consolas, monospace',
        overflowX: 'auto', margin: '4px 0',
      }}>
        {codeLang && <div style={{ color: '#569CD6', fontSize: 10, marginBottom: 4 }}>{codeLang}</div>}
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{block}</pre>
      </div>
    );
  };

  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      if (inCode) {
        elements.push(flushCode(i));
        inCode = false;
        codeLang = '';
      } else {
        inCode = true;
        codeLang = line.slice(3).trim();
      }
      return;
    }
    if (inCode) { codeLines.push(line); return; }

    // Table
    if (line.startsWith('|')) {
      const cols = line.split('|').filter(c => c.trim() && !/^[-\s]+$/.test(c));
      if (cols.length > 0 && !line.replace(/\|/g, '').replace(/-/g, '').replace(/\s/g, '')) return; // separator row
      elements.push(
        <div key={i} style={{ display: 'flex', gap: 0, fontSize: 11, borderBottom: '1px solid #E1DFDD' }}>
          {cols.map((c, ci) => (
            <div key={ci} style={{ flex: 1, padding: '2px 6px', borderRight: '1px solid #E1DFDD', minWidth: 60 }}>
              {renderInline(c.trim())}
            </div>
          ))}
        </div>
      );
      return;
    }

    // Headings
    const h = line.match(/^(#{1,3})\s+(.+)/);
    if (h) {
      const lvl = h[1].length;
      elements.push(<div key={i} style={{ fontWeight: 700, fontSize: 15 - lvl, marginTop: 6, marginBottom: 2, color: '#1A1A1A' }}>{renderInline(h[2])}</div>);
      return;
    }

    // Bullet
    if (/^[•\-*]\s/.test(line) || /^\d+\.\s/.test(line)) {
      elements.push(<div key={i} style={{ paddingLeft: 16, marginBottom: 2, fontSize: 12 }}>• {renderInline(line.replace(/^[•\-*\d+.]\s+/, ''))}</div>);
      return;
    }

    // Checkbox
    if (/^☐|^\[ \]|^\[x\]/i.test(line)) {
      const done = /^\[x\]/i.test(line);
      const txt = line.replace(/^☐|^\[[ x]\]\s*/i, '');
      elements.push(
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2, fontSize: 12 }}>
          <span style={{ color: done ? '#107C41' : '#757575' }}>{done ? '☑' : '☐'}</span>
          <span style={{ textDecoration: done ? 'line-through' : 'none', color: done ? '#aaa' : 'inherit' }}>{txt}</span>
        </div>
      );
      return;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      elements.push(<hr key={i} style={{ border: 'none', borderTop: '1px solid #E1DFDD', margin: '6px 0' }} />);
      return;
    }

    // Normal paragraph
    if (line.trim()) {
      elements.push(<div key={i} style={{ marginBottom: 3, fontSize: 12, lineHeight: 1.6 }}>{renderInline(line)}</div>);
    } else {
      elements.push(<div key={i} style={{ height: 6 }} />);
    }
  });

  if (inCode) elements.push(flushCode(9999));

  return <>{elements}</>;
}

function renderInline(text: string): React.ReactNode {
  // Bold, italic, inline code
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith('*') && p.endsWith('*') && p.length > 2) return <em key={i}>{p.slice(1, -1)}</em>;
    if (p.startsWith('`') && p.endsWith('`') && p.length > 2)
      return <code key={i} style={{ background: '#F3F2F1', padding: '1px 4px', borderRadius: 3, fontFamily: 'monospace', fontSize: '0.9em' }}>{p.slice(1, -1)}</code>;
    return p;
  });
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({
  msg, onInsert, onReplace, onAppend, onCopy, onComment, onTrackChanges,
}: {
  msg: ChatMessage;
  onInsert: (text: string) => void;
  onReplace: (text: string) => void;
  onAppend: (text: string) => void;
  onCopy: (text: string) => void;
  onComment: (text: string) => void;
  onTrackChanges: (text: string) => void;
}) {
  const isUser = msg.role === 'user';
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        gap: 8,
        alignItems: 'flex-start',
        marginBottom: 16,
      }}
    >
      {/* Avatar */}
      <div style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        background: isUser ? '#2B579A' : '#7C3AED',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, color: '#fff', fontWeight: 700, marginTop: 2,
      }}>
        {isUser ? 'U' : '✨'}
      </div>

      {/* Bubble */}
      <div style={{
        maxWidth: '85%',
        background: isUser ? '#EFF6FF' : '#F9F9F9',
        border: `1px solid ${isUser ? '#BFDBFE' : '#E1DFDD'}`,
        borderRadius: isUser ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
        padding: '8px 12px',
        position: 'relative',
        userSelect: 'text',
      }}>
        {isUser ? (
          <div style={{ fontSize: 12, color: '#1A1A1A', whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
            {msg.content.split(/(\!\[.*?\]\(data:image\/[^;]+;base64,[^\)]+\))/).map((part, idx) => {
               if (part.startsWith('![')) {
                 const match = part.match(/\!\[.*?\]\((data:image\/[^;]+;base64,[^\)]+)\)/);
                 if (match) {
                   return <img key={idx} src={match[1]} style={{ maxWidth: '100%', borderRadius: 6, marginTop: 6 }} alt="Attachment" />;
                 }
               }
               return <span key={idx}>{part}</span>;
            })}
          </div>
        ) : (
          <div style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
            <RenderMarkdown text={msg.content} />
          </div>
        )}

        {/* Streaming cursor */}
        {msg.isStreaming && (
          <span style={{ display: 'inline-block', width: 8, height: 14, background: '#7C3AED', marginLeft: 2, animation: 'blink 1s step-end infinite', borderRadius: 1 }} />
        )}

        {/* Timestamp */}
        <div style={{ fontSize: 9, color: '#aaa', marginTop: 4, textAlign: isUser ? 'right' : 'left' }}>
          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>

        {/* Actions (on hover, assistant only) */}
        {!isUser && !msg.isStreaming && hovered && (
          <div style={{
            position: 'absolute', bottom: -28, left: 0, display: 'flex', gap: 3, zIndex: 20,
            background: '#fff', padding: '2px 4px', borderRadius: 6, border: '1px solid #E1DFDD',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)', flexWrap: 'wrap', maxWidth: 360,
          }}>
            {[
              { label: 'Insert', action: () => onInsert(msg.content) },
              { label: 'Replace Selection', action: () => onReplace(msg.content) },
              { label: 'Append Below', action: () => onAppend(msg.content) },
              { label: 'Copy', action: () => onCopy(msg.content) },
              { label: 'Comment', action: () => onComment(msg.content) },
              { label: 'Track Changes', action: () => onTrackChanges(msg.content) },
            ].map(a => (
              <button key={a.label} onClick={a.action} style={{
                padding: '2px 6px', fontSize: 9, background: '#F3F2F1',
                border: 'none', borderRadius: 3, cursor: 'pointer',
                color: '#2B579A', fontWeight: 600, whiteSpace: 'nowrap',
              }}>
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Conversation Sidebar ─────────────────────────────────────────────────────
function ConvSidebar({
  conversations, activeId, onSelect, onNew, onDelete, onPin, onRename, search, onSearch,
}: {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onPin: (id: string) => void;
  onRename: (id: string, title: string) => void;
  search: string;
  onSearch: (q: string) => void;
}) {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameVal, setRenameVal] = useState('');

  const filtered = search
    ? conversations.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.messages.some(m => m.content.toLowerCase().includes(search.toLowerCase()))
      )
    : conversations;

  return (
    <div style={{
      width: 180, borderRight: '1px solid #E1DFDD', display: 'flex',
      flexDirection: 'column', background: '#FAFAFA', flexShrink: 0,
    }}>
      {/* New Chat */}
      <button onClick={onNew} style={{
        margin: 8, padding: '6px 10px', background: '#2B579A', color: '#fff',
        border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center',
      }}>
        + New Chat
      </button>

      {/* Search */}
      <div style={{ padding: '0 8px 6px' }}>
        <input
          placeholder="Search chats..."
          value={search}
          onChange={e => onSearch(e.target.value)}
          style={{
            width: '100%', padding: '4px 8px', border: '1px solid #E1DFDD',
            borderRadius: 4, fontSize: 10, boxSizing: 'border-box', background: '#fff',
          }}
        />
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.length === 0 && (
          <div style={{ padding: 12, fontSize: 11, color: '#aaa', textAlign: 'center' }}>No chats yet</div>
        )}
        {filtered.map(c => (
          <div key={c.id}
            onClick={() => onSelect(c.id)}
            style={{
              padding: '7px 10px', cursor: 'pointer', fontSize: 11,
              background: c.id === activeId ? '#EFF6FF' : 'transparent',
              borderLeft: c.id === activeId ? '3px solid #2B579A' : '3px solid transparent',
              display: 'flex', flexDirection: 'column', gap: 2,
              transition: 'background 0.1s',
            }}
          >
            {renamingId === c.id ? (
              <input
                autoFocus
                value={renameVal}
                onChange={e => setRenameVal(e.target.value)}
                onBlur={() => { onRename(c.id, renameVal || c.title); setRenamingId(null); }}
                onKeyDown={e => { if (e.key === 'Enter') { onRename(c.id, renameVal || c.title); setRenamingId(null); } }}
                onClick={e => e.stopPropagation()}
                style={{ fontSize: 10, padding: '2px 4px', border: '1px solid #2B579A', borderRadius: 3, width: '100%', boxSizing: 'border-box' }}
              />
            ) : (
              <div style={{ fontWeight: c.id === activeId ? 600 : 400, color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.pinned ? '📌 ' : ''}{c.title}
              </div>
            )}
            <div style={{ fontSize: 9, color: '#aaa' }}>
              {c.messages.length} msg · {c.createdAt.toLocaleDateString()}
            </div>
            {/* Mini actions */}
            <div style={{ display: 'flex', gap: 4, marginTop: 2 }} onClick={e => e.stopPropagation()}>
              <span onClick={() => { setRenamingId(c.id); setRenameVal(c.title); }} style={{ fontSize: 9, color: '#888', cursor: 'pointer' }}>✏️</span>
              <span onClick={() => onPin(c.id)} style={{ fontSize: 9, color: '#888', cursor: 'pointer' }}>{c.pinned ? '📌' : '📎'}</span>
              <span onClick={() => onDelete(c.id)} style={{ fontSize: 9, color: '#C50F1F', cursor: 'pointer' }}>🗑</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Chat Panel ──────────────────────────────────────────────────────────
export function AIChatPane({ onClose, embedded }: { onClose: () => void; embedded?: boolean }) {
  const [, setTick] = useState(0);
  const rerender = useCallback(() => setTick(t => t + 1), []);

  const [inputText, setInputText] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [provider, setProvider] = useState(engine.getProvider());
  const [model, setModel] = useState(engine.getModel());
  const [isGenerating, setIsGenerating] = useState(false);
  const [contextText, setContextText] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const conv = engine.getActiveConversation();
  const convs = engine.getConversations();

  useEffect(() => {
    // Grab selected text as context
    const api = EditorAPI.getLegacy();
    if (api) setContextText(api.getSelectedText());
    // Start with a new conversation if none
    if (engine.getConversations().length === 0) {
      engine.newConversation();
      rerender();
    }
    inputRef.current?.focus();
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [conv?.messages.length, isGenerating]);

  const handleSend = () => {
    const text = inputText.trim();
    if ((!text && !attachedImage) || isGenerating) return;
    
    let finalMsg = text;
    if (attachedImage) {
      finalMsg += (finalMsg ? '\n\n' : '') + `![attachment](${attachedImage})`;
    }
    
    setInputText('');
    setAttachedImage(null);
    setIsGenerating(true);

    engine.send(
      finalMsg,
      contextText,
      (_msgId, _partial) => rerender(),
      (_msgId, _final) => {
        setIsGenerating(false);
        rerender();
      }
    );
    rerender();
  };

  const handleStop = () => {
    engine.stop();
    setIsGenerating(false);
    rerender();
  };

  const handleProviderChange = (pid: string) => {
    engine.setProvider(pid);
    const models = AIProviderManager.getModelsForProvider(pid);
    const newModel = models.length > 0 ? models[0].id : '';
    engine.setModel(newModel);
    setProvider(pid);
    setModel(newModel);
  };

  const handleModelChange = (m: string) => {
    engine.setModel(m);
    setModel(m);
  };

  const handleInsert = (text: string) => {
    EditorAPI.getLegacy()?.insertTextAtSelection('\n' + text);
  };

  const handleReplace = (text: string) => {
    EditorAPI.getLegacy()?.insertTextAtSelection(text);
  };

  const handleAppend = (text: string) => {
    EditorAPI.getLegacy()?.insertTextAtSelection('\n\n' + text);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleComment = (text: string) => {
    EditorAPI.getLegacy()?.insertComment?.(text);
  };

  const handleTrackChanges = (text: string) => {
    EditorAPI.getLegacy()?.insertTextAtSelection('[Tracked Insertion]: ' + text);
  };

  const providers = AIProviderManager.getProviders();
  const currentProviderModels = AIProviderManager.getModelsForProvider(provider);

  const suggestedPrompts = [
    '✨ Summarize this document',
    '📋 Create an outline',
    '🔍 Check grammar and style',
    '📊 Create a table for this data',
    '🌐 Translate the selected text',
    '✅ Extract action items',
  ];

  return (
    <>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .ai-chat-scroll::-webkit-scrollbar { width: 4px; }
        .ai-chat-scroll::-webkit-scrollbar-thumb { background: #E1DFDD; border-radius: 2px; }
      `}</style>
      <div style={embedded ? {
          display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', background: '#fff',
          fontFamily: 'Segoe UI, sans-serif', fontSize: 12, userSelect: 'none',
        } : {
          position: 'absolute', right: 0, top: 110, bottom: 0, width: 540,
          background: '#fff', borderLeft: '1px solid #E1DFDD', boxShadow: '-4px 0 20px rgba(0,0,0,0.08)',
          display: 'flex', flexDirection: 'column', fontFamily: 'Segoe UI, sans-serif',
          fontSize: 12, zIndex: 150, userSelect: 'none',
        }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: embedded ? '6px 10px' : '10px 14px',
          borderBottom: '1px solid #E1DFDD', background: embedded ? '#F9F9F9' : '#fff', flexShrink: 0,
        }}>
          {!embedded && (
            <>
              <span style={{ fontSize: 16 }}>🤖</span>
              <span style={{ fontWeight: 700, color: '#7C3AED', fontSize: 14, flex: 1 }}>OfficeX AI</span>
            </>
          )}
          {embedded && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14 }}>🤖</span>
              <span style={{ fontWeight: 700, color: '#7C3AED', fontSize: 13 }}>OfficeX AI Workspace</span>
            </div>
          )}

          {/* Connection & Model Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, background: '#F3F4F6', padding: '3px 8px', borderRadius: 12 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} title="Ollama Connected" />
            <span style={{ fontWeight: 600, color: '#374151' }}>Ollama (qwen3:8b)</span>
            <span style={{ color: '#6B7280' }}>⚡ Streaming</span>
          </div>

          {/* Provider select */}
          <select
            value={provider}
            onChange={e => handleProviderChange(e.target.value)}
            style={{ padding: '2px 6px', border: '1px solid #E1DFDD', borderRadius: 4, fontSize: 10, background: '#fff', maxWidth: 90 }}
          >
            {providers.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>

          {/* Model select */}
          <select
            value={model}
            onChange={e => handleModelChange(e.target.value)}
            style={{ padding: '2px 6px', border: '1px solid #E1DFDD', borderRadius: 4, fontSize: 10, background: '#fff', maxWidth: 100 }}
          >
            {currentProviderModels.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>

          <button style={{ width: 24, height: 24, border: 'none', background: 'none', cursor: 'pointer', fontSize: 14 }} title="AI Settings" onClick={() => CommandDispatcher.dispatch('WORD.AI.SETTINGS')}>⚙️</button>

          {!embedded && (
            <button onClick={onClose} style={{
              width: 24, height: 24, border: 'none', background: 'none',
              fontSize: 14, cursor: 'pointer', color: '#757575', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>✕</button>
          )}
        </div>

        {/* Body: Sidebar + Messages */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* Conversation Sidebar */}
          <ConvSidebar
            conversations={convs}
            activeId={conv?.id ?? null}
            search={search}
            onSearch={setSearch}
            onSelect={(id) => { engine.setActiveConversation(id); rerender(); }}
            onNew={() => { engine.newConversation(); rerender(); }}
            onDelete={(id) => { engine.deleteConversation(id); rerender(); }}
            onPin={(id) => { engine.pinConversation(id); rerender(); }}
            onRename={(id, t) => { engine.renameConversation(id, t); rerender(); }}
          />

          {/* Messages Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Context indicator */}
            {contextText && (
              <div style={{
                padding: '5px 12px', background: '#FFF8E1', borderBottom: '1px solid #FFE082',
                fontSize: 10, color: '#7A6300', display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <span>📄</span>
                <span style={{ fontWeight: 600 }}>Selection:</span>
                <span><em>"{contextText.substring(0, 60)}{contextText.length > 60 ? '...' : ''}"</em></span>
              </div>
            )}
            {!contextText && (
              <div style={{
                padding: '5px 12px', background: '#F3F2F1', borderBottom: '1px solid #E1DFDD',
                fontSize: 10, color: '#605E5C', display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <span>📄</span>
                <span style={{ fontWeight: 600 }}>Whole Document:</span>
                <span><em>Reading current document context...</em></span>
              </div>
            )}

            {/* Messages */}
            <div ref={scrollRef} className="ai-chat-scroll" style={{ flex: 1, overflowY: 'auto', padding: '12px 14px 30px' }}>
              {/* Empty state */}
              {(!conv || conv.messages.length === 0) && (
                <div style={{ textAlign: 'center', paddingTop: 32 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🤖</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#7C3AED', marginBottom: 4 }}>OfficeX AI</div>
                  <div style={{ color: '#6B7280', fontSize: 11, marginBottom: 16 }}>Local AI Engine for Word (Qwen3 8B · Ollama)</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'stretch', maxWidth: 260, margin: '0 auto' }}>
                    {suggestedPrompts.map(p => (
                      <button key={p}
                        onClick={() => { setInputText(p.replace(/^[^\s]+\s/, '')); inputRef.current?.focus(); }}
                        style={{
                          padding: '6px 10px', background: '#F3F2F1', border: '1px solid #E1DFDD',
                          borderRadius: 6, cursor: 'pointer', fontSize: 11, textAlign: 'left',
                          color: '#333', transition: 'background 0.1s',
                        }}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {conv?.messages.map(msg => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  onInsert={handleInsert}
                  onReplace={handleReplace}
                  onAppend={handleAppend}
                  onCopy={handleCopy}
                  onComment={handleComment}
                  onTrackChanges={handleTrackChanges}
                />
              ))}

              {/* Typing indicator */}
              {isGenerating && conv?.messages[conv.messages.length - 1]?.isStreaming && (
                <div style={{ display: 'flex', gap: 4, padding: '4px 12px' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 7, height: 7, borderRadius: '50%', background: '#7C3AED',
                      animation: `blink 1.2s ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
              borderTop: '1px solid #E1DFDD', padding: '10px 12px',
              background: '#FAFAFA', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8
            }}>
              {/* Chat Toolbar */}
              <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                <button title="Attach File" style={{ border: '1px solid #E1DFDD', background: '#fff', borderRadius: 4, padding: '3px 6px', fontSize: 10, cursor: 'pointer', display: 'flex', gap: 3, alignItems: 'center' }}>
                  📎 File
                </button>
                <button title="Attach Image" style={{ border: '1px solid #E1DFDD', background: '#fff', borderRadius: 4, padding: '3px 6px', fontSize: 10, cursor: 'pointer', display: 'flex', gap: 3, alignItems: 'center' }}>
                  🖼️ Image
                </button>
                <button title="Attach Selection" onClick={() => { const s = EditorAPI.getLegacy()?.getSelectedText(); if (s) setContextText(s); }} style={{ border: '1px solid #E1DFDD', background: contextText ? '#EEF2FF' : '#fff', borderRadius: 4, padding: '3px 6px', fontSize: 10, cursor: 'pointer', display: 'flex', gap: 3, alignItems: 'center' }}>
                  📑 Selection
                </button>
                <button title="Attach Document" onClick={() => setContextText(EditorAPI.getLegacy()?.getSelectedText() || 'Document Context Attached')} style={{ border: '1px solid #E1DFDD', background: '#fff', borderRadius: 4, padding: '3px 6px', fontSize: 10, cursor: 'pointer', display: 'flex', gap: 3, alignItems: 'center' }}>
                  📄 Document
                </button>
                <button title="Voice Input" style={{ border: '1px solid #E1DFDD', background: '#fff', borderRadius: 4, padding: '3px 6px', fontSize: 10, cursor: 'pointer', display: 'flex', gap: 3, alignItems: 'center' }}>
                  🎙️ Voice
                </button>
                <div style={{ flex: 1 }} />
                <button onClick={() => engine.newConversation()} title="Clear Chat" style={{ border: 'none', background: 'transparent', color: '#757575', fontSize: 10, cursor: 'pointer', display: 'flex', gap: 3, alignItems: 'center' }}>
                  🗑️ Clear
                </button>
              </div>

              {attachedImage && (
                <div style={{ position: 'relative', display: 'inline-block', width: 60, height: 60, marginTop: 4 }}>
                  <img src={attachedImage} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #E1DFDD' }} alt="Attached" />
                  <button onClick={() => setAttachedImage(null)} style={{ position: 'absolute', top: -6, right: -6, width: 16, height: 16, borderRadius: '50%', background: '#C50F1F', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                </div>
              )}

              <div style={{
                display: 'flex', gap: 8, alignItems: 'flex-end',
                background: '#fff', border: '1px solid #E1DFDD', borderRadius: 8,
                padding: '8px 10px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}>
                <textarea
                  ref={inputRef}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={async e => {
                    if (e.key === 'Enter' && !e.shiftKey) { 
                      e.preventDefault(); 
                      handleSend(); 
                    } else if (e.key.toLowerCase() === 'v' && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      try {
                        let pastedImage = false;
                        const w = window as any;
                        if (w.electronAPI && w.electronAPI.readClipboardImage) {
                          try {
                            const dataUrl = await w.electronAPI.readClipboardImage();
                            if (dataUrl) {
                              setAttachedImage(dataUrl);
                              pastedImage = true;
                            }
                          } catch (err) {
                            console.warn('readClipboardImage IPC failed, falling back', err);
                          }
                        }

                        if (!pastedImage && navigator.clipboard.read) {
                          try {
                            const items = await navigator.clipboard.read();
                            for (const item of items) {
                              const imageType = item.types.find(t => t.startsWith('image/'));
                              if (imageType) {
                                const blob = await item.getType(imageType);
                                const reader = new FileReader();
                                reader.onload = () => {
                                  setAttachedImage(reader.result as string);
                                };
                                reader.readAsDataURL(blob);
                                pastedImage = true;
                                break;
                              }
                            }
                          } catch (err) {}
                        }
                        
                        if (!pastedImage) {
                          const text = await navigator.clipboard.readText();
                          if (text) {
                            const target = e.target as HTMLTextAreaElement;
                            const start = target.selectionStart;
                            const end = target.selectionEnd;
                            const val = target.value;
                            setInputText(val.slice(0, start) + text + val.slice(end));
                            setTimeout(() => {
                              if (inputRef.current) {
                                inputRef.current.selectionStart = inputRef.current.selectionEnd = start + text.length;
                              }
                            }, 0);
                          }
                        }
                      } catch (err) {}
                    } else if (e.key.toLowerCase() === 'c' && (e.ctrlKey || e.metaKey)) {
                      const target = e.target as HTMLTextAreaElement;
                      if (target.selectionStart !== target.selectionEnd) {
                        e.preventDefault();
                        navigator.clipboard.writeText(target.value.slice(target.selectionStart, target.selectionEnd));
                      }
                    } else if (e.key.toLowerCase() === 'x' && (e.ctrlKey || e.metaKey)) {
                      const target = e.target as HTMLTextAreaElement;
                      if (target.selectionStart !== target.selectionEnd) {
                        e.preventDefault();
                        const start = target.selectionStart;
                        const end = target.selectionEnd;
                        const val = target.value;
                        navigator.clipboard.writeText(val.slice(start, end));
                        setInputText(val.slice(0, start) + val.slice(end));
                        setTimeout(() => {
                          if (inputRef.current) {
                            inputRef.current.selectionStart = inputRef.current.selectionEnd = start;
                          }
                        }, 0);
                      }
                    } else if (e.key.toLowerCase() === 'a' && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      const target = e.target as HTMLTextAreaElement;
                      target.selectionStart = 0;
                      target.selectionEnd = target.value.length;
                    }
                  }}
                  placeholder="Ask anything about your document... (Enter to send, Shift+Enter for new line)"
                  style={{
                    flex: 1, border: 'none', outline: 'none', resize: 'none',
                    fontSize: 12, fontFamily: 'Segoe UI, sans-serif',
                    minHeight: 36, maxHeight: 120, background: 'transparent',
                    lineHeight: 1.5,
                  }}
                  rows={1}
                />
                {isGenerating ? (
                  <button onClick={handleStop} style={{
                    width: 32, height: 32, borderRadius: '50%', border: 'none',
                    background: '#C50F1F', color: '#fff', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0,
                  }}>⏹</button>
                ) : (
                  <button onClick={handleSend} disabled={!inputText.trim()} style={{
                    width: 32, height: 32, borderRadius: '50%', border: 'none',
                    background: inputText.trim() ? '#2B579A' : '#E1DFDD',
                    color: inputText.trim() ? '#fff' : '#aaa', cursor: inputText.trim() ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0,
                    transition: 'all 0.15s',
                  }}>▶</button>
                )}
              </div>
              <div style={{ fontSize: 9, color: '#aaa', marginTop: 5, textAlign: 'center' }}>
                {engine.getModel()} · {conv?.messages.length ?? 0} messages · Hover AI responses to Insert / Replace / Copy
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
