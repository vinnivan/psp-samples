const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');

const Utility = require('./scrape-utilities.js');



 const scrape = async () => {

    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];


    try {
        await driver.get('http://wacocitytx.iqm2.com/Citizens/Default.aspx');
        let element = await driver.findElement(By.id('ContentPlaceholder1_pnlUpcomingMeetings'));
        let tableHtml = await element.getAttribute('innerHTML');

        let root = HTMLParser.parse(tableHtml);
        let rows = root.querySelectorAll('div');
        let title;
        let meetingTime;
        let date;
        let link;

        debugger;

        for (let i = 3; i < rows.length; i++) {
			
            const row = rows[i];
			
			if (row.getAttribute('class') == 'Row MeetingRow' || row.getAttribute('class') == 'Row MeetingRow Alt') {
				
				title = row.querySelector('.RowBottom').querySelectorAll('div')[1].text;
				
				date = row.querySelector('.RowLink').querySelector('a').text.substr(0,12);
				
				meetingTime = row.querySelector('.RowLink').querySelector('a').text.substr(13,20);
				
				date = `${Utility.processNamedMonthDate(date)} ${meetingTime}`;
				
				link = 'http://wacocitytx.iqm2.com/' + row.querySelector('.RowLink').querySelector('a').getAttribute('href');
				
				let event = {
					Name: title,
					Date: date,
					AgendaUrl: link
				};

				events.push(event);
				
			}

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
