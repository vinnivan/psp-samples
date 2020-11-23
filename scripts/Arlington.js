const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');

const Utility = require('./scrape-utilities.js');



 const scrape = async () => {

    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];


    try {
        await driver.get('https://www.arlingtontx.gov/cms/one.aspx?pageId=15052707');
        let element = await driver.findElement(By.name('granicusFrame'));
        let tableHtml = await element.getAttribute('src');
		await driver.get(tableHtml);
		
		let secElement = await driver.findElement(By.id('archive'));
		let secTableHtml = await secElement.getAttribute('innerHTML');
        let root = HTMLParser.parse(secTableHtml);
        let rows = root.querySelectorAll('tr');
		
        let title;
        const meetingTime = "6:30 PM";
		let month;
		let day;
        let date;
        let link;
		const d = new Date();
		const currentYear = d.getFullYear();

        debugger;

        for (let i = 1; i < rows.length; i++) {
			
            const row = rows[i].querySelectorAll('.listItem');
			
			let rawTime = row[1].text.replace(',','');
				rawTime = rawTime.split(' ');
				
			if (rawTime.length == 3) {
	
				if (rawTime[2] == currentYear) {
					
					title = row[0].text.replace(/\n/g,'');
					title = title.trim();
					
					month = getMonth(rawTime[0]);
					day = rawTime[1];
					date = month + '/' + day + '/' + currentYear + ' ' + meetingTime;
					
					link = row[3].querySelector('a').getAttribute('href');
					
					let event = {
						Name: title,
						Date: date,
						AgendaUrl: link
					};

					events.push(event);

				};
			}
			else if (rawTime.length == 4) {
	
				if (rawTime[3] == currentYear) {
					
					title = row[0].text.replace(/\n/g,'');
					title = title.trim();
					
					month = getMonth(rawTime[0]);
					day = rawTime[2];
					date = month + '/' + day + '/' + currentYear + ' ' + meetingTime;
					
					link = row[3].querySelector('a').getAttribute('href');
					
					let event = {
						Name: title,
						Date: date,
						AgendaUrl: link
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
