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

        const resource = {
           "end": {
            "dateTime": show.dateEnd,
            "timeZone": "America/New_York"
           },
           "start": {
            "dateTime": show.date,
            "timeZone": "America/New_York"
           },
           "location": show.location,
           "summary": show.name,
           "locked": true,
           "htmlLink": "https://dichotic.rainer.space/show/"+show._id
         };
        //  console.log(resource);
        let updateCallback = Meteor.bindEnvironment(function(err, result){
          if(err){
            console.log(err);
          } else {
            console.log(result);
            Shows.update({_id:show._id}, {$set:{google:result}});
          }
        });
        calendar.events.insert(
          {
            'auth': oauth2Client,
            'calendarId': calendarId.calendar,
            'resource': resource,

          },
          updateCallback
        );
      }
    },
    "google.update"(channelId){

      // console.log(calendarInfo);
      if(Oauth.find({}).count() > 0 ){

        const calendarInfo = Calendar.findOne({"watch.id":channelId});

        console.log("Getting events to google");

        const clientSecret = googleKey.web.client_secret;
        const clientId = googleKey.web.client_id;
        const redirectUrl = googleKey.web.redirect_uris[0];
        const auth = new googleAuth();
        const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

        oauth2Client.credentials = Oauth.findOne({});

        const calendarInfo = Calendar.findOne({"watch.id":channelId});

        let calendar = google.calendar('v3');

        let eventListCallback = Meteor.bindEnvironment(function(err, result){
          if(err){
            console.log(err);
          } else {
            for(calEvents of result.items){
              let showDocument = Shows.findOne({"google.id":calEvents.id});
              if(showDocument !== []){
                let updateObj = {
                  date: new Date(calEvents.start.dateTime),
                  dateEnd: new Date(calEvents.end.dateTime),
                  calDescription: calEvents.description,
                  name: calEvents.summary
                };
                Shows.update({_id:showDocument._id, {$set:updateObj}});
              }
            }
          }
        });


        calendar.events.list({
          auth: oauth2Client,
          calendarId: calendarInfo.calendar
        }, eventListCallback)
      }
    }
  })
}
