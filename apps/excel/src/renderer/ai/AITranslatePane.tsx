import React, { useState, useEffect, useRef } from 'react';
import {
  Languages,
  ArrowRightLeft,
  Copy,
  Check,
  Sparkles,
  X,
  RefreshCw,
  ArrowRight,
  FileSpreadsheet,
  History,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  TranslateEngine,
  SUPPORTED_LANGUAGES,
  TranslateResult
} from './TranslateEngine';

interface AITranslatePaneProps {
  isOpen: boolean;
  onClose: () => void;
  activeCellRefText: string;
  activeCellCoord: { row: number; col: number };
  onReplaceCell: (translated: string) => void;
  onInsertAdjacentCol: (translated: string) => void;
  onTranslateSheet: (
    sourceLang: string,
    targetLang: string,
    onProgress: (done: number, total: number) => void
  ) => Promise<{ count: number }>;
}

interface TranslationHistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  time: string;
}

export function AITranslatePane({
  isOpen,
  onClose,
  activeCellRefText,
  activeCellCoord,
  onReplaceCell,
  onInsertAdjacentCol,
  onTranslateSheet,
}: AITranslatePaneProps) {
  const [sourceLang, setSourceLang] = useState('Auto Detect');
  const [targetLang, setTargetLang] = useState('Vietnamese');
  const [sourceText, setSourceText] = useState(activeCellRefText || '');
  const [translatedText, setTranslatedText] = useState('');
  const [detectedLang, setDetectedLang] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'translate' | 'sheet' | 'history'>('translate');
  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);

  // Sheet translate progress
  const [sheetProgress, setSheetProgress] = useState<{ done: number; total: number } | null>(null);
  const [isSheetTranslating, setIsSheetTranslating] = useState(false);
  const [sheetCompleteCount, setSheetCompleteCount] = useState<number | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  // Sync activeCellRefText when active cell changes
  useEffect(() => {
    if (activeCellRefText) {
      setSourceText(activeCellRefText);
      // Auto translate when cell has text and panel is open
      if (isOpen && activeCellRefText.trim().length > 0) {
        doTranslate(activeCellRefText, sourceLang, targetLang);
      }
    }
  }, [activeCellRefText, activeCellCoord.row, activeCellCoord.col]);

  const doTranslate = async (text: string, src: string, tgt: string) => {
    const query = text.trim();
    if (!query) return;

    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();

    setIsLoading(true);
    setTranslatedText('');

    try {
      const res = await TranslateEngine.translate(query, { sourceLang: src, targetLang: tgt }, abortRef.current.signal);
      setTranslatedText(res.translatedText);
      setDetectedLang(res.detectedSourceLang);

      // Add to history
      setHistory(prev => [
        {
          id: Date.now().toString(),
          sourceText: query,
          translatedText: res.translatedText,
          sourceLang: res.detectedSourceLang,
          targetLang: tgt,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev.slice(0, 19),
      ]);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setTranslatedText(`[Lỗi dịch: ${err?.message || 'Không thể kết nối'}]`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwap = () => {
    if (sourceLang === 'Auto Detect') {
      setSourceLang(targetLang);
      setTargetLang('English');
    } else {
      const prev = sourceLang;
      setSourceLang(targetLang);
      setTargetLang(prev);
    }
    if (translatedText) {
      setSourceText(translatedText);
      setTranslatedText('');
      doTranslate(translatedText, targetLang, sourceLang === 'Auto Detect' ? 'English' : sourceLang);
    }
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleStartSheetTranslate = async () => {
    if (isSheetTranslating) return;
    setIsSheetTranslating(true);
    setSheetProgress({ done: 0, total: 1 });
    setSheetCompleteCount(null);

    try {
      const res = await onTranslateSheet(sourceLang, targetLang, (done, total) => {
        setSheetProgress({ done, total });
      });
      setSheetCompleteCount(res.count);
    } catch (err) {
      console.error('Sheet translate failed:', err);
    } finally {
      setIsSheetTranslating(false);
    }
  };

  const colLetter = String.fromCharCode(64 + activeCellCoord.col);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 390,
        background: 'white',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        borderLeft: '1px solid #e2e8f0',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #107c41 0%, #059669 100%)',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          color: 'white',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Languages size={18} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Dịch thuật AI (Translator)</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
            Đang chọn ô: <span style={{ fontWeight: 600, color: '#fef08a' }}>{colLetter}{activeCellCoord.row}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            borderRadius: 6,
            padding: '6px',
            cursor: 'pointer',
            color: 'white',
          }}
        >
          <X size={15} />
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc',
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setActiveTab('translate')}
          style={{
            flex: 1,
            padding: '9px 12px',
            fontSize: 12,
            fontWeight: activeTab === 'translate' ? 600 : 500,
            color: activeTab === 'translate' ? '#107c41' : '#64748b',
            borderBottom: activeTab === 'translate' ? '2px solid #107c41' : '2px solid transparent',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <Languages size={14} /> Dịch ô tính
        </button>
        <button
          onClick={() => setActiveTab('sheet')}
          style={{
            flex: 1,
            padding: '9px 12px',
            fontSize: 12,
            fontWeight: activeTab === 'sheet' ? 600 : 500,
            color: activeTab === 'sheet' ? '#107c41' : '#64748b',
            borderBottom: activeTab === 'sheet' ? '2px solid #107c41' : '2px solid transparent',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <FileSpreadsheet size={14} /> Dịch cả Sheet
        </button>
        <button
          onClick={() => setActiveTab('history')}
          style={{
            flex: 1,
            padding: '9px 12px',
            fontSize: 12,
            fontWeight: activeTab === 'history' ? 600 : 500,
            color: activeTab === 'history' ? '#107c41' : '#64748b',
            borderBottom: activeTab === 'history' ? '2px solid #107c41' : '2px solid transparent',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <History size={14} /> Lịch sử
        </button>
      </div>

      {/* Language Selector Bar */}
      <div
        style={{
          padding: '10px 14px',
          background: '#f1f5f9',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexShrink: 0,
        }}
      >
        <select
          value={sourceLang}
          onChange={(e) => {
            setSourceLang(e.target.value);
            if (sourceText) doTranslate(sourceText, e.target.value, targetLang);
          }}
          style={{
            flex: 1,
            fontSize: 12,
            padding: '5px 8px',
            borderRadius: 6,
            border: '1px solid #cbd5e1',
            background: 'white',
          }}
        >
          {SUPPORTED_LANGUAGES.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        <button
          onClick={handleSwap}
          title="Đổi chiều ngôn ngữ"
          style={{
            padding: '6px',
            borderRadius: 6,
            border: '1px solid #cbd5e1',
            background: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#475569',
          }}
        >
          <ArrowRightLeft size={13} />
        </button>

        <select
          value={targetLang}
          onChange={(e) => {
            setTargetLang(e.target.value);
            if (sourceText) doTranslate(sourceText, sourceLang, e.target.value);
          }}
          style={{
            flex: 1,
            fontSize: 12,
            padding: '5px 8px',
            borderRadius: 6,
            border: '1px solid #cbd5e1',
            background: 'white',
          }}
        >
          {SUPPORTED_LANGUAGES.filter((l) => l !== 'Auto Detect').map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {activeTab === 'translate' && (
          <>
            {/* Source Box */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>
                  Văn bản gốc {detectedLang && <span style={{ color: '#059669', textTransform: 'none' }}>({detectedLang})</span>}
                </span>
                <button
                  onClick={() => {
                    setSourceText(activeCellRefText);
                    if (activeCellRefText) doTranslate(activeCellRefText, sourceLang, targetLang);
                  }}
                  style={{
                    fontSize: 11,
                    color: '#107c41',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <RefreshCw size={11} /> Nạp lại ô {colLetter}{activeCellCoord.row}
                </button>
              </div>

              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Nhập hoặc chọn ô cần dịch..."
                rows={4}
                style={{
                  width: '100%',
                  fontSize: 13,
                  padding: '9px 11px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
            </div>

            {/* Translate Button */}
            <button
              onClick={() => doTranslate(sourceText, sourceLang, targetLang)}
              disabled={isLoading || !sourceText.trim()}
              style={{
                background: isLoading || !sourceText.trim() ? '#94a3b8' : 'linear-gradient(135deg, #107c41 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                padding: '9px 14px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: isLoading || !sourceText.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.15s ease',
              }}
            >
              {isLoading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {isLoading ? 'Đang dịch...' : 'Dịch ngay'}
            </button>

            {/* Translation Output Box */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>
                  Bản dịch ({targetLang})
                </span>
                {translatedText && (
                  <button
                    onClick={handleCopy}
                    style={{
                      fontSize: 11,
                      color: '#475569',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    {isCopied ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                    {isCopied ? 'Đã sao chép' : 'Sao chép'}
                  </button>
                )}
              </div>

              <div
                style={{
                  minHeight: 100,
                  maxHeight: 180,
                  overflowY: 'auto',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  padding: '10px 12px',
                  fontSize: 13,
                  color: translatedText ? '#0f172a' : '#94a3b8',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {translatedText || (isLoading ? 'Đang dịch văn bản...' : 'Bản dịch sẽ hiển thị ở đây...')}
              </div>
            </div>

            {/* Quick Insertion Actions */}
            {translatedText && !isLoading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b' }}>HÀNH ĐỘNG VỚI Ô TÍNH:</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => {
                      onReplaceCell(translatedText);
                    }}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      background: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      color: '#065f46',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <CheckCircle2 size={14} /> Thay thế ô {colLetter}{activeCellCoord.row}
                  </button>

                  <button
                    onClick={() => {
                      onInsertAdjacentCol(translatedText);
                    }}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      color: '#15803d',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <ArrowRight size={14} /> Điền vào cột bên
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Tab 2: Whole Sheet Translation */}
        {activeTab === 'sheet' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div
              style={{
                padding: '12px',
                borderRadius: 8,
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                fontSize: 12,
                color: '#166534',
                lineHeight: 1.5,
              }}
            >
              <strong>⚡ Dịch tự động toàn bộ trang tính:</strong>
              <div style={{ marginTop: 4 }}>
                Tính năng này sẽ quét tất cả các ô có chứa chữ trong Sheet hiện tại, dịch sang <strong>{targetLang}</strong> và tự động cập nhật lại bảng tính.
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Ngôn ngữ đích cần dịch sang:</span>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                style={{
                  fontSize: 13,
                  padding: '7px 10px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  background: 'white',
                }}
              >
                {SUPPORTED_LANGUAGES.filter((l) => l !== 'Auto Detect').map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {sheetProgress && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b' }}>
                  <span>Tiến độ dịch:</span>
                  <span>{sheetProgress.done} / {sheetProgress.total} ô</span>
                </div>
                <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      background: '#107c41',
                      width: `${Math.round((sheetProgress.done / Math.max(1, sheetProgress.total)) * 100)}%`,
                      transition: 'width 0.2s ease',
                    }}
                  />
                </div>
              </div>
            )}

            {sheetCompleteCount !== null && (
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: 6,
                  background: '#ecfdf5',
                  border: '1px solid #6ee7b7',
                  color: '#047857',
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <CheckCircle2 size={16} />
                <span>Đã hoàn tất dịch thành công <strong>{sheetCompleteCount}</strong> ô tính!</span>
              </div>
            )}

            <button
              onClick={handleStartSheetTranslate}
              disabled={isSheetTranslating}
              style={{
                marginTop: 8,
                background: isSheetTranslating ? '#94a3b8' : 'linear-gradient(135deg, #107c41 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                padding: '11px 16px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: isSheetTranslating ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {isSheetTranslating ? <RefreshCw size={15} className="animate-spin" /> : <Layers size={15} />}
              {isSheetTranslating ? 'Đang dịch các ô trong Sheet...' : 'Bắt đầu dịch toàn bộ Sheet'}
            </button>
          </div>
        )}

        {/* Tab 3: History */}
        {activeTab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 10px', color: '#94a3b8', fontSize: 13 }}>
                Chưa có lịch sử dịch nào.
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 6,
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b' }}>
                    <span>{item.sourceLang} → {item.targetLang}</span>
                    <span>{item.time}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#475569', fontStyle: 'italic' }}>
                    "{item.sourceText}"
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: '#0f172a' }}>
                    {item.translatedText}
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    <button
                      onClick={() => onReplaceCell(item.translatedText)}
                      style={{
                        fontSize: 11,
                        padding: '4px 8px',
                        background: '#e0f2fe',
                        border: '1px solid #bae6fd',
                        color: '#0369a1',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    >
                      Dán vào ô
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(item.translatedText);
                      }}
                      style={{
                        fontSize: 11,
                        padding: '4px 8px',
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        color: '#475569',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    >
                      Sao chép
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

