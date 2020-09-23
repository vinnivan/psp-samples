

module.exports = {


    processTime(source) {
        let elements = source.split(" ");

        if (elements.lengh < 2) {

            return source;
        }

        let time = elements[0];
        let amPm = elements[1];

        if (amPm.toLowerCase() === "a.m." ||
            amPm.toLowerCase() === "p.m.") {
            amPm = amPm.replace(/\./g, "").trim().toUpperCase();
        } else {
            amPm = elements[1].toUpperCase();            
        }

        return `${time} ${amPm}`;
    },



    processNumericDate(stamp) {

        let elements = stamp.trim().split("/");

        let month = "00" + elements[0]
        month = month.substr(month.length - 2);

        let day = "00" + elements[1];
        day = day.substr(day.length - 2);

        let year = elements[2];

        if (year.length == 2) {

            year = "20" + year;
        }

        let processedDate = `${month}/${day}/${year}`;
        return processedDate;

    },


    processNamedMonthDate(stamp) {

        // April 7, 2020

        // or 20 Sep 2020

        let month;
        let day;

        let elements = stamp.trim().split(" ");

        if (this.isNumeric(elements[0])) {

            day = "00" + elements[0];
            day = day.substr(day.length - 2);
            month = this.monthNumberFromName(elements[1]);


        } else { 

            month = this.monthNumberFromName(elements[0]);

            day = "00" + elements[1].replace(",", "");
            day = day.substr(day.length - 2);

        }

        let year = elements[2];
        if (year.length == 2) {

            year = "20" + year;
        }

        let processedDate = `${month}/${day}/${year}`;

        return processedDate;

    },


    monthNumberFromName(monthName) {

        if (!monthName || monthName.lengh < 3) {
            return "";
        }

        let month = monthName.toLowerCase().substr(0,3);

        switch (month) {
            case 'jan':
                return "01";
            case 'feb':
                return "02";
            case 'mar':
                return "03";
            case 'apr':
                return "04";
            case 'may':
                return "05";
            case 'jun':
                return "06";
            case 'jul':
                return "07";
            case 'aug':
                return "08";
            case 'sep':
                return "09";
            case 'oct':
                return "10";
            case 'nov':
                return "11";
            case 'dec':
                return "12";
            default:
                return "";
        }


    },

    parseDate(date) {
    // April 8, 2020 

    let output = {};
    let elements = date.replace(",", "").split(" ");

    if (elements.length < 3) {
        return {
            month: "01",
            day: "01",
            year: "0001"
        };
    }

    let month = elements[0].trim();
    output.month = Utility.monthNumberFromName(month);

    let day = "00" + elements[1].trim();

    output.day = day.substr(day.length - 2);
    output.year = elements[2].trim();

    return output;
        
    },


    isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

}