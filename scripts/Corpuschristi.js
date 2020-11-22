const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');

const Utility = require('./scrape-utilities.js');



 const scrape = async () => {

    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];


    try {
        await driver.get('https://corpuschristi.legistar.com/DepartmentDetail.aspx?ID=16850&GUID=A6D0B73D-749A-4E86-8B51-441C31FAF5B1&Mode=MainBody');
        let element = await driver.findElement(By.css('.rgMasterTable'));
        let tableHtml = await element.getAttribute('innerHTML');

        let root = HTMLParser.parse(tableHtml);
        let rows = root.querySelector("tbody").querySelectorAll('tr');
        let title;
        let meetingTime;
        let date;
        let link;

        debugger;

        for (let i = 0; i < rows.length; i++) {
			
            const row = rows[i];
			
			let elements = row.querySelectorAll('td');
			
			title = elements[3].childNodes[0].text;
			
			date = elements[0].text;
			meetingTime = elements[2].querySelector('span').text;
			date = `${date} ${meetingTime}`
			
			link = 'https://corpuschristi.legistar.com/' + elements[4].querySelector('a').getAttribute('href');
			
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
