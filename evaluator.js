const axios = require('axios');
const fs = require('fs');

// This script takes the link and uses Jina AI to scrape the site's homepage.

const rawData = JSON.parse(fs.readFileSync('scrapedData.json', 'utf8'));

const enhancedData = []; // new array containing scraped homepage info

async function scrapeWebsite(link) {
    try {
        const response = await axios.get(`https://r.jina.ai/${link}`);
        let text = response.data;
        console.log("scraped", link);
        text = text.replace(/https?:\/\/\S+\b/g, ''); // Removes URLs
        text = text.replace(/\S+@\S+\.\S+/g, ''); // Removes email addresses
        text = text.trim();
        console.log(`The scraped website homepage is ${text.length} characters`);
        return text;
    }
    catch (err) {
        console.log("JinaAI error scraping website", err);
        return "";
    }
}

let currentIndex = 0; // current index of rawData

function iterateData() { // iterates over rawData
    if (currentIndex < rawData.length) { // recursive function - acts as a for loop
        const tool = rawData[currentIndex];
        const name = tool.name;
        const link = tool.link;
        const desc = tool.desc;

        if (link !== "Link Missing") { // if link is not missing
            scrapeWebsite(link).then(homepage => {
                enhancedData.push({ name: name, link: link, desc: desc, homepage: homepage });
                currentIndex++;
                setTimeout(iterateData, 9000); // Wait for 30 seconds before processing the next item
            }).catch(err => {
                console.log("Error processing link", link, err);
                currentIndex++;
                setTimeout(iterateData, 9000);
            });
        } else { // if link is missing
            enhancedData.push({ name: name, link: link, desc: desc, homepage: "" });
            currentIndex++;
            setTimeout(iterateData, 9000);
        }
    } else { // at the end, if currentIndex === rawData.length meaning that we've iterated thru the entire array
        fs.writeFile('enhancedData.json', JSON.stringify(enhancedData, null, 2), (err) => {
            if (err) throw err;
            console.log('Enhanced data saved.');
        });
    }
}

// Start the process
iterateData();