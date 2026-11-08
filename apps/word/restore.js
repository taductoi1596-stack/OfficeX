const fs = require('fs');
try {
  const str = fs.readFileSync('scratch.tsx', 'utf16le');
  const buf = Buffer.from(str, 'latin1');
  const fixedStr = buf.toString('utf8');
  fs.writeFileSync('src/renderer/file/FileMenu.tsx', fixedStr, 'utf8');
  console.log('Restored perfectly!');
} catch (e) {
  console.error(e);
}
