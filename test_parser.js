const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Get console logs
  const logs = [];
  page.on('console', msg => logs.push({ type: msg.type(), text: msg.text() }));

  await page.goto('http://localhost:5182', { waitUntil: 'networkidle2', timeout: 10000 });
  await new Promise(r => setTimeout(r, 1500));

  // Inject test directly into the page to bypass UI
  const result = await page.evaluate(() => {
    // Test the formula parser directly if accessible
    try {
      // Get React fiber root to access component state
      const root = document.getElementById('root');
      if (!root) return 'no root';
      
      // Look for any debug info or try to test formula parsing
      return 'page loaded';
    } catch(e) {
      return 'error: ' + e.message;
    }
  });
  
  // Check if FormulaParser handles simple expressions correctly by checking the built JS
  const pageContent = await page.evaluate(() => {
    // Check if eval-based approach works for simple expressions
    const testExpr = '10+20';
    const hasDisallowedChars = /[^0-9+\-*/().\s]/.test(testExpr);
    let evalResult;
    try {
      evalResult = eval(testExpr); // eslint-disable-line no-eval
    } catch(e) {
      evalResult = 'eval error: ' + e.message;
    }
    return { hasDisallowedChars, evalResult };
  });
  
  console.log('FormulaParser eval test:', pageContent);
  console.log('Page errors:', logs.filter(l => l.type === 'error').map(l => l.text));

  await browser.close();
})();
