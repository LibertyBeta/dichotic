import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http'
import { SyncedCron } from 'meteor/percolate:synced-cron';
import { Shows } from './shows.js';
import request from 'request';
const Keys = require('./keys.js');

if (Meteor.isServer) {
  SyncedCron.start();
  console.log(SyncedCron.nextScheduledAtDate('weatherUpdater'));
  if(SyncedCron.nextScheduledAtDate('weatherUpdater') === undefined){
    console.log("ADDING FIRST JOB");
    SyncedCron.add({
      name: 'weatherUpdater',
      schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 30 minutes');
      },
      job: function() {
        var weatherFetched = Meteor.call("weather.check");
        return weatherFetched;
      }
    });

  }
  //
  Meteor.methods({
    'weather.start'(){
      const sevenDays = new Date();
      sevenDays.setDate(sevenDays.getDate() + 7);
      // Shows.find({date:{$lte: sevenDays}, weather}).find()
      //Start the weather run. Recussively.
    },

    'weather.check'(id){
      // All the Calls to
    }
  });
}
