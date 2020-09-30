const {Builder, By, Key, until} = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');
const Utility = require('./scrape-utilities.js');

module.exports = async () => {
    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];

    let now = new Date();

    try {

        const rootUrl = "https://v3.boardbook.org/Public/";
        const url = rootUrl + "PublicHome.aspx?ak=888888";
        await driver.get(url);


        let table = await driver.findElement(By.css("#ctl00_ContentPlaceHolder1_gvMeetings"));
        let tableHtml = await table.getAttribute('innerHTML');
        let root = HTMLParser.parse(tableHtml);

        let rows = root.querySelectorAll("tr");

        debugger;


        for (let row of rows) {

            let columns = row.querySelectorAll("td");

            if (!columns || columns.length == 0) {
                continue;
            }


            let linkElement = columns[0].querySelector("a");
            let link = rootUrl + linkElement.getAttribute("href").trim();
            let rawDate = columns[0].text.trim();
            let title = columns[1].text.trim();

            // Monday, April 6, 2020 at 6:00 PM
            let dateTime = rawDate.split("at");
            let dateElement = dateTime[0];
            let timeElement = dateTime[1].trim();

            let dateElements = dateElement.split(",");

            let event = {
                Name: "Board Meeting",
                Description: title,
                Date: `${dateElements[1].trim()}, ${dateElements[2].trim()} ${timeElement}`,
                AgendaUrl: link
            };

            events.push(event);
        }

    } finally {
        await driver.quit();
    }

    return JSON.stringify({
        Events : events,
        Errors: errors
    });
}
