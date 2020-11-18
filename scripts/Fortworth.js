const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');

const Utility = require('./scrape-utilities.js');



 const scrape = async () => {

    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];


    try {
        await driver.get('https://www.fortworthtexas.gov/calendar/city-council');
        let element = await driver.findElement(By.css('.calendar-body-content'));
        let tableHtml = await element.getAttribute('innerHTML');
		
        let root = HTMLParser.parse(tableHtml);
        let rows = root.querySelectorAll("section");

		let monthYear = await driver.findElement(By.css('.calendar-nav-timeframe'))
			monthYear = await monthYear.getAttribute('innerHTML')
			monthYear = HTMLParser.parse(monthYear)
			
		let	month = monthYear.querySelectorAll('span')[0].text
			month = numberMonth(month);
			
		let year = monthYear.querySelectorAll('span')[1].text;
		
        let title;
        let meetingTime;
        let date;

        debugger;

        for (let i = 0; i < rows.length; i++) {
			
            const row = rows[i];
			
			if (row.querySelector('ul')) {
				let rawdate = row.querySelector('.full-date').childNodes[1].text;
 
				let count = row.querySelectorAll('li');
				
				for (let k = 0; k < count.length; k++) {
					title = count[k].querySelectorAll('span')[1].text;
					
					date = month + '/' + rawdate + '/' + year + ' ' + getMeetingTime(title)
					let event = {
						Name: title,
						Date: date,
						AgendaUrl: getLink(title)
					};
			
					events.push(event);
				};
			};


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
function numberMonth(month) {
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
function getLink(title) {
	if (title == "Notice of Public Hearing on Annexation Case No. AX-20-002") {
		return "https://www.fortworthtexas.gov/departments/citysecretary/events/annexation"
	}
	if (title == "City Council Work Session") {
		return "https://www.fortworthtexas.gov/departments/citysecretary/events/city-council-work-session/no-meeting-city-council-work-sessions"
	}
	if (title == "Crime Control and Prevention District Board of Directors") {
		return "https://www.fortworthtexas.gov/departments/citysecretary/events/crime-control-prevention"
	}
	if (title == "City Council Meeting") {
		return "https://www.fortworthtexas.gov/departments/citysecretary/events/city-council-meeting"
	}
	else {
		return undefined
	};
};
function getMeetingTime(title) {
	if (title == "Notice of Public Hearing on Annexation Case No. AX-20-002") {
		return "1:00 PM"
	}
	if (title == "City Council Work Session") {
		return "3:00 PM"
	}
	if (title == "Crime Control and Prevention District Board of Directors") {
		return "2:00 PM"
	}
	if (title == "City Council Meeting") {
		return "7:00 PM"
	}
	else {
		return ""
	};
};
let result = scrape().then(r => {

    console.log(r);
});
