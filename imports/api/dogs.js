import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { FS } from 'meteor/cfs:base-package';
import { S3 } from 'meteor/cfs:s3';
import { resizeImageStream } from 'meteor/numtel:cfs-image-resize';
import Keys from '../credentials/keys.js';

console.log("starting up dogs");
export const Dogs = new Mongo.Collection('dogs');

let fileStore = new FS.Store.S3("dogImages",{
  accessKeyId: Keys.aws.key, //required if environment variables are not set
  secretAccessKey: Keys.aws.secret, //required if environment variables are not set
  bucket: "dichotic", //required
});
let thumbStore = new FS.Store.S3("thumbs", {
  accessKeyId: Keys.aws.key, //required if environment variables are not set
  secretAccessKey: Keys.aws.secret, //required if environment variables are not set
  bucket: "dichotic", //required
  beforeWrite: function(fileObj) {
    // We return an object, which will change the
    // filename extension and type for this store only.
    return {
      extension: 'jpeg',
      type: 'image/jpeg'
    };
  },
  transformWrite: resizeImageStream({
    width: 250,
    height: 250,
    format: 'image/jpeg',
    quality: 50
  })
});
export const DogImages = new FS.Collection("DogImages", {
    stores: [fileStore, thumbStore],
    filter: {
        allow: {
            contentTypes: ['image/*']
        }
    }
});


if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('dogsImages', function dogsImagesPublications() {
    return DogImages.find();
  });

  Meteor.publish('dogImages', function dogImagesPublications(id) {
    return DogImages.find({_id:id});
  });

  Meteor.publish('dogs', function dogPublication() {
    console.log('subscribing for a single dog');
    return Dogs.find();
  });

  Meteor.publish('dog', function aDogPublication(id) {

    return Dogs.find({_id:id});
  });

  Meteor.publish('kenelDogs', function kenelDogs() {
    return Dogs.find();
  });

  DogImages.allow({
    insert:function(userId,project){
      return true;
    },
    update:function(userId,project,fields,modifier){
     return true;
    },
    remove:function(userId,project){
      return true;
    },
    download:function(){
      return true;
    }
  });
}

Meteor.methods({
  'dog.insert'(object) {
    // check(text, String);

    // // Make sure the user is logged in before inserting a task
    // if (! Meteor.userId()) {
    //   throw new Meteor.Error('not-authorized');
    // }
    console.log(object);
    const id = Dogs.insert(object);
    return id;
  },
  'dog.remove'(taskId) {
    check(taskId, String);

    Tasks.remove(taskId);
  },
});
