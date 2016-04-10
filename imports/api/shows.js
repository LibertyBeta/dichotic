import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http'
// import {Future} from 'fibers/future';
import request from 'request';
const Keys = require('./keys.js');
export const Shows = new Mongo.Collection('shows');
console.log(Keys);

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('ourShows', function ourShowsPublication(dogIds) {
    console.log("Subscribing for " + dogIds);
    //Now lets check to see if we have updated weather
    if(dogIds.length > 0){
      // const checkShows
    }
    return Shows.find({dog:{$in:dogIds}});
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
  'calendar.insert'(object) {
    console.log(object);
    console.log("running insert");
    console.log("https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key="+Keys.google);

    const uri = "https://maps.googleapis.com/maps/api/geocode/json?address="+object.location.replace(" ", "+")+"&key="+Keys.google;

    const id = Shows.insert(object);
    //Once we're in the database, lets do some post load magic.
    // Things like setting the lat-lng, as well as the weather. If there is any.


    HTTP.get(uri, {}, function(error, result) {
      if(error){
        //handle the error
      }else {
        console.info("<----------------------------------------------->");
        console.info(result.data);
        const loc = result.data.results[0].geometry.location;
        console.info(loc);
        Shows.update(
          {_id:id},
          {
            $set:{
              gps:result.data.results[0].geometry.location
            }
          }
        );
        const sevenDays = new Date();
        sevenDays.setDate(sevenDays.getDate() + 7);
        if( object.date < sevenDays ){
          //Throw this into the weather queing machine.
        }

      }
    })


    return true;
  },


});