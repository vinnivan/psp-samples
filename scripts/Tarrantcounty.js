const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');

const Utility = require('./scrape-utilities.js');



 const scrape = async () => {

    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];

    /* https://pearlandtx.civicweb.net/Portal/MeetingInformation.aspx?Org=Cal&Id=530 */
    try {
        await driver.get('http://courtbook.tarrantcounty.com/sirepub/meet.aspx');
        let element = await driver.findElement(By.css('table#Table4'));
        let tableHtml = await element.getAttribute('innerHTML');

        let root = HTMLParser.parse(tableHtml);
        let rows = root.querySelectorAll(".public_meeting");
        let title;
        let meetingTime;
        let date;
		let year;
		let month;
		let day;
        let link;
		let info
		
        debugger;

        for (let i = 0; i < rows.length; i++) {
			
            const row = rows[i];
			
			info = row.querySelectorAll('td');
			
			let elements = info[2].text.split(',');
			
			rawDate = elements[1].trim().toLowerCase();
			month = Utility.monthNumberFromName(rawDate);
			day = rawDate.substr(rawDate.length - 2, rawDate.length);
			year = elements[2].trim();
			time = info[3].text;
			date = month + '/' + day + '/' + year + ' ' + time;
			
			title = info[4].text;
			
			link = 'http://courtbook.tarrantcounty.com/sirepub/' + info[5].querySelector('a').getAttribute('href');
			
            let event = {
                Name: title,
                Date: date,
                AgendaUrl: link
            };

            events.push(event);


        }
    } catch (err) {
		console.log(err)
    } finally {
        await driver.quit();
    }

    return {
        Events: events,
        Errors: errors
    };

};




let result = scrape().then(r => {

    console.log(r);
});
