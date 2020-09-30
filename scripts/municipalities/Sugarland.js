const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');
const Utility = require('./scrape-utilities.js');

module.exports = async () => {
    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];

    debugger;


    try {
        await driver.get("https://sugarland.novusagenda.com/Agendapublic/meetingsresponsive.aspx?Date=12ms");

        let element = await driver.findElement(By.css('.table.table-condensed'));
        let tableHtml = await element.getAttribute('innerHTML');

        let root = HTMLParser.parse(tableHtml);
        let rows = root.querySelectorAll("tr");



        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const columns = row.querySelectorAll("td");

            if (columns.length > 4) {

                let stamp = columns[1].structuredText;
                let meetingDate = processDate(stamp);
                let title = columns[2].structuredText.split("\n")[0].trim();

                if (title.toLowerCase().indexOf("city council") < 0) {
                    continue;
                }

                let location = columns[3].structuredText;
                let agenda = columns[5].querySelector("a").attributes['href'];

                let link = "https://sugarland.novusagenda.com/Agendapublic/" + agenda;
                console.log(link);

                let event = {
                    Name: title,
                    Date: meetingDate,
                    AgendaUrl: link,
                    Description: location
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

        let elements = stamp.trim().split("/");

        let month = "00" + elements[0]
        month = month.substr(month.length - 2);

        let day = "00" + elements[1];
        day = day.substr(day.length - 2);

        let year = elements[2];

        if (year.length == 2) {

            year = "20" + year;
        }

        let processedDate = `${month}/${day}/${year} 05:30 PM`;
        return processedDate;

    }


}
