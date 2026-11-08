const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const iconsDir = path.join(__dirname, '..', 'resources', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Convert PNG buffer to Windows ICO buffer (PNG-in-ICO format supported in Windows 10/11)
function pngToIco(pngBuffer) {
  const icoHeader = Buffer.alloc(22);
  // ICONDIR
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // Type 1 = ICO
  icoHeader.writeUInt16LE(1, 4); // 1 Image

  // ICONDIRENTRY
  icoHeader.writeUInt8(0, 6); // Width: 0 = 256px
  icoHeader.writeUInt8(0, 7); // Height: 0 = 256px
  icoHeader.writeUInt8(0, 8); // Color count: 0
  icoHeader.writeUInt8(0, 9); // Reserved
  icoHeader.writeUInt16LE(1, 10); // Color planes: 1
  icoHeader.writeUInt16LE(32, 12); // Bits per pixel: 32
  icoHeader.writeUInt32LE(pngBuffer.length, 14); // Image size in bytes
  icoHeader.writeUInt32LE(22, 18); // Image offset

  return Buffer.concat([icoHeader, pngBuffer]);
}

const icons = [
  {
    name: 'word',
    svg: `
      <svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg_w" x1="0" y1="0" x2="256" y2="256" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#2b7cd3" />
            <stop offset="100%" stop-color="#104a8e" />
          </linearGradient>
          <linearGradient id="doc_w" x1="50" y1="40" x2="210" y2="210" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="100%" stop-color="#e2e8f0" />
          </linearGradient>
          <filter id="shadow_w" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="10" stdDeviation="12" flood-opacity="0.35" flood-color="#000" />
          </filter>
        </defs>
        <rect x="16" y="16" width="224" height="224" rx="48" fill="url(#bg_w)" filter="url(#shadow_w)" />
        <rect x="70" y="50" width="120" height="156" rx="14" fill="url(#doc_w)" />
        <rect x="90" y="75" width="80" height="8" rx="4" fill="#94a3b8" />
        <rect x="90" y="95" width="80" height="8" rx="4" fill="#94a3b8" />
        <rect x="90" y="115" width="55" height="8" rx="4" fill="#94a3b8" />
        <rect x="36" y="80" width="96" height="96" rx="20" fill="#185abd" filter="url(#shadow_w)" />
        <text x="84" y="152" font-family="'Segoe UI', Arial, sans-serif" font-weight="900" font-size="64" fill="#ffffff" text-anchor="middle">W</text>
      </svg>
    `
  },
  {
    name: 'excel',
    svg: `
      <svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg_e" x1="0" y1="0" x2="256" y2="256" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#1e8e3e" />
            <stop offset="100%" stop-color="#0d522c" />
          </linearGradient>
          <linearGradient id="grid_e" x1="50" y1="40" x2="210" y2="210" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="100%" stop-color="#e2e8f0" />
          </linearGradient>
          <filter id="shadow_e" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="10" stdDeviation="12" flood-opacity="0.35" flood-color="#000" />
          </filter>
        </defs>
        <rect x="16" y="16" width="224" height="224" rx="48" fill="url(#bg_e)" filter="url(#shadow_e)" />
        <rect x="70" y="50" width="120" height="156" rx="14" fill="url(#grid_e)" />
        <rect x="90" y="75" width="36" height="26" rx="3" fill="#86efac" />
        <rect x="134" y="75" width="36" height="26" rx="3" fill="#cbd5e1" />
        <rect x="90" y="109" width="36" height="26" rx="3" fill="#cbd5e1" />
        <rect x="134" y="109" width="36" height="26" rx="3" fill="#86efac" />
        <rect x="90" y="143" width="80" height="26" rx="3" fill="#a7f3d0" />
        <rect x="36" y="80" width="96" height="96" rx="20" fill="#107c41" filter="url(#shadow_e)" />
        <text x="84" y="152" font-family="'Segoe UI', Arial, sans-serif" font-weight="900" font-size="64" fill="#ffffff" text-anchor="middle">X</text>
      </svg>
    `
  },
  {
    name: 'powerpoint',
    svg: `
      <svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg_p" x1="0" y1="0" x2="256" y2="256" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#ea580c" />
            <stop offset="100%" stop-color="#9a3412" />
          </linearGradient>
          <linearGradient id="slide_p" x1="50" y1="40" x2="210" y2="210" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="100%" stop-color="#fed7aa" />
          </linearGradient>
          <filter id="shadow_p" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="10" stdDeviation="12" flood-opacity="0.35" flood-color="#000" />
          </filter>
        </defs>
        <rect x="16" y="16" width="224" height="224" rx="48" fill="url(#bg_p)" filter="url(#shadow_p)" />
        <rect x="70" y="50" width="120" height="156" rx="14" fill="url(#slide_p)" />
        <circle cx="130" cy="115" r="32" fill="#fb923c" />
        <path d="M 130 115 L 130 83 A 32 32 0 0 1 162 115 Z" fill="#c2410c" />
        <rect x="36" y="80" width="96" height="96" rx="20" fill="#c2410c" filter="url(#shadow_p)" />
        <text x="84" y="152" font-family="'Segoe UI', Arial, sans-serif" font-weight="900" font-size="64" fill="#ffffff" text-anchor="middle">P</text>
      </svg>
    `
  },
  {
    name: 'ai',
    svg: `
      <svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg_ai" x1="0" y1="0" x2="256" y2="256" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#9333ea" />
            <stop offset="100%" stop-color="#581c87" />
          </linearGradient>
          <filter id="shadow_ai" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="10" stdDeviation="12" flood-opacity="0.35" flood-color="#000" />
          </filter>
          <linearGradient id="glow_ai" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f472b6" />
            <stop offset="100%" stop-color="#c084fc" />
          </linearGradient>
        </defs>
        <rect x="16" y="16" width="224" height="224" rx="48" fill="url(#bg_ai)" filter="url(#shadow_ai)" />
        
        <!-- Bot Head -->
        <rect x="64" y="84" width="128" height="100" rx="28" fill="#ffffff" />
        <!-- Antenna -->
        <circle cx="128" cy="56" r="12" fill="url(#glow_ai)" />
        <rect x="124" y="66" width="8" height="20" fill="#ffffff" />
        <!-- Eyes -->
        <circle cx="98" cy="126" r="14" fill="#7e22ce" />
        <circle cx="158" cy="126" r="14" fill="#7e22ce" />
        <circle cx="102" cy="122" r="5" fill="#ffffff" />
        <circle cx="162" cy="122" r="5" fill="#ffffff" />
        <!-- Mouth -->
        <path d="M 112 154 Q 128 168 144 154" stroke="#7e22ce" stroke-width="5" stroke-linecap="round" fill="none" />
        <!-- Sparkles -->
        <polygon points="196,44 200,56 212,60 200,64 196,76 192,64 180,60 192,56" fill="#fde047" />
        <polygon points="56,180 59,189 68,192 59,195 56,204 53,195 44,192 53,189" fill="#fde047" />
      </svg>
    `
  },
  {
    name: 'suite',
    svg: `
      <svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg_s" x1="0" y1="0" x2="256" y2="256" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#4f46e5" />
            <stop offset="50%" stop-color="#6366f1" />
            <stop offset="100%" stop-color="#7c3aed" />
          </linearGradient>
          <filter id="shadow_s" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="10" stdDeviation="12" flood-opacity="0.35" flood-color="#000" />
          </filter>
        </defs>
        <rect x="16" y="16" width="224" height="224" rx="48" fill="url(#bg_s)" filter="url(#shadow_s)" />
        <text x="128" y="160" font-family="'Segoe UI', Arial, sans-serif" font-weight="900" font-size="80" fill="#ffffff" text-anchor="middle" letter-spacing="-2">WP</text>
        <circle cx="196" cy="60" r="10" fill="#38bdf8" />
        <circle cx="60" cy="196" r="8" fill="#f43f5e" />
      </svg>
    `
  }
];

async function main() {
  console.log('Launching browser to render PNG and ICO icons...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 256, height: 256, deviceScaleFactor: 1 });

  for (const item of icons) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * { margin: 0; padding: 0; }
            body { background: transparent; overflow: hidden; display: flex; align-items: center; justify-content: center; }
          </style>
        </head>
        <body>
          ${item.svg}
        </body>
      </html>
    `;

    await page.setContent(html);
    const pngBuffer = await page.screenshot({ type: 'png', omitBackground: true });
    
    const pngPath = path.join(iconsDir, `${item.name}.png`);
    const icoPath = path.join(iconsDir, `${item.name}.ico`);

    fs.writeFileSync(pngPath, pngBuffer);
    const icoBuffer = pngToIco(pngBuffer);
    fs.writeFileSync(icoPath, icoBuffer);

    console.log(`[OK] Generated: ${item.name}.png & ${item.name}.ico`);
  }

  await browser.close();
  console.log('All icons generated successfully in resources/icons/');
}

main().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
