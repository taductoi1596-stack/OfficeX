const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto('http://localhost:5182');

  // Wait for grid to load
  await page.waitForSelector('td');

  const tds = await page.$$('td');
  // td index:
  // A1: 0, B1: 1, ...
  // wait, row 1 = A1..Z1
  // If 26 cols, A5 is index 4 * 26 + 0 = 104
  // Let's just click the 104th td, or just any td
  const cellA5 = tds[104];
  const bbA5 = await cellA5.boundingBox();

  // Left click A5 to make it activeCell
  await page.mouse.click(bbA5.x + bbA5.width / 2, bbA5.y + bbA5.height / 2);
  await new Promise(r => setTimeout(r, 500));

  // Right click A5
  await page.mouse.click(bbA5.x + bbA5.width / 2, bbA5.y + bbA5.height / 2, { button: 'right' });
  await new Promise(r => setTimeout(r, 500));

  // Find "Xóa" menu item and hover over it
  const menus = await page.$$('div.bg-white.border.border-slate-200.rounded.shadow-lg > div');
  for (let m of menus) {
    const text = await page.evaluate(el => el.textContent, m);
    if (text.includes('Xóa')) {
      const bbMenu = await m.boundingBox();
      await page.mouse.move(bbMenu.x + bbMenu.width / 2, bbMenu.y + bbMenu.height / 2);
      break;
    }
  }

  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'screenshot_xoa_submenu.png' });

  // Print all submenu texts
  const submenus = await page.$$('div.bg-white.border.border-slate-200.rounded.shadow-lg > div > div.absolute > div');
  for (let m of submenus) {
    const text = await page.evaluate(el => el.textContent, m);
    console.log('Submenu item text:', text);
  }

  await browser.close();
})();
