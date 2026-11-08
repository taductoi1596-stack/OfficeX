import React, { useMemo } from 'react';
import { CommandDispatcher } from '../CommandDispatcher';
import { RGroup } from '../SharedComponents';
import { IconExcel as IconFile, IconSave } from '@officex/icons';

export function FileRibbon() {
  const commands = useMemo(() => CommandDispatcher.getAllCommands(), []);

  const groups = [
    { label: 'New', prefix: 'EXCEL.FILE.NEW', icon: IconFile },
    { label: 'Open', prefix: 'EXCEL.FILE.OPEN', icon: IconFile },
    { label: 'Save', prefix: 'EXCEL.FILE.SAVE', icon: IconSave },
    { label: 'Export', prefix: 'EXCEL.FILE.EXPORT', icon: IconFile },
    { label: 'Import', prefix: 'EXCEL.FILE.IMPORT', icon: IconFile },
    { label: 'Print', prefix: 'EXCEL.FILE.PRINT', icon: IconFile },
    { label: 'Share', prefix: 'EXCEL.FILE.SHARE', icon: IconFile },
    { label: 'Cloud', prefix: 'EXCEL.FILE.CLOUD', icon: IconFile },
    { label: 'Backup', prefix: 'EXCEL.FILE.BACKUP', icon: IconSave },
    { label: 'Recovery', prefix: 'EXCEL.FILE.RECOVERY', icon: IconFile },
    { label: 'Version', prefix: 'EXCEL.FILE.VERSION', icon: IconFile },
    { label: 'Security', prefix: 'EXCEL.FILE.SECURITY', icon: IconFile },
    { label: 'Permission', prefix: 'EXCEL.FILE.PERMISSION', icon: IconFile },
    { label: 'Signature', prefix: 'EXCEL.FILE.SIGNATURE', icon: IconFile },
    { label: 'Template', prefix: 'EXCEL.FILE.TEMPLATE', icon: IconFile },
    { label: 'Compare', prefix: 'EXCEL.FILE.COMPARE', icon: IconFile },
    { label: 'Inspector', prefix: 'EXCEL.FILE.INSPECTOR', icon: IconFile },
    { label: 'Metadata', prefix: 'EXCEL.FILE.METADATA', icon: IconFile },
    { label: 'Compatibility', prefix: 'EXCEL.FILE.COMPATIBILITY', icon: IconFile },
    { label: 'Cache', prefix: 'EXCEL.FILE.CACHE', icon: IconFile },
    { label: 'Session', prefix: 'EXCEL.FILE.SESSION', icon: IconFile },
    { label: 'AI', prefix: 'EXCEL.FILE.AI', icon: IconFile },
    { label: 'Audit', prefix: 'EXCEL.FILE.AUDIT', icon: IconFile },
    { label: 'Developer', prefix: 'EXCEL.FILE.DEVELOPER', icon: IconFile },
    { label: 'Favorite', prefix: 'EXCEL.FILE.FAVORITE', icon: IconFile },
    { label: 'Lock', prefix: 'EXCEL.FILE.LOCK', icon: IconFile },
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
