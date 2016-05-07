import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Oauth, Calendar } from './oauth.js';
import { Shows } from './shows.js';
import { Dogs } from './dogs.js';
import google from 'googleapis';
import googleAuth from 'google-auth-library';
import googleKey from "../credentials/google.js";
import Keys from '../credentials/keys.js';
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

let isOauthed = function(){
  console.log("checking Oauthed");
  if(Oauth.find({}).count() > 0){
    return true ;
  } else {
    return false;
  }
}

let buildOauthClient = function(){
  const clientSecret = googleKey.web.client_secret;
  const clientId = googleKey.web.client_id;
  const redirectUrl = googleKey.web.redirect_uris[0];
  const auth = new googleAuth();
  const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  oauth2Client.credentials = Oauth.findOne({});
  //Check if the token if good, if not, update it.
  if(Oauth.findOne({}).expiry_date < (new Date()).getTime() ){

    let callback = Meteor.bindEnvironment(function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }

      Meteor.call("token.insert", oauth2Client.credentials);

    });

    oauth2Client.getAccessToken(callback);
  }
  return oauth2Client;

}

if(Meteor.isServer){
  Meteor.methods({
    "google.documentExpireEvent"(medical){
      console.log("Attemtping to set reminder for google");
      if(isOauthed()){
        console.log("Oauthed, doing the thing");
        const dog = Dogs.findOne({_id:medical.dog});
        const oauth2Client = buildOauthClient();
        const calendar = google.calendar('v3');
        const expires = medical.expires.getUTCFullYear() + "-" + (medical.expires.getUTCMonth() + 1) + "-" + medical.expires.getUTCDate();
        const calendarId = Calendar.findOne({});
        const resource = {
           "end": {
            "date": expires,
            "timeZone": "America/New_York"
           },
           "start": {
            "date": expires,
            "timeZone": "America/New_York"
           },
           "summary": "[ALERT] " + dog.name + "'s " + medical.title + " expires today!",
         };
        calendar.events.insert(
          {
            'auth': oauth2Client,
            'calendarId': calendarId.calendar,
            'resource': resource,

          },
            function(err, result){
              console.log(err);
              console.log(result);
            }
          );

      }

    },
    "google.sendEvent"(showId){
      const show = Shows.findOne({_id:showId});
      const dog = Dogs.findOne({_id:show.dog});
      // Now send it to our google calendar.

      console.log("UPDAT TOKENS?");
      console.log(Oauth.findOne({}).expiry_date < (new Date()).getTime());

      if(isOauthed()){
        console.log("sending event to google");

        let oauth2Client = buildOauthClient();


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

        let updateCallback = Meteor.bindEnvironment(function(err, result){
          if(err){
            console.log(err);
          } else {

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

    "google.updateBody"(showId){



      if(isOauthed()){
        console.log("sending event to google");

        let oauth2Client = buildOauthClient();



        calendarId = Calendar.findOne({});
        show = Shows.findOne({_id: showId});

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
           "description": '',
           "locked": true,
           "htmlLink": "https://dichotic.rainer.space/show/"+show._id
         };
        // let description = 'ERROR PARSING'
        if(show.googParseError === true){
          resource.summary = '[ALERT] ' + resource.summary;
        } else {
          let description  = Meteor.call("calendar.googleDescription", show._id);
          resource.description = description;
        }
        calendar.events.update({
          auth: oauth2Client,
          calendarId: calendarId.calendar,
          eventId: show.google.id,
          resource: resource
        }, function(err, result){
          console.log(err);
        });

      } else {
        return true;
      }
    },
    "google.update"(channelId, resourceId){

      // console.log(calendarInfo);
      if(isOauthed()){

        //Check if the token is still valid, if not, call refresh.

        let eventListCallback = Meteor.bindEnvironment(function(err, result){
          if(err){
            console.error("<-- LIST ERROR -->");
            console.error(err);
          } else {
            for(calEvents of result.items){
              let showDocument = Shows.findOne({"google.id":calEvents.id});
              // console.log(showDocument);
              if(typeof showDocument !== 'undefined' && showDocument !== []){
                let updateObj = {
                  date: new Date(calEvents.start.dateTime),
                  dateEnd: new Date(calEvents.end.dateTime),
                  calDescription: calEvents.description,
                  location: calEvents.location,
                  weather:{
                    summary: '',
                    active: true,
                    updated: false,
                    icon: 'wi-cloud-refresh',
                    last: new Date(),
                  },
                  name: calEvents.summary
                };
                Shows.update({_id:showDocument._id}, {$set:updateObj});
                const uri = "https://maps.googleapis.com/maps/api/geocode/json?address="+calEvents.location.replace(" ", "+")+"&key="+Keys.google;

                //Once we're in the database, lets do some post load magic.
                // Things like setting the lat-lng, as well as the weather. If there is any.


                HTTP.get(uri, {}, function(error, result) {
                  if(error){
                    //handle the error
                  }else {
                    console.info("<----------------------------------------------->");
                    // console.info(result.data);
                    const loc = result.data.results[0].geometry.location;
                    // console.info(loc);
                    const uriArgs = {
                      key: Keys.googleClient,
                      center: loc.lat+","+loc.lng,
                      size: 500+"x"+500,
                      maptype: 'roadmap',
                    };

                    const staticUri = "https://maps.googleapis.com/maps/api/staticmap?"+
                      "key="+Keys.googleClient +
                      "&center="+loc.lat +","+loc.lng +
                      "&size=500x500"+
                      "&type=roadmap" +
                      "&zoom=15";
                    console.log(staticUri);
                    Shows.update(
                      {_id:showDocument._id},
                      {
                        $set:{
                          gps:result.data.results[0].geometry.location,
                          mapUrl: staticUri
                        }
                      }
                    );
                  }
                })
              }
            }
          }
        });

        console.log("Getting events to google");


        let oauth2Client = buildOauthClient();


        let calendar = google.calendar('v3');

        const calendarInfo = Calendar.findOne({"watch.id":channelId});

        if(Calendar.find({"watch.id":channelId}).count() === 0 ){
          console.log("unknown watch channel, sending stop request");
          calendar.watch.stop({
            auth: oauth2Client,
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
