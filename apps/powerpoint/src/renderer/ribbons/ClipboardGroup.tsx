import React from 'react';
import { Button } from '@officex/ui';
import { 
  IconPaste, 
  IconCut, 
  IconCopy, 
  IconFormatPainter, 
  IconTrash 
} from '@officex/icons';

interface ClipboardGroupProps {
  onPaste: () => void;
  onCut: () => void;
  onCopy: () => void;
  onFormatPainter: () => void;
  onDelete: () => void;
  hasSelection: boolean;
  canPaste: boolean;
  isFormatPainterActive?: boolean;
}

export const ClipboardGroup: React.FC<ClipboardGroupProps> = ({
  onPaste,
  onCut,
  onCopy,
  onFormatPainter,
  onDelete,
  hasSelection,
  canPaste,
  isFormatPainterActive = false,
}) => {
  return (
    <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0">
      <div className="flex items-center gap-1">
        {/* Main Paste Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-14 w-12 flex-col gap-1 p-1 hover:bg-muted/80 rounded transition-colors"
          onClick={onPaste}
          title="Dán (Ctrl+V)"
        >
          <IconPaste size={20} className={canPaste ? 'text-orange-600 dark:text-orange-400' : 'text-muted-foreground'} />
          <span className="text-[10px] font-medium leading-none">Dán</span>
        </Button>

        {/* Small Action Buttons */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-muted disabled:opacity-40"
              disabled={!hasSelection}
              onClick={onCut}
              title="Cắt (Ctrl+X)"
            >
              <IconCut size={13} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-muted disabled:opacity-40"
              disabled={!hasSelection}
              onClick={onCopy}
              title="Sao chép (Ctrl+C)"
            >
              <IconCopy size={13} />
            </Button>
          </div>

          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="sm"
              className={`h-6 w-6 p-0 hover:bg-muted ${isFormatPainterActive ? 'bg-orange-100 dark:bg-orange-950 text-orange-600' : ''}`}
              onClick={onFormatPainter}
              title="Format Painter (Sao chép định dạng)"
            >
              <IconFormatPainter size={13} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 disabled:opacity-40"
              disabled={!hasSelection}
              onClick={onDelete}
              title="Xóa đối tượng (Delete)"
            >
              <IconTrash size={13} />
            </Button>
          </div>
        </div>
      </div>

      <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
        Bảng tạm
      </span>
    </div>
  );
};
