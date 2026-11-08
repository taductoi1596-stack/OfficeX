const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
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
  
  const val = await page.evaluate(() => {
    const input = document.querySelector('input[id^="cell-input"]');
    if (!input) return 'NO_INPUT';
    const td = input.closest('td');
    return {
      html: td.innerHTML,
      text: td.innerText,
      class: td.className
    };
  });
  console.log('TD CONTENT:', val);
  
  await browser.close();
})();
