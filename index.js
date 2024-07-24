const { chromium } = require('playwright');  // Or 'firefox' or 'webkit'.
const createCsvWriter = require('csv-writer').createObjectCsvWriter; // requires csv-writer package

(async () => {
    const browser = await chromium.launch(); // launches Chromium
    const page = await browser.newPage();

    const numPages = 41; // number of pages we want to scrape
    const baseUrl = "https://www.insidr.ai/ai-tools/page/" // will be used in the for loop

    const csvWriter = createCsvWriter({ // creates csv writer object
        path: 'tooldata.csv',
        header: [
            { id: 'name', title: 'NAME' },
            { id: 'link', title: 'LINK' },
            { id: 'desc', title: 'DESCRIPTION' }
        ]
    });


    const data = []; // array to put all of the data we scrape

    // localized test
    // await page.goto('https://www.insidr.ai/ai-tools/page/21/');
    // console.log("page loaded");

    // const tools = await page.locator('.aitools-item').all();
    // const names = await page.locator('.aitools-tool-title').all();
    // const links = await page.locator('.aitools-visit-link').all();
    // const descriptions = await page.locator('.aitools-tool-description').all();

    // for (let i = 0; i < tools.length; i++) {
    //     console.log(await tools[i].innerText());
    //     const name = await names[i].innerText();
    //     const desc = await descriptions[i].innerText();
    //     if ((await tools[i].innerText()).includes("Visit tool") === false) {
    //         console.log("Link Missing");
    //         data.push({ name: name, link: "Missing Link", desc: desc });
    //         console.log(links);
    //     }
    //     else {
    //         data.push({ name: name, link: await links[0].getAttribute("href"), desc: desc });
    //         links.shift();
    //         console.log(links);
    //     }
    // }

    // console.log(data);


    for (let pageNum = 1; pageNum <= numPages; pageNum++) { // solves pagination issue
        const url = `${baseUrl}${pageNum}/`;

        try {
            await page.goto(url, {timeout: 90000}); // sometimes Insidr AI's pages won't load - this sets a timeout of 1 min 30 s for a page to load
            console.log(`Now on page ${pageNum}`); // console.logs throughout to notify which step you're on in the terminal
            const tools = await page.locator('.aitools-item').all(); // on Insidr's page, each tool has its own div container. This will find all of the container divs on a page
            const names = await page.locator('.aitools-tool-title').all(); // finds all names of tools on page
            const links = await page.locator('.aitools-visit-link').all(); // finds all links of tools on page, if a link is provided
            const descriptions = await page.locator('.aitools-tool-description').all(); // finds all descriptions of tools on page

            for (let i = 0; i < tools.length; i++) { // for the current page being scraped
                const name = await names[i].innerText(); 
                const desc = await descriptions[i].innerText();
                // if a link is present, there will be a "visit tool" button, checks if one is present for each tool div
                if ((await tools[i].innerText()).includes("Visit tool") === false) { 
                    console.log("Link Missing"); // Will alert in terminal if tool is missing link
                    data.push({ name: name, link: "Missing Link", desc: desc }); // CSV file will show tool is missing link
                }
                else { // if links are missing on the page, the array links.length !== tools.length
                    data.push({ name: name, link: await links[0].getAttribute("href"), desc: desc });
                    links.shift(); // since we're going sequentially through the tools, if link is present, remove it from links array after it has been added to csv.
                    // this way we won't need two for loops
                }
            }
            console.log(`Page ${pageNum} done`); 
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
