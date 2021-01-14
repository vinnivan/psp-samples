const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');

const Utility = require('./scrape-utilities.js');



 const scrape = async () => {

    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];


    try {
        await driver.get('https://www.cityoftyler.org/government/government/agendas/-folder-2022');
        let element = await driver.findElement(By.id('widget_2678_2074_2150'));
        let tableHtml = await element.getAttribute('innerHTML');

        let root = HTMLParser.parse(tableHtml);
        let rows = root.querySelector("ul").querySelectorAll('li');
        let title;
        const meetingTime = '9:00 AM';
        let date;
        let link;

        debugger;

        for (let i = 0; i < rows.length; i++) {
			
            const row = rows[i];
			
			let elements = row.querySelector('a').text.split(' ');
			
			if (isNaN(Number(elements[0]))) {
				 				
				date = "Unknown";
				
				title = row.querySelector('a').text;
				
				link = 'https://www.cityoftyler.org/' + row.querySelector('a').getAttribute('href');
				
			}
			else {
				
				if (elements[0].length == 4) {
					
					let year = elements[0];
					let month = elements[1];
					let day = elements[2];
					
					date = month + '/' + day + '/' + year + ' ' + meetingTime;
					
					title = row.querySelector('a').text.replace(year,'');
					title = title.replace(month,'');
					title = title.replace(day,'').trim();
					
					link = 'https://www.cityoftyler.org/' + row.querySelector('a').getAttribute('href');
					
				}
				else {
					
					let year = elements[2];
					let month = elements[0];
					let day = elements[1];
					
					date = month + '/' + day + '/' + year + ' ' + meetingTime;
					
					title = row.querySelector('a').text.replace(year,'');
					title = title.replace(month,'');
					title = title.replace(day,'').trim();
					
					link = 'https://www.cityoftyler.org/' + row.querySelector('a').getAttribute('href');
					
				}
			}
			
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
