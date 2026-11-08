const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:5182');
  await new Promise(r => setTimeout(r, 1000));
  await page.mouse.click(500, 250);
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
    return JSON.stringify({
      value: input.value,
      display: getComputedStyle(input).display,
      visibility: getComputedStyle(input).visibility,
      color: getComputedStyle(input).color,
      pointerEvents: getComputedStyle(input).pointerEvents,
      opacity: getComputedStyle(input).opacity,
      width: getComputedStyle(input).width,
      height: getComputedStyle(input).height,
    });
  });
  console.log('INPUT:', val);
  
  await browser.close();
})();
