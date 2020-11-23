const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');

const Utility = require('./scrape-utilities.js');



 const scrape = async () => {

    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];


    try {
        await driver.get('https://www.garlandtx.gov/801/Meeting-Agendas-and-Minutes');
        let element = await driver.findElement(By.tagName('iframe'));
        let tableHtml = await element.getAttribute('src');
		
		await driver.get(tableHtml);
		let secElement = await driver.findElement(By.css('.smallText'));
		let secTableHtml = await secElement.getAttribute('innerHTML');

        let root = HTMLParser.parse(secTableHtml);
        let rows = root.querySelectorAll('tr');
        let title;
		let day;
		let month;
		let year;
        const meetingTime = '6:00 PM';
        let date;
        let link;

        debugger;

        for (let i = 0; i < rows.length; i++) {
			
            const row = rows[i].querySelectorAll('td');
			
			title = row[1].text.trim();
			
			rawDate = row[0].querySelector('a').text.split(' ');

			month = getMonth(rawDate[0]);
			
			day = rawDate[1].replace(',','');
			
			year = rawDate[2];
			
			date = month + '/' + day + '/' + year + ' ' + meetingTime;
			
			link = 'http://destinyhosted.com/' + row[0].querySelector('a').getAttribute('href');
			
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

function getMonth(month) {
	if (month == "January") {
		return "01"
	};
	if (month == "February") {
		return "02"
	};
	if (month == "March") {
		return "03"
	};
	if (month == "April") {
		return "04"
	};
	if (month == "May") {
		return "05"
	};
	if (month == "June") {
		return "06"
	};
	if (month == "July") {
		return "07"
	};
	if (month == "August") {
		return "08"
	};
	if (month == "September") {
		return "09"
	};
	if (month == "October") {
		return "10"
	};
	if (month == "November") {
		return "11"
	};
	if (month == "December") {
		return "12"
	};
}


let result = scrape().then(r => {

    console.log(r);
});
