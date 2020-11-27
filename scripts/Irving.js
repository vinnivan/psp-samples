const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');

const Utility = require('./scrape-utilities.js');



 const scrape = async () => {

    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];


    try {
        await driver.get('https://www.cityofirving.org/3561/2020-Agendas');
        let element = await driver.findElement(By.css('.fr-alternate-rows'));
        let tableHtml = await element.getAttribute('innerHTML');

        let root = HTMLParser.parse(tableHtml);
        let rows = root.querySelector("tbody").querySelectorAll('tr');
        const title = 'City Council Meeting';
        const meetingTime = '6:00 PM';
		let month;
		let day;
        let date;
        let link;

        debugger;

        for (let i = 0; i < rows.length; i++) {
			
            const row = rows[i].querySelectorAll('td');
			
			month = getMonth(row[0].querySelector('strong').text.split(' ')[0]);
			
			day = row[0].querySelector('strong').text.split(' ')[1].trim();
			
			date = month + '/' + day + '/' + '2020' + ' ' + meetingTime;
			
			link = 'https://www.cityofirving.org/' + row[0].querySelector('a').getAttribute('href');
			
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
	if (month == "Jan") {
		return "01"
	};
	if (month == "Feb") {
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
	if (month == "Aug") {
		return "08"
	};
	if (month == "Sept") {
		return "09"
	};
	if (month == "Oct") {
		return "10"
	};
	if (month == "Nov") {
		return "11"
	};
	if (month == "Dec") {
		return "12"
	};
}


let result = scrape().then(r => {

    console.log(r);
});
