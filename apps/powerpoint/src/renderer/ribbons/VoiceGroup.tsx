import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@officex/ui';
import { IconDictate, IconReadAloud, IconChevronDown } from '@officex/icons';

export interface VoiceLanguage {
  code: string;
  name: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: VoiceLanguage[] = [
  { code: 'vi-VN', name: 'Tiếng Việt (Việt Nam)', flag: '🇻🇳' },
  { code: 'en-US', name: 'English (United States)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (United Kingdom)', flag: '🇬🇧' },
  { code: 'fr-FR', name: 'Français (France)', flag: '🇫🇷' },
  { code: 'ja-JP', name: '日本語 (Japanese)', flag: '🇯🇵' },
  { code: 'ko-KR', name: '한국어 (Korean)', flag: '🇰🇷' },
  { code: 'zh-CN', name: '中文 (Mandarin)', flag: '🇨🇳' },
];

interface VoiceGroupProps {
  onToggleDictate: (langCode: string) => void;
  isDictating: boolean;
  onToggleReadAloud: () => void;
  isReadingAloud: boolean;
  activeLanguage: string;
  onChangeLanguage: (langCode: string) => void;
}

export const VoiceGroup: React.FC<VoiceGroupProps> = ({
  onToggleDictate,
  isDictating,
  onToggleReadAloud,
  isReadingAloud,
  activeLanguage,
  onChangeLanguage,
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === activeLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0 relative" ref={langMenuRef}>
      <div className="flex items-center gap-1">
        {/* 1. Dictate: Speech to Text (Ghi âm thành chữ) */}
        <div className="flex items-center">
          <button
            onMouseDown={(e) => e.preventDefault()}
            className={`h-14 px-2.5 rounded-l flex flex-col items-center justify-center gap-1 border transition-all ${isDictating ? 'bg-red-500 text-white border-red-600 shadow-md animate-pulse' : 'bg-background hover:bg-muted border-border hover:border-orange-400'}`}
            onClick={() => onToggleDictate(activeLanguage)}
            title={isDictating ? 'Dừng ghi âm giọng nói' : `Thu âm giọng nói thành chữ (${currentLang.name})`}
          >
            <div className="relative">
              <IconDictate size={18} className={isDictating ? 'text-white' : 'text-orange-600 dark:text-orange-400'} />
              {isDictating && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping" />
              )}
            </div>
            <span className="text-[10px] font-semibold leading-none">
              {isDictating ? 'Đang nghe...' : 'Đọc'}
            </span>
          </button>

          <button
            onMouseDown={(e) => e.preventDefault()}
            className={`h-14 px-1 rounded-r border-y border-r flex items-center justify-center transition-colors ${isDictating ? 'bg-red-600 text-white border-red-700' : 'bg-background hover:bg-muted border-border hover:border-orange-400'}`}
            onClick={() => setShowLangMenu(!showLangMenu)}
            title="Chọn ngôn ngữ giọng nói"
          >
            <IconChevronDown size={9} className={isDictating ? 'text-white' : 'text-muted-foreground'} />
          </button>
        </div>

        {/* 2. Read Aloud: Text to Speech (Phát âm thanh ra loa) */}
        <button
          onMouseDown={(e) => e.preventDefault()}
          className={`h-14 px-2.5 rounded flex flex-col items-center justify-center gap-1 border transition-all ${isReadingAloud ? 'bg-blue-500 text-white border-blue-600 shadow-md animate-pulse' : 'bg-background hover:bg-muted border-border hover:border-blue-400'}`}
          onClick={onToggleReadAloud}
          title={isReadingAloud ? 'Dừng đọc to văn bản' : 'Đọc to nội dung trên slide ra loa (Phát âm thanh)'}
        >
          <div className="relative">
            <IconReadAloud size={18} className={isReadingAloud ? 'text-white' : 'text-blue-600 dark:text-blue-400'} />
            {isReadingAloud && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping" />
            )}
          </div>
          <span className="text-[10px] font-semibold leading-none">
            {isReadingAloud ? 'Đang đọc...' : 'Đọc to'}
          </span>
        </button>
      </div>

      {/* Language Selection Menu */}
      {showLangMenu && (
        <div className="absolute left-0 top-full mt-1 z-[999] w-56 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl p-1.5 animate-in fade-in duration-100">
          <div className="text-[10px] font-bold text-muted-foreground px-2 py-1 uppercase tracking-wider">
            NGÔN NGỮ GIỌNG NÓI
          </div>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = lang.code === activeLanguage;
            return (
              <button
                key={lang.code}
                onMouseDown={(e) => e.preventDefault()}
                className={`w-full px-2 py-1.5 text-left text-xs rounded-lg flex items-center justify-between transition-colors ${isSelected ? 'bg-orange-100 dark:bg-orange-950 text-orange-600 font-bold' : 'hover:bg-muted'}`}
                onClick={() => {
                  onChangeLanguage(lang.code);
                  setShowLangMenu(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{lang.flag}</span>
                  <span className="text-xs">{lang.name}</span>
                </div>
                {isSelected && <span className="text-orange-600 text-xs">✓</span>}
              </button>
            );
          })}
        </div>
      )}

      <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
        Giọng nói
      </span>
    </div>
  );
};
