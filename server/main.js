import {Dogs} from '../imports/api/dogs.js';
import {Oauth, Calendar} from '../imports/api/oauth.js';
import { HTTP } from 'meteor/http';
import google from 'googleapis';
import googleAuth from 'google-auth-library';
import googleKey from "../imports/credentials/google.js";
import '../imports/api/shows.js';
import '../imports/api/weather.js';
import '../imports/api/judges.js';
import '../imports/api/oauth.js';
import '../imports/api/google.js';



// console.log(googleKey.web);
const SCOPES = ['https://www.googleapis.com/auth/calendar'];



WebApp.connectHandlers.use('/auth', function(req, res, next) {
  console.log("HITTING AUTH PATH");
  const clientSecret = googleKey.web.client_secret;
  const clientId = googleKey.web.client_id;
  const redirectUrl = googleKey.web.redirect_uris[0];
  const auth = new googleAuth();
  const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  // oauth2Client.getToken(req.query.code, callback);
  let callback = Meteor.bindEnvironment(function(err, token) {
    if (err) {
      console.log('Error while trying to retrieve access token', err);
      return;
    }


    Meteor.call("token.insert", token);
    oauth2Client.credentials = token;
    res.writeHead(301, {'Location': '/cal'});
    res.end();
  });
  oauth2Client.getToken(req.query.code, callback);
});

WebApp.connectHandlers.use('/watcher', function(req, res, next) {
  console.log("WATCHER REQUEST");
  console.info("<---------------------->");


  if(req.headers['x-goog-resource-uri']){
    Meteor.call("google.update", req.headers['x-goog-channel-id'], req.headers['x-goog-resource-id']);
  }

  res.writeHead(200);
  res.end();
});



WebApp.connectHandlers.use('/cal', function(req, res, next) {



  const clientSecret = googleKey.web.client_secret;
  const clientId = googleKey.web.client_id;
  const redirectUrl = googleKey.web.redirect_uris[0];
  const auth = new googleAuth();
  const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);



  if(Oauth.find({}).count() === 0 ){
    //this means we don't hav ea token. There for go, go get one.
    var authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    });
    // console.log(redirectUrl);
    console.log('Authorize this app by visiting this url: ', authUrl);
    // window.href = authUrl;
    res.writeHead(303, {'Location': authUrl});
    res.end();
    return;
  } else {
    res.writeHead(303, {'Location': "/settings"});
    res.end();
    oauth2Client.credentials = Oauth.findOne({});
    let calendar = google.calendar('v3');
    // Calendar.drop();
    //Check if we've got a calendar

    //insert Callback. For when we don't have a home calendar.
    let insertCallback = Meteor.bindEnvironment(function(error, response){

      if(error){
        console.log(error);
      } else {
        console.log("INSERTING NEW CALENDAR REF");
        console.log(response);
        const payload = {calendar:response.id};
        console.log(response.id);
        Calendar.insert(payload);
        let calendarId = Calendar.findOne({});
        calendar.events.watch({
          auth: oauth2Client,
          calendarId: calendarId.calendar,
          resource:{
            "address": "https://dichotic.rainer.space/watcher",
            "id": calendarId._id,
            "kind": "api#channel",
            "type": "web_hook"
          }
        },watchCallback);
      }


    });

    //watch callback. For when we setup our watcher.
    let watchCallback = Meteor.bindEnvironment(function(err, response){
      console.log("settings up new bind result");
      // console.log(err);
      // console.log(response);
      if(err){
        console.log(err);
      } else {
        calendarId = Calendar.findOne({});
        let updateResult = Calendar.update({_id:calendarId._id},{$set:{'watch':response}});
      }
    });

    let listCalendarCallback = Meteor.bindEnvironment(function(err, results){
      
      console.log("CHECKING FOR CALENAR");

      //First case, we DON'T have a store calendar record.
      if(Calendar.find({}).count() === 0){
        let found = false;
        for(result of results.items){
          console.log("Found Calender " + result.id);
          console.log("Known as " + result.summary);
          if(result.summary === "DICHOTIC BETA"){
            console.log("FOUND CALENDAR");
            console.log([result.id]);
            const payload = {calendar:result.id};
            Calendar.insert(payload);
            found = true;
            break;
          }
        }

        // console.log(Calendar.find({}).count());

        if(found === false){
          console.log("CALLING INSERT CALENDAR");
          calendar.calendars.insert({
            auth: oauth2Client,
            resource: {
              summary: "DICHOTIC BETA"
            }
          }, insertCallback);
        } else {
          console.log("setting up watcher");
          let calendarId = Calendar.findOne({});
          calendar.events.watch({
            auth: oauth2Client,
            calendarId: calendarId.calendar,
            resource:{
              "address": "https://dichotic.rainer.space/watcher",
              "id": calendarId._id,
              "kind": "api#channel",
              "type": "web_hook"
            }
          },watchCallback);
        }
      }

    });


    //We're authenticated. Check for a list of all calendars.
    calendar.calendarList.list({
      auth: oauth2Client,
    }, listCalendarCallback);

    // callback(oauth2Client);
    res.end();
  }


});
