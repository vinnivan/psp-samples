const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');

const Utility = require('./scrape-utilities.js');



 const scrape = async () => {

    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];


    try {
        await driver.get('https://midland.primegov.com/portal/search');
        let element = await driver.findElement(By.id('2020Meetings'));
        let tableHtml = await element.getAttribute('innerHTML');

        let root = HTMLParser.parse(tableHtml);
        let rows = root.querySelector('tbody').querySelectorAll('tr');
        let title;
        let meetingTime;
        let date;
        let link;
        debugger;

        for (let i = 0; i < rows.length; i++) {
			
            const row = rows[i].querySelectorAll('td');
			
			if (rows[i].getAttribute('role') == 'row') {
			
				title = row[0].text;
				
				date = row[1].text;
				
				link = eval(row[2].querySelector('a').getAttribute('href').replace('javascript:',''));
				
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

function downloadCompiledMeetingDoc(id, number) {
	
	var link = 'https://midland.primegov.com/api/Meeting/getcompiledfiledownloadurl?compiledFileId=' + id;
	
	return link;
	
}

let result = scrape().then(r => {

    console.log(r);
});
