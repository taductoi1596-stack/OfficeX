import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, RefreshCw, ChevronDown, Bot, User, Zap, Table2, BarChart2, FunctionSquare, Eraser, Languages, FileSpreadsheet } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

interface AIRibbonProps {
  onAskAI: (question: string) => void;
  onPanelToggle: () => void;
  isPanelOpen: boolean;
  onTranslateToggle?: () => void;
  isTranslateOpen?: boolean;
}

export function AIRibbon({ onAskAI, onPanelToggle, isPanelOpen, onTranslateToggle, isTranslateOpen }: AIRibbonProps) {
  const quickActions = [
    { icon: <Languages size={14} />, label: 'Dịch ô đang chọn', onClick: onTranslateToggle },
    { icon: <FileSpreadsheet size={14} />, label: 'Dịch toàn bộ Sheet', onClick: onTranslateToggle },
    { icon: <FunctionSquare size={14} />, label: 'Gợi ý công thức', prompt: 'Hãy gợi ý công thức phù hợp cho bảng tính của tôi' },
    { icon: <BarChart2 size={14} />, label: 'Phân tích dữ liệu', prompt: 'Phân tích dữ liệu trong bảng tính và đưa ra nhận xét' },
  ];

  return (
    <div className="flex items-center gap-2 px-2 h-full">
      {/* Open AI Panel button */}
      <button
        onClick={onPanelToggle}
        className={`flex flex-col items-center justify-center p-1 rounded h-[60px] min-w-[70px] transition-all ${
          isPanelOpen
            ? 'bg-violet-600 text-white shadow-md'
            : 'hover:bg-violet-100 text-violet-700'
        }`}
      >
        <div className="relative">
          <Sparkles size={22} className={isPanelOpen ? 'text-white' : 'text-violet-600'} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full border border-white" />
        </div>
        <span className={`text-[10px] mt-0.5 font-medium ${isPanelOpen ? 'text-white' : 'text-violet-700'}`}>
          Trợ lý AI
        </span>
      </button>

      {/* Open AI Translate Panel button */}
      <button
        onClick={onTranslateToggle}
        className={`flex flex-col items-center justify-center p-1 rounded h-[60px] min-w-[75px] transition-all ${
          isTranslateOpen
            ? 'bg-emerald-600 text-white shadow-md'
            : 'hover:bg-emerald-100 text-emerald-700'
        }`}
      >
        <div className="relative">
          <Languages size={22} className={isTranslateOpen ? 'text-white' : 'text-emerald-600'} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full border border-white" />
        </div>
        <span className={`text-[10px] mt-0.5 font-medium ${isTranslateOpen ? 'text-white' : 'text-emerald-700'}`}>
          Dịch thuật AI
        </span>
      </button>

      {/* Divider */}
      <div className="h-10 border-l border-slate-200" />

      {/* Quick action buttons */}
      <div className="flex flex-col gap-0.5 justify-center">
        <div className="flex gap-1">
          {quickActions.slice(0, 2).map((a, i) => (
            <button
              key={i}
              title={a.label}
              onClick={() => {
                if (a.onClick) a.onClick();
                else if (a.prompt) onAskAI(a.prompt);
              }}
              className="flex items-center gap-1 px-2 py-1 text-[11px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-all font-medium"
            >
              {a.icon}
              {a.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {quickActions.slice(2, 4).map((a, i) => (
            <button
              key={i}
              title={a.label}
              onClick={() => {
                if (a.onClick) a.onClick();
                else if (a.prompt) onAskAI(a.prompt);
              }}
              className="flex items-center gap-1 px-2 py-1 text-[11px] text-violet-700 bg-violet-50 hover:bg-violet-100 rounded border border-violet-200 transition-all"
            >
              {a.icon}
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── AI Side Panel ────────────────────────────────────────────────────────────

interface AIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
  getSheetContext: () => string;
}

const SUGGESTIONS = [
  'Công thức VLOOKUP là gì?',
  'Làm sao tính tổng theo điều kiện?',
  'Cách tạo biểu đồ từ dữ liệu?',
  'Hướng dẫn dùng hàm IF lồng nhau',
  'Cách lọc dữ liệu trùng lặp?',
  'Công thức tính phần trăm tăng trưởng',
];

function formatTime() {
  return new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

async function callOllama(messages: { role: string; content: string }[], onChunk: (t: string) => void, onDone: () => void) {
  try {
    const res = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen3:8b',
        messages,
        stream: true,
        options: { temperature: 0.3, num_predict: 1024 }
      }),
      signal: AbortSignal.timeout(60000),
    });
    if (!res.ok || !res.body) throw new Error('Ollama không phản hồi');
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const lines = dec.decode(value).split('\n').filter(Boolean);
      for (const line of lines) {
        try {
          const obj = JSON.parse(line);
          if (obj.message?.content) onChunk(obj.message.content);
          if (obj.done) { onDone(); return; }
        } catch {}
      }
    }
    onDone();
  } catch (err: any) {
    onChunk(`\n\n⚠️ Không thể kết nối Ollama. Hãy chắc chắn Ollama đang chạy với lệnh: \`ollama serve\``);
    onDone();
  }
}

export function AIPanel({ isOpen, onClose, initialMessage, getSheetContext }: AIPanelProps) {
  const [messages, setMessages] = useState<Message[]>([{
    id: 'welcome',
    role: 'assistant',
    content: '👋 Xin chào! Tôi là **Trợ lý AI Excel** của OfficeX.\n\nTôi có thể giúp bạn:\n- 📐 **Gợi ý & giải thích công thức**\n- 📊 **Phân tích dữ liệu**\n- 🔍 **Tìm lỗi trong bảng tính**\n- 📝 **Hướng dẫn các hàm Excel**\n\nHãy hỏi tôi bất cứ điều gì về Excel!',
    time: formatTime(),
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialMessage && isOpen) {
      sendMessage(initialMessage);
    }
  }, [initialMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const sendMessage = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || isLoading) return;
    setInput('');

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: msg, time: formatTime() };
    const assistantId = Date.now().toString() + '_ai';
    const assistantMsg: Message = { id: assistantId, role: 'assistant', content: '', time: formatTime() };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setIsLoading(true);

    const sheetCtx = getSheetContext();
    const systemPrompt = `Bạn là trợ lý AI chuyên về Microsoft Excel và bảng tính. Trả lời bằng tiếng Việt, ngắn gọn và rõ ràng. Dùng markdown để định dạng.

Ngữ cảnh bảng tính hiện tại:
${sheetCtx}

Hãy giúp người dùng sử dụng Excel hiệu quả hơn.`;

    const chatHistory = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
    chatHistory.push({ role: 'user', content: msg });

    await callOllama(
      [{ role: 'system', content: systemPrompt }, ...chatHistory],
      (token) => {
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: m.content + token } : m
        ));
      },
      () => setIsLoading(false)
    );
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome2',
      role: 'assistant',
      content: '🔄 Cuộc trò chuyện đã được làm mới. Hỏi tôi bất cứ điều gì về Excel!',
      time: formatTime(),
    }]);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 380,
        background: 'white', boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
        display: 'flex', flexDirection: 'column', zIndex: 1000,
        borderLeft: '1px solid #e2e8f0',
      }}
    >
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
        padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Sparkles size={18} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>Trợ lý AI Excel</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>Powered by Ollama · qwen3:8b</span>
          </div>
        </div>
        <button onClick={clearChat} title="Làm mới cuộc trò chuyện"
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 6, padding: '6px', cursor: 'pointer', color: 'white' }}>
          <RefreshCw size={14} />
        </button>
        <button onClick={onClose}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 6, padding: '6px', cursor: 'pointer', color: 'white' }}>
          <X size={14} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', gap: 8, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
            {/* Avatar */}
            <div style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              background: msg.role === 'user' ? '#e0f2fe' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {msg.role === 'user'
                ? <User size={14} color="#0369a1" />
                : <Bot size={14} color="white" />
              }
            </div>
            {/* Bubble */}
            <div style={{
              maxWidth: '80%',
              background: msg.role === 'user' ? '#eff6ff' : '#f8f5ff',
              border: msg.role === 'user' ? '1px solid #bfdbfe' : '1px solid #e9d5ff',
              borderRadius: msg.role === 'user' ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
              padding: '8px 12px',
            }}>
              <MarkdownText text={msg.content || (isLoading && msg.role === 'assistant' && msg.content === '' ? '▋' : '')} />
              <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}
        {/* Loading indicator */}
        {isLoading && messages[messages.length - 1]?.content === '' && (
          <div style={{ display: 'flex', gap: 4, paddingLeft: 36 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%', background: '#7c3aed',
                animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick suggestions */}
      {messages.length <= 2 && (
        <div style={{ padding: '0 12px 8px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {SUGGESTIONS.map((s, i) => (
            <button key={i} onClick={() => sendMessage(s)}
              style={{
                fontSize: 11, padding: '4px 10px', borderRadius: 20,
                border: '1px solid #e9d5ff', background: '#faf5ff',
                color: '#7c3aed', cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#ede9fe')}
              onMouseLeave={e => (e.currentTarget.style.background = '#faf5ff')}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '10px 12px', borderTop: '1px solid #f1f5f9', background: '#fafafa', flexShrink: 0 }}>
        <div style={{
          display: 'flex', gap: 8, alignItems: 'flex-end',
          background: 'white', border: '1.5px solid #e9d5ff',
          borderRadius: 12, padding: '6px 6px 6px 12px',
          boxShadow: '0 1px 4px rgba(124,58,237,0.08)',
          transition: 'border-color 0.2s',
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
            }}
            placeholder="Hỏi về Excel, công thức, dữ liệu..."
            rows={1}
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontSize: 13, resize: 'none', lineHeight: 1.5,
              maxHeight: 120, overflowY: 'auto', fontFamily: 'inherit',
            }}
            onInput={e => {
              const t = e.target as HTMLTextAreaElement;
              t.style.height = 'auto';
              t.style.height = Math.min(t.scrollHeight, 120) + 'px';
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            style={{
              width: 32, height: 32, borderRadius: 8, border: 'none',
              background: !input.trim() || isLoading ? '#e9d5ff' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              color: 'white', cursor: !input.trim() || isLoading ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s', flexShrink: 0,
            }}
          >
            {isLoading ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={14} />}
          </button>
        </div>
        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 6, textAlign: 'center' }}>
          Enter để gửi · Shift+Enter xuống dòng
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// Simple markdown renderer
function MarkdownText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div style={{ fontSize: 13, lineHeight: 1.6, color: '#1e293b', wordBreak: 'break-word' }}>
      {lines.map((line, i) => {
        // Bold **text**
        const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
        const rendered = parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j}>{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('`') && part.endsWith('`')) {
            return (
              <code key={j} style={{
                background: '#f1f5f9', padding: '1px 5px', borderRadius: 4,
                fontSize: 12, fontFamily: 'monospace', color: '#7c3aed'
              }}>
                {part.slice(1, -1)}
              </code>
            );
          }
          return <span key={j}>{part}</span>;
        });

        if (line.startsWith('- ') || line.startsWith('• ')) {
          return <div key={i} style={{ paddingLeft: 12, display: 'flex', gap: 6 }}>
            <span style={{ color: '#7c3aed', flexShrink: 0 }}>•</span>
            <span>{rendered.map((r, j) => j === 0 ? (
              <span key={j}>{(r as any).props?.children?.slice?.(2) || (typeof (r as any).props?.children === 'string' ? (r as any).props.children.slice(2) : r)}</span>
            ) : r)}</span>
          </div>;
        }
        if (line.startsWith('# ')) return <h3 key={i} style={{ fontWeight: 700, fontSize: 14, margin: '6px 0 2px' }}>{line.slice(2)}</h3>;
        if (line.startsWith('## ')) return <h4 key={i} style={{ fontWeight: 700, fontSize: 13, margin: '4px 0 2px' }}>{line.slice(3)}</h4>;
        if (line === '') return <div key={i} style={{ height: 6 }} />;
        return <div key={i}>{rendered}</div>;
      })}
    </div>
  );
}
