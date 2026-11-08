const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:5182');

  await page.waitForSelector('.bg-card'); 

  // Switch to Insert tab
  const tabs = await page.$$('button');
  for (let t of tabs) {
    const text = await page.evaluate(el => el.textContent, t);
    if (text === 'Chèn') {
      await t.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 500));

  // click trigger
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const pivotBtn = btns.find(b => b.textContent.includes('PivotTable'));
    if (pivotBtn) {
        pivotBtn.click();
    }
  });

  await new Promise(r => setTimeout(r, 500));

  // Get dropdown items height
  const heights = await page.evaluate(() => {
    const menus = document.querySelectorAll('.absolute.z-50');
    if (menus.length === 0) return 'NO MENU';
    const menu = menus[menus.length - 1];
    const items = menu.querySelectorAll('button');
    return Array.from(items).map(btn => ({
        html: btn.outerHTML,
        height: btn.offsetHeight,
        margin: window.getComputedStyle(btn).margin,
        padding: window.getComputedStyle(btn).padding,
        display: window.getComputedStyle(btn).display
    }));
  });

  console.log('Heights:', heights);

  await browser.close();
})();
