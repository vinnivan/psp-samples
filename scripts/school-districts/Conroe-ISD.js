const {Builder, By, Key, until} = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');
const Utility = require('./scrape-utilities.js');

module.exports = async () => {
    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];

    let now = new Date();

    try {

        debugger;


        await driver.get('https://www.conroeisd.net/superintendent-board-of-trustees/board-meeting-information/');
        let elements = await driver.findElements(By.css("section[data-type='accordion']"));

        for (let element of elements) {

            let tableHtml = await element.getAttribute('innerHTML');

            let root = HTMLParser.parse(tableHtml);
            let titleElement = root.querySelector("h2.panel-title.pa-title");

            let header = titleElement.text;

            if (header.substr(header.length - 4) === now.getFullYear().toString()) {

                let articles = root.querySelectorAll("article");

                for (let article of articles) {

                    let articleTitle = article.querySelector("span.ac-header-inner").text.trim();

                    if (articleTitle.toLowerCase() === "agendas") {

                        let links = article.querySelectorAll("a");

                        for (let link of links) {

                            try {

                                //7_29_19 Board Workshop
                                var title = link.childNodes[0].text;

                                var span = link.querySelector("span");

                                if (span) {
                                    title = `${title} ${span.childNodes[0].text}`;
                                }

                                var textParts = title.split(" ");
                                var linkElements = textParts[0].split("_");

                                var month = "00" + linkElements[0];
                                month = month.substr(month.length - 2);
                                var day = "00" + linkElements[1];
                                day = day.substr(day.length - 2);
                                var year = linkElements[2];

                                if (year === "19") {
                                    continue;
                                } else {
                                    year = "20" + year;
                                }

                                let event = {
                                    Name: title,
                                    AgendaUrl: link.getAttribute("href"),
                                    Date: `${month}/${day}/${year} 6:00 PM`
                                }

                                events.push(event);
                            } catch (e) {
                                errors.push(e.message);
                            }
                        }
                    }
                }

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
