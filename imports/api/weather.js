import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http'
import { SyncedCron } from 'meteor/percolate:synced-cron';
import { Shows } from './shows.js';
// const Shows = new Mongo.Collection('shows');
import request from 'request';
const Keys = require('./keys.js');

// const weatherKey = {
//   'clear-day':"wi-day-sunny",
//   'clear-night':"wi-night-cear",
//   'rain':"wi-rain",
//   'snow':"wi-snow",
//   'sleet':"wi-sleet",
//   'wind':"wi-strong-wind",
//   'fog':"wi-fog",
//   'cloudy':"wi-cloudy",
//   'partly-cloudy-day':"wi-day-cloudy",
//   'partly-cloudy-night':"wi-night-alt-cloud",
// };

const weatherKey = {
  'clear-day': "wi-forecast-io-clear-day",
  'clear-night': "wi-forecast-io-clear-night",
  'rain': "wi-forecast-io-rain",
  'snow': "wi-forecast-io-snow",
  'sleet': "wi-forecast-io-sleet",
  'strong-wind': "wi-forecast-io-wind",
  'fog': "wi-forecast-io-fog",
  'cloudy': "wi-forecast-io-cloudy",
  'partly-cloudy-night': "wi-forecast-io-partly-cloudy-day",
  'partly-cloudy-day': "wi-forecast-io-partly-cloudy-night",
  'hail': "wi-forecast-io-hail",
  'thunderstorm': "wi-forecast-io-thunderstorm",
  'tornado': "wi-forecast-io-tornado",
};

if (Meteor.isServer) {
  SyncedCron.start();
  console.log(SyncedCron.nextScheduledAtDate('weatherUpdater'));
  if(SyncedCron.nextScheduledAtDate('weatherUpdater') === undefined){
    console.log("ADDING FIRST JOB");
    SyncedCron.add({
      name: 'weatherUpdater',
      schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 1 hour');
      },
      job: function() {
        var weatherFetched = Meteor.call("weather.start");
        return weatherFetched;
      }
    });

  }
  //
  Meteor.methods({
    'weather.start'(){
      const today = new Date();
      const sevenDays = new Date();
      sevenDays.setDate(sevenDays.getDate() + 7);
      const query = {
        $and:[ {date:{ $gt: today}} , {date:{ $lte: sevenDays}}]
      };
      console.log(query);
      const toUpdate = Shows.find({date:{$lte: sevenDays}}).fetch();
      const updateIds = [];
      // console.log(toUpdate);
      for(show of toUpdate){
        updateIds.push(show._id);
        Meteor.call("weather.check", show);
      }
      Shows.update(
        {_id:
          {$in:updateIds}
        },
        {
          $set:{
            "weather.active": true,
            "weather.last":new Date()
          }
        });

      //Start the weather run. Recussively.
    },

    'weather.check'(show){
      console.log(show);
      if(!show.gps) return false;
      function pad(number) {
        if (number < 10) {
          return '0' + number;
        }
        return number;
      }
      const time = show.date.getUTCFullYear() +
        '-' + pad(show.date.getUTCMonth() + 1) +
        '-' + pad(show.date.getUTCDate()) +
        'T' + pad(show.date.getUTCHours()) +
        ':' + pad(show.date.getUTCMinutes()) +
        ':' + pad(show.date.getUTCSeconds());
      const uri = "https://api.forecast.io/forecast/"+Keys.forecast+"/"+show.gps.lat+","+show.gps.lng+","+time;
      console.log(uri);
      HTTP.get(uri, function(error, response){
        if(error && response.statusCode !== 200){
          console.log(error);
        } else {
          const hourly = response.data.hourly;
          Shows.update(
            {
              _id:show._id
            },
            {
              $set:{
                "weather.active": true,
                "weather.summary": hourly.summary,
                "weather.icon": weatherKey[hourly.icon],
                "weather.hourly": hourly.data,
                "weather.last":new Date()
              }
            });
        }
      })


    }
  });
}
