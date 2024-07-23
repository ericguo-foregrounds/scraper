const { chromium } = require('playwright');  // Or 'firefox' or 'webkit'.
const createCsvWriter = require('csv-writer').createObjectCsvWriter; // requires csv-writer package

(async () => {
    const browser = await chromium.launch(); // launches Chromium
    const page = await browser.newPage();

    const numPages = 41; // number of pages we want to scrape
    const baseUrl = "https://www.insidr.ai/ai-tools/page/" // will be used in for loop

    const csvWriter = createCsvWriter({ // creates csv writer object
        path: 'tooldata.csv',
        header: [
            {id: 'name', title: 'NAME'},
            {id: 'link', title: 'LINK'},
            {id: 'desc', title: 'DESCRIPTION'}
        ]
    });


    const data = []; // array to put all of the data we scrape

    // localized test
    // await page.goto('https://www.insidr.ai/ai-tools/page/2/');

    // const names = await page.locator('.aitools-tool-title').all();
    // const links = await page.locator('.aitools-visit-link').all();
    // const descriptions = await page.locator('.aitools-tool-description').all();

    // for(let i = 0; i < names.length; i++) {
    //     data.push({name: await names[i].innerText(), link: await links[i].getAttribute("href"), desc: await descriptions[i].innerText()});
    // }

    for(let pageNum = 1; pageNum <= numPages; pageNum++) { // solves pagination issue
        const url = `${baseUrl}${pageNum}/`;

        try {
            await page.goto(url);
            const names = await page.locator('.aitools-tool-title').all();
            const links = await page.locator('.aitools-visit-link').all();
            const descriptions = await page.locator('.aitools-tool-description').all();

            for(let i = 0; i < names.length; i++) { // assumes that every name has a link and a description
                data.push({name: await names[i].innerText(), link: await links[i].getAttribute("href"), desc: await descriptions[i].innerText()});
            } 

        }
        catch { // if error
            console.log(`Error on Page ${pageNum}`); // tells us where error occurred
            await browser.close();
        }
    }

    await csvWriter.writeRecords(data);
    console.log("Written to CSV file");
    await browser.close();
 })();
