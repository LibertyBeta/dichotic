import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http'
import googleKey from "../credentials/google.js";

import request from 'request';
import Keys from '../credentials/keys.js';
import {Oauth,Calendar} from './oauth.js';
export const Shows = new Mongo.Collection('shows');

console.log(Keys);

if (Meteor.isServer) {

  Meteor.publish('ourShows', function ourShowsPublication(dogIds) {
    console.log("Subscribing for " + dogIds);
    //Now lets check to see if we have updated weather
    if(dogIds.length > 0){
      // const checkShows
    }
    return Shows.find({dog:{$in:dogIds}});
  });

  Meteor.publish('show', function showPublication(id) {
    console.log("Subscribing for Show " + id);
    return Shows.find({_id:id});
  });

  Meteor.publish('shows', function showsPublication() {
    return Shows.find();
  });

  Meteor.publish('aDogsShow', function aDogsShow(id) {
    return Shows.find({dog:id});
  });


  //SERVER SIDE ONLY METHODS. MOSTLY API CALLS.
  Meteor.methods({
    'calendar.getAddreses'(address){
      this.unblock();
      try{
        const response = HTTP.get("https://maps.googleapis.com/maps/api/geocode/json?address="+address.replace(" ", "+")+"&key="+Keys.google, {});
        // console.log(response);
        return response.data.results;
      }
      catch(e){
        // console.info(e);
        throw new Meteor.Error( 500, e.toString());
      }
    },
    'calendar.map'(id){
      this.unblock();
      console.log("STARTING MAP");
      const thisShow = Shows.findOne({_id:id});
      // console.log(thisShow);
      // if(thisShow.geometry)
      try{
        const uriArgs = {
          key: Keys.google,
          center: thisShow.gps.lat+","+thisShow.gps.lat,
          size: 500+"x"+500,
          maptype: 'roadmap',

        };

        const uri = "https://maps.googleapis.com/maps/api/staticmap?";
        const response = HTTP.get(uri, {params:uriArgs});
        console.log(response);
        return response.data.results;
      }
      catch(e){
        console.info(e);
        throw new Meteor.Error( 500, e.toString());
      }
    }
  })


}

Meteor.methods({
  'calendar.score'(id, result) {
    Shows.update({_id:id},
    {$set:{
      score: result
    }});
  },
  'calendar.addJudge'(showId,id) {
    console.log("Updating show " + showId + " with judge " + id);
    return Shows.update(
      {_id:showId},
      {$addToSet:
        {judges:id}
      }
    );
  },
  'calendar.insert'(object) {
    console.log(object);
    console.log("running insert");
    // console.log("https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key="+Keys.google);

    const uri = "https://maps.googleapis.com/maps/api/geocode/json?address="+object.location.replace(" ", "+")+"&key="+Keys.google;

    const id = Shows.insert(object);
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
          {_id:id},
          {
            $set:{
              gps:result.data.results[0].geometry.location,
              mapUrl: staticUri
            }
          }
        );
        const sevenDays = new Date();
        sevenDays.setDate(sevenDays.getDate() + 7);
        if( object.date < sevenDays ){
          //Throw this into the weather queing machine.
          Shows.update(
            {_id:id},
            {
              $set:{
                weather:{
                  summary: '',
                  active: true,
                  updated: false,
                  icon: 'wi-cloud-refresh',
                  last: new Date(),
                }
              }
            }
          );
        }

      }
    })
    Meteor.call("google.sendEvent", id, function(e, r){
      console.error(e);
      console.error(r);
    })

    //Now send it to our google calendar.
    // if(Oauth.find({}).count() > 0 ){
    //   const clientSecret = googleKey.web.client_secret;
    //   const clientId = googleKey.web.client_id;
    //   const redirectUrl = googleKey.web.redirect_uris[0];
    //   const auth = new googleAuth();
    //   const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
    //
    //   oauth2Client.credentials = Oauth.findOne({});
    //
    //   calendarId = Calendar.findOne({});
    //
    //   let calendar = google.calendar('v3');
    //
    //   const start = object.date;
    //   const end = object.date;
    //   end.setTime(end.getTime() + " + 30 minutes");
    //   function pad(number) {
    //     if (number < 10) {
    //       return '0' + number;
    //     }
    //     return number;
    //   }
    //
    //   const startTime = start.getUTCFullYear() +
    //     '-' + pad(start.getUTCMonth() + 1) +
    //     '-' + pad(start.getUTCDate()) +
    //     'T' + pad(start.getUTCHours()) +
    //     ':' + pad(start.getUTCMinutes()) +
    //     ':' + pad(start.getUTCSeconds());
    //
    //   const endTime = end.getUTCFullYear() +
    //     '-' + pad(end.getUTCMonth() + 1) +
    //     '-' + pad(end.getUTCDate()) +
    //     'T' + pad(end.getUTCHours()) +
    //     ':' + pad(end.getUTCMinutes()) +
    //     ':' + pad(end.getUTCSeconds());
    //   calendar.events.insert(
    //     {
    //       auth: oauth2Client,
    //       calendarId: calendarId,
    //       resource:
    //         {
    //          "end": {
    //           "dateTime": endTime,
    //           "timeZone": "America/New_York"
    //          },
    //          "start": {
    //           "dateTime": startTime,
    //           "timeZone": "America/New_York"
    //          },
    //          "location": object.location,
    //          "summary": object.name
    //         }
    //     },
    //     function(err, result){
    //       console.log(err, result);
    //     }
    //   )
    // }


    return true;
  },


});
