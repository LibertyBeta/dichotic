import { Mongo } from 'meteor/mongo';

export const Shows = new Mongo.Collection('shows');


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


}

Meteor.methods({
  'calendar.insert'(object) {
    
    console.log(object);
    const id = Shows.insert(object);
    return id;
  },

});
