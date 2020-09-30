let Parser = require('rss-parser');
let parser = new Parser();
const Utility = require('./scrape-utilities.js');

module.exports = async () => {
    let events = [];
    let errors = [];
    try {
        debugger;

        const rss = "https://www.galvestontx.gov/RSSFeed.aspx?ModID=58&CID=Main-Calendar-14";

        let feed = await parser.parseURL(rss);

        for (let item of feed.items) {

            if (!item.title.startsWith("City Council")) {
                continue;
            }

            let elements = item.content.split("<br>");
            let date = elements[0];
            let start = date.indexOf("</strong>");
            date = date.substring(start + 9).trim();

            let time = elements[1];
            start = time.indexOf("</strong>");
            elements = time.substring(start + 9).trim().split("-");
            time = elements[0].replace(" ", "");

            date = `${Utility.processNamedMonthDate(date)} ${time}`;

            let event = {
                Name: item.title,
                Date: date,
                AgendaUrl: item.link
            };
            events.push(event);
        }

    } catch (err) {
        errors.push(err.message);
    } finally { }
    return JSON.stringify({
        Events: events,
        Errors: errors
    });
}