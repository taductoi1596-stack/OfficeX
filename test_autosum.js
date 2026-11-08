const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });
  
  const errors = [];
  page.on('console', msg => { 
    if (msg.type() === 'error') errors.push(msg.text()); 
    if (msg.text().includes('CommandDispatcher') || msg.text().includes('AUTOSUM') || msg.text().includes('ARITHMETIC')) {
      console.log('LOG:', msg.text());
    }
  });

  await page.goto('http://localhost:5182', { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  // ========== TEST 1: Thêm (Add) ==========
  console.log('=== TEST 1: Thêm ===');
  
  // Click A1
  await page.evaluate(() => {
    const tds = document.querySelectorAll('td');
    for (const td of tds) {
      td.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      break;
    }
  });
  await new Promise(r => setTimeout(r, 200));

  let inp = await page.$('input[id^="cell-input-"]');
  if (inp) { await inp.type('10'); await page.keyboard.press('Enter'); }
  await new Promise(r => setTimeout(r, 200));

  inp = await page.$('input[id^="cell-input-"]');
  if (inp) { await inp.type('20'); await page.keyboard.press('Enter'); }
  await new Promise(r => setTimeout(r, 300));

  await page.screenshot({ path: 'C:/Users/taduc/.gemini/antigravity-ide/brain/5eff1fe7-29f8-4923-8101-c086d48ad26d/t1_data.png' });

  // Click AutoSum chevron
  const chevronClicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const chevron = btns.find(b => b.className.includes('border-l') && b.querySelector('svg'));
    if (chevron) { chevron.click(); return true; }
    return false;
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'C:/Users/taduc/.gemini/antigravity-ide/brain/5eff1fe7-29f8-4923-8101-c086d48ad26d/t1_dropdown.png' });

  // Click Thêm
  const themClicked = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const item = all.find(el => el.textContent?.trim() === 'Thêm' && el.tagName !== 'BODY' && el.tagName !== 'HTML');
    if (item) { item.dispatchEvent(new MouseEvent('click', { bubbles: true })); return item.tagName + ':' + item.className; }
    return 'NOT FOUND';
  });
  console.log('Thêm element clicked:', themClicked);
  await new Promise(r => setTimeout(r, 600));
  
  await page.screenshot({ path: 'C:/Users/taduc/.gemini/antigravity-ide/brain/5eff1fe7-29f8-4923-8101-c086d48ad26d/t1_formula.png' });
  
  // Check what formula is in the input
  const formula1 = await page.evaluate(() => {
    const inp = document.querySelector('input[id^="cell-input-"]');
    return inp ? inp.value : 'no input found';
  });
  console.log('Formula in cell:', formula1);
  
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 500));
  
  await page.screenshot({ path: 'C:/Users/taduc/.gemini/antigravity-ide/brain/5eff1fe7-29f8-4923-8101-c086d48ad26d/t1_result.png' });

  // ========== TEST 2: AVERAGE ==========
  console.log('=== TEST 2: AVERAGE ===');

  // Go to B1 and enter 25, 63
  await page.evaluate(() => {
    const tds = Array.from(document.querySelectorAll('td'));
    if (tds[1]) tds[1].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 200));
  inp = await page.$('input[id^="cell-input-"]');
  if (inp) { await inp.type('25'); await page.keyboard.press('Enter'); }
  await new Promise(r => setTimeout(r, 200));
  inp = await page.$('input[id^="cell-input-"]');
  if (inp) { await inp.type('63'); await page.keyboard.press('Enter'); }
  await new Promise(r => setTimeout(r, 300));

  // Open dropdown and click Average
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const chevron = btns.find(b => b.className.includes('border-l') && b.querySelector('svg'));
    if (chevron) chevron.click();
  });
  await new Promise(r => setTimeout(r, 400));

  await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const item = all.find(el => el.textContent?.trim() === 'Trung bình' && el.tagName !== 'BODY');
    if (item) item.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 600));
  
  const formula2 = await page.evaluate(() => {
    const inp = document.querySelector('input[id^="cell-input-"]');
    return inp ? inp.value : 'no input';
  });
  console.log('Average formula:', formula2);
  
  await page.screenshot({ path: 'C:/Users/taduc/.gemini/antigravity-ide/brain/5eff1fe7-29f8-4923-8101-c086d48ad26d/t2_avg_formula.png' });
  
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'C:/Users/taduc/.gemini/antigravity-ide/brain/5eff1fe7-29f8-4923-8101-c086d48ad26d/t2_avg_result.png' });
  
  console.log('Errors:', errors);
  await browser.close();
})();
