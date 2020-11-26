const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');

const Utility = require('./scrape-utilities.js');



 const scrape = async () => {

    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];


    try {
        await driver.get('http://ww2.cityofpasadena.net/councilagendas/council_agenda.asp');
        let element = await driver.findElement(By.xpath("//table[@width='102%']"));
        let tableHtml = await element.getAttribute('innerHTML');

        let root = HTMLParser.parse(tableHtml);
        let rows = root.querySelectorAll('td');
        let title;
		let month;
		let day;
        const meetingTime = '2:00 PM';
		let year;
        let date;
        let link;

        debugger;

        for (let i = 0; i < rows.length; i++) {
			
            const row = rows[i];
			
			if (row.querySelector('font')) {
				
				if (row.querySelector('font').getAttribute('size') == '2') {
					
					month = row.querySelector('font').text.replace('\n\t\t','');
					month = getMonth(month);
					
				};
				
				if (row.querySelector('font').getAttribute('size') == '4') {
					
					year = row.querySelector('font').text.replace('\n','').trim();
					
				};
				
				if (row.querySelectorAll('font')[0].querySelector('a')) {
				
					if (row.querySelectorAll('font')[0].querySelector('a').text == 'Cancelled') {
						
						continue;
						
					}
					else {
						
						title = row.querySelectorAll('font')[0].querySelector('a').text.replace(/\n\t/g,'');
						title = title.replace(/\t/g,'').trim();
						
						if (title == 'C' || title == 'Cancel') {
							
							continue;
							
						};
						
						day = row.querySelectorAll('font')[0].childNodes[0].text;
						day = day.replace(/\n\t\t/g,'');
						day = day.replace('&nbsp;','').trim();
						
						if (day.length == 3) {
							
							day = '0' + day;
							day = day.slice(0,2);
							
						}
						else {
							
							day = day.slice(0,2);
						};
						
						date = month + '/' + day + '/' + year + ' ' + meetingTime;
						
						link = 'http://ww2.cityofpasadena.net/councilagendas/' + row.querySelectorAll('font')[0].querySelector('a').getAttribute('href');
					}
				
					let event = {
						Name: title,
						Date: date,
						AgendaUrl: link
					};

					events.push(event);
				}
			}

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
