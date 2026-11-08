import React from 'react';
import { RGroup } from '../SharedComponents';
import { LargeButton, SmallButton } from '../insert/InsertRibbonGroups';
import { CommandDispatcher } from '../CommandDispatcher';
import { Dropdown } from '@officex/ui';
import { IconChevronDown } from '@officex/icons';
import { PageNumberModal } from '../insert/PageNumberModal';

const I = {
  PageNumberHash: (p: any) => (
    <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="3" width="14" height="18" rx="2" ry="2"/>
      <g stroke="#3498db" strokeWidth="2" strokeLinecap="round">
        <line x1="9" y1="10" x2="15" y2="10" />
        <line x1="9" y1="14" x2="15" y2="14" />
        <line x1="11.5" y1="8" x2="10.5" y2="16" />
        <line x1="14.5" y1="8" x2="13.5" y2="16" />
      </g>
    </svg>
  ),
  HeaderNav: (p: any) => (
    <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="3" width="14" height="18" rx="2" ry="2"/>
      <line x1="8" y1="7" x2="16" y2="7" stroke="#3498db" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M12 11 l-3 3 m3 -3 l3 3 m-3 -3 v6" stroke="#3498db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  FooterNav: (p: any) => (
    <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="3" width="14" height="18" rx="2" ry="2"/>
      <line x1="8" y1="17" x2="16" y2="17" stroke="#e67e22" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M12 13 l-3 -3 m3 3 l3 -3 m-3 3 v-6" stroke="#e67e22" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  PrevNav: (p: any) => (
    <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 6 l-6 6 l6 6" stroke="#e67e22" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="5" y="4" width="14" height="16" rx="2" ry="2" stroke="#bdc3c7" />
    </svg>
  ),
  NextNav: (p: any) => (
    <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 6 l6 6 l-6 6" stroke="#e67e22" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="5" y="4" width="14" height="16" rx="2" ry="2" stroke="#bdc3c7" />
    </svg>
  ),
  RemoveHeader: (p: any) => (
    <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="3" width="14" height="18" rx="2" ry="2"/>
      <line x1="8" y1="7" x2="16" y2="7" stroke="#3498db" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="16" cy="7" r="4" fill="white" stroke="none" />
      <path d="M14 5 l4 4 m-4 0 l4 -4" stroke="#e74c3c" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  RemoveFooter: (p: any) => (
    <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="3" width="14" height="18" rx="2" ry="2"/>
      <line x1="8" y1="17" x2="16" y2="17" stroke="#e67e22" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="16" cy="17" r="4" fill="white" stroke="none" />
      <path d="M14 15 l4 4 m-4 0 l4 -4" stroke="#e74c3c" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  CloseAction: (p: any) => (
    <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="#e74c3c" stroke="none" />
      <path d="M8 8 l8 8 m-8 0 l8 -8" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
};

const exec = (cmd: string) => CommandDispatcher.dispatch(cmd);

export function HeaderFooterRibbon() {
  const [showPageNumberModal, setShowPageNumberModal] = React.useState(false);
  const [includeTotal, setIncludeTotal] = React.useState(true);

  const pageLabel = includeTotal ? '1/1' : '1';

  const positions = [
    { cmd: 'WORD.INSERT.PAGE_NUMBER.TOP_LEFT',    style: { top: 4, left: 4 } },
    { cmd: 'WORD.INSERT.PAGE_NUMBER.TOP_CENTER',  style: { top: 4, left: '50%', transform: 'translateX(-50%)' } },
    { cmd: 'WORD.INSERT.PAGE_NUMBER.TOP_RIGHT',   style: { top: 4, right: 4 } },
    { cmd: 'WORD.INSERT.PAGE_NUMBER.BOTTOM_LEFT', style: { bottom: 4, left: 4 } },
    { cmd: 'WORD.INSERT.PAGE_NUMBER.BOTTOM_CENTER', style: { bottom: 4, left: '50%', transform: 'translateX(-50%)' } },
    { cmd: 'WORD.INSERT.PAGE_NUMBER.BOTTOM_RIGHT',  style: { bottom: 4, right: 4 } },
  ];

  const pageNumberContent = (
    <div className="w-[228px] p-3 text-slate-700 font-sans">
      <div className="text-[12px] font-semibold text-[#1e3f70] mb-3">
        Thêm vào Đầu trang hoặc Chân trang
      </div>

      {/* 6 page thumbnails */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 10 }}>
        {positions.map((pos, idx) => (
          <div
            key={idx}
            onClick={() => exec(pos.cmd)}
            style={{
              width: 60, height: 76,
              border: '1px solid #ccc',
              background: 'white',
              position: 'relative',
              cursor: 'pointer',
              borderRadius: 1,
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#2b579a')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#ccc')}
          >
            <span style={{
              position: 'absolute',
              fontSize: 9,
              lineHeight: 1,
              color: idx === 2 || idx === 5 ? '#c0392b' : '#2b579a',
              whiteSpace: 'nowrap',
              ...pos.style as any,
            }}>{pageLabel}</span>
          </div>
        ))}
      </div>

      {/* Separator */}
      <div style={{ height: 1, background: '#e2e8f0', margin: '4px 0 8px' }} />

      {/* Bao gồm Số Trang checkbox */}
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, padding: '2px 0', userSelect: 'none' }}>
        <input
          type="checkbox"
          checked={includeTotal}
          onChange={e => setIncludeTotal(e.target.checked)}
          style={{ width: 13, height: 13, cursor: 'pointer', accentColor: '#2b579a' }}
        />
        Bao gồm Số Trang
      </label>

      <div style={{ height: 1, background: '#e2e8f0', margin: '8px 0 6px' }} />

      {/* Manage */}
      <div className="flex items-center gap-3 px-1 py-1.5 hover:bg-slate-100 cursor-pointer text-[13px]" onClick={() => setShowPageNumberModal(true)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 text-slate-600">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        <span>Quản lý số trang</span>
      </div>

      {/* Remove */}
      <div className="flex items-center gap-3 px-1 py-1.5 hover:bg-slate-100 cursor-pointer text-[13px]" onClick={() => exec('WORD.INSERT.PAGE_NUMBER.REMOVE')}>
        <I.RemoveHeader size={16} className="shrink-0" />
        <span>Loại bỏ Số Trang</span>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Số Trang */}
      <RGroup label="Số Trang">
        <div className="flex gap-1 h-full items-center">
          <Dropdown
            trigger={
              <button className="flex flex-col items-center justify-center w-[54px] rounded hover:bg-slate-200 transition-colors px-1 h-[52px] cursor-pointer">
                <I.PageNumberHash size={24} className="text-slate-600 mb-1" />
                <span className="text-[10px] text-slate-700 leading-tight text-center flex items-center gap-0.5">Số Trang <IconChevronDown size={8} className="shrink-0" /></span>
              </button>
            }
          >
            {pageNumberContent}
          </Dropdown>
        </div>
      </RGroup>

      {/* 2. Dẫn hướng */}
      <RGroup label="Dẫn hướng">
        <div className="flex gap-1 h-full items-center">
          <LargeButton icon={I.HeaderNav} label="Đi đến Phần đầu trang" onClick={() => exec('WORD.HEADER_FOOTER.GO_TO_HEADER')} />
          <LargeButton icon={I.FooterNav} label="Đi đến Phần chân trang" onClick={() => exec('WORD.HEADER_FOOTER.GO_TO_FOOTER')} />
          <div className="flex flex-col justify-around h-[52px] w-[60px]">
            <SmallButton icon={I.PrevNav} label="Trước" onClick={() => exec('WORD.HEADER_FOOTER.PREV')} />
            <SmallButton icon={I.NextNav} label="Tiếp" onClick={() => exec('WORD.HEADER_FOOTER.NEXT')} />
          </div>
        </div>
      </RGroup>

      {/* 3. Tùy Chọn */}
      <RGroup label="Tùy Chọn">
        <div className="flex flex-col justify-center gap-1.5 h-full px-2 w-[220px]">
          <label className="flex items-center gap-2 text-[11px] text-slate-700 cursor-pointer">
            <input type="checkbox" className="rounded border-slate-300 w-3 h-3 text-blue-600 focus:ring-blue-500" />
            Khác nhau ở Trang Đầu tiên
          </label>
          <label className="flex items-center gap-2 text-[11px] text-slate-700 cursor-pointer">
            <input type="checkbox" className="rounded border-slate-300 w-3 h-3 text-blue-600 focus:ring-blue-500" />
            Các trang chẵn & lẻ khác nhau
          </label>
        </div>
      </RGroup>

      {/* 4. Loại bỏ */}
      <RGroup label="Loại bỏ">
        <div className="flex gap-1 h-full items-center">
          <LargeButton icon={I.RemoveHeader} label="Loại bỏ tiêu đề" onClick={() => exec('WORD.HEADER_FOOTER.REMOVE_HEADER')} />
          <LargeButton icon={I.RemoveFooter} label="Loại bỏ Chân trang" onClick={() => exec('WORD.HEADER_FOOTER.REMOVE_FOOTER')} />
        </div>
      </RGroup>

      {/* 5. Đóng */}
      <RGroup label="Đóng">
        <div className="flex gap-1 h-full items-center">
          <LargeButton icon={I.CloseAction} label="Đóng Bản xem trước" onClick={() => exec('WORD.HEADER_FOOTER.CLOSE')} />
        </div>
      </RGroup>
      
      {showPageNumberModal && <PageNumberModal onClose={() => setShowPageNumberModal(false)} />}
    </>
  );
}
