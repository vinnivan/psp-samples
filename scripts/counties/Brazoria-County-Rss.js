let Parser = require('rss-parser');
let utilities = require('./scrape-utilities.js');
let parser = new Parser();

module.exports = async () => {
    let events = [];
    let errors = [];

    try {

        debugger;


        let feed = await parser.parseURL('https://brazoriacountytx.iqm2.com/Services/RSS.aspx?Feed=Calendar');

        feed.items.forEach(item => {

            let event = {
                Name: '',
                Date: '',
                AgendaUrl: item.link
            };

            // Description: item.content


            if (processTitle(item, event) == true) {
                events.push(event);
            }

        });

    } catch(err) {

        errors.push(err.message);

    } finally {

    }

    return JSON.stringify({
        Events : events,
        Errors: errors
    });

}

function processTitle(item , event) {
    // process title - Commissioners' Court - Agenda - Apr 2, 2020 2:00 PM

    let elements = item.title.split("-");

    if (elements.length < 3) {
        return false;
    }

    if (elements[1].trim().toLowerCase() !== "agenda") {
        return false;
    }

    event.Name = elements[0].trim();

    let stampElements = elements[2].trim().split(" ");
    if (stampElements.length < 5) {
        return false;
    }

    let month = utilities.monthNumberFromName(stampElements[0]);
    let day = stampElements[1].replace(",", "");
    day = "00" + day;
    day = day.substr(day.length - 2, 2);

    year = stampElements[2];

    let time = stampElements[3];
    let amPm = stampElements[4];

    event.Date = `${month}/${day}/${year} ${time} ${amPm}`;

    return true;
}
