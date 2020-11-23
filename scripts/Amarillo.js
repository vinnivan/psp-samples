const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');

const Utility = require('./scrape-utilities.js');



 const scrape = async () => {

    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];


    try {
        await driver.get('https://www.amarillo.gov/city-hall/city-government/meeting-agendas-and-minutes');
        let element = await driver.findElement(By.css('.responsive-table-data-mb'));
        let tableHtml = await element.getAttribute('innerHTML');

        let root = HTMLParser.parse(tableHtml);
        let rows = root.querySelector("tbody").querySelectorAll('tr');
        let title;
        let meetingTime;
        let date;
        let link;

        debugger;

        for (let i = 0; i < rows.length; i++) {
			
            const row = rows[i].querySelectorAll('td');
			
			title = row[0].querySelector('a').querySelectorAll('span')[0].text;
			
			date = row[1].querySelectorAll('time')[0].text;
			
			link = 'https://www.amarillo.gov/' + row[2].querySelector('a').getAttribute('href');
			
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
