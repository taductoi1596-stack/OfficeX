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

  // Type something
  await page.keyboard.type('Hello World');
  await page.keyboard.press('Enter');

  // Right click A1
  await page.mouse.click(bbA1.x + bbA1.width / 2, bbA1.y + bbA1.height / 2, { button: 'right' });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'screenshot1.png' });

  // Wait for Context Menu to appear and find "Sao chép"
  const menus = await page.$$('div.bg-white.border.border-slate-200.rounded.shadow-lg > div');
  for (let m of menus) {
    const text = await page.evaluate(el => el.textContent, m);
    if (text.includes('Sao chép')) {
      await m.click();
      break;
    }
  }

  // Right click B2 (Row 2, Col 2) -> actually, we can just click cell B1 (index 1) or B2
  await new Promise(r => setTimeout(r, 500));
  const tds2 = await page.$$('td');
  const cellB2 = tds2[28]; // roughly somewhere not A1, 26 columns, so 28 is C2
  const bbB2 = await cellB2.boundingBox();
  await page.mouse.click(bbB2.x + bbB2.width / 2, bbB2.y + bbB2.height / 2, { button: 'right' });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'screenshot2.png' });

  // Wait for Context Menu to appear and find "Dán"
  const menus2 = await page.$$('div.bg-white.border.border-slate-200.rounded.shadow-lg > div');
  for (let m of menus2) {
    const text = await page.evaluate(el => el.textContent, m);
    if (text.includes('Dán') && !text.includes('Dán đặc biệt')) {
      await m.click();
      break;
    }
  }

  // Wait a bit
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'screenshot3.png' });

  // Read B2 text
  const b2Text = await page.evaluate(el => el.textContent, cellB2);
  console.log('Target cell text after paste:', b2Text);

  await browser.close();
})();
