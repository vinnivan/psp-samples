const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');

const Utility = require('./scrape-utilities.js');



 const scrape = async () => {

    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];


    try {
        await driver.get('https://ci.lubbock.tx.us/meetings');
        let element = await driver.findElement(By.css('.month-wrapper'));
        let tableHtml = await element.getAttribute('innerHTML');

        let root = HTMLParser.parse(tableHtml);
        let rows = root.querySelectorAll('.col-calendar-day');
        let title;
		let day;
		let month;
		let year = new Date;
			month = year.getMonth() + 1;
			year = year.getFullYear();
        let meetingTime;
        let date;
        let link;

        debugger;

        for (let i = 0; i < rows.length; i++) {
			
            const row = rows[i].querySelectorAll('.event-block');
			
			day = rows[i].querySelector('.day').text;
			
			if (i > 0) {
				
				let perviousDay = rows[i-1].querySelector('.day').text;
				
				numDay = parseInt(day);
				numPday = parseInt(perviousDay);
				
				if (numDay < numPday) {
					
					month += 1;
					
				}
				
			}
			
			for (let y = 0; y < row.length; y++) {

				if (row[y].querySelector('.flex-wrapper')) {
					
					title = row[y].querySelector('a').text;
					
					meetingTime = row[y].querySelector('h4').querySelector('span').text;
					
					date = month + '/' + day + '/' + year + ' ' + meetingTime;
					
					link = 'https://ci.lubbock.tx.us/' + row[y].querySelector('a').getAttribute('href');
					
					let event = {
						Name: title,
						Date: date,
						AgendaUrl: link
					};

					events.push(event);
					
				}
				
			}

        }
		//Below pulls out only upcoming meetings
		/*
		await driver.get('https://ci.lubbock.tx.us/meetings');
        let element = await driver.findElement(By.css('.meeting-intro-col'));
        let tableHtml = await element.getAttribute('innerHTML');

        let root = HTMLParser.parse(tableHtml);
        let rows = root.querySelectorAll('a');
        let title;	
		let month;
		let day;
		const year = '2020';
        let meetingTime;
        let date;
        let link;
		
        debugger;

        for (let i = 0; i < rows.length; i++) {
			
            const row = rows[i];
			
			title = row.querySelector('.meeting-details').querySelectorAll('div')[1].text.trim();
			
			rawDate = row.querySelector('.meeting-date').text.split(' ');
			
			month = getMonth(rawDate[1]);
			meetingTime = row.querySelector('.meeting-details').querySelectorAll('div')[0].text
			day = rawDate[2].replace(rawDate[2].slice(rawDate[2].length-2, rawDate[2].length),'');
			
			date = month + '/' + day + '/' + year + ' ' + meetingTime;
			
			link = 'https://ci.lubbock.tx.us/' + row.getAttribute('href');
			
			let event = {
				Name: title,
				Date: date,
				AgendaUrl: link
			};

			events.push(event);
					
				
				
		}
		*/
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
