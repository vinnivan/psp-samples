const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');

const Utility = require('./scrape-utilities.js');



 const scrape = async () => {

    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];
    /* Pull data out from missouri city-council website */
    try {
        await driver.get('https://www.missouricitytx.gov/407/City-Council');
        let element = await driver.findElement(By.xpath("//table[1]"));
        let tableHtml = await element.getAttribute('innerHTML');
        let root = HTMLParser.parse(tableHtml);
        let rows = root.querySelectorAll("tr");
        let title;
        let date;
        let link;
		
        debugger;
		for (let i = 0; i < rows.length; i++) {
			const row = rows[i];
			let td = row.querySelectorAll('td');
			for (let u = 1; u <td.length; u++) {
				date = `${td[0].text} 7:00 PM`;
				let type = td[u].getAttribute('data-th')
				if (type == "Regular Meeting") {
					title = "Regular Meeting" + " " + td[u].querySelector('a').text;
					link = "https://www.missouricitytx.gov/" + td[u].querySelector('a').getAttribute('href');
				}
				if (type == "Special Meeting") {
					title = "Special Meeting" + " " + td[u].querySelector('a').text;
					link = "https://www.missouricitytx.gov/" + td[u].querySelector('a').getAttribute('href');
				}
				if (type == "Video") {
					break
				}



            let event = {
                Name: title,
				Date: date,
                AgendaUrl: link
            };

            events.push(event);


        
			}
		}
    } catch (err) {
        console.log(err);
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
