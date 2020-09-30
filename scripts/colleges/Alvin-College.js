const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');
const Utility = require('./scrape-utilities.js');

module.exports = async () => {
    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];

    try {
        await driver.get("http://www.alvincollege.edu/about/college-leadership/board-of-regents/notices-agendas.html");

        let element = await driver.findElement(By.css('.interior-template'));

        let divHtml = await element.getAttribute('innerHTML');

        let root = HTMLParser.parse(divHtml);

        debugger;

        let state = 0;
        let longDate;
        let now = new Date();

        for (let node of root.childNodes) {

            if (node.nodeType != 1) {
                continue;
            }

            switch (state) {
                case 0: // Looking for Date

                    // HtmlNode
                    if (node.tagName === "p") {

                        if (node.childNodes && node.childNodes.length == 1) {
                            if (node.childNodes[0].nodeType == 1 && node.childNodes[0].tagName === "strong") {
                                console.log(node.text);
                                longDate = node.text.trim();

                                if (longDate.endsWith(now.getFullYear().toString()) == false) {
                                    continue;
                                }

                                state = 1;
                            }
                        }
                    }
                    break;

                case 1: // looking for link

                    if (node.tagName === "ul") {

                        var rows = node.querySelectorAll("li");

                        for (let row of rows) {

                            var anchors = row.querySelectorAll("a");

                            for (let anchor of anchors) {

                                try {

                                    if ( !(anchor.text.toLowerCase().indexOf("agenda") >= 0 || 
                                            anchor.text.toLowerCase().indexOf("board meeting") >= 0)) {
                                        continue;
                                    }

                                    let link = anchor.getAttribute("href");

                                    link = "http://www.alvincollege.edu" + link;

                                    // /about/college-leadership/board-of-regents/pdf/agenda/NOTICEofEMERGENCYMeeting-March16-2020.pdf
                                    let title = "BOARD OF REGENTS";

                                    let meetingDate = Utility.processNamedMonthDate(longDate) + " 6:00 PM";

                                    let event = {
                                        Name: title,
                                        Date: meetingDate,
                                        AgendaUrl: link
                                    };

                                    events.push(event);

                                } catch (err) {
                                    errors.push(`Date:${longDate} ${err.message}`);
                                }
                            }

                        }

                        longDate = undefined;
                        state = 0;
                    }
                    break;
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

function processDate(fileName) {
    //                0           1     2
    //NOTICEofEMERGENCYMeeting-March16-2020

    let temp = fileName.toLowerCase();
    let elements = temp.split("-");
    temp = elements[1];
    let year = elements[2];


    let month;

    if (temp.startsWith("january")) {
        month = "01";
        temp = temp.substr(7);
    } else if (temp.startsWith("february")) {
        month = "02";
        temp = temp.substr(8);
    } else if (temp.startsWith("march")) {
        month = "03";
        temp = temp.substr(5);
    } else if (temp.startsWith("april")) {
        month = "04";
        temp = temp.substr(5);
    } else if (temp.startsWith("may")) {
        month = "05";
        temp = temp.substr(3);
    } else if (temp.startsWith("june")) {
        month = "06";
        temp = temp.substr(4);
    } else if (temp.startsWith("july")) {
        month = "07";
        temp = temp.substr(4);
    } else if (temp.startsWith("august")) {
        month = "08";
        temp = temp.substr(6);
    } else if (temp.startsWith("september")) {
        month = "09";
        temp = temp.substr(9);
    } else if (temp.startsWith("october")) {
        month = "10";
        temp = temp.substr(7);
    } else if (temp.startsWith("november")) {
        month = "11";
        temp = temp.substr(8);
    } else if (temp.startsWith("december")) {
        month = "12";
        temp = temp.substr(8);
    } else {
        throw new Error("File name did not start with a month name! File Name:" + temp);
    }

    let day = "00" + temp;
    day = day.substr(day.length - 2);

    let date = `${month}/${day}/${year}`;

    return date;
}