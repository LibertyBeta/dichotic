import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import googleKey from "../credentials/google.js";

import request from 'request';
import Keys from '../credentials/keys.js';
import {Oauth,Calendar} from './oauth.js';
import {Dogs} from './dogs.js';
import {Judges} from './judges.js';
export const Shows = new Mongo.Collection('shows');

// 

if (Meteor.isServer) {

  Meteor.publish('ourShows', function ourShowsPublication(dogIds) {
    
    //Now lets check to see if we have updated weather
    if(dogIds.length > 0){
      // const checkShows
    }
    return Shows.find({dog:{$in:dogIds}});
  });

  Meteor.publish('show', function showPublication(id) {
    
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
        // 
        return response.data.results;
      }
      catch(e){
        // 
        throw new Meteor.Error( 500, e.toString());
      }
    },
    'calendar.map'(id){
      this.unblock();
      
      const thisShow = Shows.findOne({_id:id});
      // 
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
        
        return response.data.results;
      }
      catch(e){
        
        throw new Meteor.Error( 500, e.toString());
      }
    },
    'calendar.googleDescription'(id){
      
        const aShow = Shows.findOne({_id:id});
        let description = '[DICHOTIC SHOW INFO BELOW. EDIT AT YOUR OWN RISK]';
        if(aShow.weather.summary){
          description += '\n>Weather : ' + aShow.weather.summary;
        } else {
          description += '\n>Weather : No Weather info at this time';
        }

        const dog = Dogs.findOne({_id:aShow.dog});

        description += '\n>DOG : ' + dog.name;
        const judges = Judges.find({_id:{$in:show.judges}}).fetch();
        let judgeString = '\n>JUDGES : '
        
        for(judge of judges){
          judgeString += judge.name + ", ";
        }
        if(judgeString === '\n>JUDGES : '){
          judgeString += "No Judges yet."
        } else {
          judgeString = judgeString.substring(0, judgeString.length - 2)
        }
        description += judgeString;

        return description;

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
    
    const result = Shows.update(
      {_id:showId},
      {$addToSet:
        {judges:id}
      }
    );
    Meteor.call("google.updateBody", showId);
    return result;
  },
  'calendar.insert'(object) {
    
    
    // 

    const uri = "https://maps.googleapis.com/maps/api/geocode/json?address="+object.location.replace(" ", "+")+"&key="+Keys.google;
    object['googParseError'] = false;
    const id = Shows.insert(object);
    //Once we're in the database, lets do some post load magic.
    // Things like setting the lat-lng, as well as the weather. If there is any.


    HTTP.get(uri, {}, function(error, result) {
      if(error){
        //handle the error
      }else {
        
        // 
        const loc = result.data.results[0].geometry.location;
        // 
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
                  updatePast: new Date(),
                }
              }
            }
          );
        }

      }
    })
    Meteor.call("google.sendEvent", id, function(e, r){
      
      
    })




    return true;
  },


});
