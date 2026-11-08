const fs = require('fs');
try {
  // Read UTF-16LE string (skipping BOM automatically by Node's utf16le? No, need to slice BOM)
  const buf16 = fs.readFileSync('scratch.tsx');
  let str = buf16.toString('utf16le');
  if (str.charCodeAt(0) === 0xFEFF) str = str.substring(1);

  const cp1252ToByte = {
    0x20AC: 0x80, 0x201A: 0x82, 0x0192: 0x83, 0x201E: 0x84, 0x2026: 0x85,
    0x2020: 0x86, 0x2021: 0x87, 0x02C6: 0x88, 0x2030: 0x89, 0x0160: 0x8A,
    0x2039: 0x8B, 0x0152: 0x8C, 0x017D: 0x8E, 0x2018: 0x91, 0x2019: 0x92,
    0x201C: 0x93, 0x201D: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
    0x02DC: 0x98, 0x2122: 0x99, 0x0161: 0x9A, 0x203A: 0x9B, 0x0153: 0x9C,
    0x017E: 0x9E, 0x0178: 0x9F,
  };

  const bytes = Buffer.alloc(str.length);
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (cp1252ToByte[code] !== undefined) {
      bytes[i] = cp1252ToByte[code];
    } else {
      bytes[i] = code & 0xFF; // for 0x00-0x7F and 0xA0-0xFF which map 1:1 in Latin1
    }
  }

  const fixedStr = bytes.toString('utf8');
  fs.writeFileSync('src/renderer/file/FileMenu.tsx', fixedStr, 'utf8');
  console.log('Successfully recovered all bytes!');
} catch (e) {
  console.error(e);
}
