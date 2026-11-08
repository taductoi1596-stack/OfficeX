const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto('http://localhost:5182');

  // Wait for grid to load
  await page.waitForSelector('td');

  const tds = await page.$$('td');
  const cellA1 = tds[0];
  const bbA1 = await cellA1.boundingBox();

  // Right click A1
  await page.mouse.click(bbA1.x + bbA1.width / 2, bbA1.y + bbA1.height / 2, { button: 'right' });
  await new Promise(r => setTimeout(r, 500));

  // Find "Chèn" menu item and hover over it
  const menus = await page.$$('div.bg-white.border.border-slate-200.rounded.shadow-lg > div');
  for (let m of menus) {
    const text = await page.evaluate(el => el.textContent, m);
    if (text.includes('Chèn')) {
      const bbMenu = await m.boundingBox();
      await page.mouse.move(bbMenu.x + bbMenu.width / 2, bbMenu.y + bbMenu.height / 2);
      break;
    }
  }

  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'screenshot_chen_submenu.png' });

  // Find "1 Hàng Ở dưới" inside the submenu
  const submenus = await page.$$('div.bg-white.border.border-slate-200.rounded.shadow-lg > div > div.absolute > div');
  for (let m of submenus) {
    const text = await page.evaluate(el => el.textContent, m);
    if (text.includes('1 Hàng Ở dưới')) {
      const bbMenu = await m.boundingBox();
      await page.mouse.click(bbMenu.x + bbMenu.width / 2, bbMenu.y + bbMenu.height / 2);
      console.log('Clicked 1 Hàng Ở dưới');
      break;
    }
  }

  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'screenshot_chen_done.png' });

  await browser.close();
})();
