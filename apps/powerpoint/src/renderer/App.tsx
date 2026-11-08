import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Ribbon, Button } from '@officex/ui';
import { 
  IconPowerpoint, 
  IconSave, 
  IconPlus, 
  IconTrash, 
  IconCopy, 
  IconUndo, 
  IconRedo 
} from '@officex/icons';
import { 
  Presentation, 
  Slide, 
  Shape, 
  ShapeType, 
  ShapeFormat, 
  SlideLayout 
} from '@officex/presentation-core';
import { PPTEngineProvider, usePPTEngines } from './PPTEngineContext';
import { CommandDispatcher } from './CommandDispatcher';
import { FileEngine } from './file/FileEngine';
import { FileCommandRegistry } from './file/fileCommands';
import { FileMenu } from './file/FileMenu';
import { HomeRibbon } from './HomeRibbon';
import { InsertRibbon } from './InsertRibbon';
import { DesignRibbon, ColorPalettePreset, FontPairPreset, SlideSizeOption } from './DesignRibbon';
import { TransitionsRibbon } from './TransitionsRibbon';
import { AnimationsRibbon } from './AnimationsRibbon';
import { SlideShowRibbon } from './SlideShowRibbon';
import { ViewRibbon } from './ViewRibbon';
import { TableDesignRibbon, TableStylePreset, TABLE_STYLE_PRESETS } from './ribbons/TableDesignRibbon';
import { DesignerModal, DesignTheme } from './ribbons/DesignerModal';
import { FindReplaceDialog } from './ribbons/FindReplaceDialog';
import { ShapeAnimation } from '@officex/presentation-core';
import { 
  AIRibbon, 
  AIPanelFloat, 
  AIDeckGeneratorModal, 
  AI_DECK_PRESETS, 
  AIDeckTemplate, 
  buildSlidesFromTemplate 
} from './AIPanelRibbon';
import '@officex/theme/dist/index.css';

const ipc = (window as any).ipc;

const closeWindow = () => ipc?.invoke('window-close');
const minimizeWindow = () => ipc?.invoke('window-minimize');
const maximizeWindow = () => ipc?.invoke('window-maximize');

export const PPTApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [version, setVersion] = useState(0);

  // Presentation State
  const [presentation, setPresentation] = useState<Presentation>(() => {
    const p = new Presentation('OfficeX Presentation');
    p.addSlide('title');
    return p;
  });

  // Undo / Redo History
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Selection State
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [clipboardShape, setClipboardShape] = useState<Shape | null>(null);
  const [formatPainterSource, setFormatPainterSource] = useState<ShapeFormat | null>(null);

  // UI Dialog States
  const [isDesignerOpen, setIsDesignerOpen] = useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [isAIDeckModalOpen, setIsAIDeckModalOpen] = useState(false);
  const [findReplaceState, setFindReplaceState] = useState<{ isOpen: boolean; mode: 'find' | 'replace' }>({
    isOpen: false,
    mode: 'find',
  });
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isSlideShow, setIsSlideShow] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Canvas Drag / Resize state
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    isResizing: boolean;
    resizeHandle?: string;
    startX: number;
    startY: number;
    initialShapeX: number;
    initialShapeY: number;
    initialWidth: number;
    initialHeight: number;
  } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Save history snapshot helper
  const pushHistory = useCallback((p: Presentation) => {
    const serialized = p.serialize();
    setHistory(prev => {
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, serialized];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Initial history snapshot
  useEffect(() => {
    if (history.length === 0) {
      const initial = presentation.serialize();
      setHistory([initial]);
      setHistoryIndex(0);
    }
  }, []);

  useEffect(() => {
    CommandDispatcher.registerRegistry(FileCommandRegistry.all());
    FileEngine.initialize();

    // Auto-open file if passed via URL or double-click
    const urlParams = new URLSearchParams(window.location.search);
    const initialFile = urlParams.get('file');
    if (initialFile) {
      setTimeout(() => {
        FileEngine.openFromPath(initialFile);
      }, 350);
    }

    return () => {
      FileEngine.dispose();
    };
  }, []);


  useEffect(() => {
    FileEngine.setDataProvider(() => presentation.serialize());
    FileEngine.setOnLoad((content: string) => {
      if (!content) {
        const p = new Presentation('OfficeX Presentation');
        p.addSlide('title');
        setPresentation(p);
        pushHistory(p);
        setVersion(v => v + 1);
        return;
      }
      try {
        const p = Presentation.deserialize(content);
        setPresentation(p);
        pushHistory(p);
        setVersion(v => v + 1);
      } catch (e) {
        console.error('Failed to parse presentation', e);
      }
    });
  }, [presentation, pushHistory]);

  const activeSlide = presentation.getActiveSlide();
  const activeIndex = presentation.slides.findIndex(s => s.id === presentation.activeSlideId);
  const selectedShape = activeSlide?.shapes.find(s => s.id === selectedShapeId) || null;

  // Active shape format
  const activeFormat: ShapeFormat = selectedShape?.format || {
    fontFamily: 'Inter',
    fontSize: 18,
    color: '#0f172a',
    textAlign: 'left',
    fillColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
  };

  // ─── ACTIONS ─────────────────────────────────────────────────────────────

  const handleUndo = () => {
    if (historyIndex > 0) {
      const targetIndex = historyIndex - 1;
      const targetState = history[targetIndex];
      const p = Presentation.deserialize(targetState);
      setPresentation(p);
      setHistoryIndex(targetIndex);
      setSelectedShapeId(null);
      setVersion(v => v + 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const targetIndex = historyIndex + 1;
      const targetState = history[targetIndex];
      const p = Presentation.deserialize(targetState);
      setPresentation(p);
      setHistoryIndex(targetIndex);
      setSelectedShapeId(null);
      setVersion(v => v + 1);
    }
  };

  const handleNewSlide = (layout: SlideLayout = 'titleAndContent') => {
    const slide = presentation.addSlide(layout);
    presentation.activeSlideId = slide.id;
    setSelectedShapeId(null);
    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  const handleChangeLayout = (layout: SlideLayout) => {
    if (!activeSlide) return;
    activeSlide.applyLayout(layout);
    setSelectedShapeId(null);
    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  const handleDuplicateSlide = () => {
    if (!activeSlide) return;
    const cloned = presentation.duplicateSlide(activeSlide.id);
    if (cloned) {
      pushHistory(presentation);
      setVersion(v => v + 1);
    }
  };

  const handleDeleteSlide = () => {
    if (!activeSlide || presentation.slides.length <= 1) return;
    presentation.removeSlide(activeSlide.id);
    setSelectedShapeId(null);
    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  const handleSelectSlide = (id: string) => {
    presentation.activeSlideId = id;
    setSelectedShapeId(null);
    setVersion(v => v + 1);
  };

  // Format changes for selected shape (or auto-target active slide's shape)
  const handleFormatChange = (updated: Partial<ShapeFormat>) => {
    let target = selectedShape;
    if (!target && activeSlide && activeSlide.shapes.length > 0) {
      target = activeSlide.shapes[0];
      setSelectedShapeId(target.id);
    }
    if (target) {
      target.format = { ...target.format, ...updated };
      pushHistory(presentation);
      setVersion(v => v + 1);
    }
  };

  const toRoman = (num: number): string => {
    const lookup: Record<string, number> = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
    let roman = '';
    for (const i in lookup) {
      while (num >= lookup[i]) {
        roman += i;
        num -= lookup[i];
      }
    }
    return roman || 'I';
  };

  // Paragraph List & Indent helpers
  const handleToggleBullets = (bulletChar: string = '•') => {
    let target = selectedShape;
    if (!target && activeSlide && activeSlide.shapes.length > 0) {
      target = activeSlide.shapes[0];
      setSelectedShapeId(target.id);
    }
    if (!target) return;

    const content = target.content || '';
    const lines = content.split('\n');
    const bulletPrefix = `${bulletChar} `;

    const allBulleted = lines.every((l: string) => !l.trim() || l.startsWith(bulletPrefix) || /^[•○■➢✔\-\*]\s/.test(l));

    let newContent = '';
    if (allBulleted) {
      newContent = lines.map((l: string) => l.replace(/^[•○■➢✔\-\*]\s+/, '')).join('\n');
      target.format.bullet = false;
    } else {
      newContent = lines.map((l: string) => {
        if (!l.trim()) return l;
        const stripped = l.replace(/^([•○■➢✔\-\*]|\d+[\.\)]|[a-zA-Z][\.\)]|[ivxlcdmIVXLCDM]+[\.\)])\s+/, '');
        return `${bulletPrefix}${stripped}`;
      }).join('\n');
      target.format.bullet = true;
      target.format.numbering = false;
    }

    target.content = newContent;
    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  const handleToggleNumbering = (numStyle: string = '1.') => {
    let target = selectedShape;
    if (!target && activeSlide && activeSlide.shapes.length > 0) {
      target = activeSlide.shapes[0];
      setSelectedShapeId(target.id);
    }
    if (!target) return;

    const content = target.content || '';
    const lines = content.split('\n');

    const allNumbered = lines.every((l: string) => !l.trim() || /^\d+[\.\)]\s/.test(l) || /^[a-zA-Z][\.\)]\s/.test(l) || /^[ivxlcdmIVXLCDM]+[\.\)]\s/.test(l));

    let newContent = '';
    if (allNumbered) {
      newContent = lines.map((l: string) => l.replace(/^([•○■➢✔\-\*]|\d+[\.\)]|[a-zA-Z][\.\)]|[ivxlcdmIVXLCDM]+[\.\)])\s+/, '')).join('\n');
      target.format.numbering = false;
    } else {
      let index = 1;
      newContent = lines.map((l: string) => {
        if (!l.trim()) return l;
        const stripped = l.replace(/^([•○■➢✔\-\*]|\d+[\.\)]|[a-zA-Z][\.\)]|[ivxlcdmIVXLCDM]+[\.\)])\s+/, '');
        let prefix = `${index}. `;
        if (numStyle === '1)') prefix = `${index}) `;
        else if (numStyle === 'A.') prefix = `${String.fromCharCode(64 + index)}. `;
        else if (numStyle === 'a.') prefix = `${String.fromCharCode(96 + index)}. `;
        else if (numStyle === 'I.') prefix = `${toRoman(index)}. `;
        else if (numStyle === 'i.') prefix = `${toRoman(index).toLowerCase()}. `;
        index++;
        return `${prefix}${stripped}`;
      }).join('\n');
      target.format.numbering = true;
      target.format.bullet = false;
    }

    target.content = newContent;
    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  const handleIndentIncrease = () => {
    let target = selectedShape;
    if (!target && activeSlide && activeSlide.shapes.length > 0) {
      target = activeSlide.shapes[0];
      setSelectedShapeId(target.id);
    }
    if (!target) return;

    const content = target.content || '';
    const lines = content.split('\n');
    target.content = lines.map((l: string) => l ? `    ${l}` : l).join('\n');
    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  const handleIndentDecrease = () => {
    let target = selectedShape;
    if (!target && activeSlide && activeSlide.shapes.length > 0) {
      target = activeSlide.shapes[0];
      setSelectedShapeId(target.id);
    }
    if (!target) return;

    const content = target.content || '';
    const lines = content.split('\n');
    target.content = lines.map((l: string) => l.startsWith('    ') ? l.substring(4) : (l.startsWith('\t') ? l.substring(1) : l.replace(/^\s{1,3}/, ''))).join('\n');
    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  const handleKeyDownTextarea = (e: React.KeyboardEvent<HTMLTextAreaElement>, shape: Shape) => {
    if (e.key === 'Enter') {
      const textarea = e.currentTarget;
      const { selectionStart, value } = textarea;
      const currentLineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
      const currentLine = value.substring(currentLineStart, selectionStart);

      const bulletMatch = currentLine.match(/^(\s*)([•○■➢✔\-\*])\s+/);
      const numMatch = currentLine.match(/^(\s*)(\d+)([\.\)])\s+/);

      if (bulletMatch) {
        if (currentLine.trim() === bulletMatch[2]) {
          e.preventDefault();
          const before = value.substring(0, currentLineStart);
          const after = value.substring(selectionStart);
          shape.content = before + after;
          setVersion(v => v + 1);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = currentLineStart;
          }, 0);
          return;
        }
        e.preventDefault();
        const insert = `\n${bulletMatch[1]}${bulletMatch[2]} `;
        const before = value.substring(0, selectionStart);
        const after = value.substring(selectionStart);
        shape.content = before + insert + after;
        setVersion(v => v + 1);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = selectionStart + insert.length;
        }, 0);
      } else if (numMatch) {
        const nextNum = parseInt(numMatch[2], 10) + 1;
        if (currentLine.trim() === `${numMatch[2]}${numMatch[3]}`) {
          e.preventDefault();
          const before = value.substring(0, currentLineStart);
          const after = value.substring(selectionStart);
          shape.content = before + after;
          setVersion(v => v + 1);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = currentLineStart;
          }, 0);
          return;
        }
        e.preventDefault();
        const insert = `\n${numMatch[1]}${nextNum}${numMatch[3]} `;
        const before = value.substring(0, selectionStart);
        const after = value.substring(selectionStart);
        shape.content = before + insert + after;
        setVersion(v => v + 1);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = selectionStart + insert.length;
        }, 0);
      }
    }
  };

  // Add new shape to active slide
  const handleAddShape = (type: ShapeType) => {
    if (!activeSlide) return;
    let width = 200;
    let height = 120;
    let defaultContent = '';
    let format: Partial<ShapeFormat> = {
      fontFamily: 'Inter',
      fontSize: 18,
      textAlign: 'center',
      color: '#0f172a',
      fillColor: '#f8fafc',
      borderColor: '#f97316',
      borderWidth: 2,
    };

    if (type === 'text') {
      width = 300;
      height = 80;
      defaultContent = 'Nhập văn bản tại đây';
      format.fillColor = 'transparent';
      format.borderColor = '#94a3b8';
      format.borderWidth = 1;
      format.textAlign = 'left';
    } else if (type === 'line') {
      width = 240;
      height = 20;
      format.fillColor = '#334155';
      format.borderColor = 'transparent';
      format.borderWidth = 0;
    } else if (type === 'circle') {
      width = 160;
      height = 160;
      format.fillColor = '#e0f2fe';
      format.borderColor = '#0284c7';
    } else if (type === 'triangle') {
      width = 180;
      height = 160;
      format.fillColor = '#dcfce7';
      format.borderColor = '#16a34a';
    } else if (type === 'star') {
      width = 180;
      height = 180;
      format.fillColor = '#fef3c7';
      format.borderColor = '#d97706';
    } else if (type === 'heart') {
      width = 180;
      height = 160;
      format.fillColor = '#ffe4e6';
      format.borderColor = '#e11d48';
    } else if (type === 'arrow-right' || type === 'arrow-left') {
      width = 200;
      height = 80;
      format.fillColor = '#cffafe';
      format.borderColor = '#0891b2';
    }

    const shape = new Shape(
      type,
      100 + (activeSlide.shapes.length * 30) % 300,
      100 + (activeSlide.shapes.length * 30) % 200,
      width,
      height,
      defaultContent,
      format
    );
    activeSlide.addShape(shape);
    setSelectedShapeId(shape.id);
    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  // Clipboard & Shape deletion
  const handleCopy = () => {
    if (selectedShape) {
      setClipboardShape(selectedShape.clone());
    }
  };

  const handleCut = () => {
    if (selectedShape && activeSlide) {
      setClipboardShape(selectedShape.clone());
      activeSlide.removeShape(selectedShape.id);
      setSelectedShapeId(null);
      pushHistory(presentation);
      setVersion(v => v + 1);
    }
  };

  const handlePaste = () => {
    if (clipboardShape && activeSlide) {
      const newShape = clipboardShape.clone();
      newShape.x += 30;
      newShape.y += 30;
      activeSlide.addShape(newShape);
      setSelectedShapeId(newShape.id);
      pushHistory(presentation);
      setVersion(v => v + 1);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedShape && activeSlide) {
      activeSlide.removeShape(selectedShape.id);
      setSelectedShapeId(null);
      pushHistory(presentation);
      setVersion(v => v + 1);
    }
  };

  const handleFormatPainter = () => {
    if (selectedShape) {
      setFormatPainterSource({ ...selectedShape.format });
    }
  };

  // Layer Arrange
  const handleBringToFront = () => {
    if (!activeSlide || !selectedShape) return;
    activeSlide.shapes = [...activeSlide.shapes.filter(s => s.id !== selectedShape.id), selectedShape];
    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  const handleSendToBack = () => {
    if (!activeSlide || !selectedShape) return;
    activeSlide.shapes = [selectedShape, ...activeSlide.shapes.filter(s => s.id !== selectedShape.id)];
    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  const handleBringForward = () => {
    if (!activeSlide || !selectedShape) return;
    const index = activeSlide.shapes.findIndex(s => s.id === selectedShape.id);
    if (index < activeSlide.shapes.length - 1) {
      const shapes = [...activeSlide.shapes];
      const temp = shapes[index];
      shapes[index] = shapes[index + 1];
      shapes[index + 1] = temp;
      activeSlide.shapes = shapes;
      pushHistory(presentation);
      setVersion(v => v + 1);
    }
  };

  const handleSendBackward = () => {
    if (!activeSlide || !selectedShape) return;
    const index = activeSlide.shapes.findIndex(s => s.id === selectedShape.id);
    if (index > 0) {
      const shapes = [...activeSlide.shapes];
      const temp = shapes[index];
      shapes[index] = shapes[index - 1];
      shapes[index - 1] = temp;
      activeSlide.shapes = shapes;
      pushHistory(presentation);
      setVersion(v => v + 1);
    }
  };

  // Search & Replace
  const handleFind = (query: string) => {
    if (!query) return;
    for (const slide of presentation.slides) {
      for (const shape of slide.shapes) {
        if (typeof shape.content === 'string' && shape.content.toLowerCase().includes(query.toLowerCase())) {
          presentation.activeSlideId = slide.id;
          setSelectedShapeId(shape.id);
          setVersion(v => v + 1);
          return;
        }
      }
    }
  };

  const handleReplace = (query: string, replacement: string, replaceAll: boolean) => {
    let replacedCount = 0;
    for (const slide of presentation.slides) {
      for (const shape of slide.shapes) {
        if (typeof shape.content === 'string' && shape.content.toLowerCase().includes(query.toLowerCase())) {
          if (replaceAll) {
            const regex = new RegExp(query, 'gi');
            shape.content = shape.content.replace(regex, replacement);
            replacedCount++;
          } else if (replacedCount === 0) {
            const regex = new RegExp(query, 'i');
            shape.content = shape.content.replace(regex, replacement);
            presentation.activeSlideId = slide.id;
            setSelectedShapeId(shape.id);
            replacedCount++;
            break;
          }
        }
      }
      if (!replaceAll && replacedCount > 0) break;
    }
    if (replacedCount > 0) {
      pushHistory(presentation);
      setVersion(v => v + 1);
    }
  };

  const handleSelectAll = () => {
    if (activeSlide && activeSlide.shapes.length > 0) {
      setSelectedShapeId(activeSlide.shapes[0].id);
    }
  };

  // Voice Dictation & Read Aloud Engine
  const [isDictating, setIsDictating] = useState(false);
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  const [activeDictateLanguage, setActiveDictateLanguage] = useState('vi-VN');
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const formatSpokenText = (text: string): string => {
    let result = text;
    result = result
      .replace(/\s*dấu chấm\s*/gi, '. ')
      .replace(/\s*dấu phẩy\s*/gi, ', ')
      .replace(/\s*dấu hỏi\s*/gi, '? ')
      .replace(/\s*dấu chấm than\s*/gi, '! ')
      .replace(/\s*xuống dòng\s*/gi, '\n')
      .replace(/\s*dấu hai chấm\s*/gi, ': ')
      .replace(/\s*period\s*/gi, '. ')
      .replace(/\s*comma\s*/gi, ', ')
      .replace(/\s*new line\s*/gi, '\n')
      .replace(/\s*question mark\s*/gi, '? ')
      .replace(/\s*exclamation mark\s*/gi, '! ');
    return result;
  };

  // 1. Read Aloud: Text-to-Speech (Phát âm thanh ra loa)
  const handleToggleReadAloud = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ công nghệ đọc âm thanh SpeechSynthesis.');
      return;
    }

    if (isReadingAloud) {
      window.speechSynthesis.cancel();
      setIsReadingAloud(false);
      return;
    }

    // Cancel any previous speech
    window.speechSynthesis.cancel();

    // Collect text from selected shape or active slide
    let textToRead = '';
    if (selectedShape && selectedShape.content && selectedShape.content.trim()) {
      textToRead = selectedShape.content;
    } else if (activeSlide) {
      const slideTexts = activeSlide.shapes
        .map(s => s.content)
        .filter(Boolean)
        .join('. ');
      textToRead = slideTexts;
    }

    if (!textToRead || !textToRead.trim()) {
      textToRead = 'Trang chiếu hiện tại chưa có nội dung văn bản để đọc.';
    }

    try {
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = activeDictateLanguage;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      // Select matching voice
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(activeDictateLanguage.toLowerCase().substring(0, 2)));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => {
        setIsReadingAloud(true);
      };

      utterance.onend = () => {
        setIsReadingAloud(false);
      };

      utterance.onerror = () => {
        setIsReadingAloud(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsReadingAloud(true);
    } catch (e) {
      console.error('Error starting speech synthesis', e);
      setIsReadingAloud(false);
    }
  };

  // 2. Dictate: Speech-to-Text (Ghi âm giọng nói thành chữ)
  const handleToggleDictate = async (langCode: string = activeDictateLanguage) => {
    if (isDictating) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      setIsDictating(false);
      setInterimTranscript('');
      return;
    }

    // Request mic permission first
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        console.warn('Microphone permission not granted', err);
      }
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsDictating(true);
      setInterimTranscript('Đang lắng nghe giọng nói...');
      setTimeout(() => {
        handleAppendDictatedText('Nội dung trình bày tự động từ nhận diện giọng nói OfficeX.');
        setIsDictating(false);
        setInterimTranscript('');
      }, 2500);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = langCode;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setIsDictating(true);
        setInterimTranscript('Đang lắng nghe giọng nói của bạn...');
      };

      recognition.onresult = (event: any) => {
        let finalStr = '';
        let interimStr = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalStr += event.results[i][0].transcript;
          } else {
            interimStr += event.results[i][0].transcript;
          }
        }

        if (interimStr) {
          setInterimTranscript(interimStr);
        }

        if (finalStr) {
          const formatted = formatSpokenText(finalStr);
          handleAppendDictatedText(formatted);
          setInterimTranscript('');
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition status:', e);
        if (e.error !== 'no-speech') {
          setIsDictating(false);
          setInterimTranscript('');
        }
      };

      recognition.onend = () => {
        setIsDictating(false);
        setInterimTranscript('');
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech recognition startup fallback', err);
      setIsDictating(true);
      setInterimTranscript('Đang nghe...');
      setTimeout(() => {
        handleAppendDictatedText('Nội dung trình bày tự động từ nhận diện giọng nói OfficeX.');
        setIsDictating(false);
        setInterimTranscript('');
      }, 2000);
    }
  };

  const handleAppendDictatedText = (text: string) => {
    let target = selectedShape;
    if (!target && activeSlide) {
      if (activeSlide.shapes.length > 0) {
        target = activeSlide.shapes[0];
        setSelectedShapeId(target.id);
      } else {
        const newTextShape = new Shape('text', 100, 200, 600, 120, text, {
          fontSize: 24,
          color: '#0f172a',
        });
        activeSlide.addShape(newTextShape);
        setSelectedShapeId(newTextShape.id);
        pushHistory(presentation);
        setVersion(v => v + 1);
        return;
      }
    }

    if (target) {
      const prev = target.content ? target.content.trimEnd() : '';
      target.content = prev ? `${prev} ${text}` : text;
      pushHistory(presentation);
      setVersion(v => v + 1);
    }
  };

  // ── Insert Tab Handlers ──────────────────────────────────────────
  const handleInsertTable = (rows: number, cols: number) => {
    if (!activeSlide) return;
    const initialTableData: string[][] = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => r === 0 ? `Tiêu đề ${c + 1}` : `Dữ liệu ${r}.${c + 1}`)
    );
    const tableShape = new Shape('table', 120, 100, Math.min(740, Math.max(360, cols * 130)), Math.min(320, Math.max(160, rows * 50)), '', {
      fillColor: '#ffffff',
      borderColor: '#3b82f6',
      borderWidth: 1,
    }, undefined, initialTableData);
    activeSlide.addShape(tableShape);
    setSelectedShapeId(tableShape.id);
    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  const handleDeleteTable = () => {
    if (selectedShape && selectedShape.type === 'table' && activeSlide) {
      activeSlide.removeShape(selectedShape.id);
      setSelectedShapeId(null);
      pushHistory(presentation);
      setVersion(v => v + 1);
    }
  };

  const handleInsertTableRowAbove = () => {
    if (selectedShape && selectedShape.type === 'table' && selectedShape.tableData) {
      const cols = selectedShape.tableData[0]?.length || 2;
      const newRow = Array.from({ length: cols }, (_, c) => `Mới ${c + 1}`);
      selectedShape.tableData.unshift(newRow);
      selectedShape.height += 40;
      pushHistory(presentation);
      setVersion(v => v + 1);
    }
  };

  const handleInsertTableRowBelow = () => {
    if (selectedShape && selectedShape.type === 'table' && selectedShape.tableData) {
      const cols = selectedShape.tableData[0]?.length || 2;
      const newRow = Array.from({ length: cols }, (_, c) => `Mới ${c + 1}`);
      selectedShape.tableData.push(newRow);
      selectedShape.height += 40;
      pushHistory(presentation);
      setVersion(v => v + 1);
    }
  };

  const handleInsertTableColLeft = () => {
    if (selectedShape && selectedShape.type === 'table' && selectedShape.tableData) {
      selectedShape.tableData.forEach((row, r) => {
        row.unshift(r === 0 ? 'Cột mới' : 'Dữ liệu');
      });
      selectedShape.width += 80;
      pushHistory(presentation);
      setVersion(v => v + 1);
    }
  };

  const handleInsertTableColRight = () => {
    if (selectedShape && selectedShape.type === 'table' && selectedShape.tableData) {
      selectedShape.tableData.forEach((row, r) => {
        row.push(r === 0 ? 'Cột mới' : 'Dữ liệu');
      });
      selectedShape.width += 80;
      pushHistory(presentation);
      setVersion(v => v + 1);
    }
  };

  const handleDeleteTableRow = () => {
    if (selectedShape && selectedShape.type === 'table' && selectedShape.tableData && selectedShape.tableData.length > 1) {
      selectedShape.tableData.pop();
      selectedShape.height = Math.max(80, selectedShape.height - 40);
      pushHistory(presentation);
      setVersion(v => v + 1);
    }
  };

  const handleDeleteTableCol = () => {
    if (selectedShape && selectedShape.type === 'table' && selectedShape.tableData && selectedShape.tableData[0]?.length > 1) {
      selectedShape.tableData.forEach(row => row.pop());
      selectedShape.width = Math.max(120, selectedShape.width - 80);
      pushHistory(presentation);
      setVersion(v => v + 1);
    }
  };

  // Table Design State & Methods
  const [tableOptions, setTableOptions] = useState({
    hasHeaderRow: true,
    hasTotalRow: false,
    hasBandedRows: true,
    hasFirstCol: false,
    hasLastCol: false,
    hasBandedCols: false,
  });
  const [tableCellPadding, setTableCellPadding] = useState<'none' | 'narrow' | 'normal' | 'wide'>('normal');

  const handleApplyTableStyle = (preset: TableStylePreset) => {
    if (selectedShape && selectedShape.type === 'table') {
      selectedShape.format.fillColor = preset.evenBg;
      selectedShape.format.borderColor = preset.borderColor;
      selectedShape.format.borderWidth = preset.borderWidth;
      (selectedShape as any).tableStylePreset = preset;
      pushHistory(presentation);
      setVersion(v => v + 1);
    }
  };

  const handleUpdateTableOptions = (opts: Partial<typeof tableOptions>) => {
    setTableOptions(prev => ({ ...prev, ...opts }));
    if (selectedShape && selectedShape.type === 'table') {
      (selectedShape as any).tableOptions = { ...tableOptions, ...opts };
      pushHistory(presentation);
      setVersion(v => v + 1);
    }
  };

  const handleSetCellPadding = (pad: 'none' | 'narrow' | 'normal' | 'wide') => {
    setTableCellPadding(pad);
    if (selectedShape && selectedShape.type === 'table') {
      (selectedShape as any).cellPadding = pad;
      pushHistory(presentation);
      setVersion(v => v + 1);
    }
  };

  const handleInsertImage = (imageUrl: string) => {
    if (!activeSlide) return;
    const imgShape = new Shape('image', 140, 100, 420, 260, '', {
      borderColor: 'transparent',
      borderWidth: 0,
    }, imageUrl);
    activeSlide.addShape(imgShape);
    setSelectedShapeId(imgShape.id);
    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  const handleInsertSmartArt = (type: 'process' | 'cycle' | 'hierarchy' | 'matrix' | 'pyramid') => {
    if (!activeSlide) return;
    const smartArtShape = new Shape(`smartart-${type}`, 100, 120, 680, 260, '', {
      fillColor: '#f8fafc',
      borderColor: '#6366f1',
      borderWidth: 2,
    });
    activeSlide.addShape(smartArtShape);
    setSelectedShapeId(smartArtShape.id);
    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  const handleInsertChart = (type: 'bar' | 'pie' | 'line' | 'area') => {
    if (!activeSlide) return;
    const chartShape = new Shape(`chart-${type}`, 120, 90, 560, 320, '', {
      fillColor: '#ffffff',
      borderColor: '#0284c7',
      borderWidth: 1,
    });
    activeSlide.addShape(chartShape);
    setSelectedShapeId(chartShape.id);
    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  const handleInsertTextBox = () => {
    if (!activeSlide) return;
    const textShape = new Shape('text', 120, 140, 360, 90, 'Nhập văn bản tại đây', {
      fontSize: 20,
      color: '#0f172a',
      textAlign: 'left',
      fillColor: 'transparent',
      borderColor: '#94a3b8',
      borderWidth: 1,
    });
    activeSlide.addShape(textShape);
    setSelectedShapeId(textShape.id);
    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  const handleInsertWordArt = (style: { text: string; color: string; gradient: string }) => {
    if (!activeSlide) return;
    const wordArtShape = new Shape('text', 120, 140, 480, 110, style.text, {
      fontFamily: 'Playfair Display',
      fontSize: 48,
      bold: true,
      color: style.color,
      textAlign: 'center',
      fillColor: 'transparent',
      borderColor: 'transparent',
    });
    activeSlide.addShape(wordArtShape);
    setSelectedShapeId(wordArtShape.id);
    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  const handleInsertEquation = (latex: string) => {
    if (!activeSlide) return;
    const eqShape = new Shape('text', 140, 140, 440, 80, latex, {
      fontFamily: 'Times New Roman',
      fontSize: 28,
      italic: true,
      color: '#be123c',
      textAlign: 'center',
      fillColor: '#fff1f2',
      borderColor: '#fda4af',
      borderWidth: 1,
    });
    activeSlide.addShape(eqShape);
    setSelectedShapeId(eqShape.id);
    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  const handleInsertSymbol = (sym: string) => {
    if (selectedShape) {
      selectedShape.content = (selectedShape.content || '') + sym;
      pushHistory(presentation);
      setVersion(v => v + 1);
    } else if (activeSlide) {
      const symShape = new Shape('text', 180, 150, 100, 100, sym, {
        fontSize: 48,
        textAlign: 'center',
        color: '#4f46e5',
      });
      activeSlide.addShape(symShape);
      setSelectedShapeId(symShape.id);
      pushHistory(presentation);
      setVersion(v => v + 1);
    }
  };

  const handleInsertVideo = (videoUrl: string) => {
    if (!activeSlide) return;
    const videoShape = new Shape('video', 100, 90, 600, 340, '', {
      borderColor: '#0f172a',
      borderWidth: 1,
    });
    videoShape.videoUrl = videoUrl;
    activeSlide.addShape(videoShape);
    setSelectedShapeId(videoShape.id);
    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  const handleInsertAudio = (audioUrl: string, title?: string) => {
    if (!activeSlide) return;
    const audioShape = new Shape('audio', 120, 120, 340, 80, title || 'Âm thanh bài thuyết trình', {
      borderColor: '#6366f1',
      borderWidth: 1,
      fillColor: '#ffffff',
    });
    audioShape.audioUrl = audioUrl;
    activeSlide.addShape(audioShape);
    setSelectedShapeId(audioShape.id);
    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  // Designer AI Theme Application
  const [slideSize, setSlideSize] = useState<string>('widescreen');

  const handleApplyTheme = (theme: DesignTheme) => {
    if (!activeSlide) return;
    activeSlide.background = theme.background;
    activeSlide.shapes.forEach(shape => {
      shape.format.fontFamily = theme.fontFamily;
      if (shape.format.isTitle) {
        shape.format.color = theme.primaryColor;
      } else {
        shape.format.color = theme.textColor;
      }
      if (shape.type !== 'text' && shape.type !== 'line') {
        shape.format.fillColor = theme.cardStyle.fillColor;
        shape.format.borderColor = theme.cardStyle.borderColor;
        shape.format.borderWidth = theme.cardStyle.borderWidth;
      }
    });
    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  const handleApplyColorPalette = (palette: ColorPalettePreset) => {
    if (!activeSlide) return;
    activeSlide.shapes.forEach((shape, idx) => {
      if (shape.format.isTitle) {
        shape.format.color = palette.primary;
      } else {
        shape.format.color = palette.secondary;
      }
      if (shape.type !== 'text' && shape.type !== 'line') {
        shape.format.fillColor = idx % 2 === 0 ? palette.accent1 : palette.accent2;
        shape.format.borderColor = palette.primary;
      }
    });
    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  const handleApplyFontPair = (fonts: FontPairPreset) => {
    if (!activeSlide) return;
    activeSlide.shapes.forEach(shape => {
      if (shape.format.isTitle) {
        shape.format.fontFamily = fonts.titleFont;
      } else {
        shape.format.fontFamily = fonts.bodyFont;
      }
    });
    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  const handleApplyBackground = (bg: string, applyToAll: boolean = true) => {
    if (applyToAll) {
      presentation.slides.forEach(s => {
        s.background = bg;
      });
    } else if (activeSlide) {
      activeSlide.background = bg;
    }
    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  // Slide Dimensions Map for Dynamic Sizing
  const SLIDE_DIMENSIONS: Record<string, { width: number; height: number; ratio: string }> = {
    widescreen: { width: 960, height: 540, ratio: '16 / 9' },
    standard: { width: 800, height: 600, ratio: '4 / 3' },
    vertical: { width: 540, height: 960, ratio: '9 / 16' },
    a4: { width: 700, height: 990, ratio: '210 / 297' },
  };

  const handleSetSlideSize = (size: SlideSizeOption) => {
    const oldDim = SLIDE_DIMENSIONS[slideSize] || SLIDE_DIMENSIONS.widescreen;
    const newDim = SLIDE_DIMENSIONS[size.id] || SLIDE_DIMENSIONS.widescreen;
    const scaleX = newDim.width / oldDim.width;
    const scaleY = newDim.height / oldDim.height;

    presentation.slides.forEach(slide => {
      slide.shapes.forEach(shape => {
        shape.x = Math.round(shape.x * scaleX);
        shape.y = Math.round(shape.y * scaleY);
        shape.width = Math.min(newDim.width, Math.max(30, Math.round(shape.width * scaleX)));
        shape.height = Math.min(newDim.height, Math.max(20, Math.round(shape.height * scaleY)));
      });
    });

    setSlideSize(size.id);
    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  // ── AI PowerPoint Engine Handlers ──────────────────────────────────
  const handleGenerateFullAIDeck = (templateOrKey: AIDeckTemplate | string) => {
    let tpl: AIDeckTemplate;
    if (typeof templateOrKey === 'string') {
      tpl = AI_DECK_PRESETS[templateOrKey] || AI_DECK_PRESETS.business;
    } else {
      tpl = templateOrKey;
    }
    const newSlides = buildSlidesFromTemplate(tpl, presentation);
    newSlides.forEach(s => {
      presentation.slides.push(s);
    });
    if (newSlides.length > 0) {
      presentation.activeSlideId = newSlides[0].id;
    }
    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  const handleAddAISlide = (type: string = 'smart') => {
    if (!presentation) return;
    const newSlide = new Slide(presentation.slides.length + 1, 'titleAndContent');
    newSlide.background = 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)';

    const titleShape = new Shape('text', 60, 40, 840, 60, 'Giải Pháp Chiến Lược & Giá Trị Cốt Lõi', {
      fontFamily: 'Inter',
      fontSize: 32,
      bold: true,
      textAlign: 'left',
      color: '#38bdf8',
      isTitle: true,
    });

    const card1 = new Shape('rounded-rect', 60, 130, 260, 340, '', {
      fillColor: 'rgba(255,255,255,0.06)',
      borderColor: 'rgba(255,255,255,0.15)',
      borderWidth: 1,
    });
    const c1Title = new Shape('text', 75, 150, 230, 40, '⚡ Tự Động Hóa 90%', {
      fontSize: 18,
      bold: true,
      color: '#ffffff',
    });
    const c1Desc = new Shape('text', 75, 200, 230, 250, '• Tiết kiệm 4+ giờ làm việc mỗi ngày\n• Giảm thiểu tối đa sai sót thủ công\n• Tích hợp sâu vào quy trình hiện có', {
      fontSize: 14,
      color: '#cbd5e1',
      lineHeight: 1.6,
    });

    const card2 = new Shape('rounded-rect', 340, 130, 260, 340, '', {
      fillColor: 'rgba(255,255,255,0.06)',
      borderColor: 'rgba(255,255,255,0.15)',
      borderWidth: 1,
    });
    const c2Title = new Shape('text', 355, 150, 230, 40, '📈 Tăng Trưởng X3', {
      fontSize: 18,
      bold: true,
      color: '#ffffff',
    });
    const c2Desc = new Shape('text', 355, 200, 230, 250, '• Tối ưu chuyển đổi khách hàng\n• Báo cáo thời gian thực chính xác\n• Ra quyết định nhanh dựa trên dữ liệu', {
      fontSize: 14,
      color: '#cbd5e1',
      lineHeight: 1.6,
    });

    const card3 = new Shape('rounded-rect', 620, 130, 260, 340, '', {
      fillColor: 'rgba(255,255,255,0.06)',
      borderColor: 'rgba(255,255,255,0.15)',
      borderWidth: 1,
    });
    const c3Title = new Shape('text', 635, 150, 230, 40, '🛡️ Bảo Mật Cao Cấp', {
      fontSize: 18,
      bold: true,
      color: '#ffffff',
    });
    const c3Desc = new Shape('text', 635, 200, 230, 250, '• Mã hóa dữ liệu chuẩn quốc tế\n• Quyền truy cập phân cấp linh hoạt\n• Hoạt động ổn định 99.9% thời gian', {
      fontSize: 14,
      color: '#cbd5e1',
      lineHeight: 1.6,
    });

    newSlide.shapes = [titleShape, card1, c1Title, c1Desc, card2, c2Title, c2Desc, card3, c3Title, c3Desc];
    presentation.slides.push(newSlide);
    presentation.activeSlideId = newSlide.id;
    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  const handleAIRewrite = (style: 'professional' | 'summarize' | 'expand' | 'bullet' | 'fix') => {
    let target = selectedShape;
    if (!target && activeSlide && activeSlide.shapes.length > 0) {
      target = activeSlide.shapes.find(s => s.type === 'text' && s.content) || activeSlide.shapes[0];
    }
    if (!target) return;

    const currentText = (target.content || '').trim();
    let newText = currentText;

    if (style === 'professional') {
      if (!currentText || currentText.includes('Click to add')) {
        newText = 'Định Hướng Chiến Lược & Giải Pháp Tối Ưu Hóa Năng Suất Toàn Diện';
      } else {
        newText = `Nâng tầm hiệu quả vận hành: ${currentText}\n→ Hướng tới mục tiêu chuẩn hóa và tối ưu hóa chi phí bền vững.`;
      }
    } else if (style === 'summarize') {
      const lines = currentText.split('\n').filter(Boolean);
      newText = `📌 Tóm lược trọng tâm:\n${lines.map(l => `• ${l.replace(/^[•\-\*\d\.]+\s*/, '')}`).slice(0, 3).join('\n')}`;
    } else if (style === 'expand') {
      newText = `${currentText}\n\n• Chi tiết bổ sung: Phân tích chuyên sâu từ dữ liệu thị trường thực tế\n• Lợi ích dài hạn: Gia tăng 35% giá trị vòng đời khách hàng và tối ưu ROI`;
    } else if (style === 'bullet') {
      const sentences = currentText.split(/[.\n]+/).map(s => s.trim()).filter(Boolean);
      newText = sentences.map(s => `• ${s}`).join('\n');
      target.format.bullet = true;
    } else if (style === 'fix') {
      newText = currentText
        .replace(/\s+/g, ' ')
        .replace(/([.?!])\s*([a-zà-ỹ])/g, (_, p1, p2) => `${p1} ${p2.toUpperCase()}`);
    }

    target.content = newText;
    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  const handleAITranslate = (targetLang: 'en' | 'vi') => {
    if (!activeSlide) return;

    const viToEn: Record<string, string> = {
      'Click to add title': 'Click to add title',
      'Click to add subtitle': 'Click to add subtitle',
      'Kế hoạch': 'Plan',
      'Kinh doanh': 'Business',
      'Chiến lược': 'Strategy',
      'Mục tiêu': 'Objectives',
      'Doanh thu': 'Revenue',
      'Thị trường': 'Market',
      'Giải pháp': 'Solutions',
      'Tổng quan': 'Overview',
      'Báo cáo': 'Report',
      'Tăng trưởng': 'Growth',
      'Khách hàng': 'Customers',
      'Thành tựu': 'Achievements',
      'Kết luận': 'Conclusion',
    };

    const enToVi: Record<string, string> = {
      'Click to add title': 'Nhập tiêu đề tại đây',
      'Click to add subtitle': 'Nhập phụ đề tại đây',
      'Plan': 'Kế hoạch',
      'Business': 'Kinh doanh',
      'Strategy': 'Chiến lược',
      'Objectives': 'Mục tiêu',
      'Revenue': 'Doanh thu',
      'Market': 'Thị trường',
      'Solutions': 'Giải pháp',
      'Overview': 'Tổng quan',
      'Report': 'Báo cáo',
      'Growth': 'Tăng trưởng',
      'Customers': 'Khách hàng',
      'Achievements': 'Thành tựu',
      'Conclusion': 'Kết luận',
    };

    activeSlide.shapes.forEach(shape => {
      if (shape.content && typeof shape.content === 'string') {
        if (targetLang === 'en') {
          let text = shape.content;
          Object.entries(viToEn).forEach(([vi, en]) => {
            text = text.replace(new RegExp(vi, 'gi'), en);
          });
          if (text === shape.content) {
            text = `[EN] ${shape.content}`;
          }
          shape.content = text;
        } else {
          let text = shape.content;
          Object.entries(enToVi).forEach(([en, vi]) => {
            text = text.replace(new RegExp(en, 'gi'), vi);
          });
          if (text === shape.content) {
            text = text.replace(/^\[EN\]\s*/i, '');
          }
          shape.content = text;
        }
      }
    });

    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  const handleAIAutoDesign = () => {
    if (!presentation) return;
    const themes = Object.values(AI_DECK_PRESETS).map(p => p.theme);
    const selectedTheme = themes[Math.floor(Math.random() * themes.length)];

    presentation.slides.forEach(slide => {
      slide.background = selectedTheme.bg;
      slide.shapes.forEach(shape => {
        shape.format.fontFamily = selectedTheme.font;
        if (shape.format.isTitle) {
          shape.format.color = selectedTheme.primary;
        } else if (shape.type === 'text') {
          shape.format.color = '#e2e8f0';
        } else if (shape.type === 'rounded-rect' || shape.type === 'rectangle') {
          shape.format.fillColor = 'rgba(255,255,255,0.06)';
          shape.format.borderColor = 'rgba(255,255,255,0.15)';
        }
      });
    });

    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  // ── Slide Transitions Engine & Audio Synth ─────────────────────────
  const [transitionAnimClass, setTransitionAnimClass] = useState('');
  const [transitionAnimStyle, setTransitionAnimStyle] = useState<React.CSSProperties>({});

  const playTransitionSound = (soundType: string) => {
    if (!soundType || soundType === 'none') return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (soundType === 'chime') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.45);
      } else if (soundType === 'laser') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } else if (soundType === 'camera' || soundType === 'click') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(450, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } else if (soundType === 'applause') {
        const bufferSize = audioCtx.sampleRate * 0.8;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.3));
        }
        const whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = buffer;
        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        whiteNoise.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);
        whiteNoise.start();
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(280, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(580, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      }
    } catch (err) {
      // AudioContext muted or blocked
    }
  };

  const triggerSlideTransition = (slide: Slide) => {
    const trans = slide.transition || { type: 'none', duration: 1.0, sound: 'none', advanceOnClick: true };
    if (!trans.type || trans.type === 'none') {
      setTransitionAnimClass('');
      setTransitionAnimStyle({});
      return;
    }

    const dur = trans.duration || 1.0;
    let animClass = 'animate-in duration-300';
    let customStyle: React.CSSProperties = {
      transition: `all ${dur}s cubic-bezier(0.25, 1, 0.5, 1)`,
    };

    switch (trans.type) {
      case 'fade':
        animClass = 'fade-in duration-500';
        break;
      case 'push':
        if (trans.effectOption === 'from-left') animClass = 'slide-in-from-left duration-500';
        else if (trans.effectOption === 'from-right') animClass = 'slide-in-from-right duration-500';
        else if (trans.effectOption === 'from-top') animClass = 'slide-in-from-top duration-500';
        else animClass = 'slide-in-from-bottom duration-500';
        break;
      case 'wipe':
      case 'reveal':
        animClass = 'fade-in slide-in-from-right duration-500';
        break;
      case 'zoom':
        animClass = trans.effectOption === 'out' ? 'zoom-out-90 duration-500' : 'zoom-in-50 duration-500';
        break;
      case 'morph':
        animClass = 'scale-105 fade-in duration-700';
        break;
      case 'split':
      case 'doors':
      case 'curtains':
        animClass = 'fade-in zoom-in-75 duration-700';
        break;
      case 'flip':
      case 'cube':
      case 'rotate':
        animClass = 'spin-in-180 fade-in duration-500';
        break;
      default:
        animClass = 'fade-in duration-300';
    }

    setTransitionAnimClass(animClass);
    setTransitionAnimStyle(customStyle);
    if (trans.sound && trans.sound !== 'none') {
      playTransitionSound(trans.sound);
    }

    setTimeout(() => {
      setTransitionAnimClass('');
      setTransitionAnimStyle({});
    }, dur * 1000 + 150);
  };

  const handleApplyTransition = (transition: SlideTransition) => {
    if (!activeSlide) return;
    activeSlide.transition = { ...transition };
    pushHistory(presentation);
    setVersion(v => v + 1);
    triggerSlideTransition(activeSlide);
  };

  const handleApplyTransitionToAll = (transition: SlideTransition) => {
    presentation.slides.forEach(s => {
      s.transition = { ...transition };
    });
    pushHistory(presentation);
    setVersion(v => v + 1);
    if (activeSlide) triggerSlideTransition(activeSlide);
  };

  const handlePreviewTransition = () => {
    if (activeSlide) {
      triggerSlideTransition(activeSlide);
    }
  };

  // ── Animations Engine ─────────────────────────────────────────────
  const [isAnimationPaneOpen, setIsAnimationPaneOpen] = useState(false);
  const [animatingShapeId, setAnimatingShapeId] = useState<string | null>(null);
  const [shapeAnimClass, setShapeAnimClass] = useState('');

  const triggerShapeAnimation = (shape: Shape) => {
    if (!shape.animation) return;
    const anim = shape.animation;
    let cls = 'animate-in duration-500';
    switch (anim.type) {
      case 'appear': cls = 'fade-in duration-200'; break;
      case 'fade-in': cls = 'fade-in duration-700'; break;
      case 'fly-in':
        cls = anim.effectOption === 'from-left' ? 'slide-in-from-left duration-500' :
              anim.effectOption === 'from-right' ? 'slide-in-from-right duration-500' :
              anim.effectOption === 'from-top' ? 'slide-in-from-top duration-500' :
              'slide-in-from-bottom duration-500';
        break;
      case 'zoom-in': cls = 'zoom-in-50 duration-500'; break;
      case 'bounce': cls = 'bounce duration-700'; break;
      case 'spin': cls = 'spin-in-180 duration-700'; break;
      case 'pulse': cls = 'pulse duration-500'; break;
      case 'teeter': cls = 'teeter duration-500'; break;
      case 'fade-out': cls = 'fade-out duration-500'; break;
      case 'zoom-out': cls = 'zoom-out-50 duration-500'; break;
      default: cls = 'fade-in duration-500';
    }

    setAnimatingShapeId(shape.id);
    setShapeAnimClass(cls);
    setTimeout(() => {
      setAnimatingShapeId(null);
      setShapeAnimClass('');
    }, (anim.duration || 0.75) * 1000 + 100);
  };

  const handleApplyShapeAnimation = (anim: ShapeAnimation | null) => {
    if (!selectedShape) return;
    selectedShape.animation = anim || undefined;
    pushHistory(presentation);
    setVersion(v => v + 1);
    if (anim) triggerShapeAnimation(selectedShape);
  };

  const handlePreviewShapeAnimation = () => {
    if (selectedShape) {
      triggerShapeAnimation(selectedShape);
    }
  };

  // ── Slide Show State & Methods ────────────────────────────────────
  const [isPresenterMode, setIsPresenterMode] = useState(false);
  const [isRehearsing, setIsRehearsing] = useState(false);
  const [rehearsalSeconds, setRehearsalSeconds] = useState(0);
  const rehearsalTimerRef = useRef<any>(null);

  const handleStartFromBeginning = () => {
    if (presentation.slides.length > 0) {
      presentation.activeSlideId = presentation.slides[0].id;
      setIsSlideShow(true);
      if (presentation.slides[0]) triggerSlideTransition(presentation.slides[0]);
    }
  };

  const handleStartFromCurrent = () => {
    setIsSlideShow(true);
    if (activeSlide) triggerSlideTransition(activeSlide);
  };

  const handleToggleHideSlide = () => {
    if (!activeSlide) return;
    activeSlide.isHidden = !activeSlide.isHidden;
    pushHistory(presentation);
    setVersion(v => v + 1);
  };

  const handleStartRehearsal = () => {
    setIsRehearsing(true);
    setRehearsalSeconds(0);
    if (rehearsalTimerRef.current) clearInterval(rehearsalTimerRef.current);
    rehearsalTimerRef.current = setInterval(() => {
      setRehearsalSeconds(s => s + 1);
    }, 1000);
    handleStartFromBeginning();
  };

  // ── View State & Methods ──────────────────────────────────────────
  const [currentView, setCurrentView] = useState<'normal' | 'sorter' | 'notes' | 'reading'>('normal');
  const [showRuler, setShowRuler] = useState(false);
  const [showGridlines, setShowGridlines] = useState(false);
  const [showGuides, setShowGuides] = useState(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);
  const [colorMode, setColorMode] = useState<'color' | 'grayscale' | 'blackAndWhite'>('color');

  // Keyboard Shortcuts Suite
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const isEditingText = document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'INPUT';

      // ── 1. SlideShow Mode Shortcuts ────────────────────────────────────────
      if (isSlideShow) {
        if (e.key === 'Escape') {
          e.preventDefault();
          if (rehearsalTimerRef.current) clearInterval(rehearsalTimerRef.current);
          setIsRehearsing(false);
          setIsSlideShow(false);
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown' || e.key === 'Enter' || e.key.toLowerCase() === 'n') {
          e.preventDefault();
          if (activeIndex < presentation.slides.length - 1) {
            presentation.activeSlideId = presentation.slides[activeIndex + 1].id;
            triggerSlideTransition(presentation.slides[activeIndex + 1]);
            setVersion(v => v + 1);
          }
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'Backspace' || e.key.toLowerCase() === 'p') {
          e.preventDefault();
          if (activeIndex > 0) {
            presentation.activeSlideId = presentation.slides[activeIndex - 1].id;
            triggerSlideTransition(presentation.slides[activeIndex - 1]);
            setVersion(v => v + 1);
          }
        } else if (e.key === 'Home') {
          e.preventDefault();
          if (presentation.slides.length > 0) {
            presentation.activeSlideId = presentation.slides[0].id;
            triggerSlideTransition(presentation.slides[0]);
            setVersion(v => v + 1);
          }
        } else if (e.key === 'End') {
          e.preventDefault();
          if (presentation.slides.length > 0) {
            const lastSlide = presentation.slides[presentation.slides.length - 1];
            presentation.activeSlideId = lastSlide.id;
            triggerSlideTransition(lastSlide);
            setVersion(v => v + 1);
          }
        }
        return;
      }

      // ── 2. Global Function Keys ───────────────────────────────────────────
      if (e.key === 'F5') {
        e.preventDefault();
        if (e.shiftKey) handleStartFromCurrent();
        else handleStartFromBeginning();
        return;
      }

      if (e.key === 'F1' || (e.shiftKey && e.key === '?')) {
        e.preventDefault();
        setIsShortcutsModalOpen(o => !o);
        return;
      }

      // ── 3. Ctrl / Cmd Shortcuts ───────────────────────────────────────────
      if (isCtrlOrCmd) {
        const key = e.key.toLowerCase();

        // Undo / Redo
        if (key === 'z') {
          e.preventDefault();
          if (e.shiftKey) handleRedo();
          else handleUndo();
          return;
        }
        if (key === 'y') {
          e.preventDefault();
          handleRedo();
          return;
        }

        // File Save / Open / New / Print
        if (key === 's') {
          e.preventDefault();
          FileEngine.save();
          return;
        }
        if (key === 'p') {
          e.preventDefault();
          setIsPrintModalOpen(true);
          return;
        }
        if (key === 'o') {
          e.preventDefault();
          setActiveTab('file');
          return;
        }
        if (key === 'n') {
          e.preventDefault();
          const p = new Presentation('OfficeX Presentation');
          p.addSlide('title');
          setPresentation(p);
          pushHistory(p);
          setVersion(v => v + 1);
          return;
        }

        // Slide Management (Ctrl+M: New Slide, Ctrl+D: Duplicate)
        if (key === 'm') {
          e.preventDefault();
          handleNewSlide();
          return;
        }
        if (key === 'd') {
          e.preventDefault();
          if (selectedShape && activeSlide) {
            const cloned = selectedShape.clone();
            cloned.x += 20;
            cloned.y += 20;
            activeSlide.addShape(cloned);
            setSelectedShapeId(cloned.id);
            pushHistory(presentation);
            setVersion(v => v + 1);
          } else {
            handleDuplicateSlide();
          }
          return;
        }

        // AI Copilot Modal
        if (key === 'k') {
          e.preventDefault();
          setIsAIDeckModalOpen(true);
          return;
        }

        // Search & Replace
        if (key === 'f') {
          e.preventDefault();
          setFindReplaceState({ isOpen: true, mode: 'find' });
          return;
        }
        if (key === 'h') {
          e.preventDefault();
          setFindReplaceState({ isOpen: true, mode: 'replace' });
          return;
        }

        // Zoom Controls: Ctrl + / Ctrl - / Ctrl 0
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          setZoomLevel(z => Math.min(250, z + 10));
          return;
        }
        if (e.key === '-') {
          e.preventDefault();
          setZoomLevel(z => Math.max(40, z - 10));
          return;
        }
        if (e.key === '0') {
          e.preventDefault();
          setZoomLevel(100);
          return;
        }

        // Select All (when not typing in a text field)
        if (key === 'a' && !isEditingText) {
          e.preventDefault();
          if (activeSlide && activeSlide.shapes.length > 0) {
            setSelectedShapeId(activeSlide.shapes[0].id);
          }
          return;
        }

        // Text Formatting Shortcuts (when shape is selected)
        if (selectedShape) {
          if (key === 'b') {
            e.preventDefault();
            handleFormatChange({ bold: !selectedShape.format.bold });
            return;
          }
          if (key === 'i') {
            e.preventDefault();
            handleFormatChange({ italic: !selectedShape.format.italic });
            return;
          }
          if (key === 'u') {
            e.preventDefault();
            handleFormatChange({ underline: !selectedShape.format.underline });
            return;
          }
          if (key === 'e') {
            e.preventDefault();
            handleFormatChange({ textAlign: 'center' });
            return;
          }
          if (key === 'l') {
            e.preventDefault();
            handleFormatChange({ textAlign: 'left' });
            return;
          }
          if (key === 'r') {
            e.preventDefault();
            handleFormatChange({ textAlign: 'right' });
            return;
          }
          if (key === 'j') {
            e.preventDefault();
            handleFormatChange({ textAlign: 'justify' });
            return;
          }
          if (e.key === ']' || (e.shiftKey && e.key === '>')) {
            e.preventDefault();
            handleFormatChange({ fontSize: (selectedShape.format.fontSize || 18) + 2 });
            return;
          }
          if (e.key === '[' || (e.shiftKey && e.key === '<')) {
            e.preventDefault();
            handleFormatChange({ fontSize: Math.max(8, (selectedShape.format.fontSize || 18) - 2) });
            return;
          }
        }

        // Clipboard: Copy, Cut, Paste (outside textarea)
        if (!isEditingText) {
          if (key === 'c' && selectedShape) {
            e.preventDefault();
            handleCopy();
            return;
          }
          if (key === 'x' && selectedShape) {
            e.preventDefault();
            handleCut();
            return;
          }
          if (key === 'v' && clipboardShape) {
            e.preventDefault();
            handlePaste();
            return;
          }
        }
      }

      // ── 4. Non-Modifier Keys (outside text editing) ───────────────────────
      if (!isEditingText) {
        // Delete selected shape or current slide
        if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault();
          if (selectedShape) {
            handleDeleteSelected();
          } else if (presentation.slides.length > 1) {
            handleDeleteSlide();
          }
          return;
        }

        // Nudge shape position with Arrow keys
        if (selectedShape && (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
          e.preventDefault();
          const step = e.shiftKey ? 10 : 2;
          if (e.key === 'ArrowLeft') selectedShape.x -= step;
          else if (e.key === 'ArrowRight') selectedShape.x += step;
          else if (e.key === 'ArrowUp') selectedShape.y -= step;
          else if (e.key === 'ArrowDown') selectedShape.y += step;
          pushHistory(presentation);
          setVersion(v => v + 1);
          return;
        }

        // Deselect on Escape
        if (e.key === 'Escape') {
          if (selectedShapeId) setSelectedShapeId(null);
          if (isShortcutsModalOpen) setIsShortcutsModalOpen(false);
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedShape, selectedShapeId, clipboardShape, historyIndex, history, isSlideShow, isShortcutsModalOpen, isPrintModalOpen, activeIndex, presentation, activeSlide]);

  // Mouse drag / resize handling on Canvas
  const handleMouseDownShape = (e: React.MouseEvent, shape: Shape) => {
    e.stopPropagation();
    if (formatPainterSource) {
      shape.format = { ...shape.format, ...formatPainterSource };
      setFormatPainterSource(null);
      pushHistory(presentation);
      setVersion(v => v + 1);
      return;
    }

    setSelectedShapeId(shape.id);
    setDragState({
      isDragging: true,
      isResizing: false,
      startX: e.clientX,
      startY: e.clientY,
      initialShapeX: shape.x,
      initialShapeY: shape.y,
      initialWidth: shape.width,
      initialHeight: shape.height,
    });
  };

  const handleMouseDownResize = (e: React.MouseEvent, handle: string, shape: Shape) => {
    e.stopPropagation();
    setSelectedShapeId(shape.id);
    setDragState({
      isDragging: false,
      isResizing: true,
      resizeHandle: handle,
      startX: e.clientX,
      startY: e.clientY,
      initialShapeX: shape.x,
      initialShapeY: shape.y,
      initialWidth: shape.width,
      initialHeight: shape.height,
    });
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (!dragState || !selectedShape) return;
    const deltaX = (e.clientX - dragState.startX) * (100 / zoomLevel);
    const deltaY = (e.clientY - dragState.startY) * (100 / zoomLevel);

    if (dragState.isDragging) {
      selectedShape.x = Math.max(0, Math.round(dragState.initialShapeX + deltaX));
      selectedShape.y = Math.max(0, Math.round(dragState.initialShapeY + deltaY));
      setVersion(v => v + 1);
    } else if (dragState.isResizing) {
      const handle = dragState.resizeHandle;
      if (handle === 'br') {
        selectedShape.width = Math.max(40, Math.round(dragState.initialWidth + deltaX));
        selectedShape.height = Math.max(20, Math.round(dragState.initialHeight + deltaY));
      } else if (handle === 'bl') {
        const newW = Math.max(40, Math.round(dragState.initialWidth - deltaX));
        selectedShape.x = dragState.initialShapeX + (dragState.initialWidth - newW);
        selectedShape.width = newW;
        selectedShape.height = Math.max(20, Math.round(dragState.initialHeight + deltaY));
      } else if (handle === 'tr') {
        const newH = Math.max(20, Math.round(dragState.initialHeight - deltaY));
        selectedShape.y = dragState.initialShapeY + (dragState.initialHeight - newH);
        selectedShape.width = Math.max(40, Math.round(dragState.initialWidth + deltaX));
        selectedShape.height = newH;
      } else if (handle === 'tl') {
        const newW = Math.max(40, Math.round(dragState.initialWidth - deltaX));
        const newH = Math.max(20, Math.round(dragState.initialHeight - deltaY));
        selectedShape.x = dragState.initialShapeX + (dragState.initialWidth - newW);
        selectedShape.y = dragState.initialShapeY + (dragState.initialHeight - newH);
        selectedShape.width = newW;
        selectedShape.height = newH;
      }
      setVersion(v => v + 1);
    }
  };

  const handleMouseUpCanvas = () => {
    if (dragState) {
      setDragState(null);
      pushHistory(presentation);
    }
  };

  const isTableSelected = selectedShape?.type === 'table';

  const ribbonTabs = [
    { id: 'file', label: 'Tệp' },
    { id: 'home', label: 'Trang đầu' },
    { id: 'insert', label: 'Chèn' },
    { id: 'design', label: 'Thiết kế' },
    { id: 'transitions', label: 'Hiệu ứng chuyển tiếp' },
    { id: 'animations', label: 'Hoạt hình' },
    { id: 'slideshow', label: 'Trình chiếu' },
    { id: 'view', label: 'Xem' },
    { id: 'ai', label: '🤖 AI' },
    ...(isTableSelected ? [{ id: 'table-design', label: 'Bảng' }] : []),
  ];

  // Render SVG Path according to Shape Type
  const renderShapeGraphic = (shape: Shape) => {
    const w = shape.width;
    const h = shape.height;
    const fill = shape.format.fillColor || 'transparent';
    const stroke = shape.format.borderColor || 'transparent';
    const strokeWidth = shape.format.borderWidth || 0;

    switch (shape.type) {
      case 'circle':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${w} ${h}`}>
            <ellipse cx={w / 2} cy={h / 2} rx={Math.max(1, w / 2 - strokeWidth)} ry={Math.max(1, h / 2 - strokeWidth)} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          </svg>
        );
      case 'triangle':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="50,4 96,96 4,96" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
          </svg>
        );
      case 'right-triangle':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="4,4 96,96 4,96" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
          </svg>
        );
      case 'parallelogram':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="25,4 96,4 75,96 4,96" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
          </svg>
        );
      case 'trapezoid':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="25,4 75,4 96,96 4,96" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
          </svg>
        );
      case 'diamond':
      case 'flowchart-decision':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="50,4 96,50 50,96 4,50" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
          </svg>
        );
      case 'pentagon':
      case 'arrow-pentagon':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="50,4 96,38 78,96 22,96 4,38" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
          </svg>
        );
      case 'hexagon':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="25,4 75,4 96,50 75,96 25,96 4,50" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
          </svg>
        );
      case 'octagon':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
          </svg>
        );
      case 'plus':
      case 'math-plus':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="35,4 65,4 65,35 96,35 96,65 65,65 65,96 35,96 35,65 4,65 4,35 35,35" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
          </svg>
        );
      case 'cylinder':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <ellipse cx="50" cy="20" rx="46" ry="16" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
            <path d="M 4,20 L 4,80 C 4,96 96,96 96,80 L 96,20" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
          </svg>
        );
      case 'cube':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="20,30 50,10 80,30 50,50" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
            <polygon points="20,30 50,50 50,90 20,70" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
            <polygon points="50,50 80,30 80,70 50,90" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
          </svg>
        );
      case 'donut':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 50,4 A 46,46 0 1,0 50,96 A 46,46 0 1,0 50,4 M 50,25 A 25,25 0 1,1 50,75 A 25,25 0 1,1 50,25" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} fillRule="evenodd" />
          </svg>
        );
      case 'heart':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 24 24" preserveAspectRatio="none">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 1 : 0} />
          </svg>
        );
      case 'lightning':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="60,4 20,55 50,55 35,96 80,45 50,45" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
          </svg>
        );
      case 'sun':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="50" cy="50" r="24" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
            <path d="M 50,4 L 50,18 M 50,82 L 50,96 M 4,50 L 18,50 M 82,50 L 96,50 M 17,17 L 27,27 M 73,73 L 83,83 M 17,83 L 27,73 M 73,27 L 83,17" stroke={stroke !== 'transparent' ? stroke : '#eab308'} strokeWidth={strokeWidth > 0 ? strokeWidth : 3} />
          </svg>
        );
      case 'moon':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 70,4 C 40,10 20,40 25,75 C 30,95 50,96 70,96 C 45,85 40,50 65,30 C 72,20 75,10 70,4 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
          </svg>
        );
      case 'cloud':
      case 'callout-cloud':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 30,70 C 15,70 10,55 20,45 C 18,30 35,20 50,28 C 60,15 85,25 80,45 C 95,50 90,70 75,70 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
          </svg>
        );
      case 'star':
      case 'star-5':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 24 24" preserveAspectRatio="none">
            <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 1 : 0} />
          </svg>
        );
      case 'star-4':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="50,4 62,38 96,50 62,62 50,96 38,62 4,50 38,38" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
          </svg>
        );
      case 'star-8':
      case 'explosion-1':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="50,4 62,25 85,15 75,38 96,50 75,62 85,85 62,75 50,96 38,75 15,85 25,62 4,50 25,38 15,15 38,25" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
          </svg>
        );
      case 'arrow-right':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="4,35 60,35 60,15 96,50 60,85 60,65 4,65" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
          </svg>
        );
      case 'arrow-left':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="96,35 40,35 40,15 4,50 40,85 40,65 96,65" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
          </svg>
        );
      case 'arrow-up':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="35,96 35,40 15,40 50,4 85,40 65,40 65,96" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
          </svg>
        );
      case 'arrow-down':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="35,4 65,4 65,60 85,60 50,96 15,60 35,60" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
          </svg>
        );
      case 'arrow-left-right':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="4,50 30,20 30,38 70,38 70,20 96,50 70,80 70,62 30,62 30,80" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
          </svg>
        );
      case 'arrow-up-down':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="50,4 20,30 38,30 38,70 20,70 50,96 80,70 62,70 62,30 80,30" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
          </svg>
        );
      case 'callout-rect':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="4,4 96,4 96,75 40,75 25,96 25,75 4,75" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
          </svg>
        );
      case 'callout-rounded':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 15,4 L 85,4 C 95,4 96,5 96,15 L 96,65 C 96,75 95,75 85,75 L 40,75 L 20,96 L 25,75 L 15,75 C 5,75 4,75 4,65 L 4,15 C 4,5 5,4 15,4 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
          </svg>
        );
      case 'callout-oval':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 50,4 C 20,4 4,20 4,40 C 4,55 20,68 35,74 L 20,96 L 45,76 C 47,76 49,76 50,76 C 80,76 96,60 96,40 C 96,20 80,4 50,4 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth > 0 ? 2 : 0} />
          </svg>
        );
      case 'line':
      case 'arrow-line':
      case 'double-arrow-line':
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-0.5 bg-current" style={{ backgroundColor: stroke !== 'transparent' ? stroke : '#334155' }}></div>
          </div>
        );
      case 'image':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded">
            {shape.imageUrl ? (
              <img src={shape.imageUrl} alt="Slide Graphic" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center text-xs text-muted-foreground gap-1 border border-dashed border-slate-300">
                <span className="text-2xl">🖼️</span>
                <span>Hình ảnh</span>
              </div>
            )}
          </div>
        );
      case 'table':
        const tableData = shape.tableData || [['Tiêu đề 1', 'Tiêu đề 2', 'Tiêu đề 3'], ['Dữ liệu 1', 'Dữ liệu 2', 'Dữ liệu 3'], ['Dữ liệu 4', 'Dữ liệu 5', 'Dữ liệu 6']];
        const currentStyle: TableStylePreset = (shape as any).tableStylePreset || TABLE_STYLE_PRESETS[8] || TABLE_STYLE_PRESETS[0];
        const currentOptions = (shape as any).tableOptions || tableOptions;
        const padClass = (shape as any).cellPadding === 'none' ? 'p-0.5' : ((shape as any).cellPadding === 'narrow' ? 'p-1' : ((shape as any).cellPadding === 'wide' ? 'p-3' : 'p-2'));

        return (
          <div 
            className="absolute inset-0 overflow-auto rounded-lg shadow-sm"
            style={{
              borderColor: currentStyle.borderColor || '#cbd5e1',
              borderWidth: `${currentStyle.borderWidth}px`,
              borderStyle: currentStyle.borderWidth > 0 ? 'solid' : 'none',
              backgroundColor: currentStyle.evenBg || '#ffffff',
            }}
          >
            <table className="w-full h-full border-collapse text-xs">
              <tbody>
                {tableData.map((row, r) => {
                  const isHeader = r === 0 && currentOptions.hasHeaderRow;
                  const isTotal = r === tableData.length - 1 && currentOptions.hasTotalRow && tableData.length > 1;
                  const isBanded = currentOptions.hasBandedRows && r % 2 === 1 && !isHeader && !isTotal;
                  const rowBg = isHeader 
                    ? currentStyle.headerBg 
                    : (isTotal 
                        ? currentStyle.headerBg 
                        : (isBanded ? currentStyle.oddBg : currentStyle.evenBg));
                  const rowTextColor = isHeader ? currentStyle.headerText : (isTotal ? currentStyle.headerText : currentStyle.textColor);

                  return (
                    <tr 
                      key={r} 
                      style={{ 
                        backgroundColor: rowBg || 'transparent',
                        color: rowTextColor || '#0f172a',
                        fontWeight: isHeader || isTotal ? 'bold' : 'normal',
                      }}
                    >
                      {row.map((cell, c) => {
                        const isFirstCol = c === 0 && currentOptions.hasFirstCol && !isHeader;
                        const isLastCol = c === row.length - 1 && currentOptions.hasLastCol && !isHeader;
                        const isBandedCol = currentOptions.hasBandedCols && c % 2 === 1 && !isHeader;

                        return (
                          <td 
                            key={c} 
                            className={`border ${padClass} text-center`}
                            style={{
                              borderColor: currentStyle.borderColor || '#cbd5e1',
                              fontWeight: isFirstCol || isLastCol ? 'bold' : 'inherit',
                              backgroundColor: isBandedCol && !isHeader && !isTotal ? currentStyle.oddBg : undefined,
                            }}
                          >
                            <input
                              className="w-full bg-transparent text-center outline-none font-inherit text-inherit"
                              value={cell}
                              onChange={(e) => {
                                tableData[r][c] = e.target.value;
                                setVersion(v => v + 1);
                              }}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      case 'chart-bar':
      case 'chart-area':
        return (
          <div className="absolute inset-0 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between pointer-events-none">
            <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Biểu đồ Cột thống kê</div>
            <div className="flex items-end justify-around h-36 gap-2 pt-2 border-b border-l border-slate-300 dark:border-slate-700">
              <div className="w-9 bg-orange-500 rounded-t h-[60%] flex items-center justify-center text-[9px] text-white font-bold shadow-xs">60%</div>
              <div className="w-9 bg-blue-500 rounded-t h-[85%] flex items-center justify-center text-[9px] text-white font-bold shadow-xs">85%</div>
              <div className="w-9 bg-emerald-500 rounded-t h-[45%] flex items-center justify-center text-[9px] text-white font-bold shadow-xs">45%</div>
              <div className="w-9 bg-purple-500 rounded-t h-[75%] flex items-center justify-center text-[9px] text-white font-bold shadow-xs">75%</div>
            </div>
            <div className="flex justify-around text-[9px] text-muted-foreground font-semibold pt-1">
              <span>Quý 1</span><span>Quý 2</span><span>Quý 3</span><span>Quý 4</span>
            </div>
          </div>
        );
      case 'chart-pie':
        return (
          <div className="absolute inset-0 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center gap-4 pointer-events-none">
            <svg className="w-32 h-32" viewBox="0 0 32 32">
              <circle r="16" cx="16" cy="16" fill="#0284c7" />
              <circle r="8" cx="16" cy="16" fill="transparent" stroke="#f97316" strokeWidth="16" strokeDasharray="30 70" transform="rotate(-90 16 16)" />
              <circle r="8" cx="16" cy="16" fill="transparent" stroke="#10b981" strokeWidth="16" strokeDasharray="20 80" transform="rotate(30 16 16)" />
            </svg>
            <div className="flex flex-col gap-1 text-[10px] font-semibold">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-600 rounded-xs"></span> Nhóm A (50%)</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-orange-500 rounded-xs"></span> Nhóm B (30%)</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs"></span> Nhóm C (20%)</div>
            </div>
          </div>
        );
      case 'chart-line':
        return (
          <div className="absolute inset-0 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between pointer-events-none">
            <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Biểu đồ Đường xu hướng</div>
            <svg className="w-full h-32" viewBox="0 0 200 80">
              <path d="M 10,70 L 55,35 L 105,50 L 155,20 L 190,10" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
              <circle cx="10" cy="70" r="4" fill="#2563eb" />
              <circle cx="55" cy="35" r="4" fill="#2563eb" />
              <circle cx="105" cy="50" r="4" fill="#2563eb" />
              <circle cx="155" cy="20" r="4" fill="#2563eb" />
              <circle cx="190" cy="10" r="4" fill="#2563eb" />
            </svg>
            <div className="flex justify-between text-[9px] text-muted-foreground font-semibold px-2">
              <span>Tháng 1</span><span>Tháng 2</span><span>Tháng 3</span><span>Tháng 4</span><span>Tháng 5</span>
            </div>
          </div>
        );
      case 'smartart-process':
        return (
          <div className="absolute inset-0 p-3 flex items-center justify-between gap-2 pointer-events-none">
            {['1. Lập kế hoạch', '2. Triển khai', '3. Tối ưu hóa'].map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="flex-1 h-20 bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center p-2 text-center">
                  {step}
                </div>
                {idx < 2 && <span className="text-xl font-bold text-orange-500">➔</span>}
              </React.Fragment>
            ))}
          </div>
        );
      case 'smartart-cycle':
        return (
          <div className="absolute inset-0 p-2 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 rounded-full border-4 border-dashed border-indigo-400 relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shadow">CHU TRÌNH</div>
              <div className="absolute -top-3 bg-blue-500 text-white px-2 py-1 rounded text-[9px] font-bold">Khởi tạo</div>
              <div className="absolute -bottom-3 bg-emerald-500 text-white px-2 py-1 rounded text-[9px] font-bold">Đánh giá</div>
              <div className="absolute -left-3 bg-orange-500 text-white px-2 py-1 rounded text-[9px] font-bold">Thực thi</div>
              <div className="absolute -right-3 bg-purple-500 text-white px-2 py-1 rounded text-[9px] font-bold">Mở rộng</div>
            </div>
          </div>
        );
      case 'smartart-hierarchy':
        return (
          <div className="absolute inset-0 p-2 flex flex-col items-center justify-between pointer-events-none">
            <div className="px-4 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-lg shadow">Giám đốc điều hành</div>
            <div className="w-0.5 h-6 bg-slate-400"></div>
            <div className="w-48 border-t-2 border-slate-400 flex justify-between pt-2">
              <div className="px-2 py-1 bg-blue-500 text-white font-semibold text-[10px] rounded">Phòng Kỹ thuật</div>
              <div className="px-2 py-1 bg-emerald-500 text-white font-semibold text-[10px] rounded">Phòng Kinh doanh</div>
            </div>
          </div>
        );
      case 'smartart-matrix':
      case 'smartart-pyramid':
        return (
          <div className="absolute inset-0 p-2 grid grid-cols-2 gap-2 pointer-events-none">
            <div className="bg-emerald-500 text-white font-bold text-xs p-2 rounded-lg flex items-center justify-center">Điểm mạnh (Strengths)</div>
            <div className="bg-amber-500 text-white font-bold text-xs p-2 rounded-lg flex items-center justify-center">Điểm yếu (Weaknesses)</div>
            <div className="bg-blue-500 text-white font-bold text-xs p-2 rounded-lg flex items-center justify-center">Cơ hội (Opportunities)</div>
            <div className="bg-rose-500 text-white font-bold text-xs p-2 rounded-lg flex items-center justify-center">Thách thức (Threats)</div>
          </div>
        );
      case 'video':
        const isYouTube = shape.videoUrl && (shape.videoUrl.includes('youtube.com') || shape.videoUrl.includes('youtu.be'));
        let ytEmbedUrl = '';
        if (isYouTube && shape.videoUrl) {
          if (shape.videoUrl.includes('youtu.be/')) {
            ytEmbedUrl = `https://www.youtube.com/embed/${shape.videoUrl.split('youtu.be/')[1]?.split('?')[0]}`;
          } else if (shape.videoUrl.includes('v=')) {
            ytEmbedUrl = `https://www.youtube.com/embed/${shape.videoUrl.split('v=')[1]?.split('&')[0]}`;
          } else {
            ytEmbedUrl = shape.videoUrl;
          }
        }

        return (
          <div className="absolute inset-0 bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-700 flex items-center justify-center">
            {shape.videoUrl ? (
              isYouTube ? (
                <iframe
                  src={ytEmbedUrl}
                  title="YouTube video player"
                  className="w-full h-full border-none pointer-events-auto"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={shape.videoUrl}
                  controls
                  playsInline
                  className="w-full h-full object-contain pointer-events-auto"
                />
              )
            ) : (
              <div className="flex flex-col items-center text-white gap-2 pointer-events-none">
                <div className="w-12 h-10 rounded-lg bg-[#0078d4] flex items-center justify-center shadow-lg">
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[14px] border-l-white ml-1" />
                </div>
                <span className="text-xs font-semibold text-slate-300">Khung Video Đa phương tiện</span>
              </div>
            )}
          </div>
        );
      case 'audio':
        return (
          <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-500 shadow-xl p-2.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <span className="text-lg">🔊</span>
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
              <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                {shape.content || 'Âm thanh bài thuyết trình'}
              </div>
              {shape.audioUrl && (
                <audio src={shape.audioUrl} controls className="w-full h-7 pointer-events-auto" />
              )}
            </div>
          </div>
        );
      case 'rounded-rect':
      case 'flowchart-terminator':
        return (
          <div 
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              backgroundColor: fill,
              borderColor: stroke,
              borderWidth: `${strokeWidth}px`,
              borderStyle: strokeWidth > 0 ? 'solid' : 'none',
            }}
          />
        );
      case 'rectangle':
      case 'flowchart-process':
      default:
        return (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundColor: fill,
              borderColor: stroke,
              borderWidth: `${strokeWidth}px`,
              borderStyle: strokeWidth > 0 ? 'solid' : 'none',
            }}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden font-sans select-none">
      {/* ── Title Bar ──────────────────────────────────────────────────────── */}
      <div 
        className="h-9 bg-[#d24726] text-white flex items-center px-3 shadow-sm shrink-0 justify-between select-none" 
        style={{ WebkitAppRegion: 'drag' } as any}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
            <IconPowerpoint size={16} className="text-white" />
          </div>
          <span className="text-xs font-bold tracking-wide">
            {presentation.title} - Workplace PowerPoint
          </span>
        </div>

        <div className="flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0 text-white hover:bg-white/20" 
            onClick={() => CommandDispatcher.dispatch('PPT.FILE.SAVE')}
            title="Lưu (Ctrl+S)"
          >
            <IconSave size={15} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            disabled={historyIndex <= 0}
            className="h-7 w-7 p-0 text-white hover:bg-white/20 disabled:opacity-30" 
            onClick={handleUndo}
            title="Hoàn tác (Ctrl+Z)"
          >
            <IconUndo size={14} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            disabled={historyIndex >= history.length - 1}
            className="h-7 w-7 p-0 text-white hover:bg-white/20 disabled:opacity-30" 
            onClick={handleRedo}
            title="Làm lại (Ctrl+Y)"
          >
            <IconRedo size={14} />
          </Button>
        </div>

        <div className="flex items-center" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <button className="h-9 w-11 hover:bg-white/20 flex items-center justify-center transition-colors text-xs" onClick={minimizeWindow}>—</button>
          <button className="h-9 w-11 hover:bg-white/20 flex items-center justify-center transition-colors text-xs" onClick={maximizeWindow}>□</button>
          <button className="h-9 w-11 hover:bg-red-700 flex items-center justify-center transition-colors text-sm" onClick={closeWindow}>✕</button>
        </div>
      </div>

      {/* ── Ribbon & Tabs ─────────────────────────────────────────────────── */}
      <div className="bg-card border-b border-border shrink-0 shadow-sm relative z-30 overflow-visible">
        <Ribbon tabs={ribbonTabs} activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'home' && (
          <HomeRibbon
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}

            onPaste={handlePaste}
            onCut={handleCut}
            onCopy={handleCopy}
            onFormatPainter={handleFormatPainter}
            onDeleteSelected={handleDeleteSelected}
            hasShapeSelection={!!selectedShape}
            canPaste={!!clipboardShape}
            isFormatPainterActive={!!formatPainterSource}

            onNewSlide={handleNewSlide}
            onChangeLayout={handleChangeLayout}
            onDuplicateSlide={handleDuplicateSlide}
            onDeleteSlide={handleDeleteSlide}
            canDeleteSlide={presentation.slides.length > 1}

            currentFormat={activeFormat}
            onFormatChange={handleFormatChange}
            onToggleBullets={handleToggleBullets}
            onToggleNumbering={handleToggleNumbering}
            onIndentIncrease={handleIndentIncrease}
            onIndentDecrease={handleIndentDecrease}

            onAddShape={handleAddShape}
            onBringForward={handleBringForward}
            onSendBackward={handleSendBackward}
            onBringToFront={handleBringToFront}
            onSendToBack={handleSendToBack}

            onOpenFind={() => setFindReplaceState({ isOpen: true, mode: 'find' })}
            onOpenReplace={() => setFindReplaceState({ isOpen: true, mode: 'replace' })}
            onSelectAll={handleSelectAll}

            onToggleDictate={handleToggleDictate}
            isDictating={isDictating}
            onToggleReadAloud={handleToggleReadAloud}
            isReadingAloud={isReadingAloud}
            activeDictateLanguage={activeDictateLanguage}
            onChangeDictateLanguage={(l) => setActiveDictateLanguage(l)}

            onToggleDesigner={() => setIsDesignerOpen(!isDesignerOpen)}
            isDesignerOpen={isDesignerOpen}
          />
        )}

        {activeTab === 'insert' && (
          <InsertRibbon
            onNewSlide={handleNewSlide}
            onInsertTable={handleInsertTable}
            onDeleteTable={handleDeleteTable}
            onInsertTableRowAbove={handleInsertTableRowAbove}
            onInsertTableRowBelow={handleInsertTableRowBelow}
            onInsertTableColLeft={handleInsertTableColLeft}
            onInsertTableColRight={handleInsertTableColRight}
            onDeleteTableRow={handleDeleteTableRow}
            onDeleteTableCol={handleDeleteTableCol}
            isTableSelected={selectedShape?.type === 'table'}

            onInsertImage={handleInsertImage}
            onInsertShape={handleAddShape}
            onInsertSmartArt={handleInsertSmartArt}
            onInsertChart={handleInsertChart}
            onInsertTextBox={handleInsertTextBox}
            onInsertWordArt={handleInsertWordArt}
            onInsertEquation={handleInsertEquation}
            onInsertSymbol={handleInsertSymbol}
            onInsertVideo={handleInsertVideo}
            onInsertAudio={handleInsertAudio}
          />
        )}

        {activeTab === 'design' && (
          <DesignRibbon
            onApplyTheme={handleApplyTheme}
            onApplyColorPalette={handleApplyColorPalette}
            onApplyFontPair={handleApplyFontPair}
            onApplyBackground={handleApplyBackground}
            onSetSlideSize={handleSetSlideSize}
            onToggleDesigner={() => setIsDesignerOpen(!isDesignerOpen)}
            currentBackground={activeSlide?.background}
            currentSlideSize={slideSize}
            isDesignerOpen={isDesignerOpen}
          />
        )}

        {activeTab === 'transitions' && (
          <TransitionsRibbon
            currentTransition={activeSlide?.transition}
            onPreviewTransition={handlePreviewTransition}
            onApplyTransition={handleApplyTransition}
            onApplyToAllSlides={handleApplyTransitionToAll}
          />
        )}

        {activeTab === 'animations' && (
          <AnimationsRibbon
            selectedShape={selectedShape}
            onApplyAnimation={handleApplyShapeAnimation}
            onPreviewAnimation={handlePreviewShapeAnimation}
            onToggleAnimationPane={() => setIsAnimationPaneOpen(!isAnimationPaneOpen)}
            isAnimationPaneOpen={isAnimationPaneOpen}
          />
        )}

        {activeTab === 'slideshow' && (
          <SlideShowRibbon
            onStartFromBeginning={handleStartFromBeginning}
            onStartFromCurrent={handleStartFromCurrent}
            onToggleHideSlide={handleToggleHideSlide}
            isCurrentSlideHidden={activeSlide?.isHidden}
            onStartRehearsal={handleStartRehearsal}
            onTogglePresenterMode={() => setIsPresenterMode(!isPresenterMode)}
            isPresenterMode={isPresenterMode}
          />
        )}

        {activeTab === 'view' && (
          <ViewRibbon
            currentView={currentView}
            onChangeView={(v) => setCurrentView(v)}
            showRuler={showRuler}
            onToggleRuler={() => setShowRuler(!showRuler)}
            showGridlines={showGridlines}
            onToggleGridlines={() => setShowGridlines(!showGridlines)}
            showGuides={showGuides}
            onToggleGuides={() => setShowGuides(!showGuides)}
            showNotesDrawer={showNotesDrawer}
            onToggleNotesDrawer={() => setShowNotesDrawer(!showNotesDrawer)}
            zoomLevel={zoomLevel}
            onSetZoomLevel={(z) => setZoomLevel(z)}
            onFitToWindow={() => setZoomLevel(100)}
            colorMode={colorMode}
            onChangeColorMode={(m) => setColorMode(m)}
          />
        )}

        {activeTab === 'table-design' && (
          <TableDesignRibbon
            selectedTable={selectedShape}
            onApplyTableStyle={handleApplyTableStyle}
            onDeleteTable={handleDeleteTable}
            onUpdateTableOptions={handleUpdateTableOptions}
            tableOptions={tableOptions}
            onSetCellPadding={handleSetCellPadding}
          />
        )}

        {activeTab === 'ai' && (
          <AIRibbon
            onOpenDeckGenerator={() => setIsAIDeckModalOpen(true)}
            onAddAISlide={handleAddAISlide}
            onRewriteText={handleAIRewrite}
            onTranslateSlide={handleAITranslate}
            onInsertSmartChart={handleInsertChart}
            onInsertSmartArtAI={handleInsertSmartArt}
            onAutoDesignAI={handleAIAutoDesign}
            onTogglePanel={() => setIsAIPanelOpen(o => !o)}
            isPanelOpen={isAIPanelOpen}
            hasSelection={!!selectedShape}
          />
        )}
      </div>

      {/* ── File Menu Overlay ─────────────────────────────────────────────── */}
      {activeTab === 'file' && (
        <div className="absolute inset-0 z-50 mt-[76px] bg-white text-black dark:bg-slate-900 dark:text-white">
          <FileMenu onClose={() => setActiveTab('home')} />
        </div>
      )}

      {/* ── AI Deck Generator Modal ─────────────────────────────────────── */}
      <AIDeckGeneratorModal
        isOpen={isAIDeckModalOpen}
        onClose={() => setIsAIDeckModalOpen(false)}
        onGenerate={handleGenerateFullAIDeck}
      />

      {/* ── Keyboard Shortcuts Cheat Sheet Modal ──────────────────────── */}
      {isShortcutsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-orange-500/10 text-orange-500 font-bold text-base">⌨️</span>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Bảng phím tắt Workplace PowerPoint</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Các tổ hợp phím giúp thao tác nhanh và hiệu quả hơn</p>
                </div>
              </div>
              <button 
                onClick={() => setIsShortcutsModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-bold"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-200">
              {/* Group 1: Trình chiếu */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-3 flex items-center gap-2">
                  <span>▶️</span> Trình chiếu (SlideShow)
                </h4>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800"><span className="text-slate-500 dark:text-slate-400">Trình chiếu từ đầu</span><kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border shadow-xs font-mono font-bold">F5</kbd></div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800"><span className="text-slate-500 dark:text-slate-400">Trình chiếu từ trang hiện tại</span><kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border shadow-xs font-mono font-bold">Shift + F5</kbd></div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800"><span className="text-slate-500 dark:text-slate-400">Slide tiếp theo</span><kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border shadow-xs font-mono font-bold">Space / ➔ / ⬇</kbd></div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800"><span className="text-slate-500 dark:text-slate-400">Slide trước đó</span><kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border shadow-xs font-mono font-bold">⬅ / ⬆ / Backspace</kbd></div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800"><span className="text-slate-500 dark:text-slate-400">Về slide đầu / cuối</span><kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border shadow-xs font-mono font-bold">Home / End</kbd></div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800"><span className="text-slate-500 dark:text-slate-400">Thoát trình chiếu</span><kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border shadow-xs font-mono font-bold">Escape</kbd></div>
                </div>
              </div>

              {/* Group 2: Thao tác Slide & Hình khối */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
                  <span>📄</span> Thao tác Slide & Đối tượng
                </h4>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800"><span className="text-slate-500 dark:text-slate-400">Thêm slide mới</span><kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border shadow-xs font-mono font-bold">Ctrl + M</kbd></div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800"><span className="text-slate-500 dark:text-slate-400">Nhân bản (Duplicate)</span><kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border shadow-xs font-mono font-bold">Ctrl + D</kbd></div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800"><span className="text-slate-500 dark:text-slate-400">Xóa đối tượng / slide</span><kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border shadow-xs font-mono font-bold">Delete / Backspace</kbd></div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800"><span className="text-slate-500 dark:text-slate-400">Di chuyển đối tượng tinh chỉnh</span><kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border shadow-xs font-mono font-bold">Phím mũi tên (±2px)</kbd></div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800"><span className="text-slate-500 dark:text-slate-400">Di chuyển nhanh</span><kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border shadow-xs font-mono font-bold">Shift + Mũi tên (±10px)</kbd></div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800"><span className="text-slate-500 dark:text-slate-400">Trợ lý AI Tạo Slide</span><kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border shadow-xs font-mono font-bold">Ctrl + K</kbd></div>
                </div>
              </div>

              {/* Group 3: Định dạng văn bản & In ấn */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
                  <span>✍️</span> Soạn thảo & In ấn
                </h4>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800"><span className="text-slate-500 dark:text-slate-400">In tài liệu / Xuất PDF</span><kbd className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 border border-orange-500/30 shadow-xs font-mono font-bold">Ctrl + P</kbd></div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800"><span className="text-slate-500 dark:text-slate-400">Lưu tài liệu</span><kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border shadow-xs font-mono font-bold">Ctrl + S</kbd></div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800"><span className="text-slate-500 dark:text-slate-400">In đậm / In nghiêng / Gạch chân</span><kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border shadow-xs font-mono font-bold">Ctrl + B / I / U</kbd></div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800"><span className="text-slate-500 dark:text-slate-400">Căn giữa / Trái / Phải</span><kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border shadow-xs font-mono font-bold">Ctrl + E / L / R</kbd></div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800"><span className="text-slate-500 dark:text-slate-400">Tăng / Giảm cỡ chữ</span><kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border shadow-xs font-mono font-bold">Ctrl + ] / [</kbd></div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800"><span className="text-slate-500 dark:text-slate-400">Hoàn tác (Undo) / Làm lại (Redo)</span><kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border shadow-xs font-mono font-bold">Ctrl + Z / Y</kbd></div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800"><span className="text-slate-500 dark:text-slate-400">Tìm kiếm & Thay thế</span><kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border shadow-xs font-mono font-bold">Ctrl + F / H</kbd></div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800"><span className="text-slate-500 dark:text-slate-400">Thu phóng Zoom (+ / - / 100%)</span><kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border shadow-xs font-mono font-bold">Ctrl + (+ / - / 0)</kbd></div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
              <span className="text-xs text-slate-400">Mẹo: Nhấn <kbd className="font-mono font-bold bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px]">F1</kbd> bất kỳ lúc nào để mở bảng này</span>
              <button 
                onClick={() => setIsShortcutsModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-sm transition-all"
              >
                Đã hiểu (Esc)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Print Dialog Modal (Ctrl + P) ─────────────────────────────────── */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 font-bold text-lg">🖨️</div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">In bài thuyết trình (Workplace PowerPoint Print)</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Tùy chỉnh trang in, bố cục slide và xuất bản PDF</p>
                </div>
              </div>
              <button 
                onClick={() => setIsPrintModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-bold"
              >
                ✕
              </button>
            </div>

            {/* Content: 2-column layout (Settings left, Preview right) */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
              {/* Left Column: Settings */}
              <div className="w-full md:w-80 space-y-5 shrink-0 text-sm">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Phạm vi in</label>
                  <select className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none">
                    <option value="all">Tất cả Slide ({presentation.slides.length} trang)</option>
                    <option value="current">Chỉ Slide hiện tại (Trang {activeIndex + 1})</option>
                    <option value="custom">Phạm vi tùy chỉnh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Bố cục in</label>
                  <select className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none">
                    <option value="full">Toàn trang Slide (1 slide / trang)</option>
                    <option value="handouts_2">Handouts (2 slides / trang)</option>
                    <option value="handouts_4">Handouts (4 slides / trang)</option>
                    <option value="notes">Trang ghi chú diễn giả (Notes)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Chế độ màu</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button className="px-3 py-2 rounded-xl border border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-semibold">Màu sắc</button>
                    <button className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs hover:bg-slate-100 dark:hover:bg-slate-800">Xám</button>
                    <button className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs hover:bg-slate-100 dark:hover:bg-slate-800">Trắng đen</button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Số lượng bản in</label>
                  <input type="number" min="1" max="99" defaultValue="1" className="w-24 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                </div>
              </div>

              {/* Right Column: Preview */}
              <div className="flex-1 bg-slate-100 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col items-center justify-center min-h-[300px]">
                <span className="text-xs text-slate-400 mb-2 font-medium">Xem trước bản in: Trang {activeIndex + 1}/{presentation.slides.length}</span>
                <div 
                  className="w-full max-w-md aspect-video bg-white shadow-xl rounded-lg overflow-hidden border border-slate-300 relative"
                  style={{ background: activeSlide?.background || '#ffffff' }}
                >
                  {activeSlide?.shapes.map(shape => (
                    <div 
                      key={shape.id}
                      style={{
                        position: 'absolute',
                        left: `${(shape.x / (SLIDE_DIMENSIONS[slideSize] || SLIDE_DIMENSIONS.widescreen).width) * 100}%`,
                        top: `${(shape.y / (SLIDE_DIMENSIONS[slideSize] || SLIDE_DIMENSIONS.widescreen).height) * 100}%`,
                        width: `${(shape.width / (SLIDE_DIMENSIONS[slideSize] || SLIDE_DIMENSIONS.widescreen).width) * 100}%`,
                        height: `${(shape.height / (SLIDE_DIMENSIONS[slideSize] || SLIDE_DIMENSIONS.widescreen).height) * 100}%`,
                      }}
                    >
                      {renderShapeGraphic(shape)}
                      <div 
                        className="absolute inset-0 p-1 flex flex-col justify-center text-[10px]"
                        style={{
                          fontFamily: shape.format.fontFamily || 'Inter',
                          color: shape.format.color || '#0f172a',
                          textAlign: (shape.format.textAlign as any) || 'center',
                          fontWeight: shape.format.bold ? 'bold' : 'normal',
                        }}
                      >
                        {shape.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
              <span className="text-xs text-slate-500 dark:text-slate-400">Tổ hợp phím: <kbd className="font-mono font-bold bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px]">Ctrl + P</kbd></span>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsPrintModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition-colors"
                >
                  Hủy (Cancel)
                </button>
                <button 
                  onClick={() => {
                    setIsPrintModalOpen(false);
                    setTimeout(() => window.print(), 100);
                  }}
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md hover:shadow-orange-500/25 transition-all flex items-center gap-2"
                >
                  <span>🖨️ In tài liệu / Xuất PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── AI Panel Overlay ──────────────────────────────────────────────── */}
      <AIPanelFloat
        isOpen={isAIPanelOpen}
        onClose={() => setIsAIPanelOpen(false)}
        onInsertText={(text) => {
          if (!activeSlide) return;
          if (selectedShape && selectedShape.type !== 'table' && selectedShape.type !== 'video' && selectedShape.type !== 'audio') {
            selectedShape.content = (selectedShape.content ? selectedShape.content + '\n\n' : '') + text;
          } else {
            const newShape = new Shape('text', 60, 80, 640, 200, text, {
              fontSize: 16,
              color: '#0f172a',
              textAlign: 'left',
              fillColor: 'transparent',
              borderColor: '#94a3b8',
              borderWidth: 1,
            });
            activeSlide.addShape(newShape);
            setSelectedShapeId(newShape.id);
          }
          pushHistory(presentation);
          setVersion(v => v + 1);
        }}
        onAddSlideWithContent={(title, bullets) => {
          const newSlide = new Slide(presentation.slides.length + 1, 'titleAndContent');
          const titleShape = new Shape('text', 60, 40, 840, 70, title, {
            fontSize: 32,
            bold: true,
            textAlign: 'left',
            color: '#0f172a',
            isTitle: true,
          });
          const bodyShape = new Shape('text', 60, 130, 840, 360, bullets.join('\n'), {
            fontSize: 18,
            textAlign: 'left',
            color: '#334155',
            bullet: true,
            lineHeight: 1.6,
          });
          newSlide.shapes = [titleShape, bodyShape];
          presentation.slides.push(newSlide);
          presentation.activeSlideId = newSlide.id;
          pushHistory(presentation);
          setVersion(v => v + 1);
        }}
        onGenerateFullDeck={(key) => handleGenerateFullAIDeck(key)}
        onApplyTheme={(key) => handleAIAutoDesign()}
        slideCount={presentation.slides.length}
        currentSlideIndex={activeIndex >= 0 ? activeIndex : 0}
      />

      {/* ── Main Workspace ────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Thumbnails Sidebar */}
        <div className="w-56 bg-card border-r border-border overflow-y-auto p-3 flex flex-col gap-3 shrink-0 shadow-inner">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Các trang chiếu ({presentation.slides.length})
            </span>
            <button
              onClick={() => handleNewSlide()}
              className="h-6 w-6 rounded hover:bg-muted flex items-center justify-center text-orange-600 transition-colors"
              title="Thêm trang mới"
            >
              <IconPlus size={14} />
            </button>
          </div>

          {presentation.slides.map((slide, index) => {
            const isActive = slide.id === presentation.activeSlideId;
            const hasTransition = slide.transition?.type && slide.transition.type !== 'none';

            return (
              <div 
                key={slide.id} 
                className={`group flex items-center gap-2 cursor-pointer transition-all p-1 rounded-lg ${isActive ? 'bg-orange-50 dark:bg-orange-950/30' : 'hover:bg-muted/50'}`}
                onClick={() => {
                  handleSelectSlide(slide.id);
                  triggerSlideTransition(slide);
                }}
              >
                <div className="flex flex-col items-center justify-center w-4 shrink-0">
                  <span className={`text-xs font-bold text-right ${isActive ? 'text-orange-600 font-extrabold' : 'text-muted-foreground'}`}>
                    {index + 1}
                  </span>
                  {hasTransition && (
                    <span 
                      className="text-[9px] text-amber-500 font-bold leading-none animate-pulse hover:scale-125 transition-transform" 
                      title={`Hiệu ứng: ${slide.transition?.type} (Click để xem trước)`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectSlide(slide.id);
                        triggerSlideTransition(slide);
                      }}
                    >
                      ★
                    </span>
                  )}
                </div>

                {/* Mini Slide Preview */}
                <div 
                  className={`w-36 rounded relative overflow-hidden shadow-sm transition-all ${isActive ? 'ring-2 ring-orange-500 shadow-md' : 'border border-border'}`}
                  style={{ 
                    aspectRatio: (SLIDE_DIMENSIONS[slideSize] || SLIDE_DIMENSIONS.widescreen).ratio,
                    background: slide.background 
                  }}
                >
                  {/* Miniature Shapes */}
                  {slide.shapes.map(s => {
                    const dim = SLIDE_DIMENSIONS[slideSize] || SLIDE_DIMENSIONS.widescreen;
                    return (
                      <div
                        key={s.id}
                        style={{
                          position: 'absolute',
                          left: `${(s.x / dim.width) * 100}%`,
                          top: `${(s.y / dim.height) * 100}%`,
                          width: `${(s.width / dim.width) * 100}%`,
                          height: `${(s.height / dim.height) * 100}%`,
                          backgroundColor: s.format.fillColor && s.format.fillColor !== 'transparent' ? s.format.fillColor : (s.format.isTitle ? '#ea580c' : '#94a3b8'),
                          borderRadius: s.type === 'circle' ? '50%' : '1px',
                          opacity: 0.8,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Workspace Area (Normal View vs Slide Sorter View) */}
        {currentView === 'sorter' ? (
          <div className="flex-1 bg-slate-200 dark:bg-neutral-950 overflow-auto p-8">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>BỘ SẮP XẾP TRANG CHIẾU ({presentation.slides.length} TRANG CHIẾU)</span>
              <span className="text-[11px] font-normal">Nhấp đúp vào trang chiếu bất kỳ để chuyển sang chế độ chỉnh sửa chi tiết</span>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {presentation.slides.map((slide, idx) => (
                <div 
                  key={slide.id}
                  className={`bg-card rounded-xl border p-2.5 flex flex-col gap-2 cursor-pointer transition-all hover:scale-105 shadow-md ${slide.id === presentation.activeSlideId ? 'ring-2 ring-orange-500 border-orange-500' : 'hover:border-orange-400'}`}
                  onClick={() => handleSelectSlide(slide.id)}
                  onDoubleClick={() => {
                    handleSelectSlide(slide.id);
                    setCurrentView('normal');
                  }}
                >
                  <div className="flex items-center justify-between text-xs font-bold px-1">
                    <span>Trang {idx + 1}</span>
                    {slide.isHidden && <span className="text-[10px] text-red-500 font-bold">🙈 Đã ẩn</span>}
                  </div>
                  <div 
                    className="w-full rounded relative overflow-hidden border border-border"
                    style={{ 
                      aspectRatio: (SLIDE_DIMENSIONS[slideSize] || SLIDE_DIMENSIONS.widescreen).ratio,
                      background: slide.background 
                    }}
                  >
                    {slide.shapes.map(s => {
                      const dim = SLIDE_DIMENSIONS[slideSize] || SLIDE_DIMENSIONS.widescreen;
                      return (
                        <div
                          key={s.id}
                          style={{
                            position: 'absolute',
                            left: `${(s.x / dim.width) * 100}%`,
                            top: `${(s.y / dim.height) * 100}%`,
                            width: `${(s.width / dim.width) * 100}%`,
                            height: `${(s.height / dim.height) * 100}%`,
                            backgroundColor: s.format.fillColor && s.format.fillColor !== 'transparent' ? s.format.fillColor : (s.format.isTitle ? '#ea580c' : '#94a3b8'),
                            borderRadius: s.type === 'circle' ? '50%' : '1px',
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* Center Main Slide Canvas Area */}
            <div 
              className="flex-1 bg-slate-200 dark:bg-neutral-950 overflow-auto p-8 flex items-center justify-center relative cursor-default"
              onMouseMove={handleMouseMoveCanvas}
              onMouseUp={handleMouseUpCanvas}
              onClick={() => setSelectedShapeId(null)}
              ref={canvasRef}
            >
              {/* Optional Ruler Display */}
              {showRuler && (
                <>
                  <div className="absolute top-0 left-0 right-0 h-4 bg-slate-300 dark:bg-slate-800 border-b border-border flex items-center justify-between px-8 text-[8px] font-mono text-muted-foreground z-30">
                    <span>0</span><span>200</span><span>400</span><span>600</span><span>800</span><span>1000</span>
                  </div>
                  <div className="absolute top-4 left-0 bottom-0 w-4 bg-slate-300 dark:bg-slate-800 border-r border-border flex flex-col items-center justify-between py-8 text-[8px] font-mono text-muted-foreground z-30">
                    <span>0</span><span>200</span><span>400</span><span>600</span>
                  </div>
                </>
              )}

              {/* Slide Stage Container with dynamic scale & Color Filter */}
              <div 
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.1s ease-out',
                  filter: colorMode === 'grayscale' ? 'grayscale(100%)' : (colorMode === 'blackAndWhite' ? 'contrast(200%) grayscale(100%)' : 'none'),
                }}
              >
                {/* Dynamic Presentation Canvas with Transitions animation */}
                <div 
                  className={`shadow-2xl relative rounded-sm overflow-hidden select-none border border-black/10 transition-all duration-150 ${transitionAnimClass}`}
                  style={{ 
                    width: `${(SLIDE_DIMENSIONS[slideSize] || SLIDE_DIMENSIONS.widescreen).width}px`,
                    height: `${(SLIDE_DIMENSIONS[slideSize] || SLIDE_DIMENSIONS.widescreen).height}px`,
                    background: activeSlide?.background || '#ffffff',
                    ...transitionAnimStyle
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (e.target === e.currentTarget) {
                      setSelectedShapeId(null);
                    }
                  }}
                >
                  {/* Optional Gridlines Pattern */}
                  {showGridlines && (
                    <div 
                      className="absolute inset-0 pointer-events-none opacity-20 z-0"
                      style={{
                        backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                      }}
                    />
                  )}

                  {/* Optional Guides */}
                  {showGuides && (
                    <>
                      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-cyan-500/60 pointer-events-none z-0" />
                      <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-cyan-500/60 pointer-events-none z-0" />
                    </>
                  )}

                  {activeSlide?.shapes.map((shape) => {
                    const isSelected = shape.id === selectedShapeId;
                    const isAnimating = animatingShapeId === shape.id;

                    return (
                      <div 
                        key={shape.id}
                        style={{
                          position: 'absolute',
                          left: `${shape.x}px`,
                          top: `${shape.y}px`,
                          width: `${shape.width}px`,
                          height: `${shape.height}px`,
                          zIndex: shape.format.zIndex || (isSelected ? 10 : 1),
                        }}
                        className={`group transition-shadow select-none ${isAnimating ? shapeAnimClass : ''} ${isSelected ? 'ring-2 ring-orange-500 ring-offset-1' : 'hover:ring-1 hover:ring-orange-300'}`}
                        onMouseDown={(e) => handleMouseDownShape(e, shape)}
                      >
                        {/* Animation Sequence Number Tag */}
                        {shape.animation && (
                          <div 
                            className="absolute -top-3 -left-3 w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shadow-md z-40 cursor-pointer animate-in fade-in"
                            title={`Hoạt hình: ${shape.animation.type}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerShapeAnimation(shape);
                            }}
                          >
                            1
                          </div>
                        )}

                        {/* SVG/Graphic Representation */}
                        {renderShapeGraphic(shape)}

                        {/* Editable Text Area Inside Shape (for text and basic shapes) */}
                        {shape.type !== 'table' && shape.type !== 'video' && shape.type !== 'audio' && (
                          <div 
                            className="absolute inset-0 p-2 flex flex-col justify-center overflow-hidden"
                            style={{
                              textAlign: shape.format.textAlign || 'left',
                            }}
                          >
                            <textarea 
                              className="w-full h-full bg-transparent resize-none outline-none leading-relaxed border-none cursor-text select-text"
                              style={{
                                fontFamily: shape.format.fontFamily || 'Inter',
                                fontSize: `${shape.format.fontSize || 18}px`,
                                fontWeight: shape.format.bold ? 'bold' : 'normal',
                                fontStyle: shape.format.italic ? 'italic' : 'normal',
                                textDecoration: shape.format.underline ? 'underline' : shape.format.strikethrough ? 'line-through' : 'none',
                                color: shape.format.color || '#0f172a',
                                backgroundColor: shape.format.highlightColor || 'transparent',
                                textAlign: shape.format.textAlign || 'left',
                                lineHeight: shape.format.lineHeight || 1.25,
                              }}
                              value={shape.content || ''}
                              placeholder={shape.type === 'text' ? 'Nhập văn bản...' : ''}
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                setSelectedShapeId(shape.id);
                              }}
                              onKeyDown={(e) => handleKeyDownTextarea(e, shape)}
                              onChange={(e) => {
                                shape.content = e.target.value;
                                setVersion(v => v + 1);
                              }}
                              onBlur={() => {
                                pushHistory(presentation);
                              }}
                              onFocus={() => {
                                setSelectedShapeId(shape.id);
                              }}
                            />
                          </div>
                        )}

                        {/* Table Quick Action Floating Bar */}
                        {isSelected && shape.type === 'table' && (
                          <div 
                            className="absolute -top-9 left-0 bg-slate-900/95 text-white rounded-lg shadow-xl px-2.5 py-1 flex items-center gap-1.5 z-50 text-[11px] border border-slate-700 backdrop-blur animate-in fade-in duration-100 select-none whitespace-nowrap"
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <span className="font-bold text-orange-400 text-[10px] uppercase tracking-wider pr-1 border-r border-slate-700">Bảng</span>
                            <button className="hover:text-orange-400 px-1 py-0.5 rounded hover:bg-white/10 transition-colors" onClick={handleInsertTableRowAbove} title="Chèn thêm 1 hàng bên trên">+ Hàng trên</button>
                            <button className="hover:text-orange-400 px-1 py-0.5 rounded hover:bg-white/10 transition-colors" onClick={handleInsertTableRowBelow} title="Chèn thêm 1 hàng bên dưới">+ Hàng dưới</button>
                            <span className="text-slate-700">|</span>
                            <button className="hover:text-orange-400 px-1 py-0.5 rounded hover:bg-white/10 transition-colors" onClick={handleInsertTableColLeft} title="Chèn thêm 1 cột bên trái">+ Cột trái</button>
                            <button className="hover:text-orange-400 px-1 py-0.5 rounded hover:bg-white/10 transition-colors" onClick={handleInsertTableColRight} title="Chèn thêm 1 cột bên phải">+ Cột phải</button>
                            <span className="text-slate-700">|</span>
                            <button className="hover:text-red-400 px-1 py-0.5 rounded hover:bg-red-950/50 transition-colors text-red-300" onClick={handleDeleteTableRow} title="Xóa hàng cuối">- Hàng</button>
                            <button className="hover:text-red-400 px-1 py-0.5 rounded hover:bg-red-950/50 transition-colors text-red-300" onClick={handleDeleteTableCol} title="Xóa cột cuối">- Cột</button>
                            <span className="text-slate-700">|</span>
                            <button className="text-red-400 hover:text-white hover:bg-red-600 px-1.5 py-0.5 rounded font-bold transition-colors" onClick={handleDeleteTable} title="Xóa toàn bộ bảng">✕ Xóa bảng</button>
                          </div>
                        )}

                        {/* Video Quick Action Floating Bar */}
                        {isSelected && shape.type === 'video' && (
                          <div 
                            className="absolute -top-9 left-0 bg-slate-900/95 text-white rounded-lg shadow-xl px-2.5 py-1 flex items-center gap-2 z-50 text-[11px] border border-slate-700 backdrop-blur animate-in fade-in duration-100 select-none whitespace-nowrap"
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <span className="font-bold text-blue-400 text-[10px] uppercase tracking-wider pr-1 border-r border-slate-700">Video</span>
                            <button 
                              className="hover:text-blue-300 px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors flex items-center gap-1"
                              onClick={() => {
                                const newUrl = prompt('Nhập đường dẫn URL Video mới (YouTube / MP4):', shape.videoUrl || '');
                                if (newUrl !== null) {
                                  shape.videoUrl = newUrl.trim();
                                  pushHistory(presentation);
                                  setVersion(v => v + 1);
                                }
                              }}
                            >
                              🌐 Đổi Link Video
                            </button>
                            <span className="text-slate-700">|</span>
                            <button 
                              className="text-red-400 hover:text-white hover:bg-red-600 px-1.5 py-0.5 rounded font-bold transition-colors" 
                              onClick={() => {
                                if (activeSlide) {
                                  activeSlide.removeShape(shape.id);
                                  setSelectedShapeId(null);
                                  pushHistory(presentation);
                                  setVersion(v => v + 1);
                                }
                              }} 
                              title="Xóa video"
                            >
                              ✕ Xóa Video
                            </button>
                          </div>
                        )}

                        {/* Audio Quick Action Floating Bar */}
                        {isSelected && shape.type === 'audio' && (
                          <div 
                            className="absolute -top-9 left-0 bg-slate-900/95 text-white rounded-lg shadow-xl px-2.5 py-1 flex items-center gap-2 z-50 text-[11px] border border-slate-700 backdrop-blur animate-in fade-in duration-100 select-none whitespace-nowrap"
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <span className="font-bold text-indigo-400 text-[10px] uppercase tracking-wider pr-1 border-r border-slate-700">Âm thanh</span>
                            <button 
                              className="text-red-400 hover:text-white hover:bg-red-600 px-1.5 py-0.5 rounded font-bold transition-colors" 
                              onClick={() => {
                                if (activeSlide) {
                                  activeSlide.removeShape(shape.id);
                                  setSelectedShapeId(null);
                                  pushHistory(presentation);
                                  setVersion(v => v + 1);
                                }
                              }} 
                              title="Xóa tệp âm thanh"
                            >
                              ✕ Xóa Âm thanh
                            </button>
                          </div>
                        )}

                        {/* Resize Handles when selected */}
                        {isSelected && (
                          <>
                            <div 
                              className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-orange-500 rounded-full cursor-nwse-resize shadow-sm"
                              onMouseDown={(e) => handleMouseDownResize(e, 'tl', shape)}
                            />
                            <div 
                              className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-orange-500 rounded-full cursor-nesw-resize shadow-sm"
                              onMouseDown={(e) => handleMouseDownResize(e, 'tr', shape)}
                            />
                            <div 
                              className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-orange-500 rounded-full cursor-nesw-resize shadow-sm"
                              onMouseDown={(e) => handleMouseDownResize(e, 'bl', shape)}
                            />
                            <div 
                              className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-orange-500 rounded-full cursor-nwse-resize shadow-sm"
                              onMouseDown={(e) => handleMouseDownResize(e, 'br', shape)}
                            />
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Optional Speaker Notes Drawer / Notes View */}
            {(showNotesDrawer || currentView === 'notes') && (
              <div className="w-full bg-white dark:bg-slate-900 border-t border-border p-3 flex flex-col gap-1.5 shadow-lg z-30 shrink-0">
                <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span>📝</span>
                    <span>GHI CHÚ NGƯỜI THUYẾT TRÌNH (SPEAKER NOTES)</span>
                  </div>
                  <span className="text-[10px]">Trang chiếu {activeIndex + 1} / {presentation.slides.length}</span>
                </div>
                <textarea
                  className="w-full h-20 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg p-2.5 text-xs leading-relaxed outline-none focus:border-orange-500 resize-none font-sans"
                  placeholder="Nhập ghi chú thuyết minh cho trang chiếu này (Ghi chú sẽ xuất hiện trong Chế độ Người thuyết trình)..."
                  value={activeSlide?.notes || ''}
                  onChange={(e) => {
                    if (activeSlide) {
                      activeSlide.notes = e.target.value;
                      setVersion(v => v + 1);
                    }
                  }}
                  onBlur={() => pushHistory(presentation)}
                />
              </div>
            )}
          </div>
        )}

        {/* ── Animation Pane Sidebar Drawer ─────────────────────────── */}
        {isAnimationPaneOpen && (
          <div className="w-72 bg-card border-l border-border flex flex-col shrink-0 shadow-2xl animate-in slide-in-from-right-4 duration-200 z-40">
            <div className="p-3 border-b border-border flex items-center justify-between bg-muted/40">
              <div className="flex items-center gap-2">
                <span className="text-base text-orange-600">📋</span>
                <span className="text-xs font-bold text-foreground">Ngăn Hoạt hình (Animation Pane)</span>
              </div>
              <button 
                className="text-xs font-bold text-muted-foreground hover:text-foreground"
                onClick={() => setIsAnimationPaneOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                TRÌNH TỰ HOẠT HÌNH TRANG NÀY
              </div>
              {activeSlide?.shapes.filter(s => s.animation).length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground italic leading-relaxed">
                  Chưa có hình nào được gán hoạt hình.<br />
                  Chọn 1 hình và chọn hiệu ứng ở tab 'Hoạt hình'.
                </div>
              ) : (
                activeSlide?.shapes.filter(s => s.animation).map((s, idx) => (
                  <div 
                    key={s.id}
                    className={`p-2 rounded-lg border flex items-center justify-between text-xs cursor-pointer transition-all ${selectedShapeId === s.id ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-500 shadow-xs' : 'bg-muted/30 border-border hover:bg-muted'}`}
                    onClick={() => {
                      setSelectedShapeId(s.id);
                      triggerShapeAnimation(s);
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold truncate text-[11px]">{s.content || s.type}</span>
                        <span className="text-[9px] text-muted-foreground">{s.animation?.type} ({s.animation?.duration}s)</span>
                      </div>
                    </div>

                    <button 
                      className="text-red-500 hover:text-red-700 text-xs font-bold px-1.5 py-0.5 rounded hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        s.animation = undefined;
                        pushHistory(presentation);
                        setVersion(v => v + 1);
                      }}
                      title="Xóa hoạt hình"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-2.5 border-t border-border flex items-center justify-between bg-muted/20">
              <button 
                className="w-full py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg shadow transition-colors flex items-center justify-center gap-1.5"
                onClick={() => {
                  activeSlide?.shapes.filter(s => s.animation).forEach((s, i) => {
                    setTimeout(() => triggerShapeAnimation(s), i * 600);
                  });
                }}
              >
                <span>▶ Phát tất cả hoạt hình</span>
              </button>
            </div>
          </div>
        )}

          {/* ── Floating Voice Dictate Bar ────────────────────────────── */}
          {isDictating && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white border border-slate-700 shadow-2xl rounded-full px-5 py-2.5 flex items-center gap-4 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200">
              <div className="flex items-center gap-2">
                <div className="relative flex items-center justify-center w-6 h-6">
                  <span className="absolute w-full h-full bg-red-500 rounded-full animate-ping opacity-75"></span>
                  <span className="relative w-3 h-3 bg-red-500 rounded-full"></span>
                </div>
                <div className="flex items-center gap-0.5 h-4">
                  <span className="w-1 bg-red-400 rounded-full animate-pulse h-3"></span>
                  <span className="w-1 bg-red-500 rounded-full animate-pulse h-4" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1 bg-red-400 rounded-full animate-pulse h-2" style={{ animationDelay: '300ms' }}></span>
                  <span className="w-1 bg-red-500 rounded-full animate-pulse h-5" style={{ animationDelay: '450ms' }}></span>
                </div>
              </div>

              <div className="flex flex-col max-w-xs">
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Đang nghe... ({activeDictateLanguage})</span>
                <span className="text-xs text-slate-200 truncate italic">
                  {interimTranscript || 'Nói để nhập văn bản trực tiếp vào slide...'}
                </span>
              </div>

              <button
                onClick={() => handleToggleDictate(activeDictateLanguage)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-semibold shadow transition-colors flex items-center gap-1 ml-2 cursor-pointer"
              >
                <span>■</span>
                <span>Dừng</span>
              </button>
            </div>
          )}

          {/* ── Floating Read Aloud Audio Player Bar ─────────────────── */}
          {isReadingAloud && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 bg-blue-950/95 text-white border border-blue-700 shadow-2xl rounded-full px-5 py-2.5 flex items-center gap-4 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200">
              <div className="flex items-center gap-2">
                <div className="relative flex items-center justify-center w-6 h-6">
                  <span className="absolute w-full h-full bg-blue-500 rounded-full animate-ping opacity-75"></span>
                  <span className="relative w-3 h-3 bg-blue-500 rounded-full"></span>
                </div>
                <div className="flex items-center gap-0.5 h-4">
                  <span className="w-1 bg-blue-400 rounded-full animate-pulse h-4"></span>
                  <span className="w-1 bg-blue-300 rounded-full animate-pulse h-2" style={{ animationDelay: '100ms' }}></span>
                  <span className="w-1 bg-blue-500 rounded-full animate-pulse h-5" style={{ animationDelay: '200ms' }}></span>
                  <span className="w-1 bg-blue-400 rounded-full animate-pulse h-3" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>

              <div className="flex flex-col max-w-xs">
                <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">Đang phát âm thanh...</span>
                <span className="text-xs text-slate-100 truncate font-medium">
                  Đang đọc nội dung bài thuyết trình ra loa
                </span>
              </div>

              <button
                onClick={handleToggleReadAloud}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-semibold shadow transition-colors flex items-center gap-1 ml-2 cursor-pointer"
              >
                <span>■</span>
                <span>Dừng</span>
              </button>
            </div>
          )}

        {/* Right AI Designer Panel */}
        <DesignerModal
          isOpen={isDesignerOpen}
          onClose={() => setIsDesignerOpen(false)}
          onApplyTheme={handleApplyTheme}
        />
      </div>

      {/* ── Find & Replace Dialog ─────────────────────────────────────────── */}
      <FindReplaceDialog
        isOpen={findReplaceState.isOpen}
        initialMode={findReplaceState.mode}
        onClose={() => setFindReplaceState({ ...findReplaceState, isOpen: false })}
        onFind={handleFind}
        onReplace={handleReplace}
      />

      {/* ── Slide Show Fullscreen Mode (Standard vs Presenter View) ─────── */}
      {isSlideShow && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-in fade-in duration-200">
          {/* Rehearsal Timer Bar */}
          {isRehearsing && (
            <div className="absolute top-4 left-4 z-50 bg-slate-900/90 text-white border border-amber-500 rounded-xl px-4 py-2 flex items-center gap-3 shadow-2xl backdrop-blur">
              <span className="text-amber-400 font-bold text-xs flex items-center gap-1.5 animate-pulse">
                <span>⏱️</span>
                <span>Đang thử thời gian:</span>
              </span>
              <span className="font-mono font-bold text-sm text-emerald-400">
                {String(Math.floor(rehearsalSeconds / 60)).padStart(2, '0')}:{String(rehearsalSeconds % 60).padStart(2, '0')}
              </span>
              <button 
                className="px-2 py-0.5 bg-amber-600 hover:bg-amber-700 rounded text-[10px] font-bold"
                onClick={() => {
                  if (rehearsalTimerRef.current) clearInterval(rehearsalTimerRef.current);
                  setIsRehearsing(false);
                  alert(`Đã hoàn tất thử thời gian! Tổng thời lượng thuyết trình: ${Math.floor(rehearsalSeconds / 60)} phút ${rehearsalSeconds % 60} giây.`);
                }}
              >
                Kết thúc
              </button>
            </div>
          )}

          {isPresenterMode ? (
            /* Presenter View Split Screen */
            <div className="w-full h-full p-6 flex gap-6 bg-slate-950 text-white">
              {/* Left Column: Current Slide */}
              <div className="flex-1 flex flex-col gap-3">
                <div className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                  TRANG CHIẾU HIỆN TẠI (TRANG {activeIndex + 1}/{presentation.slides.length})
                </div>
                <div 
                  className="flex-1 rounded-xl overflow-hidden shadow-2xl relative border border-slate-700"
                  style={{ background: activeSlide?.background || '#ffffff' }}
                >
                  {activeSlide?.shapes.map(shape => (
                    <div 
                      key={shape.id}
                      style={{
                        position: 'absolute',
                        left: `${(shape.x / (SLIDE_DIMENSIONS[slideSize] || SLIDE_DIMENSIONS.widescreen).width) * 100}%`,
                        top: `${(shape.y / (SLIDE_DIMENSIONS[slideSize] || SLIDE_DIMENSIONS.widescreen).height) * 100}%`,
                        width: `${(shape.width / (SLIDE_DIMENSIONS[slideSize] || SLIDE_DIMENSIONS.widescreen).width) * 100}%`,
                        height: `${(shape.height / (SLIDE_DIMENSIONS[slideSize] || SLIDE_DIMENSIONS.widescreen).height) * 100}%`,
                      }}
                    >
                      {renderShapeGraphic(shape)}
                      <div 
                        className="absolute inset-0 p-1 flex flex-col justify-center text-xs"
                        style={{
                          fontFamily: shape.format.fontFamily || 'Inter',
                          color: shape.format.color || '#0f172a',
                          textAlign: shape.format.textAlign || 'left',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {shape.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Next Slide Preview & Speaker Notes */}
              <div className="w-96 flex flex-col gap-4">
                {/* Next Slide Preview */}
                <div className="flex flex-col gap-1.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    TRANG CHIẾU TIẾP THEO
                  </div>
                  <div 
                    className="w-full aspect-video rounded-lg overflow-hidden border border-slate-800 bg-slate-900 relative shadow-inner"
                    style={{ background: presentation.slides[activeIndex + 1]?.background || '#1e293b' }}
                  >
                    {presentation.slides[activeIndex + 1] ? (
                      presentation.slides[activeIndex + 1].shapes.map(s => (
                        <div
                          key={s.id}
                          style={{
                            position: 'absolute',
                            left: `${(s.x / 960) * 100}%`,
                            top: `${(s.y / 540) * 100}%`,
                            width: `${(s.width / 960) * 100}%`,
                            height: `${(s.height / 540) * 100}%`,
                            backgroundColor: s.format.fillColor && s.format.fillColor !== 'transparent' ? s.format.fillColor : '#94a3b8',
                            borderRadius: '1px',
                          }}
                        />
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-slate-500 italic">
                        [Hết bài thuyết trình]
                      </div>
                    )}
                  </div>
                </div>

                {/* Speaker Notes */}
                <div className="flex-1 flex flex-col gap-1.5 bg-slate-900/80 border border-slate-800 rounded-xl p-3">
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>📝</span>
                    <span>GHI CHÚ THUYẾT MINH</span>
                  </div>
                  <div className="flex-1 overflow-y-auto text-xs leading-relaxed text-slate-300 font-sans whitespace-pre-wrap">
                    {activeSlide?.notes || 'Không có ghi chú nào cho trang chiếu này.'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Standard Fullscreen Slide Show */
            <div 
              className="relative rounded overflow-hidden shadow-2xl transition-all"
              style={{ 
                width: `${(SLIDE_DIMENSIONS[slideSize] || SLIDE_DIMENSIONS.widescreen).width}px`,
                height: `${(SLIDE_DIMENSIONS[slideSize] || SLIDE_DIMENSIONS.widescreen).height}px`,
                maxWidth: '95vw',
                maxHeight: '90vh',
                background: activeSlide?.background || '#ffffff' 
              }}
            >
              {activeSlide?.shapes.map(shape => (
                <div 
                  key={shape.id}
                  style={{
                    position: 'absolute',
                    left: `${shape.x}px`,
                    top: `${shape.y}px`,
                    width: `${shape.width}px`,
                    height: `${shape.height}px`,
                  }}
                >
                  {renderShapeGraphic(shape)}
                  <div 
                    className="absolute inset-0 p-2 flex flex-col justify-center"
                    style={{
                      fontFamily: shape.format.fontFamily || 'Inter',
                      fontSize: `${shape.format.fontSize || 18}px`,
                      fontWeight: shape.format.bold ? 'bold' : 'normal',
                      fontStyle: shape.format.italic ? 'italic' : 'normal',
                      textDecoration: shape.format.underline ? 'underline' : 'none',
                      color: shape.format.color || '#0f172a',
                      textAlign: shape.format.textAlign || 'left',
                      lineHeight: shape.format.lineHeight || 1.25,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {shape.content}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Navigation Controls Bar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md px-5 py-2.5 rounded-full text-white text-xs flex items-center gap-4 border border-white/10 shadow-2xl">
            <button 
              disabled={activeIndex <= 0}
              className="hover:text-orange-400 disabled:opacity-30 font-semibold" 
              onClick={() => {
                if (activeIndex > 0) {
                  presentation.activeSlideId = presentation.slides[activeIndex - 1].id;
                  triggerSlideTransition(presentation.slides[activeIndex - 1]);
                  setVersion(v => v + 1);
                }
              }}
            >
              ◀ Trước
            </button>
            <span className="font-mono text-slate-300">Trang {activeIndex + 1} / {presentation.slides.length}</span>
            <button 
              disabled={activeIndex >= presentation.slides.length - 1}
              className="hover:text-orange-400 disabled:opacity-30 font-semibold" 
              onClick={() => {
                if (activeIndex < presentation.slides.length - 1) {
                  presentation.activeSlideId = presentation.slides[activeIndex + 1].id;
                  triggerSlideTransition(presentation.slides[activeIndex + 1]);
                  setVersion(v => v + 1);
                }
              }}
            >
              Tiếp ▶
            </button>
            <span className="text-white/20">|</span>
            <button 
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${isPresenterMode ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}
              onClick={() => setIsPresenterMode(!isPresenterMode)}
            >
              👔 Người thuyết trình
            </button>
            <button 
              className="text-red-400 hover:text-red-300 font-bold ml-1" 
              onClick={() => {
                if (rehearsalTimerRef.current) clearInterval(rehearsalTimerRef.current);
                setIsRehearsing(false);
                setIsSlideShow(false);
              }}
            >
              Thoát (Esc)
            </button>
          </div>
        </div>
      )}

      {/* ── Status Bar ────────────────────────────────────────────────────── */}
      <div className="h-6 bg-[#d24726] text-white flex items-center px-4 text-xs shrink-0 select-none shadow-sm">
        <div className="flex items-center gap-4">
          <span className="font-medium">
            Trang chiếu {activeIndex + 1} / {presentation.slides.length}
          </span>
          <span className="text-white/80">Tiếng Việt</span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <button 
            className="hover:bg-white/20 px-2 py-0.5 rounded transition-colors text-white/90"
            onClick={() => {
              if (activeSlide) {
                activeSlide.shapes.push(new Shape('text', 60, 480, 840, 40, 'Ghi chú cho diễn giả...', { fontSize: 14, color: '#64748b' }));
                pushHistory(presentation);
                setVersion(v => v + 1);
              }
            }}
          >
            Ghi chú
          </button>
          
          <div className="flex items-center gap-1.5">
            <span className="w-9 text-right font-mono">{zoomLevel}%</span>
            <input 
              type="range" 
              min="50" 
              max="150" 
              value={zoomLevel} 
              onChange={(e) => setZoomLevel(Number(e.target.value))}
              className="w-20 accent-white cursor-pointer" 
            />
          </div>

          <button 
            className="hover:bg-white/20 px-1.5 py-0.5 rounded transition-colors"
            title="Trình chiếu toàn màn hình (F5)"
            onClick={() => setIsSlideShow(true)}
          >
            ▶ Trình chiếu
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <PPTEngineProvider>
    <PPTApp />
  </PPTEngineProvider>
);

export default App;
