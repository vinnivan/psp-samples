const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');

const Utility = require('./scrape-utilities.js');



 const scrape = async () => {

    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];


    try {
        await driver.get('https://www.thewoodlandstownship-tx.gov/991/Agendas-Minutes-and-More');
        let element = await driver.findElement(By.tagName('iframe'));
        let tableHtml = await element.getAttribute('src');
		
		await driver.get(tableHtml);
		let secElement = await driver.findElement(By.id("list"));
		let secTableHtml = await secElement.getAttribute('innerHTML');

        let root = HTMLParser.parse(secTableHtml);
        let rows = root.querySelector("tbody").querySelectorAll('tr');
        let title;
        const meetingTime = '3:00 PM';
        let date;
        let link;

        debugger;

        for (let i = 0; i < rows.length; i++) {
			
            const row = rows[i].querySelectorAll('td');
			
			title = row[1].childNodes[0].text.trim();
			
			date = `${Utility.processNamedMonthDate(row[0].querySelector('a').text)} ${meetingTime}`;
			
			link = 'https://destinyhosted.com/' + row[0].querySelector('a').getAttribute('href')
			
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
