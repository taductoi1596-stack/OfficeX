const fs = require('fs');
let c = fs.readFileSync('src/renderer/context/contextCommands.ts', 'utf8');
const replacements = [
  ['image', 'Image'],
  ['table', 'Table'],
  ['shape', 'Shape'],
  ['chart', 'Chart'],
  ['smartart', 'SmartArt'],
  ['header', 'Header'],
  ['footer', 'Footer'],
  ['object', 'OLE'],
  ['ai', 'AI'],
  ['plugin', 'Plugin']
];
replacements.forEach(([oldStr, newStr]) => {
  c = c.replace(new RegExp(`ContextEngine\\.Open\\('${oldStr}'\\)`, 'g'), `ContextEngine.Open('${newStr}')`);
});
fs.writeFileSync('src/renderer/context/contextCommands.ts', c);
