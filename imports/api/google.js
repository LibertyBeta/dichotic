import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {Oauth, Calendar} from './oauth.js';
import {Shows} from './shows.js';
import google from 'googleapis';
import googleAuth from 'google-auth-library';
import googleKey from "../credentials/google.js";
const SCOPES = ['https://www.googleapis.com/auth/calendar'];


if(Meteor.isServer){
  Meteor.methods({
    "google.sendEvent"(showId){
      const show = Shows.findOne({_id:showId});
      // Now send it to our google calendar.
      if(Oauth.find({}).count() > 0 ){
        console.log("sending event to google");
        const clientSecret = googleKey.web.client_secret;
        const clientId = googleKey.web.client_id;
        const redirectUrl = googleKey.web.redirect_uris[0];
        const auth = new googleAuth();
        const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

        oauth2Client.credentials = Oauth.findOne({});

        calendarId = Calendar.findOne({});

        let calendar = google.calendar('v3');


        // function pad(number) {
        //   if (number < 10) {
        //     return '0' + number;
        //   }
        //   return number;
        // }
        //
        // const startTime = start.getUTCFullYear() +
        //   '-' + pad(start.getUTCMonth() + 1) +
        //   '-' + pad(start.getUTCDate()) +
        //   'T' + pad(start.getUTCHours()) +
        //   ':' + pad(start.getUTCMinutes()) +
        //   ':' + pad(start.getUTCSeconds());
        //
        // const endTime = end.getUTCFullYear() +
        //   '-' + pad(end.getUTCMonth() + 1) +
        //   '-' + pad(end.getUTCDate()) +
        //   'T' + pad(end.getUTCHours()) +
        //   ':' + pad(end.getUTCMinutes()) +
        //   ':' + pad(end.getUTCSeconds());
        const resource = {
         "end": {
          "dateTime": show.date,
          "timeZone": "America/New_York"
         },
         "start": {
          "dateTime": show.date,
          "timeZone": "America/New_York"
         },
         "location": show.location,
         "summary": show.name
       };
       console.log(resource);
        calendar.events.insert(
          {
            'auth': oauth2Client,
            'calendarId': calendarId.calendar,
            'resource': resource,

          },
          function(err, result){
            console.log(err, result);
          }
        )
      }
    }
  })
}
