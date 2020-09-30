const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');
const Utility = require('./scrape-utilities.js');

module.exports = async () => {
    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];

    try {
        //                https://leaguecity.legistar.com/View.ashx?M=A&ID=762073&GUID=FA466027-32DF-4616-84B4-4CF95BA0D6F0
        await driver.get("https://leaguecity.legistar.com/calendar.aspx");

        let element = await driver.findElement(By.css('table.rgMasterTable'));
        let tableHtml = await element.getAttribute('innerHTML');

        let root = HTMLParser.parse(tableHtml);
        let rows = root.querySelectorAll("tr");

        debugger;


        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const columns = row.querySelectorAll("td");

            if (columns.length > 2) {

                let title = columns[0].structuredText;

                // 4/28/2020
                let date = columns[1].structuredText;
                let meetingDate = Utility.processNumericDate(date);
                
                let time = columns[3].structuredText;
                time = Utility.processTime(time);

                meetingDate = `${meetingDate} ${time}`;

                let agenda = columns[6].querySelector("a").attributes['href'];
                let link = "https://leaguecity.legistar.com/" + agenda;

                if (!agenda) {
                    link = undefined;
                }

                let event = {
                    Name: title,
                    Date: meetingDate,
                    AgendaUrl: link
                };

                events.push(event);
            }

        }

    } finally {
        await driver.quit();
    }

    return JSON.stringify({
        Events: events,
        Errors: errors
    });


}
