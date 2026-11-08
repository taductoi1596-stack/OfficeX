import React, { useState } from 'react';
import { Button, Input } from '@officex/ui';
import { IconFind, IconReplace } from '@officex/icons';

interface FindReplaceDialogProps {
  isOpen: boolean;
  initialMode: 'find' | 'replace';
  onClose: () => void;
  onFind: (query: string) => void;
  onReplace: (query: string, replacement: string, replaceAll: boolean) => void;
}

export const FindReplaceDialog: React.FC<FindReplaceDialogProps> = ({
  isOpen,
  initialMode,
  onClose,
  onFind,
  onReplace,
}) => {
  const [mode, setMode] = useState<'find' | 'replace'>(initialMode);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-150">
      <div className="w-96 bg-background border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-muted/50">
          <div className="flex items-center gap-2">
            {mode === 'find' ? <IconFind size={16} className="text-orange-600" /> : <IconReplace size={16} className="text-orange-600" />}
            <h3 className="text-sm font-semibold">
              {mode === 'find' ? 'Tìm kiếm trong bản trình bày' : 'Thay thế văn bản'}
            </h3>
          </div>
          <button onClick={onClose} className="h-6 w-6 rounded hover:bg-muted text-muted-foreground hover:text-foreground text-sm">
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-border text-xs">
          <button
            className={`flex-1 py-2 font-medium text-center border-b-2 transition-colors ${mode === 'find' ? 'border-orange-500 text-orange-600 font-semibold' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            onClick={() => setMode('find')}
          >
            Tìm kiếm
          </button>
          <button
            className={`flex-1 py-2 font-medium text-center border-b-2 transition-colors ${mode === 'replace' ? 'border-orange-500 text-orange-600 font-semibold' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            onClick={() => setMode('replace')}
          >
            Thay thế
          </button>
        </div>

        {/* Form Inputs */}
        <div className="p-4 flex flex-col gap-3 text-xs">
          <div className="flex flex-col gap-1">
            <label className="text-muted-foreground">Nội dung cần tìm:</label>
            <input
              type="text"
              autoFocus
              className="h-8 px-3 rounded border border-input bg-background focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="Nhập từ khóa..."
              value={findText}
              onChange={e => setFindText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && findText) {
                  onFind(findText);
                }
              }}
            />
          </div>

          {mode === 'replace' && (
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground">Thay thế bằng:</label>
              <input
                type="text"
                className="h-8 px-3 rounded border border-input bg-background focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="Nhập nội dung mới..."
                value={replaceText}
                onChange={e => setReplaceText(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-border bg-muted/30 flex items-center justify-end gap-2 text-xs">
          <Button variant="outline" size="sm" onClick={onClose}>
            Đóng
          </Button>

          {mode === 'find' ? (
            <Button
              variant="default"
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 text-white"
              disabled={!findText.trim()}
              onClick={() => onFind(findText)}
            >
              Tìm tiếp theo
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                disabled={!findText.trim()}
                onClick={() => onReplace(findText, replaceText, false)}
              >
                Thay thế
              </Button>
              <Button
                variant="default"
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white"
                disabled={!findText.trim()}
                onClick={() => onReplace(findText, replaceText, true)}
              >
                Thay thế tất cả
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
