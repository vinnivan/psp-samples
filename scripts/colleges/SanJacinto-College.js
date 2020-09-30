const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');
const Utility = require('./scrape-utilities.js');

module.exports = async () => {
    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];

    try {
        await driver.get("https://www.sanjac.edu/board-meeting-agendas");
        // div.field--name-body > h2
        let elements = await driver.findElements(By.css('.content'));

        let rows;

        for (let element of elements) {

            let divHtml = await element.getAttribute('innerHTML');

            let root = HTMLParser.parse(divHtml);
            // verify we're in the right spot
            let title = root.querySelector("h2");
            if (title) {
                rows = root.querySelectorAll("p");
                break;
            }

        }

        if (!rows) {

            errors.push("Verify CSS selector - agenda paragraphs not found!");

            return JSON.stringify({
                Events: events,
                Errors: errors
            });
        }

        debugger;

        let now = new Date();

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];

            try {
                // sample - "Board Agenda January 2020"
                let anchor = row.querySelector("a");
                if (!anchor) {
                    continue;
                }
                let title = anchor.attributes['title'];
                let elements = title.split(" ");

                let year = elements[elements.length - 1];

                if (parseInt(year) < now.getFullYear()) {
                    break;
                }

                let spliceIndex = elements.length - 2;
                let day = 1;
                let monthName = elements[elements.length - 2];

                if (monthName.indexOf(",") > 0) {

                    spliceIndex = elements.length - 3;
                    day = "00" + monthName.replace(",", "");
                    day = day.substr(day.length - 2);

                    monthName = elements[elements.length - 3];
                }

                let month = Utility.monthNumberFromName(monthName);
                let meetingDate = `${month}/${day}/${year} 7:00 PM`;

                elements = elements.splice(0, spliceIndex);
                title = elements.join(" ");
                let link = row.querySelector("a").attributes['href'];

                let event = {
                    Name: title,
                    Date: meetingDate,
                    AgendaUrl: link
                };

                events.push(event);
            } catch (err) {
                errors.push(`index:${i} ${err.message}`);
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
