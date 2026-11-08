import React, { useState, useEffect, useRef } from 'react';
import { CommandDispatcher } from '../CommandDispatcher';
import { ContextEngine } from './ContextEngine';
import { ContextMenuRegistry, ContextMenuItem } from './ContextMenuRegistry';
import { IconChevronDown } from '@officex/icons';

export function ContextMenuProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [contextType, setContextType] = useState(ContextEngine.activeContextType);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubOpen = ContextEngine.on('ContextOpened', (payload: any) => {
      setContextType(payload.type);
    });

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setVisible(false);
        CommandDispatcher.dispatch('WORD.CONTEXT.CLOSE');
      }
    };
    
    // Close on escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visible) {
        setVisible(false);
        CommandDispatcher.dispatch('WORD.CONTEXT.CLOSE');
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      unsubOpen();
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    // Update context type to whatever is active in engine
    setContextType(ContextEngine.activeContextType);
    setVisible(true);
    CommandDispatcher.dispatch('WORD.CONTEXT.OPEN');
  };

  const dispatchAndClose = (cmd: string) => {
    CommandDispatcher.dispatch(cmd);
    setVisible(false);
  };

  const RenderMenuItem = ({ item }: { item: ContextMenuItem }) => {
    if (item.type === 'Divider') {
      return <div key={item.id} className="h-px bg-slate-200 my-1 mx-2" />;
    }

    if (item.type === 'SubMenu') {
      return (
        <div key={item.id} className="group relative">
          <button className="w-full text-left px-4 py-1.5 text-[12px] text-slate-700 hover:bg-slate-100 hover:text-blue-600 flex justify-between items-center">
            <span className="flex items-center gap-2">
              {item.icon ? <item.icon size={13} /> : <span className="w-[13px]" />}
              {item.label}
            </span>
            <IconChevronDown size={12} className="-rotate-90" />
          </button>
          {/* Submenu rendering */}
          <div className="hidden group-hover:flex flex-col absolute left-full top-0 ml-0.5 bg-white border border-slate-200 shadow-xl rounded-md py-1 w-48">
            {item.children?.map(child => <RenderMenuItem key={child.id} item={child} />)}
          </div>
        </div>
      );
    }

    return (
      <button
        key={item.id}
        onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); item.commandId && dispatchAndClose(item.commandId); }}
        className="w-full text-left px-4 py-1.5 text-[12px] text-slate-700 hover:bg-slate-100 hover:text-blue-600 flex justify-between items-center"
      >
        <span className="flex items-center gap-2">
          {item.icon ? <item.icon size={13} /> : <span className="w-[13px]" />}
          {item.label}
        </span>
        {item.shortcut && <span className="text-slate-400 text-[10px] ml-4">{item.shortcut}</span>}
      </button>
    );
  };

  const currentMenu = ContextMenuRegistry.getMenu(contextType);

  return (
    <div className="flex-1 w-full flex flex-col overflow-hidden min-h-0" onContextMenu={handleContextMenu}>
      {children}
      {visible && currentMenu && (
        <div
          ref={menuRef}
          className="fixed z-50 bg-white border border-slate-200 shadow-xl rounded-md py-1 w-56 flex flex-col"
          style={{ top: position.y, left: position.x }}
          onContextMenu={(e) => e.preventDefault()}
        >
          {currentMenu.items.map(item => (
            <RenderMenuItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
