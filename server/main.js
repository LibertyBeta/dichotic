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
  console.log(req.headers);

  if(req.headers['x-goog-resource-uri']){
    Meteor.call("google.update", req.headers['x-goog-channel-id']);
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
    var authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    // window.href = authUrl;
    res.writeHead(301, {'Location': authUrl});
    res.end();
  } else {
    oauth2Client.credentials = Oauth.findOne({});
    let calendar = google.calendar('v3');
    // Calendar.drop();
    //Check if we've got a calendar
    let insertCallback = Meteor.bindEnvironment(function(error, response){
      console.log(error);
      console.log("INSERTING NEW CALENDAR REF");
      const payload = {calendar:result.id};
      Calendar.insert(payload);

    });

    let watchCallback = Meteor.bindEnvironment(function(err, response){
      console.log("settings up new bind result");
      // console.log(err);
      // console.log(response);
      if(err){
        console.log(err);
      } else {
        console.log({$set:{'watch':response}});
        calendarId = Calendar.findOne({});
        let updateResult = Calendar.update({id:calendarId._id},{$set:{'watch':response}});
        // console.log("UPDATING CALENDAR", updateResult);
      }
    });

    let localCallbase = Meteor.bindEnvironment(function(err, results){
      // test for existing calendar
      console.log("CHECKING FOR CALENAR");
      if(Calendar.find({}).count() === 0){
        for(result of results.items){
          if(result.summary === "DICHOTIC BETA"){
            console.log("FOUND CALENDAR");
            console.log([result.id]);
            const payload = {calendar:result.id};
            Calendar.insert(payload);
            break;
          }
        }
        console.log(Calendar.find({}).count());
        if(Calendar.find({}).count() === 0){
          console.log("CALLING FOR CALENDAR");
          calendar.calendars.insert({
            auth: oauth2Client,
            resource: {
              summary: "DICHOTIC BETA"
            }
          }, insertCallback);
        }
      }
      let calendarId = Calendar.findOne({});
      console.log("setting up watch for ");
      // console.log(calendarId);
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
    });

    calendar.calendarList.list({
      auth: oauth2Client,
    }, localCallbase);

    // callback(oauth2Client);
    res.end();
  }


});
