const {Builder, By, Key, until} = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');
const Utility = require('./scrape-utilities.js');

module.exports = async () => {
    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];

    try {
        await driver.get('https://www.alvinisd.net/Page/39890');
        let element = await driver.findElement(By.css('table'));
        let tableHtml = await element.getAttribute('innerHTML');

        let root = HTMLParser.parse(tableHtml);
        let rows = root.querySelectorAll("tr");

        debugger;

        for (let i = 1; i < rows.length; i++) { 
            const row = rows[i];
            const columns = row.querySelectorAll("td");

            const links = columns[1].querySelectorAll("a");


            for (let j = 0; j < links.length; j++) {
                const link = links[j].getAttribute("href");
                const timeText = links[j].text.trim();

                // Exclude string like this: 
                // March 26, 2020 - SCHOOL SAFETY COMMITTEE MEETING
                if (timeText.length > 25 || timeText.length == 0) {
                    continue;
                }

                //March 3, 2020
                const date = Utility.processNamedMonthDate(timeText) + " 7:00 PM";
                const title = "Board Meeting";

                let event = {
                    Name: title,
                    Date: date,
                    AgendaUrl: link
                };

                events.push(event);
           }
        }  

    } finally {
        await driver.quit();
    }

    return JSON.stringify({
        Events : events,
        Errors: errors
    });
}
