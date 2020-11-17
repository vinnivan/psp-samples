const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');

const Utility = require('./scrape-utilities.js');



 const scrape = async () => {

    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];


    try {
        await driver.get('http://agenda.elpasotexas.gov/sirepub/meetresults.aspx');
        let element = await driver.findElement(By.css(".category-tab-list"));
        let tableHtml = await element.getAttribute('innerHTML');

        let root = HTMLParser.parse(tableHtml);
		
		let rows = root.querySelectorAll('li');
		var d = new Date();
		const currentYear = d.getFullYear();
		
		let URL 
		
		for (let i = 0; i < rows.length; i++) {
			let row = rows[i]
			if (row.querySelector('a').text == currentYear) {
				URL = 'http://agenda.elpasotexas.gov/sirepub/' + row.querySelector('a').getAttribute('rel')
			}
		};
		await driver.get(URL);
		let secElement = await driver.findElement(By.css('.results_table'));
		let secTableHtml = await secElement.getAttribute('innerHTML');
		
		let secRoot = HTMLParser.parse(secTableHtml);
		let elements = secRoot.querySelectorAll('tr');
        let title;
        const meetingTime = '3:30 PM';
        let date;
        let link;

        debugger;

        for (let i = 1; i < elements.length; i++) {
			
            const info = elements[i];
			
			title = info.querySelectorAll('td')[0].text;
			
			date = info.querySelectorAll('td')[1].text + ' ' + meetingTime;
			
			link = 'http://agenda.elpasotexas.gov/sirepub/' + info.querySelectorAll('td')[2].querySelector('a').getAttribute('href');
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
