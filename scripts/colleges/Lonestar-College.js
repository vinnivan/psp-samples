const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');
const Utility = require('./scrape-utilities.js');

module.exports = async () => {
    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];

    try {
        await driver.get("http://www.lonestar.edu/board-agendas.htm");

        debugger;

        let element = await driver.findElement(By.css('.content-well'));

        let divHtml = await element.getAttribute('innerHTML');

        let root = HTMLParser.parse(divHtml);

        // verify we're in the right spot
        let firstGroup = root.querySelector("ul");

        var rows = firstGroup.querySelectorAll("li");

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];

            try {
                // sample - "Board Agenda January 2020"
                let anchor = row.querySelector("a");
                if (!anchor) {
                    continue;
                }


                let link = anchor.getAttribute("href");
                link = "http://www.lonestar.edu" + link;

                let title = anchor.text;
                let elements = title.split(" ");

                let dateElements = elements.splice(0, 3)
                let date = dateElements.join(" ");
                title = elements.join(" ");

                let meetingDate = Utility.processNamedMonthDate(date) + " 5:00 PM";

                let event = {
                    Name: "Regular Board Meeting",
                    Description: title,
                    Date: meetingDate,
                    AgendaUrl: link
                };

                events.push(event);
            } catch (err) {
                errors.push(`index:${i} ${err.message}`);
            }
        }
    } catch (err) {
        console.log(err);
    
    } finally {
        await driver.quit();
    }

    return JSON.stringify({
        Events: events,
        Errors: errors
    });


}
