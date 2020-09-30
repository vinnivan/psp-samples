const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');
//const Utility = require('./scrape-utilities.js');

const Utility = require('../scripts/scrape-utilities.js');

// debugger;

//module.exports = async () => {
 const scrape = async () => {

    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];

    /* https://pearlandtx.civicweb.net/Portal/MeetingInformation.aspx?Org=Cal&Id=530 */
    try {
        await driver.get('https://www.pearlandtx.gov/government/agendas/city-council');
        let element = await driver.findElement(By.css('.upcoming-meeting-list'));
        let tableHtml = await element.getAttribute('innerHTML');

        let root = HTMLParser.parse(tableHtml);
        let rows = root.querySelectorAll("li");

        let title;
        const meetingTime = "6:30 PM";
        let date;
        let link;

        debugger;

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];

            const linkElement = row.querySelector("a");

            if (linkElement) {

                link = "https://pearlandtx.civicweb.net" + linkElement.getAttribute("href");
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

    return JSON.stringify({
        Events: events,
        Errors: errors
    });

};

let result = scrape();

console.log(result);




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