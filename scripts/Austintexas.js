const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');

const Utility = require('./scrape-utilities.js');



 const scrape = async () => {

    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];

    /* https://pearlandtx.civicweb.net/Portal/MeetingInformation.aspx?Org=Cal&Id=530 */
    try {
        await driver.get('https://www.austintexas.gov/department/city-council/council/council_meeting_info_center.htm');
        let element = await driver.findElement(By.css('div#edims table:nth-of-type(1)'));
        let tableHtml = await element.getAttribute('innerHTML');

        let root = HTMLParser.parse(tableHtml);
        let rows = root.querySelectorAll("tr");
        let title;
        const meetingTime = "10:00 AM"
        let date;
        let link;
		
        debugger;

        for (let i = 0; i < rows.length; i++) {
			
            const row = rows[i];
			
			date = `${row.querySelectorAll('p')[0].text} ${meetingTime}`;
			
			title = row.querySelectorAll('p')[1].text;
			
			link = 'https://www.austintexas.gov/' + row.querySelector('a').getAttribute('href');
			
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
