const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  await page.goto('http://localhost:5182', { waitUntil: 'networkidle2', timeout: 10000 });
  await new Promise(r => setTimeout(r, 1500));

  // Click H1 (empty cell)
  await page.mouse.click(500, 250); 
  await new Promise(r => setTimeout(r, 500));

  // Open Formulas tab
  await page.mouse.click(220, 50); 
  await new Promise(r => setTimeout(r, 500));
  
  // Click AutoSum dropdown
  await page.mouse.click(105, 120); 
  await new Promise(r => setTimeout(r, 500));
  
  // Click Nhân
  await page.evaluate(() => {
    const items = document.querySelectorAll('div');
    for (const el of items) {
      if (el.textContent === 'Nhân') {
        el.click();
        break;
      }
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  
  await page.screenshot({ path: 't3_after_nhan.png' });
  
  // Click H2 (outside)
  await page.mouse.click(500, 300);
  await new Promise(r => setTimeout(r, 1000));
  
  await page.screenshot({ path: 't3_after_outside.png' });
  
  await browser.close();
})();
