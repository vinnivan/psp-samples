const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');

const Utility = require('./scrape-utilities.js');



 const scrape = async () => {

    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];


    try {
        await driver.get('https://www.plano.gov/1227/City-Council-Agendas');
        let element = await driver.findElement(By.id('ifrm'));
        let tableHtml = await element.getAttribute('src');
		await driver.get(tableHtml);
		let secElement = await driver.findElement(By.id('SearchAgendasMeetings_radGridMeetings_ctl00'));
		let secTableHtml = await secElement.getAttribute('innerHTML');

        let root = HTMLParser.parse(secTableHtml);
        let rows = root.querySelectorAll('tr');
        let title;
        const meetingTime = '7:00 PM';
        let date;
        let link;

        debugger;

        for (let i = 5; i < rows.length; i++) {
			
            const row = rows[i].querySelectorAll('td');
			
			title = row[1].text;
			
			date = `${row[0].text} ${meetingTime}`;
			
			link = 'https://plano.novusagenda.com/agendapublic/' + row[4].querySelector('a').getAttribute('href')
			
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
