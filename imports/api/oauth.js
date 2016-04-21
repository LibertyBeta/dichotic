import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Oauth = new Mongo.Collection('Oauth');
export const Calendar = new Mongo.Collection('gCalendar');

if(Meteor.isServer){

  Meteor.methods({
    "token.insert"(token){
      return Oauth.insert(token);
    }
  })
}
