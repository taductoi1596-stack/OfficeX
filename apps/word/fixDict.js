const fs = require('fs');
let c = fs.readFileSync('src/renderer/DictationToolbar.tsx', 'utf8');

c = c.replace(/} as Record<string, string>\)\[status as string\];/g, '');

const fixedCode = `  const statusColor = ({
    idle: '#757575',
    listening: '#107C41',
    paused: '#F7630C',
    processing: '#2B579A',
  } as Record<string, string>)[status as string];

  const statusLabel = ({
    idle: 'Ready',
    listening: '● Listening...',
    paused: '⏸ Paused',
    processing: '⏳ Processing...',
  } as Record<string, string>)[status as string];`;

c = c.replace(/  const isActive = status === 'listening';\n  const isPaused = status === 'paused';\n\n\n\n/, 
  `  const isActive = status === 'listening';\n  const isPaused = status === 'paused';\n\n${fixedCode}\n`);

fs.writeFileSync('src/renderer/DictationToolbar.tsx', c);
