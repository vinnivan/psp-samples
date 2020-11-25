const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');

const Utility = require('./scrape-utilities.js');



 const scrape = async () => {

    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];


    try {
		// All upcoming agendas
        await driver.get('https://www.gptx.org/city-government/city-secretary/city-council-meetings/council-meeting-agendas-action-minutes/-toggle-allupcoming');
		/* All past Agendas
		await driver.get('https://www.gptx.org/city-government/city-secretary/city-council-meetings/council-meeting-agendas-action-minutes/-toggle-allpast');
		*/
		/*All Agendas
		await driver.get('https://www.gptx.org/city-government/city-secretary/city-council-meetings/council-meeting-agendas-action-minutes/-toggle-all');
		*/
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
			
			title = row[0].querySelector('span').text;
			
			date = row[1].querySelectorAll('time')[0].text.split('-')[0];
			
			link = 'https://www.gptx.org/' + row[0].querySelector('a').getAttribute('href');
			
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
