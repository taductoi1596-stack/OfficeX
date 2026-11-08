const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:5182');
  await new Promise(r => setTimeout(r, 1000));
  await page.mouse.click(600, 250); // E1 or F1
  await page.mouse.click(220, 50); // Formulas
  await new Promise(r => setTimeout(r, 500));
  await page.mouse.click(105, 120); // AutoSum
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
  
  const val = await page.evaluate(() => {
    const active = document.querySelector('td.border-\\[2px\\]');
    if (!active) return 'NO_ACTIVE_TD';
    return {
      html: active.innerHTML,
      text: active.innerText
    };
  });
  console.log('TD CONTENT:', val);
  
  await browser.close();
})();
