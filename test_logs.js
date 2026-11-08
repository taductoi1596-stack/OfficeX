const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  await page.goto('http://localhost:5182');
  await new Promise(r => setTimeout(r, 1000));
  await page.mouse.click(600, 250); 
  await page.mouse.click(220, 50); 
  await new Promise(r => setTimeout(r, 500));
  await page.mouse.click(105, 120); 
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => {
    const items = document.querySelectorAll('div');
    for (const el of items) {
      if (el.textContent === 'Tổng') {
        el.click();
        break;
      }
    }
  });
  await new Promise(r => setTimeout(r, 1500));
  await browser.close();
})();
