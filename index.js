const { chromium } = require('playwright');  // Or 'firefox' or 'webkit'.

(async () => {
    const browser = await chromium.launch(); // launches Chromium
    const page = await browser.newPage();

    const numPages = 4; // number of pages we want to scrape
    const baseUrl = "https://www.insidr.ai/ai-tools/page/" // will be used in for loop

    for(let pageNum = 1; pageNum <= numPages; pageNum++) { // solves pagination issue
        const url = `${baseUrl}${pageNum}/`;

        try {
            await page.goto(url);
            await page.screenshot({ path: `page${pageNum}.png`, fullPage: true });
        }
        catch { // if error
            console.log(`Error on Page ${pageNum}`); // tells us where error occurred
            await browser.close();
        }
    }
    await browser.close();
})();



