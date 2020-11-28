const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');

const Utility = require('./scrape-utilities.js');



 const scrape = async () => {

    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];


    try {
        await driver.get('https://mcallentx.civicclerk.com/web/home.aspx');
        let element = await driver.findElement(By.id('aspxroundpanelCurrent_pnlDetails_grdEventsCurrent_DXMainTable'));
        let tableHtml = await element.getAttribute('innerHTML');
        let root = HTMLParser.parse(tableHtml);

        let rows = root.querySelectorAll('.dxgvDataRow_CustomThemeModerno');
        let title;
        let meetingTime;
        let date;
        let link;

        debugger;

        for (let i = 0; i < rows.length; i++) {
			
            const row = rows[i].querySelectorAll('td');
			
			title = row[0].querySelector('a').text;
			
			date = row[1].text.trim();
			
			link = eval(row[0].querySelector('a').getAttribute('href').replace('javascript:',''))
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

function LaunchPlayer(id, key, mod, mk, nov) {
	
	var src = 'https://mcallentx.civicclerk.com/web/Player.aspx?id=' + id + '&key=' + key + '&mod=' + mod + '&mk=' + mk + '&nov=' + nov;
	
	return src;

}
let result = scrape().then(r => {

    console.log(r);
});
