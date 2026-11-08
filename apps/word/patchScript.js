const fs = require('fs');
let c = fs.readFileSync('fixAll2.js', 'utf8');
c = c.replace(/src\/renderer\/ai\/AIEngine.ts/g, 'src/renderer/AIEngine.ts');
c = c.replace(/src\/renderer\/ai\/AIChatEngine.ts/g, 'src/renderer/AIChatEngine.ts');
fs.writeFileSync('fixAll2.js', c);
