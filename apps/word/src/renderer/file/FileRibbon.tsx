import React, { useMemo } from 'react';
import { CommandDispatcher } from '../CommandDispatcher';
import { RGroup } from '../SharedComponents';
import { IconWord as IconFile, IconSave } from '@officex/icons';

export function FileRibbon() {
  const commands = useMemo(() => CommandDispatcher.getAllCommands(), []);

  const groups = [
    { label: 'New', prefix: 'WORD.FILE.NEW', icon: IconFile },
    { label: 'Open', prefix: 'WORD.FILE.OPEN', icon: IconFile },
    { label: 'Save', prefix: 'WORD.FILE.SAVE', icon: IconSave },
    { label: 'Export', prefix: 'WORD.FILE.EXPORT', icon: IconFile },
    { label: 'Import', prefix: 'WORD.FILE.IMPORT', icon: IconFile },
    { label: 'Print', prefix: 'WORD.FILE.PRINT', icon: IconFile },
    { label: 'Share', prefix: 'WORD.FILE.SHARE', icon: IconFile },
    { label: 'Cloud', prefix: 'WORD.FILE.CLOUD', icon: IconFile },
    { label: 'Backup', prefix: 'WORD.FILE.BACKUP', icon: IconSave },
    { label: 'Recovery', prefix: 'WORD.FILE.RECOVERY', icon: IconFile },
    { label: 'Version', prefix: 'WORD.FILE.VERSION', icon: IconFile },
    { label: 'Security', prefix: 'WORD.FILE.SECURITY', icon: IconFile },
    { label: 'Permission', prefix: 'WORD.FILE.PERMISSION', icon: IconFile },
    { label: 'Signature', prefix: 'WORD.FILE.SIGNATURE', icon: IconFile },
    { label: 'Template', prefix: 'WORD.FILE.TEMPLATE', icon: IconFile },
    { label: 'Compare', prefix: 'WORD.FILE.COMPARE', icon: IconFile },
    { label: 'Inspector', prefix: 'WORD.FILE.INSPECTOR', icon: IconFile },
    { label: 'Metadata', prefix: 'WORD.FILE.METADATA', icon: IconFile },
    { label: 'Compatibility', prefix: 'WORD.FILE.COMPATIBILITY', icon: IconFile },
    { label: 'Cache', prefix: 'WORD.FILE.CACHE', icon: IconFile },
    { label: 'Session', prefix: 'WORD.FILE.SESSION', icon: IconFile },
    { label: 'AI', prefix: 'WORD.FILE.AI', icon: IconFile },
    { label: 'Audit', prefix: 'WORD.FILE.AUDIT', icon: IconFile },
    { label: 'Developer', prefix: 'WORD.FILE.DEVELOPER', icon: IconFile },
    { label: 'Favorite', prefix: 'WORD.FILE.FAVORITE', icon: IconFile },
    { label: 'Lock', prefix: 'WORD.FILE.LOCK', icon: IconFile },
  ];

  return (
    <>
      {groups.map(group => {
        const groupCommands = commands.filter(c => c.id.startsWith(group.prefix) && c.id !== group.prefix);
        if (groupCommands.length === 0) return null;

        // Splitting into columns of 3 buttons
        const columns = [];
        for (let i = 0; i < groupCommands.length; i += 3) {
          columns.push(groupCommands.slice(i, i + 3));
        }

        return (
          <RGroup key={group.label} label={group.label}>
            <div className="flex gap-1 mr-1">
              {columns.map((col, idx) => (
                <div key={idx} className="flex flex-col gap-0.5 justify-around" style={{ height: 52 }}>
                  {col.map(cmd => (
                    <button key={cmd.id}
                      onMouseDown={(e) => { e.preventDefault(); CommandDispatcher.dispatch(cmd.id); }}
                      className="flex items-center gap-1.5 px-2 h-7 rounded hover:bg-slate-200 transition-colors text-[11px] text-slate-700 whitespace-nowrap overflow-hidden w-28"
                      title={cmd.name}
                    >
                      <group.icon size={13} className="shrink-0" />
                      <span className="truncate">{cmd.name}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </RGroup>
        );
      })}
    </>
  );
}
