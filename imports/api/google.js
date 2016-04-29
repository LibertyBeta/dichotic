import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Oauth, Calendar } from './oauth.js';
import { Shows } from './shows.js';
import { Dogs } from './dogs.js';
import google from 'googleapis';
import googleAuth from 'google-auth-library';
import googleKey from "../credentials/google.js";
const SCOPES = ['https://www.googleapis.com/auth/calendar'];


if(Meteor.isServer){
  Meteor.methods({
    "google.sendEvent"(showId){
      const show = Shows.findOne({_id:showId});
      const dog = Dogs.findOne({_id:show.dog});
      // Now send it to our google calendar.
      const clientSecret = googleKey.web.client_secret;
      const clientId = googleKey.web.client_id;
      const redirectUrl = googleKey.web.redirect_uris[0];
      const auth = new googleAuth();
      const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
      console.log("UPDAT TOKENS?");
      console.log(Oauth.findOne({}).expiry_date < (new Date()).getTime());

      if(Oauth.find({}).count() > 0){
        console.log("sending event to google");

        oauth2Client.credentials = Oauth.findOne({});
        //Check if the token if good, if not, update it.
        if(Oauth.findOne({}).expiry_date < (new Date()).getTime() ){

          let callback = Meteor.bindEnvironment(function(err, token) {
            if (err) {
              console.log('Error while trying to retrieve access token', err);
              return;
            }

            Meteor.call("token.insert", token);

          });

          console.log(oauth2Client.tokenInfo);
          oauth2Client.refreshAccessToken(callback);
        }


        calendarId = Calendar.findOne({});

        let calendar = google.calendar('v3');
        const description = "DOG: > " + dog.name;

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
           "description": description,
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
      // } else if (Oauth.find().count() > 0 && Oauth.findOne({}).expiry_date < (new Date()).getTime()) {
      //   console.log("attempting to update token");
      //   let callback = Meteor.bindEnvironment(function(err, token) {
      //     console.log('attempting to refresh token');
      //     if (err) {
      //       console.log('Error while trying to retrieve access token', err);
      //       return;
      //     }
      //     console.log("Thew new token is!")
      //     console.log(token);
      //     console.log(oauth2Client.credentials);
      //     // let dies =
      //
      //     Meteor.call("token.insert", token, function(){
      //       // Meteor.call("google.sendEvent", showId);
      //     });
      //     // Meteor.call("google.sendEvent", showId);
      //   });
      //   oauth2Client.credentials = Oauth.findOne({});
      //   console.log("The old Token was" + Oauth.findOne({}).access_token);
      //   // console.log(oauth2Client.tokenInfo);
      //   oauth2Client.getAccessToken(callback);
      //
      // }
    },

    "google.updateBody"(showId){},
    "google.update"(channelId, resourceId){

      // console.log(calendarInfo);
      if(Oauth.find().count() > 0 ){

        //Check if the token is still valid, if not, call refresh.

        let eventListCallback = Meteor.bindEnvironment(function(err, result){
          if(err){
            console.error("<-- LIST ERROR -->");
            console.error(err);
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
                Shows.update({_id:showDocument._id}, {$set:updateObj});
              }
            }
          }
        });

        console.log("Getting events to google");

        const clientSecret = googleKey.web.client_secret;
        const clientId = googleKey.web.client_id;
        const redirectUrl = googleKey.web.redirect_uris[0];
        const auth = new googleAuth();
        const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

        oauth2Client.credentials = Oauth.findOne({});
        if(Oauth.findOne({}).expiry_date < (new Date()).getTime() ){

          let callback = Meteor.bindEnvironment(function(err, token) {
            if (err) {
              console.log('Error while trying to retrieve access token', err);
              return;
            }

            Meteor.call("token.insert", token);

          });

          console.log(oauth2Client.tokenInfo);
          oauth2Client.refreshAccessToken(callback);
        }


        let calendar = google.calendar('v3');

        const calendarInfo = Calendar.findOne({"watch.id":channelId});

        if(Calendar.find({"watch.id":channelId}).count() === 0 ){
          console.log("unknown watch channel, sending stop request");
          calendar.watch.stop({
            auth: ouath2Client,
            id: channelId,
            resourceId: resourceId
          }, function(err, result){
            console.log(err);
            console.log(result);
          })
        } else {

          calendar.events.list({
            auth: oauth2Client,
            calendarId: calendarInfo.calendar
          }, eventListCallback);
        }

      } 
    }
  })
}
