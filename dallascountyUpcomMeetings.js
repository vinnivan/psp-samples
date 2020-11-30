const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');

const Utility = require('./scrape-utilities.js');



 const scrape = async () => {

    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];

    try {
        await driver.get('https://dallascounty.civicweb.net/Portal/MeetingTypeList.aspx');
        let element = await driver.findElement(By.css('.upcoming-meeting-list'));
        let tableHtml = await element.getAttribute('innerHTML');

        let root = HTMLParser.parse(tableHtml);
        let rows = root.querySelectorAll("li");

        let title;
        const meetingTime = "9:00 AM";
        let date;
        let link;

        debugger;

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];

            const linkElement = row.querySelector("a");

            if (linkElement) {

                link = "https://dallascounty.civicweb.net" + linkElement.getAttribute("href");
                title = linkElement.text.trim();

            } else {

                const spans = row.querySelectorAll("span");
                link = undefined;

                for (let span of spans) {

                    title = span.text.trim();

                    if (title.length > 0) {
                        break;
                    }
                }
            }

            let elements = title.split("-");

            title = elements[0].trim();
            let dateString = elements[1].trim();

            date = `${Utility.processNamedMonthDate(dateString)} ${meetingTime}`;



            let event = {
                Name: title,
                Date: date,
                AgendaUrl: link
            };

            events.push(event);


        }
    } catch (err) {

    } finally {
        await driver.quit();
    }

    return {
        Events: events,
        Errors: errors
    };

};


function parseDate(date) {

    let output = {};
    let elements = date.replace(",", "").split(" ");

    if (elements.length < 3) {
        return {
            month: "01",
            day: "01",
            year: "0001"
        };
    }

    let month = elements[0].trim();
    output.month = Utility.monthNumberFromName(month);


    let day = "00" + elements[1].trim();

    output.day = day.substr(day.length - 2);
    output.year = elements[2].trim();

    return output;

};



let result = scrape().then(r => {

    console.log(r);
});
