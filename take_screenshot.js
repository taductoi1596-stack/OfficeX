const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to full HD
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Navigate to the app
  await page.goto('http://localhost:5180');
  
  // Wait for the app to load (e.g. wait for the ribbon)
  await page.waitForSelector('text/Trang chủ');
  
  // 1. Click H9 (row 9, col 8) -> Wait, how to find the cell?
  // The cells have onMouseDown but no clear ids. The input has id `cell-input-row-col` but it's only rendered when active.
  // The grid is a table. We can click by coordinates or evaluate to find the td.
  await page.evaluate(() => {
    // Find cell H9 (row 9, col 8)
    const td = document.querySelector('tr:nth-child(9) td:nth-child(9)'); // because row header is nth-child(1)
    if (td) {
      const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
      td.dispatchEvent(event);
    }
  });
  
  // Wait for input H9 to appear
  await page.waitForSelector('#cell-input-9-8');
  await page.type('#cell-input-9-8', '25');
  await page.keyboard.press('Tab'); // Move to I9
  
  // Wait for input I9 to appear
  await page.waitForSelector('#cell-input-9-9');
  await page.type('#cell-input-9-9', '63');
  await page.keyboard.press('Tab'); // Move to J9 (col 10)
  
  // Wait for input J9 to appear
  await page.waitForSelector('#cell-input-9-10');
  
  // Click AutoSum dropdown (we can find it by text or icon)
  // Find the AutoSum button
  await page.evaluate(() => {
    // Find the Sigma icon or text "Tự tính tổng"
    const sumBtn = Array.from(document.querySelectorAll('span')).find(el => el.textContent === 'Tự tính tổng');
    if (sumBtn && sumBtn.parentElement) {
      const arrowBtn = sumBtn.parentElement.parentElement.querySelector('button:last-child');
      if (arrowBtn) arrowBtn.click();
    }
  });
  
  // Wait for dropdown
  await page.waitForSelector('text/Trung bình (Average)');
  
  // Click Average
  await page.evaluate(() => {
    const avgBtn = Array.from(document.querySelectorAll('span')).find(el => el.textContent === 'Trung bình (Average)');
    if (avgBtn && avgBtn.parentElement) {
      avgBtn.parentElement.click();
    }
  });
  
  // Wait for the formula to be inserted and value preview to appear
  await page.waitForTimeout(1000);
  
  // Take screenshot 1: Preview
  await page.screenshot({ path: 'C:\\Users\\taduc\\.gemini\\antigravity-ide\\brain\\5eff1fe7-29f8-4923-8101-c086d48ad26d\\preview_tooltip.png' });
  
  // Press Enter to confirm the formula
  await page.keyboard.press('Enter');
  
  // Wait a bit
  await page.waitForTimeout(500);
  
  // Take screenshot 2: Final Result
  await page.screenshot({ path: 'C:\\Users\\taduc\\.gemini\\antigravity-ide\\brain\\5eff1fe7-29f8-4923-8101-c086d48ad26d\\final_result.png' });
  
  await browser.close();
})();
