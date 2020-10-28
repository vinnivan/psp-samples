const { Builder, By, Key, until } = require('selenium-webdriver');
const HTMLParser = require('node-html-parser');

const Utility = require('./scrape-utilities.js');

 const scrape = async () => {

    let driver = await new Builder().forBrowser('chrome').build();

    let events = [];
    let errors = [];
    /* Pull data out from missouri city-council website */
    try {
        await driver.get('https://agenda.harriscountytx.gov/');
        let element = await driver.findElement(By.id("MainContent_gvArchive"));
        let tableHtml = await element.getAttribute('innerHTML');
        let root = HTMLParser.parse(tableHtml);
        let rows = root.querySelectorAll(".CalendarMonth");
        let title;
        let date;
        let link;
		let month;
		let day;
		let startsWithNumber = /^\d/g;
		let meetings
		let year = "2020"
		let title1
		let title2
		let value
		/*row=rows[1].text
		f=rows[1].querySelectorAll('a')
		z=f[2].text
		q=row.replace(z,'')
		q=q.replace('**','')
		events.push(Number.isInteger(z))
		events.push(z)
		events.push(q)*/
        debugger;
		for (let i = 0; i < 12; i++) {
			const row = rows[i];
			/*let text = row.querySelector('div').childNodes[0].text
			events.push(text)*/
			let allmeeting = row.querySelectorAll('a');
			for (let s = 0; s < allmeeting.length; s++) {
				if(i=="0") {
					month="01"
				}
				if(i=="1") {
					month="02"
				}
				if(i=="2") {
					month="03"
				}
				if(i=="3") {
					month="04"
				}
				if(i=="4") {
					month="05"
				}
				if(i=="5") {
					month="06"
				}
				if(i=="6") {
					month="07"
				}
				if(i=="7") {
					month="08"
				}
				if(i=="8") {
					month="09"
				}
				if(i=="9") {
					month="10"
				}
				if(i=="10") {
					month="11"
				}
				if(i=="11") {
					month="12"
				}
				let meeting = allmeeting[s].text
				if (meeting.includes('-')) {
					meetings = meeting.split('-')
				}
				else if (meeting.includes('•')) {
					meetings = meeting.split('•')
				}
				else if (meeting.includes(' & ')) {
					meetings = meeting.split(' & ')
				}
				else {
					meetings = [meeting]
				}
				if (meetings.length == '1') {
					day = meetings[0];
					value = parseInt(day);
					if (Number.isInteger(value) == true) {
						date = `${month + '/' + day + '/' + year} 10:00AM`
						let index = (s+1)*2-1;
						let mark = row.querySelector('div').childNodes[index].text;
						if (mark == "**") {
							title = "Speical Meeting";
							link = "https://agenda.harriscountytx.gov/" + allmeeting[s].getAttribute('href')
						}
						else {
							title = "Public Meeting";
							link = "https://agenda.harriscountytx.gov/" + allmeeting[s].getAttribute('href')
						}
					}
					else {
						if (day == "CIP") {
							title = 'Capital Improvements Program';
							link = "https://agenda.harriscountytx.gov/" + allmeeting[s].getAttribute('href')
						}
						else if (day == "MYR") {
							title = 'Mid-Year Review';
							link = "https://agenda.harriscountytx.gov/" + allmeeting[s].getAttribute('href')
						}
						else if (day == "PBH") {
							title = 'Preliminary Budget Hearings';
							link = "https://agenda.harriscountytx.gov/" + allmeeting[s].getAttribute('href')
						}
						else if (day == "PI") {
							title = 'Policy Issues';
							link = "https://agenda.harriscountytx.gov/" + allmeeting[s].getAttribute('href')
						}
						else if (day == "BP") {
							title = 'Budget Presentations';
							link = "https://agenda.harriscountytx.gov/" + allmeeting[s].getAttribute('href')
						}
						else if (day == "LP") {
							title = 'Legislative Platform';
							link = "https://agenda.harriscountytx.gov/" + allmeeting[s].getAttribute('href')
						}
						else if (day == "NOI") {
							title = 'Notice of Intention';
							link = "https://agenda.harriscountytx.gov/" + allmeeting[s].getAttribute('href')
						}
						else if (day == "NCFC") {
							title = 'Notice of Contingent Fee Contract';
							link = "https://agenda.harriscountytx.gov/" + allmeeting[s].getAttribute('href')
						}
						else if (day == "EC") {
							title = 'Election Commission';
							link = "https://agenda.harriscountytx.gov/" + allmeeting[s].getAttribute('href')
						}
						else if (day == "CJCC") {
							title = 'Criminal Justice Coordinating Council';
							link = "https://agenda.harriscountytx.gov/" + allmeeting[s].getAttribute('href')
						}
					}
				}
				else if (meetings.length == '2') {
					day = meetings[0]
					value = parseInt(day);
					if (Number.isInteger(value) == true) {
						date = `${month + '/' + day + '/' + year} 10:00AM`
						title1 = 'Public Meeting';
						if (day == "CIP") {
							title1 = 'Capital Improvements Program';
						}
						else if (day == "MYR") {
							title1 = 'Mid-Year Review';
						}
						else if (day == "PBH") {
							title1 = 'Preliminary Budget Hearings';
						}
						else if (day == "PI") {
							title1 = 'Policy Issues';
						}
						else if (day == "BP") {
							title1 = 'Budget Presentations';
						}
						else if (day == "LP") {
							title1 = 'Legislative Platform';
						}
						else if (day == "NOI") {
							title1 = 'Notice of Intention';
						}
						else if (day == "NCFC") {
							title1 = 'Notice of Contingent Fee Contract';
						}
						else if (day == "EC") {
							title1 = 'Election Commission';
						}
						else if (day == "CJCC") {
							title1 = 'Criminal Justice Coordinating Council';
						}
						if (meetings[1] == "CIP") {
							title2 = 'Capital Improvements Program';
						}
						else if (meetings[1] == "MYR") {
							title2 = 'Mid-Year Review';
						}
						else if (meetings[1] == "PBH") {
							title2 = 'Preliminary Budget Hearings';
						}
						else if (meetings[1] == "PI") {
							title2 = 'Policy Issues';
						}
						else if (meetings[1] == "BP") {
							title2 = 'Budget Presentations';
						}
						else if (meetings[1] == "LP") {
							title2 = 'Legislative Platform';
						}
						else if (meetings[1] == "NOI") {
							title2 = 'Notice of Intention';
						}
						else if (meetings[1] == "NCFC") {
							title2 = 'Notice of Contingent Fee Contract';
						}
						else if (meetings[1] == "EC") {
							title2 = 'Election Commission';
						}
						else if (meetings[1] == "CJCC") {
							title2 = 'Criminal Justice Coordinating Council';
						}
						title = title1 + " & " + title2
						link = "https://agenda.harriscountytx.gov/" + allmeeting[s].getAttribute('href')
					}
					if (Number.isInteger(value) == false) {
						title1 = ''
						if (day == "CIP") {
							title1 = 'Capital Improvements Program';
						}
						else if (day == "MYR") {
							title1 = 'Mid-Year Review';
						}
						else if (day == "PBH") {
							title1 = 'Preliminary Budget Hearings';
						}
						else if (day == "PI") {
							title1 = 'Policy Issues';
						}
						else if (day == "BP") {
							title1 = 'Budget Presentations';
						}
						else if (day == "LP") {
							title1 = 'Legislative Platform';
						}
						else if (day == "NOI") {
							title1 = 'Notice of Intention';
						}
						else if (day == "NCFC") {
							title1 = 'Notice of Contingent Fee Contract';
						}
						else if (day == "EC") {
							title1 = 'Election Commission';
						}
						else if (day == "CJCC") {
							title1 = 'Criminal Justice Coordinating Council';
						}
						if (meetings[1] == "CIP") {
							title2 = 'Capital Improvements Program';
						}
						else if (meetings[1] == "MYR") {
							title2 = 'Mid-Year Review';
						}
						else if (meetings[1] == "PBH") {
							title2 = 'Preliminary Budget Hearings';
						}
						else if (meetings[1] == "PI") {
							title2 = 'Policy Issues';
						}
						else if (meetings[1] == "BP") {
							title2 = 'Budget Presentations';
						}
						else if (meetings[1] == "LP") {
							title2 = 'Legislative Platform';
						}
						else if (meetings[1] == "NOI") {
							title2 = 'Notice of Intention';
						}
						else if (meetings[1] == "NCFC") {
							title2 = 'Notice of Contingent Fee Contract';
						}
						else if (meetings[1] == "EC") {
							title2 = 'Election Commission';
						}
						else if (meetings[1] == "CJCC") {
							title2 = 'Criminal Justice Coordinating Council';
						}
						title = title1 + " & " + title2
						link = "https://agenda.harriscountytx.gov/" + allmeeting[s].getAttribute('href')
					}
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
