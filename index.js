const { chromium } = require('playwright');  // Or 'firefox' or 'webkit'.

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.insidr.ai/ai-tools/');
  // other actions...
  await page.screenshot( {path: "page2.png", fullPage: true});
  await browser.close();
})();



