const fs = require('fs');
let content = fs.readFileSync('src/renderer/homeCommands.ts', 'utf8');
content = content.replace(/group: 'Style'/g, "group: 'Styles'");
content = content.replace(/group: 'Dictation'/g, "group: 'AI'");
content = content.replace(/styleId: string/g, 'styleId: any');
fs.writeFileSync('src/renderer/homeCommands.ts', content);
