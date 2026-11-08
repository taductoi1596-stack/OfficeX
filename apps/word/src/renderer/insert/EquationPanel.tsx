import React, { useState, useEffect, useRef } from 'react';
import { EditorAPI } from '../editorApi';

// ─── Symbol Data ──────────────────────────────────────────────────────────────
const SYMBOL_CATEGORIES = [
  {
    id: 'basic',
    icon: '±',
    label: 'Toán học Cơ bản',
    symbols: ['±','∞','=','≠','~','×','÷','!','∝','<','«','>','»','≤','≥','∓','≅','≈','≡','∀','C','∂','√','∛','∜','∪','∩','∅','%','°','∇','∃','∈','∉','∋','∌','∑','∏','∐','⊕','⊗','⊙','⊂','⊃','⊄','⊅','⊆','⊇']
  },
  {
    id: 'greek',
    icon: 'α',
    label: 'Chữ Hy Lạp (thường)',
    symbols: ['α','β','γ','δ','ε','ζ','η','θ','ι','κ','λ','μ','ν','ξ','ο','π','ρ','σ','τ','υ','φ','χ','ψ','ω','ϑ','ϕ','ϖ','ϱ','ϵ']
  },
  {
    id: 'GREEK',
    icon: 'N',
    label: 'Chữ Hy Lạp (Hoa)',
    symbols: ['Α','Β','Γ','Δ','Ε','Ζ','Η','Θ','Ι','Κ','Λ','Μ','Ν','Ξ','Ο','Π','Ρ','Σ','Τ','Υ','Φ','Χ','Ψ','Ω']
  },
  {
    id: 'ops',
    icon: '÷',
    label: 'Toán tử Nhị phân',
    symbols: ['÷','×','±','∓','∧','∨','∩','∪','⊕','⊗','⊙','⊖','⊘','⊚','⊛','⊞','⊟','⊠','⊡','⋅','∗','⋆','∘','∙','⋄']
  },
  {
    id: 'arrows',
    icon: '→',
    label: 'Mũi tên',
    symbols: ['→','←','↑','↓','↔','↕','⇒','⇐','⇑','⇓','⇔','⇕','↦','↩','↪','↭','↯','⇀','⇁','⇄','⇅','⇆','⇇','⇈','⇉','⇊','⇋','⇌','⇎','⇏']
  },
  {
    id: 'neq',
    icon: '≠',
    label: 'Quan hệ Phủ định',
    symbols: ['≠','≁','≄','≇','≉','≋','≌','∤','∦','⊄','⊅','⊊','⊋','⊭','⊬','⊯','⊮','≁','≃','≅','≆','≇','≈','≉','≊','≋','≌','≍']
  },
  {
    id: 'script',
    icon: '∄',
    label: 'Chữ Script',
    symbols: ['ℌ','ℑ','ℓ','ℕ','℘','ℝ','ℤ','ℂ','ℚ','𝒜','ℬ','𝒞','𝒟','ℰ','ℱ','𝒢','ℋ','ℐ','𝒥','𝒦','ℒ','ℳ','𝒩','𝒪','𝒫','𝒬','ℛ','𝒮','𝒯','𝒰']
  },
  {
    id: 'emoji_faces',
    icon: '😃',
    label: 'Biểu cảm & Gương mặt',
    symbols: ['😃','😀','😂','🤣','😄','😅','😆','😝','😉','😊','😋','😎','😍','😘','😗','😙','😚','🙂','🤗','🤔','😐','😑','😶','🙄','😏','😣','😥','😮','🤐','😯','😪','😫','😴','😌','😛','😜','🙃']
  },
  {
    id: 'emoji_gestures',
    icon: '👍',
    label: 'Cử chỉ & Biểu tượng',
    symbols: ['👍','👎','👏','🙏','💪','🤝','✌️','🤘','🤙','👋','👋','🔥','❤️','💖','🎉','✨','⭐','🌟','💡','🚀','💯','✅','❌','⚡','🎈','🎁','🏆','🎯','🥇','🥈','🥉']
  },
];

// ─── Structure Data ───────────────────────────────────────────────────────────
const STRUCTURE_CATEGORIES = [
  {
    id: 'scripts',
    icon: 'eˣ',
    label: 'Chỉ số dưới và Chỉ số trên',
    items: [
      { label: 'xʸ', latex: 'x^y', display: '□□' },
      { label: 'x₋', latex: 'x_n', display: '□□' },
      { label: 'xʸₙ', latex: 'x^y_n', display: '□□□' },
      { label: '₋xʸ', latex: '_n x^y', display: '□□□□' },
    ],
    sub: [
      {
        label: 'Chỉ số dưới và chỉ số trên Thông thường',
        items: [
          { label: 'x_y^2', latex: 'x_y^2', display: <span style={{fontStyle:'italic', fontSize:14}}>x<sub>y</sub><sup>2</sup></span> },
          { label: 'e^{-iωt}', latex: 'e^{-i\\omega t}', display: <span style={{fontStyle:'italic', fontSize:14}}>e<sup>-iωt</sup></span> },
          { label: 'x^2', latex: 'x^2', display: <span style={{fontStyle:'italic', fontSize:14}}>x<sup>2</sup></span> },
          { label: '^n_1 Y', latex: '^n_1 Y', display: <span style={{fontStyle:'italic', fontSize:14}}><sup>n</sup><sub>1</sub>Y</span> },
        ]
      }
    ]
  },
  {
    id: 'fraction',
    icon: 'x/y',
    label: 'Phân số',
    items: [
      { label: 'a/b', latex: '\\frac{a}{b}', display: <span style={{fontStyle:'italic', fontSize:12}}>a/b</span> },
      { label: 'stacked', latex: '\\frac{a}{b}', display: <span style={{fontSize:12}}>a<br/>b</span> },
    ]
  },
  {
    id: 'radical',
    icon: '√x',
    label: 'Căn',
    items: [
      { label: '√x', latex: '\\sqrt{x}', display: <span style={{fontSize:14}}>√x</span> },
      { label: '∛x', latex: '\\sqrt[3]{x}', display: <span style={{fontSize:14}}>∛x</span> },
      { label: 'ⁿ√x', latex: '\\sqrt[n]{x}', display: <span style={{fontSize:14}}>ⁿ√x</span> },
    ]
  },
  {
    id: 'integral',
    icon: '∫',
    label: 'Tích phân',
    items: [
      { label: '∫', latex: '\\int', display: '∫' },
      { label: '∬', latex: '\\iint', display: '∬' },
      { label: '∭', latex: '\\iiint', display: '∭' },
      { label: '∮', latex: '\\oint', display: '∮' },
    ]
  },
  {
    id: 'operator',
    icon: 'Σ',
    label: 'Toán tử Lớn',
    items: [
      { label: 'Σ', latex: '\\sum_{i=0}^{n}', display: <span style={{fontSize:14}}>Σ<sub style={{fontSize:9}}>i=0</sub><sup style={{fontSize:9}}>n</sup></span> },
      { label: 'Π', latex: '\\prod_{i=0}^{n}', display: '∏' },
      { label: 'lim', latex: '\\lim_{x \\to \\infty}', display: <span style={{fontSize:11}}>lim<sub>x→∞</sub></span> },
      { label: 'max', latex: '\\max', display: 'max' },
      { label: 'min', latex: '\\min', display: 'min' },
    ]
  },
  {
    id: 'bracket',
    icon: '{ }',
    label: 'Dấu ngoặc',
    items: [
      { label: '(x)', latex: '\\left( x \\right)', display: '(x)' },
      { label: '[x]', latex: '\\left[ x \\right]', display: '[x]' },
      { label: '{x}', latex: '\\left\\{ x \\right\\}', display: '{x}' },
      { label: '|x|', latex: '\\left| x \\right|', display: '|x|' },
      { label: '⟨x⟩', latex: '\\langle x \\rangle', display: '⟨x⟩' },
    ]
  },
  {
    id: 'matrix',
    icon: '[ ]',
    label: 'Ma trận',
    items: [
      { label: '2×2', latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', display: '[]₂' },
      { label: '3×3', latex: '\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}', display: '[]₃' },
    ]
  },
  {
    id: 'accent',
    icon: 'ȧ',
    label: 'Dấu Trọng âm',
    items: [
      { label: 'ȧ', latex: '\\dot{a}', display: 'ȧ' },
      { label: 'ā', latex: '\\bar{a}', display: 'ā' },
      { label: 'â', latex: '\\hat{a}', display: 'â' },
      { label: 'ã', latex: '\\tilde{a}', display: 'ã' },
      { label: 'à', latex: '\\grave{a}', display: 'à' },
      { label: 'á', latex: '\\acute{a}', display: 'á' },
    ]
  },
  {
    id: 'function',
    icon: 'sin',
    label: 'Hàm số',
    items: [
      { label: 'sin θ', latex: '\\sin\\theta', display: 'sin θ' },
      { label: 'cos θ', latex: '\\cos\\theta', display: 'cos θ' },
      { label: 'tan θ', latex: '\\tan\\theta', display: 'tan θ' },
      { label: 'log x', latex: '\\log x', display: 'log x' },
      { label: 'ln x', latex: '\\ln x', display: 'ln x' },
    ]
  },
];

// ─── Template Equations (Gần đây / Recent) ────────────────────────────────────
const TEMPLATE_STRUCTURES = [
  { label: 'Phân số', latex: '\\frac{a}{b}', display: <span style={{fontSize:14,fontStyle:'italic'}}>□<br/><hr style={{borderColor:'#333',margin:'1px 0'}}/>□</span> },
  { label: 'Phân số nhỏ', latex: '\\tfrac{a}{b}', display: <span style={{fontSize:11,fontStyle:'italic'}}>□/□</span> },
  { label: 'Nghiệm bậc 2', latex: '\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}', display: <span style={{fontSize:9,fontStyle:'italic'}}>-b±√(b²-4ac)<hr style={{borderColor:'#333',margin:'1px 0'}}/>2a</span> },
  { label: 'x_y²', latex: 'x_y^2', display: <span style={{fontSize:14,fontStyle:'italic'}}>x<sub>y</sub><sup>2</sup></span> },
];

const RECENT_SYMBOLS = ['∞', '±'];

// ─── Main EquationPanel ────────────────────────────────────────────────────────
interface EquationPanelProps {
  onClose: () => void;
}

export function EquationPanel({ onClose }: EquationPanelProps) {
  const [tab, setTab] = useState<'recent' | 'symbol' | 'structure'>('recent');
  const [input, setInput] = useState('');
  const [symbolCat, setSymbolCat] = useState('basic');
  const [structCat, setStructCat] = useState('scripts');
  const [recentSymbols, setRecentSymbols] = useState<string[]>(RECENT_SYMBOLS);
  const [recentStructures, setRecentStructures] = useState<{label:string,latex:string,display:any}[]>(
    [TEMPLATE_STRUCTURES[0], TEMPLATE_STRUCTURES[2], TEMPLATE_STRUCTURES[3]]
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const legacyApi = (EditorAPI.getLegacy() as any);

  const insertEquation = (latex: string) => {
    const toInsert = latex || input;
    if (!toInsert.trim()) return;
    if (legacyApi?.insertTextAtSelection) {
      legacyApi.insertTextAtSelection(toInsert);
    } else if (legacyApi?.insertText) {
      legacyApi.insertText(toInsert);
    }
    setInput('');
  };

  const appendSymbol = (sym: string) => {
    setInput(prev => prev + sym);
    setRecentSymbols(prev => {
      const filtered = prev.filter(s => s !== sym);
      return [sym, ...filtered].slice(0, 16);
    });
  };

  const appendStructure = (item: {label:string, latex:string, display:any}) => {
    setInput(prev => prev + item.latex + ' ');
    setRecentStructures(prev => {
      const filtered = prev.filter(s => s.latex !== item.latex);
      return [item, ...filtered].slice(0, 6);
    });
  };

  const currentSymCat = SYMBOL_CATEGORIES.find(c => c.id === symbolCat) ?? SYMBOL_CATEGORIES[0];
  const currentStructCat = STRUCTURE_CATEGORIES.find(c => c.id === structCat) ?? STRUCTURE_CATEGORIES[0];

  return (
    <div
      ref={panelRef}
      className="flex flex-col bg-white border-l border-slate-200 shadow-xl"
      style={{ width: 340, height: '100%', minHeight: 0, fontFamily: 'Segoe UI, sans-serif', fontSize: 13 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-[#f7f7f7] shrink-0">
        <span className="font-semibold text-[14px] text-slate-800">Công cụ Phương trình</span>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-lg leading-none">✕</button>
      </div>

      {/* Input area */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-200 shrink-0">
        <input
          className="w-full border border-slate-300 rounded px-3 py-2 text-[13px] outline-none focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4] mb-3 font-mono"
          placeholder="Nhập LaTeX, ví dụ: \frac{a}{b}"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') insertEquation(input); }}
        />
        <button
          onClick={() => insertEquation(input)}
          className="w-full py-1.5 bg-[#0078d4] hover:bg-[#006cbf] text-white text-[13px] font-semibold rounded transition-colors"
        >
          Chèn trên trang
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 shrink-0 px-4 pt-3 gap-5">
        {(['recent','symbol','structure'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 text-[13px] font-medium transition-colors border-b-2 ${tab === t ? 'border-[#0078d4] text-[#0078d4] font-bold' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
          >
            {t === 'recent' ? 'Gần đây' : t === 'symbol' ? 'Ký hiệu' : 'Cấu trúc'}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* ── Gần đây ── */}
        {tab === 'recent' && (
          <div className="p-4">
            <div className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide mb-3">Biểu tượng Gần đây</div>
            <div className="flex flex-wrap gap-2 mb-5">
              {recentSymbols.map((sym, i) => (
                <button key={i}
                  onClick={() => appendSymbol(sym)}
                  className="w-10 h-10 border border-slate-200 rounded bg-white hover:bg-blue-50 hover:border-[#0078d4] text-[16px] flex items-center justify-center transition-colors"
                >
                  {sym}
                </button>
              ))}
            </div>
            <div className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide mb-3">Cấu trúc Gần đây</div>
            <div className="flex flex-wrap gap-2">
              {recentStructures.map((item, i) => (
                <button key={i}
                  onClick={() => appendStructure(item)}
                  title={item.label}
                  className="w-[72px] h-[72px] border border-slate-200 rounded bg-white hover:bg-blue-50 hover:border-[#0078d4] flex items-center justify-center transition-colors text-[13px]"
                  style={{lineHeight:1.2}}
                >
                  {item.display}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Ký hiệu ── */}
        {tab === 'symbol' && (
          <div className="flex h-full">
            {/* Left category sidebar */}
            <div className="w-10 border-r border-slate-200 flex flex-col pt-2 shrink-0 bg-[#fafafa] overflow-y-auto">
              {SYMBOL_CATEGORIES.map(cat => (
                <button key={cat.id}
                  onClick={() => setSymbolCat(cat.id)}
                  title={cat.label}
                  className={`w-10 h-10 flex items-center justify-center text-[15px] transition-colors border-l-2 ${symbolCat === cat.id ? 'border-[#0078d4] bg-blue-50 text-[#0078d4] font-bold' : 'border-transparent text-slate-600 hover:bg-slate-100'}`}
                >
                  {cat.icon}
                </button>
              ))}
            </div>
            {/* Right symbols grid */}
            <div className="flex-1 p-3 overflow-y-auto">
              <div className="text-[12px] font-semibold text-slate-600 mb-3">{currentSymCat.label}</div>
              <div className="grid gap-1" style={{gridTemplateColumns: 'repeat(5, 1fr)'}}>
                {currentSymCat.symbols.map((sym, i) => (
                  <button key={i}
                    onClick={() => appendSymbol(sym)}
                    className="h-9 border border-slate-200 rounded bg-white hover:bg-blue-50 hover:border-[#0078d4] text-[16px] flex items-center justify-center transition-colors"
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Cấu trúc ── */}
        {tab === 'structure' && (
          <div className="flex h-full">
            {/* Left category sidebar */}
            <div className="w-12 border-r border-slate-200 flex flex-col pt-2 shrink-0 bg-[#fafafa]">
              {STRUCTURE_CATEGORIES.map(cat => (
                <button key={cat.id}
                  onClick={() => setStructCat(cat.id)}
                  title={cat.label}
                  className={`w-12 h-10 flex items-center justify-center text-[11px] transition-colors border-l-2 leading-tight px-1 ${structCat === cat.id ? 'border-[#0078d4] bg-blue-50 text-[#0078d4] font-bold' : 'border-transparent text-slate-600 hover:bg-slate-100'}`}
                >
                  {cat.icon}
                </button>
              ))}
            </div>
            {/* Right structure items */}
            <div className="flex-1 p-3 overflow-y-auto">
              <div className="text-[12px] font-semibold text-slate-600 mb-3">{currentStructCat.label}</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {currentStructCat.items.map((item, i) => (
                  <button key={i}
                    onClick={() => appendStructure(item as any)}
                    title={item.label}
                    className="w-[66px] h-[66px] border border-slate-200 rounded bg-white hover:bg-blue-50 hover:border-[#0078d4] flex items-center justify-center transition-colors text-[13px]"
                    style={{lineHeight:1.2}}
                  >
                    {(item as any).display ?? item.label}
                  </button>
                ))}
              </div>
              {currentStructCat.sub?.map((sub, si) => (
                <div key={si} className="mb-4">
                  <div className="text-[12px] font-semibold text-slate-600 mb-2">{sub.label}</div>
                  <div className="flex flex-wrap gap-2">
                    {sub.items.map((item, i) => (
                      <button key={i}
                        onClick={() => appendStructure(item as any)}
                        title={item.label}
                        className="w-[66px] h-[66px] border border-slate-200 rounded bg-white hover:bg-blue-50 hover:border-[#0078d4] flex items-center justify-center transition-colors text-[13px]"
                        style={{lineHeight:1.2}}
                      >
                        {(item as any).display ?? item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
