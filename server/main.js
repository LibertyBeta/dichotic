import {Dogs} from '../imports/api/dogs.js';
import '../imports/api/shows.js';
import '../imports/api/weather.js';
import '../imports/api/judges.js';

//
WebApp.connectHandlers.use("/cal", function(req, res, next) {

    const test = Dogs.find({}).fetch();
    res.writeHead(200, {'Mime-Type': 'application/ics'});
    let sample = [
      'BEGIN:VCALENDAR',
'VERSION:2.0',
'CALSCALE:GREGORIAN',
'BEGIN:VEVENT',
'SUMMARY:Access-A-Ride Pickup',
'DTSTART;TZID=America/New_York:20160802T103400',
'DTEND;TZID=America/New_York:20160802T110400',
'LOCATION:1000 Broadway Ave.\, Brooklyn',
'DESCRIPTION: Access-A-Ride trip to 900 Jay St.\, Brooklyn',
'STATUS:CONFIRMED',
'SEQUENCE:3',
'BEGIN:VALARM',
'TRIGGER:-PT10M',
'DESCRIPTION:Pickup Reminder',
'ACTION:DISPLAY',
'END:VALARM',
'END:VEVENT',
'BEGIN:VEVENT',
'SUMMARY:Access-A-Ride Pickup',
'DTSTART;TZID=America/New_York:20160802T200000',
'DTEND;TZID=America/New_York:20160802T203000',
'LOCATION:900 Jay St.\, Brooklyn',
'DESCRIPTION: Access-A-Ride trip to 1000 Broadway Ave.\, Brooklyn',
'STATUS:CONFIRMED',
'SEQUENCE:3',
'BEGIN:VALARM',
'TRIGGER:-PT10M',
'DESCRIPTION:Pickup Reminder',
'ACTION:DISPLAY',
'END:VALARM',
'END:VEVENT',
'END:VCALENDAR',
    ];
    res.end(sample.join("\r"));
});
