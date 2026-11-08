const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto('http://localhost:5182');

  await page.waitForSelector('.bg-card'); // wait for ribbon

  // dispatch command directly
  await page.evaluate(() => {
    // We can't easily access CommandDispatcher, but we can trigger it if it's on window, which it usually isn't.
    // Instead we can just click the exact button.
  });

  const buttons = await page.$$('button');
  for (let t of buttons) {
    const text = await page.evaluate(el => el.textContent, t);
    if (text === 'Chèn') {
      await t.click();
      console.log('Clicked Chèn');
      break;
    }
  }

  await new Promise(r => setTimeout(r, 1000));

  // let's just click every button in the ribbon that has the onClick handler
  // or just click the specific one
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const pivotBtn = btns.find(b => b.textContent.includes('PivotTable'));
    if (pivotBtn) {
        console.log("Found pivot btn");
        pivotBtn.click();
    }
  });

  await new Promise(r => setTimeout(r, 1000));
  
  const dialogExists = await page.evaluate(() => document.body.innerText.includes('Tạo PivotTable'));
  console.log('Dialog exists:', dialogExists);

  // Take screenshot of the whole page
  await page.screenshot({ path: 'chèn-final.png' });

  await browser.close();
})();
