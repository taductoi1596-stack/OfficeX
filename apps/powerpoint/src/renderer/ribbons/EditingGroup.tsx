import React from 'react';
import { Button } from '@officex/ui';
import { IconFind, IconReplace, IconSelectAll } from '@officex/icons';

interface EditingGroupProps {
  onOpenFind: () => void;
  onOpenReplace: () => void;
  onSelectAll: () => void;
}

export const EditingGroup: React.FC<EditingGroupProps> = ({
  onOpenFind,
  onOpenReplace,
  onSelectAll,
}) => {
  return (
    <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0">
      <div className="flex flex-col gap-0.5 justify-center">
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-1.5 justify-start text-[10px] hover:bg-muted"
          onClick={onOpenFind}
          title="Tìm kiếm văn bản (Ctrl+F)"
        >
          <IconFind size={11} className="mr-1 text-muted-foreground" />
          <span>Tìm</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-1.5 justify-start text-[10px] hover:bg-muted"
          onClick={onOpenReplace}
          title="Thay thế văn bản (Ctrl+H)"
        >
          <IconReplace size={11} className="mr-1 text-muted-foreground" />
          <span>Thay thế</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-1.5 justify-start text-[10px] hover:bg-muted"
          onClick={onSelectAll}
          title="Chọn tất cả hình (Ctrl+A)"
        >
          <IconSelectAll size={11} className="mr-1 text-muted-foreground" />
          <span>Chọn tất cả</span>
        </Button>
      </div>

      <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
        Chỉnh sửa
      </span>
    </div>
  );
};
