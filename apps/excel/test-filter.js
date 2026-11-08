const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto('http://localhost:5182');

  // Wait for grid to load
  await page.waitForSelector('td');

  // We will type "Apple" in A1, "Banana" in A2, "Apple" in A3
  // Click A1
  const clickCell = async (rowIndex, colIndex, val) => {
    // index is (rowIndex - 1) * 26 + (colIndex - 1)
    // wait, if 100 rows and 26 cols:
    const tds = await page.$$('td');
    const index = (rowIndex - 1) * 26 + (colIndex - 1);
    const cell = tds[index];
    const bb = await cell.boundingBox();
    
    // Double click to edit
    await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2, { clickCount: 2 });
    await new Promise(r => setTimeout(r, 200));
    
    // Type value
    await page.keyboard.type(val);
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 200));
  };

  await clickCell(1, 1, 'Apple');
  await clickCell(2, 1, 'Banana');
  await clickCell(3, 1, 'Apple');
  
  // Right click A1
  const tds = await page.$$('td');
  const cellA1 = tds[0];
  const bbA1 = await cellA1.boundingBox();
  await page.mouse.click(bbA1.x + bbA1.width / 2, bbA1.y + bbA1.height / 2, { button: 'right' });
  await new Promise(r => setTimeout(r, 500));

  // Hover over "Bộ lọc"
  const menus = await page.$$('div.bg-white.border.border-slate-200.rounded.shadow-lg > div');
  for (let m of menus) {
    const text = await page.evaluate(el => el.textContent, m);
    if (text.includes('Bộ lọc')) {
      const bbMenu = await m.boundingBox();
      await page.mouse.move(bbMenu.x + bbMenu.width / 2, bbMenu.y + bbMenu.height / 2);
      break;
    }
  }

  await new Promise(r => setTimeout(r, 500));
  
  // Find "Giá trị ô Apple" and click it
  const submenus = await page.$$('div.bg-white.border.border-slate-200.rounded.shadow-lg > div > div.absolute > div');
  for (let m of submenus) {
    const text = await page.evaluate(el => el.textContent, m);
    console.log('Submenu:', text);
    if (text.includes('Giá trị ô')) {
      const bbMenu = await m.boundingBox();
      await page.mouse.click(bbMenu.x + bbMenu.width / 2, bbMenu.y + bbMenu.height / 2);
      break;
    }
  }

  await new Promise(r => setTimeout(r, 500));
  
  // Now row 2 should be hidden.
  // Check the height of td for A2
  const newTds = await page.$$('td');
  const cellA2 = newTds[26];
  const bbA2 = await cellA2.boundingBox();
  console.log('Height of A2:', bbA2.height);

  await browser.close();
})();
