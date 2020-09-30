const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');
const Utility = require('./scrape-utilities.js');

module.exports = async () => {
    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];

    try {
        await driver.get("https://agendalink.co.fort-bend.tx.us:8085/agenda_publish.cfm");

        let element = await driver.findElement(By.css('table#list'));
        let tableHtml = await element.getAttribute('innerHTML');

        let root = HTMLParser.parse(tableHtml);
        let rows = root.querySelectorAll("tr");

        debugger;


        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const columns = row.querySelectorAll("td");

            if (columns.length > 2) {

                let date = columns[0].structuredText;
                let agenda = columns[0].querySelector("a").attributes['href'];
                let title = columns[1].structuredText;
                let meetingDate = processDate(date) + " 1:00 PM";
                let link = "https://agendalink.co.fort-bend.tx.us:8085/" + agenda;

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


    function processDate(stamp) {

        // April 7, 2020

        let elements = stamp.trim().split(" ");

        let month = Utility.monthNumberFromName(elements[0]);


        let day = "00" + elements[1].replace(",","");
        day = day.substr(day.length - 2);

        let year = elements[2];

        if (year.length == 2) {

            year = "20" + year;
        }

        let processedDate = `${month}/${day}/${year}`;
        return processedDate;

    }


}
