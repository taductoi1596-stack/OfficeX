import React, { useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface RibbonTab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface RibbonProps {
  tabs: RibbonTab[];
  defaultTabId?: string;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

export const Ribbon: React.FC<RibbonProps> = ({ tabs, defaultTabId, activeTab: controlledActiveTab, onChange, className }) => {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTabId || tabs[0]?.id);
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  const handleTabClick = (tabId: string) => {
    if (onChange) {
      onChange(tabId);
    }
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
    }
  };

  return (
    <div className={cn("w-full bg-card border-b border-border flex flex-col", className)}>
      <div className="flex px-2 space-x-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-t-md transition-colors",
              activeTab === tab.id
                ? "bg-background text-primary-600 border-x border-t border-border shadow-sm"
                : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.some(t => t.content) && (
        <div className="bg-background px-4 py-2 min-h-[80px]">
          {tabs.find((t) => t.id === activeTab)?.content}
        </div>
      )}
    </div>
  );
};
