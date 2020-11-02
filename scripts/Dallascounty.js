const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');

const Utility = require('./scrape-utilities.js');



 const scrape = async () => {

    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];

    /* https://pearlandtx.civicweb.net/Portal/MeetingInformation.aspx?Org=Cal&Id=530 */
    try {
        await driver.get('https://dallascounty.civicweb.net/Portal/MeetingSchedule.aspx');
        let element = await driver.findElement(By.css('.largecalendar'));
        let tableHtml = await element.getAttribute('innerHTML');

        let root = HTMLParser.parse(tableHtml);
        let rows = root.querySelectorAll(".calendar-meetings-link-container");
        let title;
        let meetingTime
        let date;
        let link;
		let list

        debugger;

        for (let i = 0; i < rows.length; i++) {
			
            const row = rows[i];
			
			let info = row.querySelector('a')
			
			if (info) {
				
				list = info.text.split("-");
				
				title = list[0].trim().replace('▪','');
				
				if (list.length == 2) {
					
					date = `${Utility.processNamedMonthDate(list[1].trim())}`
					
				}
				else {
					
					date = `${Utility.processNamedMonthDate(list[2].trim())}`
					title = title + ' - ' + list[1].trim()
				};
				
				let rawTime = row.querySelector('.meeting-time').text;
				meetingTime = rawTime.replace('Time: ','');
				date = `${date} ${meetingTime}`;
				
				link = 'https://dallascounty.civicweb.net/'+info.getAttribute('href');
				
			}
			else {
				
				info = row.querySelector('span')
				
				list = info.text.split("-");
				
				title = list[0].trim().replace('▪','');
				
				if (list.length == 2) {
					
					date = `${Utility.processNamedMonthDate(list[1].trim())}`
					
				}
				else {
					
					date = `${Utility.processNamedMonthDate(list[2].trim())}`
					title = title + ' - ' + list[1].trim()
				};
				
				let rawTime = row.querySelector('.meeting-time').text;
				meetingTime = rawTime.replace('Time: ','');
				date = `${date} ${meetingTime}`;
				
				link = undefined
				
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
