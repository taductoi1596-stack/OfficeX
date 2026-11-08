const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto('http://localhost:5182');

  await page.waitForSelector('.bg-card'); // wait for ribbon

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

  const newButtons = await page.$$('button');
  for (let b of newButtons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('PivotTable')) {
      await b.click();
      console.log('Clicked PivotTable button');
      break;
    }
  }

  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'after-click-pivot.png' });
  
  const dialogExists = await page.evaluate(() => document.body.innerText.includes('Tạo PivotTable'));
  console.log('Dialog exists:', dialogExists);

  await browser.close();
})();
