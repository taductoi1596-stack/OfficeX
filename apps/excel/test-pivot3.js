const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto('http://localhost:5182');

  await page.waitForSelector('.bg-card'); // wait for ribbon

  // Switch to Insert tab
  const tabs = await page.$$('button');
  for (let t of tabs) {
    const text = await page.evaluate(el => el.textContent, t);
    if (text === 'Chèn') {
      await t.click();
      console.log('Clicked Chèn tab');
      break;
    }
  }

  await new Promise(r => setTimeout(r, 500));

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const pivotBtn = btns.find(b => b.textContent.includes('PivotTable'));
    if (pivotBtn) {
        console.log("Found pivot btn");
        pivotBtn.click();
    }
  });

  await new Promise(r => setTimeout(r, 500));
  
  // Just dispatch directly again just to be absolutely sure
  await page.evaluate(() => {
    if (window.CommandDispatcher) {
        window.CommandDispatcher.dispatch('EXCEL.INSERT.PIVOT_TABLE');
    }
  });
  
  await new Promise(r => setTimeout(r, 500));

  const dialogHtml = await page.evaluate(() => {
    const dialogs = document.querySelectorAll('.fixed.inset-0');
    if (dialogs.length > 0) {
        return dialogs[dialogs.length - 1].outerHTML;
    }
    return 'NO DIALOG FOUND';
  });

  console.log('Dialog HTML:', dialogHtml);

  await browser.close();
})();
