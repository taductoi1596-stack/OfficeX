import React, { useMemo } from 'react';
import { CommandDispatcher } from '../CommandDispatcher';
import { RGroup } from '../SharedComponents';
import { IconPPT as IconFile, IconSave } from '@officex/icons';

export function FileRibbon() {
  const commands = useMemo(() => CommandDispatcher.getAllCommands(), []);

  const groups = [
    { label: 'New', prefix: 'PPT.FILE.NEW', icon: IconFile },
    { label: 'Open', prefix: 'PPT.FILE.OPEN', icon: IconFile },
    { label: 'Save', prefix: 'PPT.FILE.SAVE', icon: IconSave },
    { label: 'Export', prefix: 'PPT.FILE.EXPORT', icon: IconFile },
    { label: 'Import', prefix: 'PPT.FILE.IMPORT', icon: IconFile },
    { label: 'Print', prefix: 'PPT.FILE.PRINT', icon: IconFile },
    { label: 'Share', prefix: 'PPT.FILE.SHARE', icon: IconFile },
    { label: 'Cloud', prefix: 'PPT.FILE.CLOUD', icon: IconFile },
    { label: 'Backup', prefix: 'PPT.FILE.BACKUP', icon: IconSave },
    { label: 'Recovery', prefix: 'PPT.FILE.RECOVERY', icon: IconFile },
    { label: 'Version', prefix: 'PPT.FILE.VERSION', icon: IconFile },
    { label: 'Security', prefix: 'PPT.FILE.SECURITY', icon: IconFile },
    { label: 'Permission', prefix: 'PPT.FILE.PERMISSION', icon: IconFile },
    { label: 'Signature', prefix: 'PPT.FILE.SIGNATURE', icon: IconFile },
    { label: 'Template', prefix: 'PPT.FILE.TEMPLATE', icon: IconFile },
    { label: 'Compare', prefix: 'PPT.FILE.COMPARE', icon: IconFile },
    { label: 'Inspector', prefix: 'PPT.FILE.INSPECTOR', icon: IconFile },
    { label: 'Metadata', prefix: 'PPT.FILE.METADATA', icon: IconFile },
    { label: 'Compatibility', prefix: 'PPT.FILE.COMPATIBILITY', icon: IconFile },
    { label: 'Cache', prefix: 'PPT.FILE.CACHE', icon: IconFile },
    { label: 'Session', prefix: 'PPT.FILE.SESSION', icon: IconFile },
    { label: 'AI', prefix: 'PPT.FILE.AI', icon: IconFile },
    { label: 'Audit', prefix: 'PPT.FILE.AUDIT', icon: IconFile },
    { label: 'Developer', prefix: 'PPT.FILE.DEVELOPER', icon: IconFile },
    { label: 'Favorite', prefix: 'PPT.FILE.FAVORITE', icon: IconFile },
    { label: 'Lock', prefix: 'PPT.FILE.LOCK', icon: IconFile },
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
