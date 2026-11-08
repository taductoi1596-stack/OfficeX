const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  await page.goto('http://localhost:5182', { waitUntil: 'networkidle2', timeout: 10000 });
  await new Promise(r => setTimeout(r, 1500));

  // Enter 10 in A1
  await page.mouse.click(50, 250); // Click A1
  await page.keyboard.type('10');
  await page.keyboard.press('Enter'); // Moves to A2

  // Enter 20 in A2
  await page.keyboard.type('20');
  await page.keyboard.press('Enter'); // Moves to A3
  await new Promise(r => setTimeout(r, 500));

  // Click Thêm
  // The Thêm button is in the AutoSum dropdown
  // Open Formulas tab
  await page.mouse.click(220, 50); // Formulas tab
  await new Promise(r => setTimeout(r, 500));
  
  // Click AutoSum dropdown
  await page.mouse.click(105, 120); 
  await new Promise(r => setTimeout(r, 500));
  
  // Click Thêm
  await page.evaluate(() => {
    const items = document.querySelectorAll('div');
    for (const el of items) {
      if (el.textContent === 'Thêm') {
        el.click();
        break;
      }
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  
  await page.screenshot({ path: 't2_after_them.png' });
  
  // Double click A3 to see what happens
  await page.mouse.click(50, 300, { clickCount: 2 });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 't2_after_doubleclick.png' });
  
  // Read value of the input
  const val = await page.evaluate(() => {
    const input = document.getElementById('cell-input-3-1');
    return {
      value: input ? input.value : null,
      isFocused: document.activeElement === input,
      color: input ? window.getComputedStyle(input).color : null,
      caretColor: input ? window.getComputedStyle(input).caretColor : null
    };
  });
  
  console.log("Input State:", val);
  await browser.close();
})();
