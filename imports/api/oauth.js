import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Oauth = new Mongo.Collection('Oauth');
export const Calendar = new Mongo.Collection('gCalendar');

if(Meteor.isServer){

  Meteor.publish('oauth', function oauthPub() {

    return Oauth.find({});
  });

  Meteor.publish('calendar', function calendarPub() {

    return Calendar.find({});
  });

  Meteor.methods({
    "token.insert"(token){
      Oauth.remove({});
      return Oauth.insert(token);
    }
  })
}
