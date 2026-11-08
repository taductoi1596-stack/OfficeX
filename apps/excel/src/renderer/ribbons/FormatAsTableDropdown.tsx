import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@officex/ui';
import { Table } from 'lucide-react';
import { CommandDispatcher } from '../CommandDispatcher';

interface TableStyleDef {
  id: string;
  headerBg: string;
  headerText: string;
  row1Bg: string;   // odd row (1st, 3rd...)
  row2Bg: string;   // even row (2nd, 4th...)
  borderColor: string;
  accentBg?: string; // for dark styles — total/accent row
}

// ── LIGHT ──────────────────────────────────────────────────────
const LIGHT_STYLES: TableStyleDef[] = [
  { id: 'TableStyleLight1',  headerBg: '#ffffff', headerText: '#000000', row1Bg: '#ffffff', row2Bg: '#f2f2f2', borderColor: '#d9d9d9' },
  { id: 'TableStyleLight2',  headerBg: '#4f81bd', headerText: '#ffffff', row1Bg: '#dce6f1', row2Bg: '#ffffff', borderColor: '#95b3d7' },
  { id: 'TableStyleLight3',  headerBg: '#e36c09', headerText: '#ffffff', row1Bg: '#fce4d6', row2Bg: '#ffffff', borderColor: '#f4b183' },
  { id: 'TableStyleLight4',  headerBg: '#a5a5a5', headerText: '#ffffff', row1Bg: '#ededed', row2Bg: '#ffffff', borderColor: '#bfbfbf' },
  { id: 'TableStyleLight5',  headerBg: '#ffc000', headerText: '#ffffff', row1Bg: '#fff2cc', row2Bg: '#ffffff', borderColor: '#ffd966' },
  { id: 'TableStyleLight6',  headerBg: '#4bacc6', headerText: '#ffffff', row1Bg: '#daeef3', row2Bg: '#ffffff', borderColor: '#92cddc' },
  { id: 'TableStyleLight7',  headerBg: '#4ead5b', headerText: '#ffffff', row1Bg: '#ebf1de', row2Bg: '#ffffff', borderColor: '#a9d18e' },
  // Row 2
  { id: 'TableStyleLight8',  headerBg: '#ffffff', headerText: '#000000', row1Bg: '#dce6f1', row2Bg: '#ffffff', borderColor: '#4f81bd' },
  { id: 'TableStyleLight9',  headerBg: '#ffffff', headerText: '#000000', row1Bg: '#fce4d6', row2Bg: '#ffffff', borderColor: '#e36c09' },
  { id: 'TableStyleLight10', headerBg: '#ffffff', headerText: '#000000', row1Bg: '#ededed', row2Bg: '#ffffff', borderColor: '#a5a5a5' },
  { id: 'TableStyleLight11', headerBg: '#ffffff', headerText: '#000000', row1Bg: '#fff2cc', row2Bg: '#ffffff', borderColor: '#ffc000' },
  { id: 'TableStyleLight12', headerBg: '#ffffff', headerText: '#000000', row1Bg: '#daeef3', row2Bg: '#ffffff', borderColor: '#4bacc6' },
  { id: 'TableStyleLight13', headerBg: '#ffffff', headerText: '#000000', row1Bg: '#ebf1de', row2Bg: '#ffffff', borderColor: '#4ead5b' },
  // Row 3
  { id: 'TableStyleLight14', headerBg: '#dce6f1', headerText: '#1f497d', row1Bg: '#dce6f1', row2Bg: '#ffffff', borderColor: '#95b3d7' },
  { id: 'TableStyleLight15', headerBg: '#fce4d6', headerText: '#833c00', row1Bg: '#fce4d6', row2Bg: '#ffffff', borderColor: '#f4b183' },
  { id: 'TableStyleLight16', headerBg: '#ededed', headerText: '#595959', row1Bg: '#ededed', row2Bg: '#ffffff', borderColor: '#bfbfbf' },
  { id: 'TableStyleLight17', headerBg: '#fff2cc', headerText: '#7f6000', row1Bg: '#fff2cc', row2Bg: '#ffffff', borderColor: '#ffd966' },
  { id: 'TableStyleLight18', headerBg: '#daeef3', headerText: '#205868', row1Bg: '#daeef3', row2Bg: '#ffffff', borderColor: '#92cddc' },
  { id: 'TableStyleLight19', headerBg: '#ebf1de', headerText: '#375623', row1Bg: '#ebf1de', row2Bg: '#ffffff', borderColor: '#a9d18e' },
  // Row 4
  { id: 'TableStyleLight20', headerBg: '#b8cce4', headerText: '#1f497d', row1Bg: '#dce6f1', row2Bg: '#ffffff', borderColor: '#95b3d7' },
  { id: 'TableStyleLight21', headerBg: '#f8cbad', headerText: '#833c00', row1Bg: '#fce4d6', row2Bg: '#ffffff', borderColor: '#f4b183' },
  { id: 'TableStyleLight22', headerBg: '#c9c9c9', headerText: '#595959', row1Bg: '#ededed', row2Bg: '#ffffff', borderColor: '#bfbfbf' },
  { id: 'TableStyleLight23', headerBg: '#ffd966', headerText: '#7f6000', row1Bg: '#fff2cc', row2Bg: '#ffffff', borderColor: '#ffd966' },
  { id: 'TableStyleLight24', headerBg: '#92cddc', headerText: '#205868', row1Bg: '#daeef3', row2Bg: '#ffffff', borderColor: '#92cddc' },
  { id: 'TableStyleLight25', headerBg: '#a9d18e', headerText: '#375623', row1Bg: '#ebf1de', row2Bg: '#ffffff', borderColor: '#a9d18e' },
];

// ── MEDIUM ─────────────────────────────────────────────────────
const MEDIUM_STYLES: TableStyleDef[] = [
  // Row 1 — banded cols, solid header
  { id: 'TableStyleMedium1',  headerBg: '#4f81bd', headerText: '#ffffff', row1Bg: '#dce6f1', row2Bg: '#ffffff', borderColor: '#4f81bd' },
  { id: 'TableStyleMedium2',  headerBg: '#e36c09', headerText: '#ffffff', row1Bg: '#fce4d6', row2Bg: '#ffffff', borderColor: '#e36c09' },
  { id: 'TableStyleMedium3',  headerBg: '#a5a5a5', headerText: '#ffffff', row1Bg: '#ededed', row2Bg: '#ffffff', borderColor: '#a5a5a5' },
  { id: 'TableStyleMedium4',  headerBg: '#ffc000', headerText: '#ffffff', row1Bg: '#fff2cc', row2Bg: '#ffffff', borderColor: '#ffc000' },
  { id: 'TableStyleMedium5',  headerBg: '#4bacc6', headerText: '#ffffff', row1Bg: '#daeef3', row2Bg: '#ffffff', borderColor: '#4bacc6' },
  { id: 'TableStyleMedium6',  headerBg: '#4ead5b', headerText: '#ffffff', row1Bg: '#ebf1de', row2Bg: '#ffffff', borderColor: '#4ead5b' },
  // Row 2 — banded rows, solid header
  { id: 'TableStyleMedium7',  headerBg: '#1f497d', headerText: '#ffffff', row1Bg: '#dce6f1', row2Bg: '#b8cce4', borderColor: '#4f81bd' },
  { id: 'TableStyleMedium8',  headerBg: '#843c0c', headerText: '#ffffff', row1Bg: '#fce4d6', row2Bg: '#f8cbad', borderColor: '#e36c09' },
  { id: 'TableStyleMedium9',  headerBg: '#595959', headerText: '#ffffff', row1Bg: '#ededed', row2Bg: '#c9c9c9', borderColor: '#a5a5a5' },
  { id: 'TableStyleMedium10', headerBg: '#7f6000', headerText: '#ffffff', row1Bg: '#fff2cc', row2Bg: '#ffd966', borderColor: '#ffc000' },
  { id: 'TableStyleMedium11', headerBg: '#215868', headerText: '#ffffff', row1Bg: '#daeef3', row2Bg: '#92cddc', borderColor: '#4bacc6' },
  { id: 'TableStyleMedium12', headerBg: '#375623', headerText: '#ffffff', row1Bg: '#ebf1de', row2Bg: '#c6e0b4', borderColor: '#4ead5b' },
  // Row 3 — with column banding
  { id: 'TableStyleMedium13', headerBg: '#17375e', headerText: '#ffffff', row1Bg: '#dce6f1', row2Bg: '#ffffff', borderColor: '#4f81bd' },
  { id: 'TableStyleMedium14', headerBg: '#974706', headerText: '#ffffff', row1Bg: '#fce4d6', row2Bg: '#ffffff', borderColor: '#e36c09' },
  { id: 'TableStyleMedium15', headerBg: '#464646', headerText: '#ffffff', row1Bg: '#ededed', row2Bg: '#ffffff', borderColor: '#a5a5a5' },
  { id: 'TableStyleMedium16', headerBg: '#5f4600', headerText: '#ffffff', row1Bg: '#fff2cc', row2Bg: '#ffffff', borderColor: '#ffc000' },
  { id: 'TableStyleMedium17', headerBg: '#17414d', headerText: '#ffffff', row1Bg: '#daeef3', row2Bg: '#ffffff', borderColor: '#4bacc6' },
  { id: 'TableStyleMedium18', headerBg: '#254117', headerText: '#ffffff', row1Bg: '#ebf1de', row2Bg: '#ffffff', borderColor: '#4ead5b' },
  // Row 4 — banded rows, solid accent
  { id: 'TableStyleMedium19', headerBg: '#4f81bd', headerText: '#ffffff', row1Bg: '#dce6f1', row2Bg: '#b8cce4', borderColor: '#4f81bd' },
  { id: 'TableStyleMedium20', headerBg: '#e36c09', headerText: '#ffffff', row1Bg: '#fce4d6', row2Bg: '#f8cbad', borderColor: '#e36c09' },
  { id: 'TableStyleMedium21', headerBg: '#a5a5a5', headerText: '#ffffff', row1Bg: '#ededed', row2Bg: '#c9c9c9', borderColor: '#a5a5a5' },
  { id: 'TableStyleMedium22', headerBg: '#ffc000', headerText: '#ffffff', row1Bg: '#fff2cc', row2Bg: '#ffd966', borderColor: '#ffc000' },
  { id: 'TableStyleMedium23', headerBg: '#4bacc6', headerText: '#ffffff', row1Bg: '#daeef3', row2Bg: '#92cddc', borderColor: '#4bacc6' },
  { id: 'TableStyleMedium24', headerBg: '#4ead5b', headerText: '#ffffff', row1Bg: '#ebf1de', row2Bg: '#c6e0b4', borderColor: '#4ead5b' },
];

// ── DARK ───────────────────────────────────────────────────────
const DARK_STYLES: TableStyleDef[] = [
  { id: 'TableStyleDark1',  headerBg: '#17375e', headerText: '#ffffff', row1Bg: '#1f497d', row2Bg: '#4f81bd', borderColor: '#4f81bd' },
  { id: 'TableStyleDark2',  headerBg: '#843c0c', headerText: '#ffffff', row1Bg: '#c55a11', row2Bg: '#e36c09', borderColor: '#c55a11' },
  { id: 'TableStyleDark3',  headerBg: '#404040', headerText: '#ffffff', row1Bg: '#595959', row2Bg: '#a5a5a5', borderColor: '#595959' },
  { id: 'TableStyleDark4',  headerBg: '#5f4600', headerText: '#ffffff', row1Bg: '#806000', row2Bg: '#ffc000', borderColor: '#806000' },
  { id: 'TableStyleDark5',  headerBg: '#17414d', headerText: '#ffffff', row1Bg: '#215868', row2Bg: '#4bacc6', borderColor: '#215868' },
  { id: 'TableStyleDark6',  headerBg: '#254117', headerText: '#ffffff', row1Bg: '#375623', row2Bg: '#4ead5b', borderColor: '#375623' },
  { id: 'TableStyleDark7',  headerBg: '#1f497d', headerText: '#ffffff', row1Bg: '#336699', row2Bg: '#4f81bd', borderColor: '#4f81bd' },
  { id: 'TableStyleDark8',  headerBg: '#974706', headerText: '#ffffff', row1Bg: '#cc6600', row2Bg: '#f4b183', borderColor: '#cc6600' },
  { id: 'TableStyleDark9',  headerBg: '#464646', headerText: '#ffffff', row1Bg: '#737373', row2Bg: '#a5a5a5', borderColor: '#737373' },
  { id: 'TableStyleDark10', headerBg: '#7f6000', headerText: '#ffffff', row1Bg: '#bf9000', row2Bg: '#ffc000', borderColor: '#bf9000' },
  { id: 'TableStyleDark11', headerBg: '#215868', headerText: '#ffffff', row1Bg: '#2e75b6', row2Bg: '#4bacc6', borderColor: '#2e75b6' },
];

// ── PREVIEW THUMBNAIL ──────────────────────────────────────────
const TableStylePreview: React.FC<{ style: TableStyleDef; onClick: () => void }> = ({ style, onClick }) => {
  const COLS = 4;
  const ROWS = 4; // header + 3 data rows
  const W = 56;
  const H = 44;
  const rowH = H / ROWS;
  const colW = W / COLS;

  return (
    <button
      onClick={onClick}
      title={style.id}
      className="relative group flex-shrink-0"
      style={{ width: W + 4, height: H + 4, padding: 2, boxSizing: 'border-box' }}
    >
      <div
        className="absolute inset-0 rounded-sm border-2 border-transparent group-hover:border-blue-500 transition-colors z-10 pointer-events-none"
        style={{ borderRadius: 2 }}
      />
      <svg width={W} height={H} style={{ display: 'block', border: `1px solid ${style.borderColor}` }}>
        {/* Rows */}
        {Array.from({ length: ROWS }).map((_, r) => {
          const y = r * rowH;
          const bg = r === 0 ? style.headerBg : (r % 2 === 1 ? style.row1Bg : style.row2Bg);
          return (
            <rect key={r} x={0} y={y} width={W} height={rowH} fill={bg} />
          );
        })}
        {/* Vertical column lines */}
        {Array.from({ length: COLS - 1 }).map((_, c) => (
          <line
            key={c}
            x1={(c + 1) * colW} y1={0}
            x2={(c + 1) * colW} y2={H}
            stroke={style.borderColor} strokeWidth={0.7}
          />
        ))}
        {/* Horizontal row lines */}
        {Array.from({ length: ROWS - 1 }).map((_, r) => (
          <line
            key={r}
            x1={0} y1={(r + 1) * rowH}
            x2={W} y2={(r + 1) * rowH}
            stroke={style.borderColor} strokeWidth={0.7}
          />
        ))}
        {/* Header text lines (simulate text) */}
        {Array.from({ length: COLS }).map((_, c) => (
          <rect
            key={c}
            x={c * colW + 3}
            y={rowH / 2 - 1.5}
            width={colW - 6}
            height={3}
            fill={style.headerText}
            opacity={0.55}
            rx={1}
          />
        ))}
      </svg>
    </button>
  );
};

// ── MAIN COMPONENT ─────────────────────────────────────────────
export const FormatAsTableDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const applyTableStyle = (style: TableStyleDef) => {
    CommandDispatcher.dispatch('EXCEL.TABLE.FORMAT_AS_TABLE', { style });
    setOpen(false);
  };

  const Section: React.FC<{ label: string; styles: TableStyleDef[]; cols: number }> = ({ label, styles, cols }) => (
    <div className="flex flex-col gap-1.5">
      <div className="text-[12px] font-semibold text-slate-700 border-b border-slate-200 pb-0.5">{label}</div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, auto)` }}>
        {styles.map(s => (
          <TableStylePreview key={s.id} style={s} onClick={() => applyTableStyle(s)} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen(v => !v)}
        className={`h-[60px] flex flex-col items-center justify-center gap-1 px-2 text-xs font-normal text-slate-700 rounded hover:bg-slate-200 transition-colors ${open ? 'bg-slate-200' : ''}`}
      >
        <Table size={20} className="text-blue-600" />
        <span className="text-center leading-tight">Định dạng<br />dưới dạng Bảng</span>
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute top-full left-0 z-[200] bg-white shadow-xl border border-slate-200 rounded-sm overflow-y-auto"
          style={{ width: 440, maxHeight: 520, marginTop: 2 }}
        >
          <div className="p-3 flex flex-col gap-4">
            <Section label="Nhạt" styles={LIGHT_STYLES} cols={7} />
            <Section label="Trung bình" styles={MEDIUM_STYLES} cols={7} />
            <Section label="Đậm" styles={DARK_STYLES} cols={7} />
          </div>
        </div>
      )}
    </div>
  );
};
