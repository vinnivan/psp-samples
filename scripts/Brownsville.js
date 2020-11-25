const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');

const Utility = require('./scrape-utilities.js');



 const scrape = async () => {

    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];


    try {
        await driver.get('https://www.cob.us/AgendaCenter/City-Commission-3');
        let element = await driver.findElement(By.id('table3'));
        let tableHtml = await element.getAttribute('innerHTML');

        let root = HTMLParser.parse(tableHtml);
        let rows = root.querySelector("tbody").querySelectorAll('tr');
        let title;
        const meetingTime = '5:00 PM';
		let month;
		let day;
		let year;
        let date;
        let link;

        debugger;

        for (let i = 0; i < rows.length; i++) {
			
            const row = rows[i].querySelectorAll('td');
			
			title = row[0].querySelector('p').text;
			
			month = getMonth(row[0].querySelector('abbr').text)
			
			day = row[0].querySelector('strong').childNodes[1].text.split(',')[0].trim();
			
			year = row[0].querySelector('strong').childNodes[1].text.split(',')[1].trim();
			
			date = month + '/' + day + '/' + year + ' ' + meetingTime;
			
			link = 'https://www.cob.us/' + row[0].querySelectorAll('a')[1].getAttribute('href');
			
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
	if (month == "Mar") {
		return "03"
	};
	if (month == "Apr") {
		return "04"
	};
	if (month == "May") {
		return "05"
	};
	if (month == "Jun") {
		return "06"
	};
	if (month == "Jul") {
		return "07"
	};
	if (month == "Aug") {
		return "08"
	};
	if (month == "Sep") {
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
