const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto('http://localhost:5182');

  // Wait for grid to load
  await page.waitForSelector('td');

  // Double click A1 to edit
  const tds = await page.$$('td');
  const cellA1 = tds[0];
  const bbA1 = await cellA1.boundingBox();
  await page.mouse.click(bbA1.x + bbA1.width / 2, bbA1.y + bbA1.height / 2, { clickCount: 2 });

  // Type formula
  await page.keyboard.type('=1+1');
  await page.keyboard.press('Enter');

  // Click A1 again to select
  await page.mouse.click(bbA1.x + bbA1.width / 2, bbA1.y + bbA1.height / 2);

  // Copy A1
  await page.keyboard.down('Control');
  await page.keyboard.press('c');
  await page.keyboard.up('Control');

  await new Promise(r => setTimeout(r, 500));

  // Right click B1 (index 1)
  const cellB1 = tds[1];
  const bbB1 = await cellB1.boundingBox();
  await page.mouse.click(bbB1.x + bbB1.width / 2, bbB1.y + bbB1.height / 2, { button: 'right' });

  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'screenshot_menu.png' });

  // Find "Dán đặc biệt" menu item and hover over it
  const menus = await page.$$('div.bg-white.border.border-slate-200.rounded.shadow-lg > div');
  for (let m of menus) {
    const text = await page.evaluate(el => el.textContent, m);
    if (text.includes('Dán đặc biệt')) {
      const bbMenu = await m.boundingBox();
      await page.mouse.move(bbMenu.x + bbMenu.width / 2, bbMenu.y + bbMenu.height / 2);
      break;
    }
  }

  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'screenshot_submenu.png' });

  // Find "Chỉ giá trị" inside the submenu
  const submenus = await page.$$('div.bg-white.border.border-slate-200.rounded.shadow-lg > div > div.absolute > div');
  for (let m of submenus) {
    const text = await page.evaluate(el => el.textContent, m);
    if (text.includes('Chỉ giá trị')) {
      const bbMenu = await m.boundingBox();
      await page.mouse.click(bbMenu.x + bbMenu.width / 2, bbMenu.y + bbMenu.height / 2);
      break;
    }
  }

  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'screenshot_pasted.png' });

  // Read B1 text
  const b1Text = await page.evaluate(el => el.textContent, cellB1);
  console.log('Target cell text after paste:', b1Text);

  await browser.close();
})();
