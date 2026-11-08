const fs = require('fs');
let content = fs.readFileSync('src/renderer/file/FileMenu.tsx', 'utf8');

content = content.replace(/const sections[\s\S]*?\];/, `const sections: Array<{ id: ActiveSection; icon: string; label: string; divider?: boolean }> = [
    { id: 'new',      icon: '📄', label: 'New' },
    { id: 'open',     icon: '📂', label: 'Open' },
    { id: 'info',     icon: 'ℹ️',  label: 'Info' },
    { id: 'save',     icon: '💾', label: 'Save' },
    { id: 'export',   icon: '📤', label: 'Export' },
    { id: 'print',    icon: '🖨️', label: 'Print', divider: true },
    { id: 'share',    icon: '🔗', label: 'Share' },
    { id: 'history',  icon: '🕒', label: 'Version History' },
    { id: 'recovery', icon: '🔄', label: 'Recovery' },
    { id: 'options',  icon: '⚙️', label: 'Options' },
];`);

// Fix the corrupted comments
content = content.replace(/â”€/g, '─');

fs.writeFileSync('src/renderer/file/FileMenu.tsx', content, 'utf8');
console.log('Fixed');
