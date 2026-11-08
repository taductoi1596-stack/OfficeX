import React from 'react';
import { Button } from '@officex/ui';
import { 
  IconUndo, 
  IconRedo, 
  IconSparkles,
  IconMore
} from '@officex/icons';
import { ShapeType, ShapeFormat, SlideLayout } from '@officex/presentation-core';
import { ClipboardGroup } from './ribbons/ClipboardGroup';
import { SlidesGroup } from './ribbons/SlidesGroup';
import { FontGroup } from './ribbons/FontGroup';
import { ParagraphGroup } from './ribbons/ParagraphGroup';
import { DrawingGroup } from './ribbons/DrawingGroup';
import { EditingGroup } from './ribbons/EditingGroup';
import { VoiceGroup } from './ribbons/VoiceGroup';

interface HomeRibbonProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  onPaste: () => void;
  onCut: () => void;
  onCopy: () => void;
  onFormatPainter: () => void;
  onDeleteSelected: () => void;
  hasShapeSelection: boolean;
  canPaste: boolean;
  isFormatPainterActive?: boolean;

  onNewSlide: (layout?: SlideLayout) => void;
  onChangeLayout: (layout: SlideLayout) => void;
  onDuplicateSlide: () => void;
  onDeleteSlide: () => void;
  canDeleteSlide: boolean;

  currentFormat: ShapeFormat;
  onFormatChange: (format: Partial<ShapeFormat>) => void;
  onToggleBullets: (bulletChar?: string) => void;
  onToggleNumbering: (numStyle?: string) => void;
  onIndentIncrease: () => void;
  onIndentDecrease: () => void;

  onAddShape: (type: ShapeType) => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;

  onOpenFind: () => void;
  onOpenReplace: () => void;
  onSelectAll: () => void;

  onToggleDictate: (langCode: string) => void;
  isDictating: boolean;
  onToggleReadAloud: () => void;
  isReadingAloud: boolean;
  activeDictateLanguage: string;
  onChangeDictateLanguage: (langCode: string) => void;

  onToggleDesigner: () => void;
  isDesignerOpen: boolean;
}

export const HomeRibbon: React.FC<HomeRibbonProps> = ({
  onUndo,
  onRedo,
  canUndo,
  canRedo,

  onPaste,
  onCut,
  onCopy,
  onFormatPainter,
  onDeleteSelected,
  hasShapeSelection,
  canPaste,
  isFormatPainterActive,

  onNewSlide,
  onChangeLayout,
  onDuplicateSlide,
  onDeleteSlide,
  canDeleteSlide,

  currentFormat,
  onFormatChange,
  onToggleBullets,
  onToggleNumbering,
  onIndentIncrease,
  onIndentDecrease,

  onAddShape,
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack,

  onOpenFind,
  onOpenReplace,
  onSelectAll,

  onToggleDictate,
  isDictating,
  onToggleReadAloud,
  isReadingAloud,
  activeDictateLanguage,
  onChangeDictateLanguage,

  onToggleDesigner,
  isDesignerOpen,
}) => {
  return (
    <div className="h-24 px-3 py-1.5 flex items-stretch gap-3 overflow-visible relative z-30 select-none">
      {/* 0. Undo / Redo Mini Group */}
      <div className="flex flex-col gap-0.5 justify-center border-r border-border pr-2 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          disabled={!canUndo}
          className="h-6 w-6 p-0 hover:bg-muted disabled:opacity-40"
          onClick={onUndo}
          title="Hoàn tác (Ctrl+Z)"
        >
          <IconUndo size={14} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={!canRedo}
          className="h-6 w-6 p-0 hover:bg-muted disabled:opacity-40"
          onClick={onRedo}
          title="Làm lại (Ctrl+Y)"
        >
          <IconRedo size={14} />
        </Button>
      </div>

      {/* 1. Clipboard */}
      <ClipboardGroup
        onPaste={onPaste}
        onCut={onCut}
        onCopy={onCopy}
        onFormatPainter={onFormatPainter}
        onDelete={onDeleteSelected}
        hasSelection={hasShapeSelection}
        canPaste={canPaste}
        isFormatPainterActive={isFormatPainterActive}
      />

      {/* 2. Slides */}
      <SlidesGroup
        onNewSlide={onNewSlide}
        onChangeLayout={onChangeLayout}
        onDuplicateSlide={onDuplicateSlide}
        onDeleteSlide={onDeleteSlide}
        canDeleteSlide={canDeleteSlide}
      />

      {/* 3. Font */}
      <FontGroup
        currentFormat={currentFormat}
        onFormatChange={onFormatChange}
      />

      {/* 4. Paragraph */}
      <ParagraphGroup
        currentFormat={currentFormat}
        onFormatChange={onFormatChange}
        onToggleBullets={onToggleBullets}
        onToggleNumbering={onToggleNumbering}
        onIndentIncrease={onIndentIncrease}
        onIndentDecrease={onIndentDecrease}
      />

      {/* 5. Drawing & Shapes */}
      <DrawingGroup
        onAddShape={onAddShape}
        currentFormat={currentFormat}
        onFormatChange={onFormatChange}
        onBringForward={onBringForward}
        onSendBackward={onSendBackward}
        onBringToFront={onBringToFront}
        onSendToBack={onSendToBack}
        hasSelection={hasShapeSelection}
      />

      {/* 6. Editing (Find/Replace/Select) */}
      <EditingGroup
        onOpenFind={onOpenFind}
        onOpenReplace={onOpenReplace}
        onSelectAll={onSelectAll}
      />

      {/* 7. Voice Dictate & Read Aloud */}
      <VoiceGroup
        onToggleDictate={onToggleDictate}
        isDictating={isDictating}
        onToggleReadAloud={onToggleReadAloud}
        isReadingAloud={isReadingAloud}
        activeLanguage={activeDictateLanguage}
        onChangeLanguage={onChangeDictateLanguage}
      />

      {/* 8. Designer (AI) */}
      <div className="flex flex-col gap-1 pr-1 shrink-0">
        <button
          className={`h-14 px-3 rounded flex flex-col items-center justify-center gap-1 border transition-all ${isDesignerOpen ? 'bg-orange-500 text-white border-orange-600 shadow-sm' : 'bg-background hover:bg-muted border-border hover:border-orange-400'}`}
          onClick={onToggleDesigner}
          title="Mở gợi ý thiết kế thông minh Designer"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <IconSparkles size={18} className={isDesignerOpen ? 'text-white' : 'text-orange-600 dark:text-orange-400'} />
          </div>
          <span className="text-[10px] font-semibold leading-none">Designer</span>
        </button>

        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Thiết kế
        </span>
      </div>
    </div>
  );
};
