const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');

const Utility = require('./scrape-utilities.js');



 const scrape = async () => {

    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];


    try {
		//Recent meetings
        await driver.get('https://agenda.friscotexas.gov/OnBaseAgendaOnline/');
        let element = await driver.findElement(By.id('meeting-list-recent'));
        let tableHtml = await element.getAttribute('innerHTML');

        let root = HTMLParser.parse(tableHtml);
        let rows = root.querySelector("tbody").querySelectorAll('tr');
        let title;
        let meetingTime;
        let date;
        let link;

        debugger;

        for (let i = 0; i < rows.length-1; i++) {
			
            const row = rows[i].querySelectorAll('td');
			
			title = row[0].text;
			
			date = row[2].text;
			
			link = 'https://agenda.friscotexas.gov/' + row[5].querySelector('a').getAttribute('href');
			
            let event = {
                Name: title,
                Date: date,
                AgendaUrl: link
            };

            events.push(event);


        }
		//Upcoming meetings
		/*
		await driver.get('https://agenda.friscotexas.gov/OnBaseAgendaOnline/');
        let element = await driver.findElement(By.id('meetings-list-upcoming'));
        let tableHtml = await element.getAttribute('innerHTML');

        let root = HTMLParser.parse(tableHtml);
        let rows = root.querySelector("tbody").querySelectorAll('tr');
        let title;
        let meetingTime;
        let date;
        let link;

        debugger;

        for (let i = 0; i < rows.length-1; i++) {
			
            const row = rows[i].querySelectorAll('td');
			
			title = row[0].text;
			
			date = row[2].text;
			
			if (row[5].querySelector('a')) {
				
				link = 'https://agenda.friscotexas.gov/' + row[5].querySelector('a').getAttribute('href');
				
			}
			else {
				 
				 link = undefined;
				 
			};
			
            let event = {
                Name: title,
                Date: date,
                AgendaUrl: link
            };

            events.push(event);


        }
		*/
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
