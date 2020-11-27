const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');

const Utility = require('./scrape-utilities.js');



 const scrape = async () => {

    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];


    try {
        await driver.get('https://www.cityofmesquite.com/AgendaCenter/City-Council-1');
        let element = await driver.findElement(By.id('table1'));
        let tableHtml = await element.getAttribute('innerHTML');

        let root = HTMLParser.parse(tableHtml);
        let rows = root.querySelector("tbody").querySelectorAll('tr');
        let title;
        const meetingTime = '5:00 PM';
        let date;
        let link;

        debugger;

        for (let i = 0; i < rows.length; i++) {
			
            const row = rows[i].querySelectorAll('td');
			
			title = row[0].querySelector('p').text;
			
			date = row[0].querySelectorAll('a')[1].querySelector('abbr').text + row[0].querySelectorAll('a')[1].querySelector('strong').childNodes[1].text;
			
			date = `${Utility.processNamedMonthDate(date)} ${meetingTime}`;
			
			link = 'https://www.cityofmesquite.com/' + row[0].querySelectorAll('a')[1].getAttribute('href');
			
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
