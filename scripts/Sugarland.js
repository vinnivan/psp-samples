const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');

const Utility = require('./scrape-utilities.js');



 const scrape = async () => {

    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];


    try {
        await driver.get('http://webtools.sugarlandtx.gov/sl/agenda/index.html');
        let element = await driver.findElement(By.tagName('iframe'));
        let tableHtml = await element.getAttribute('src');
		
		await driver.get(tableHtml);
		let secElement = await driver.findElement(By.id("meetings"));
		let secTableHtml = await secElement.getAttribute('innerHTML');

        let root = HTMLParser.parse(secTableHtml);
        let rows = root.querySelector("tbody").querySelectorAll('tr');
        let title;
        const meetingTime = '5:30 PM';
        let date;
        let link;

        debugger;

        for (let i = 1; i < rows.length; i+=2) {
			
            const row = rows[i].querySelectorAll('td');
			
			title = row[2].querySelectorAll('div')[1].text.trim();
			
			date = `${row[1].text} ${meetingTime}`;
			
			link = 'https://sugarland.novusagenda.com/Agendapublic/' + row[5].querySelector('a').getAttribute('href')
			
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
